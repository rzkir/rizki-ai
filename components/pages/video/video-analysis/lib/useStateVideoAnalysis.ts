'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

import { useTextareaRef } from '@/hooks/text-areaRef';

type ChatMessage = Message & { videoUrl?: string };

const STORAGE_KEY = 'video_analysis_history';
const CONVERSATIONS_KEY = 'video_analysis_conversations';

interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
}

export function useStateVideoAnalysis() {
    const [prompt, setPrompt] = useState('');
    const [video, setVideo] = useState<{ file: File; preview: string } | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const [historyItems, setHistoryItems] = useState<Message[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastProcessedIndexRef = useRef<number>(-1);
    const savedMessagesCountRef = useRef<number>(0);
    const { textareaRef, resetHeight } = useTextareaRef({ input: prompt });

    // Load history from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        setHistoryItems(parsed);
                    }
                }
            } catch (error) {
                console.error('Error loading video analysis history from localStorage:', error);
            }
        }
    }, []);

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
                        console.error('Error saving video analysis history to localStorage:', error);
                    }
                    return updated;
                });
                savedMessagesCountRef.current = userMessages.length;
            }
        }
    }, [messages, currentConversationId]);

    // Reset conversation ID when messages are cleared
    useEffect(() => {
        if (messages.length === 0) {
            setCurrentConversationId(null);
            savedMessagesCountRef.current = 0;
        }
    }, [messages]);

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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

    const setVideoFile = useCallback((file: File) => {
        // Validate file type
        if (!file.type.match('video.*')) {
            alert('Please select a video file');
            return;
        }

        // Validate file size (max 50MB for video)
        if (file.size > 50 * 1024 * 1024) {
            alert('Please select a video smaller than 50MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setVideo({ file, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
    }, []);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleRemoveVideo = () => {
        setVideo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Extract frames from video
    const extractVideoFrames = async (videoFile: File): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            const frames: string[] = [];
            let frameIndex = 0;
            // Extract frames at start, middle, and near end (if video is long enough)
            const targetFrames = [0, 0.5, 0.9];

            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            video.crossOrigin = 'anonymous';

            const objectUrl = URL.createObjectURL(videoFile);
            video.src = objectUrl;

            video.onloadedmetadata = () => {
                try {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Determine how many frames to extract based on video duration
                    const duration = video.duration;
                    const framesToExtract = duration > 2
                        ? targetFrames
                        : [0]; // Only extract first frame for short videos

                    // Start extracting first frame
                    extractFrameAt(framesToExtract[0]);
                } catch (error) {
                    URL.revokeObjectURL(objectUrl);
                    reject(error);
                }
            };

            const extractFrameAt = (timeRatio: number) => {
                try {
                    video.currentTime = video.duration * timeRatio;
                } catch (error) {
                    URL.revokeObjectURL(objectUrl);
                    reject(error);
                }
            };

            video.onseeked = () => {
                try {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    frames.push(frameDataUrl);

                    frameIndex++;
                    const duration = video.duration;
                    const framesToExtract = duration > 2 ? targetFrames : [0];

                    if (frameIndex < framesToExtract.length) {
                        // Extract next frame
                        extractFrameAt(framesToExtract[frameIndex]);
                    } else {
                        // All frames extracted
                        URL.revokeObjectURL(objectUrl);
                        resolve(frames.length > 0 ? frames : []);
                    }
                } catch (error) {
                    URL.revokeObjectURL(objectUrl);
                    reject(error);
                }
            };

            video.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Failed to load video'));
            };

            // Timeout fallback
            setTimeout(() => {
                if (frames.length === 0) {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Video loading timeout'));
                }
            }, 30000); // 30 second timeout
        });
    };

    const handleAnalyzeVideo = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!prompt.trim() && !video) || isAnalyzing) return;

        // Create new conversation ID if starting a new conversation
        if (messages.length === 0) {
            setCurrentConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        }

        setIsAnalyzing(true);

        const handleError = () => {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
        };

        try {
            // Extract frames from video if present
            let extractedFrames: string[] = [];
            const videoPreview = video?.preview;
            if (video) {
                extractedFrames = await extractVideoFrames(video.file);
            }

            // Prepare user message
            const inputText = prompt.trim() || 'What\'s in this video?';
            const userMessage: ChatMessage = {
                role: 'user',
                content: inputText,
                ...(extractedFrames.length > 0 && {
                    // Send first frame as imageUrl for API analysis
                    imageUrl: extractedFrames[0],
                    // Store video URL for display (to show video player in chat)
                    videoUrl: videoPreview
                })
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setPrompt('');
            resetHeight();
            setVideo(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Add placeholder for assistant response
            const assistantMessageIndex = newMessages.length;
            setMessages([...newMessages, { role: 'assistant', content: '' }]);

            // Call API
            await streamChat({
                endpoint: API_ENDPOINTS.videoAnalyze,
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
        } catch (error) {
            console.error('Error analyzing video:', error);
            handleError();
        } finally {
            setIsAnalyzing(false);
        }
    };

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

                        // Try to restore video if available in first message
                        const firstMessage = conversation.messages[0];
                        if (firstMessage && 'videoUrl' in firstMessage && firstMessage.videoUrl) {
                            // Note: We can't restore File object, but we can show the preview URL if available
                            // User would need to re-upload the video file if they want to analyze again
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
        prompt,
        setPrompt,
        video,
        setVideo,
        messages,
        isAnalyzing,
        sheetOpen,
        setSheetOpen,
        isListening,
        isSpeechSupported,
        historyItems,
        // refs
        fileInputRef,
        messagesEndRef,
        textareaRef,
        // handlers
        handleVideoChange,
        setVideoFile,
        handleRemoveVideo,
        handleAnalyzeVideo,
        handleHistoryClick,
        toggleVoiceRecognition,
    };
}
