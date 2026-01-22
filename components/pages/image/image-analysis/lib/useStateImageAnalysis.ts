'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

import { useTextareaRef } from '@/hooks/text-areaRef';

import { Sparkles, ImageIcon, Scan } from 'lucide-react';

type ChatMessage = Message & { imageUrl?: string };

const STORAGE_KEY = 'image_analysis_history';
const CONVERSATIONS_KEY = 'image_analysis_conversations';

interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
}

export function useStateImageAnalysis() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    // Load history from localStorage using lazy initializer
    const [historyItems, setHistoryItems] = useState<Message[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                }
            } catch (error) {
                console.error('Error loading image analysis history from localStorage:', error);
            }
        }
        return [];
    });
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastProcessedIndexRef = useRef<number>(-1);
    const savedMessagesCountRef = useRef<number>(0);

    const { textareaRef, resetHeight } = useTextareaRef({
        input: prompt,
        maxHeight: 160,
    });

    // Save conversation to localStorage
    const saveConversation = useCallback((conversation: Conversation) => {
        if (typeof window === 'undefined') return;
        try {
            const stored = localStorage.getItem(CONVERSATIONS_KEY);
            const conversations: Conversation[] = stored ? JSON.parse(stored) : [];
            const existingIndex = conversations.findIndex(c => c.id === conversation.id);

            if (existingIndex >= 0) {
                conversations[existingIndex] = conversation;
            } else {
                conversations.push(conversation);
            }

            // Keep only last 50 conversations
            const updated = conversations.slice(-50);
            localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Error saving conversation to localStorage:', error);
        }
    }, []);

    // Save new user messages to history (avoid duplicates)
    useEffect(() => {
        if (typeof window !== 'undefined' && messages.length > savedMessagesCountRef.current && currentConversationId) {
            const userMessages = messages.filter(message => message.role === 'user');
            const newUserMessages = userMessages.slice(savedMessagesCountRef.current);

            if (newUserMessages.length > 0) {
                setHistoryItems(prev => {
                    // Filter out duplicates before adding new messages
                    const existingContents = new Set(prev.map(item => item.content));
                    const uniqueNewMessages = newUserMessages.filter(
                        msg => !existingContents.has(msg.content)
                    );

                    // Add new messages and limit to last 50 items
                    const updated = [...prev, ...uniqueNewMessages].slice(-50);
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                    } catch (error) {
                        console.error('Error saving image analysis history to localStorage:', error);
                    }
                    return updated;
                });
                savedMessagesCountRef.current = userMessages.length;
            }
        }
    }, [messages, currentConversationId]);

    // Reset conversation ID when messages are cleared (handled in handleReset and handleImageSelect)

    // Save conversation when messages change
    useEffect(() => {
        if (messages.length > 0 && currentConversationId) {
            const firstUserMessage = messages.find(m => m.role === 'user');
            if (!firstUserMessage) return;

            const conversation: Conversation = {
                id: currentConversationId,
                title: firstUserMessage.content,
                messages: [...messages],
                createdAt: Date.now()
            };
            saveConversation(conversation);
        }
    }, [messages, currentConversationId, saveConversation]);

    const suggestedPrompts = [
        { icon: Sparkles, text: "Identify Objects", prompt: "What objects are in this image?" },
        { icon: ImageIcon, text: "Analyze Colors", prompt: "Describe the color palette and visual style of this image" },
        { icon: Scan, text: "Extract Text", prompt: "Extract and read any text visible in this image" },
        { icon: Sparkles, text: "Scene Description", prompt: "Describe this image in detail" },
    ];

    const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Please select an image smaller than 10MB');
                return;
            }

            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target?.result as string);
                setMessages([]);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                setTimeout(() => {
                    setIsSpeechSupported(true);
                }, 100);
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'id-ID';

                recognition.onstart = () => {
                    setIsListening(true);
                    lastProcessedIndexRef.current = -1;
                    if (voiceTimeoutRef.current) {
                        clearTimeout(voiceTimeoutRef.current);
                    }
                    voiceTimeoutRef.current = setTimeout(() => {
                        if (recognitionRef.current) {
                            recognitionRef.current.stop();
                            setIsListening(false);
                        }
                    }, 10000);
                };

                recognition.onresult = (event) => {
                    if (voiceTimeoutRef.current) {
                        clearTimeout(voiceTimeoutRef.current);
                    }
                    voiceTimeoutRef.current = setTimeout(() => {
                        if (recognitionRef.current) {
                            recognitionRef.current.stop();
                            setIsListening(false);
                        }
                    }, 10000);

                    const results = Array.from(event.results);
                    const newFinalResults = results
                        .slice(lastProcessedIndexRef.current + 1)
                        .filter(result => result.isFinal)
                        .map(result => result[0].transcript);

                    if (newFinalResults.length > 0) {
                        lastProcessedIndexRef.current = results.length - 1;
                        const newText = newFinalResults.join(' ').trim();
                        if (newText) {
                            setPrompt(prev => prev + (prev ? ' ' : '') + newText);
                        }
                    }
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    if (voiceTimeoutRef.current) {
                        clearTimeout(voiceTimeoutRef.current);
                        voiceTimeoutRef.current = null;
                    }
                    lastProcessedIndexRef.current = -1;
                    setIsListening(false);
                };

                recognition.onend = () => {
                    if (voiceTimeoutRef.current) {
                        clearTimeout(voiceTimeoutRef.current);
                        voiceTimeoutRef.current = null;
                    }
                    lastProcessedIndexRef.current = -1;
                    setIsListening(false);
                };

                recognitionRef.current = recognition as unknown as SpeechRecognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (voiceTimeoutRef.current) {
                clearTimeout(voiceTimeoutRef.current);
                voiceTimeoutRef.current = null;
            }
        };
    }, []);

    // Toggle voice recognition
    const toggleVoiceRecognition = useCallback(() => {
        if (!recognitionRef.current || !isSpeechSupported) return;

        if (isListening) {
            if (voiceTimeoutRef.current) {
                clearTimeout(voiceTimeoutRef.current);
                voiceTimeoutRef.current = null;
            }
            lastProcessedIndexRef.current = -1;
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                if (voiceTimeoutRef.current) {
                    clearTimeout(voiceTimeoutRef.current);
                    voiceTimeoutRef.current = null;
                }
                lastProcessedIndexRef.current = -1;
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                if (voiceTimeoutRef.current) {
                    clearTimeout(voiceTimeoutRef.current);
                    voiceTimeoutRef.current = null;
                }
                lastProcessedIndexRef.current = -1;
                setIsListening(false);
            }
        }
    }, [isListening, isSpeechSupported]);

    const handleAnalyze = useCallback(async () => {
        if (!selectedImage || !selectedImageFile) return;

        // Create new conversation ID if starting a new conversation
        if (messages.length === 0) {
            setCurrentConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        }

        setIsLoading(true);

        const handleError = () => {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
            setIsLoading(false);
        };

        try {
            // Convert image to base64
            const imageBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(`data:image/${selectedImageFile.type.split('/')[1]};base64,${base64}`);
                };
                reader.onerror = reject;
                reader.readAsDataURL(selectedImageFile);
            });

            // Prepare user message
            const inputText = prompt.trim() || "What's in this image?";
            // Only include imageUrl for the first message
            const userMessage: ChatMessage = {
                role: 'user',
                content: inputText,
                ...(messages.length === 0 && { imageUrl: imageBase64 })
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setPrompt('');
            resetHeight();

            // Add placeholder for assistant response
            const assistantMessageIndex = newMessages.length;
            setMessages([...newMessages, { role: 'assistant', content: '' }]);

            // Call API with streaming
            await streamChat({
                endpoint: API_ENDPOINTS.imageAnalyze,
                messages: newMessages,
                onChunk: (content) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                            role: 'assistant',
                            content: content
                        };
                        return updated;
                    });
                },
                onError: handleError
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error analyzing image:', error);
            handleError();
        }
    }, [selectedImage, selectedImageFile, prompt, messages, resetHeight]);

    const handleReset = useCallback(() => {
        setSelectedImage(null);
        setSelectedImageFile(null);
        setMessages([]);
        setPrompt("");
        resetHeight();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [resetHeight]);

    // Handle history item click - load previous conversation
    const handleHistoryClick = useCallback((historyText: string) => {
        if (!historyText.trim()) return;

        setSheetOpen(false);

        // Find conversation that starts with this history text
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(CONVERSATIONS_KEY);
                if (stored) {
                    const conversations: Conversation[] = JSON.parse(stored);
                    // Find conversation by title (first user message) or by matching first user message
                    const conversation = conversations.find(
                        c => {
                            const firstUserMsg = c.messages.find(m => m.role === 'user');
                            return c.title === historyText.trim() ||
                                (firstUserMsg && firstUserMsg.content === historyText.trim());
                        }
                    );

                    if (conversation && conversation.messages.length > 0) {
                        // Load the full conversation
                        setMessages(conversation.messages);
                        setCurrentConversationId(conversation.id);

                        // Update savedMessagesCountRef to prevent duplicate saving
                        const userMessages = conversation.messages.filter(m => m.role === 'user');
                        savedMessagesCountRef.current = userMessages.length;

                        // Try to restore image if available in first message
                        const firstMessage = conversation.messages[0];
                        if (firstMessage && 'imageUrl' in firstMessage && firstMessage.imageUrl) {
                            setSelectedImage(firstMessage.imageUrl);
                        }

                        return;
                    }
                }
            } catch (error) {
                console.error('Error loading conversation:', error);
            }
        }

        // Fallback: if conversation not found, set prompt
        setMessages([]);
        setCurrentConversationId(null);
        savedMessagesCountRef.current = 0;
        setPrompt(historyText);
        setTimeout(() => textareaRef.current?.focus(), 150);
    }, [textareaRef]);

    return {
        // state
        selectedImage,
        selectedImageFile,
        messages,
        isLoading,
        prompt,
        setPrompt,
        sheetOpen,
        setSheetOpen,
        isListening,
        isSpeechSupported,
        historyItems,
        suggestedPrompts,
        // refs
        fileInputRef,
        textareaRef,
        // handlers
        handleImageSelect,
        handleAnalyze,
        handleReset,
        handleHistoryClick,
        toggleVoiceRecognition,
    };
}
