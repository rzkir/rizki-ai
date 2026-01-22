'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

import { useTextareaRef } from '@/hooks/text-areaRef';

import { Cpu, Globe2, Binary, Cloud } from 'lucide-react';

const STORAGE_KEY = 'technology_history';

export function useStateTechnology() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const [historyItems, setHistoryItems] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isUserScrollingRef = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isProgrammaticScrollRef = useRef<boolean>(false);
    const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastProcessedIndexRef = useRef<number>(-1);
    const savedMessagesCountRef = useRef<number>(0);

    // Textarea ref dengan auto-resize
    const { textareaRef, resetHeight } = useTextareaRef({ input, maxHeight: 200 });

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
                console.error('Error loading technology history from localStorage:', error);
            }
        }
    }, []);

    // Save new user messages to history (avoid duplicates)
    useEffect(() => {
        if (typeof window !== 'undefined' && messages.length > savedMessagesCountRef.current) {
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
                        console.error('Error saving technology history to localStorage:', error);
                    }
                    return updated;
                });
                savedMessagesCountRef.current = userMessages.length;
            }
        }
    }, [messages]);

    // Helper function to check if user is near bottom of scroll container
    const isNearBottom = useCallback(
        (container: HTMLElement, threshold = 100) => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            return scrollHeight - scrollTop - clientHeight < threshold;
        },
        []
    );

    // Helper function to perform programmatic scroll
    const performScroll = useCallback(() => {
        if (!messagesEndRef.current || isUserScrollingRef.current) return;

        isProgrammaticScrollRef.current = true;
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            isProgrammaticScrollRef.current = false;
        }, 500);
    }, []);

    // Helper function to clear all timeouts
    const clearAllTimeouts = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }
        if (autoScrollTimeoutRef.current) {
            clearTimeout(autoScrollTimeoutRef.current);
            autoScrollTimeoutRef.current = null;
        }
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                setIsSpeechSupported(true);
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
                            setInput(prev => prev + (prev ? ' ' : '') + newText);
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

    // Auto-scroll with debounce - only if user is not manually scrolling
    useEffect(() => {
        if (!messagesContainerRef.current || !messagesEndRef.current || isUserScrollingRef.current) {
            return;
        }

        if (autoScrollTimeoutRef.current) {
            clearTimeout(autoScrollTimeoutRef.current);
        }

        autoScrollTimeoutRef.current = setTimeout(() => {
            if (isUserScrollingRef.current) return;

            const container = messagesContainerRef.current;
            if (!container) return;

            if (isNearBottom(container, 50)) {
                requestAnimationFrame(() => {
                    setTimeout(() => performScroll(), 50);
                });
            }
        }, 300);

        return () => {
            if (autoScrollTimeoutRef.current) {
                clearTimeout(autoScrollTimeoutRef.current);
            }
        };
    }, [messages, isNearBottom, performScroll]);

    // Handle manual scroll detection
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current || isProgrammaticScrollRef.current) return;

        isUserScrollingRef.current = true;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (messagesContainerRef.current && isNearBottom(messagesContainerRef.current, 50)) {
                isUserScrollingRef.current = false;
                performScroll();
            }
        }, 2000);
    }, [isNearBottom, performScroll]);

    // Add scroll event listener
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearAllTimeouts();
        };
    }, [handleScroll, clearAllTimeouts]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const inputText = input.trim();

        // Prepare user message
        const userMessage: Message = {
            role: 'user',
            content: inputText
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        // Reset manual scroll flag when user sends a new message
        isUserScrollingRef.current = false;
        clearAllTimeouts();

        // Force scroll to bottom immediately when user sends a message
        setTimeout(() => performScroll(), 50);

        setIsLoading(true);

        const assistantMessageIndex = newMessages.length;
        setMessages([...newMessages, { role: 'assistant', content: '' }]);

        const handleError = () => {
            setMessages(prev => {
                const updated = [...prev];
                updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
        };

        try {
            await streamChat({
                endpoint: API_ENDPOINTS.technology,
                messages: newMessages,
                onChunk: (content) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                            role: 'assistant',
                            content: content,
                        };
                        return updated;
                    });
                },
                onError: handleError
            });
        } catch (error) {
            console.error('Error:', error);
            handleError();
        } finally {
            setIsLoading(false);
        }
    };

    // Handle history item click - directly submit without creating duplicate
    const handleHistoryClick = useCallback(async (historyText: string) => {
        if (!historyText.trim() || isLoading) return;

        setSheetOpen(false);

        const inputText = historyText.trim();
        setInput('');
        resetHeight();

        const userMessage: Message = { role: 'user', content: inputText };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        // Reset manual scroll flag when user sends a new message
        isUserScrollingRef.current = false;
        clearAllTimeouts();

        // Force scroll to bottom immediately when user sends a message
        setTimeout(() => performScroll(), 50);

        setIsLoading(true);

        const assistantMessageIndex = newMessages.length;
        setMessages([...newMessages, { role: 'assistant', content: '' }]);

        const handleError = () => {
            setMessages(prev => {
                const updated = [...prev];
                updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
        };

        try {
            await streamChat({
                endpoint: API_ENDPOINTS.technology,
                messages: newMessages,
                onChunk: (content) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                            role: 'assistant',
                            content: content,
                        };
                        return updated;
                    });
                },
                onError: handleError
            });
        } catch (error) {
            console.error('Error:', error);
            handleError();
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading, setInput, resetHeight, performScroll, clearAllTimeouts]);

    const suggestedPrompts = [
        { icon: Cpu, text: 'AI vs ML', prompt: 'Jelaskan perbedaan antara AI, Machine Learning, dan Deep Learning.' },
        { icon: Cloud, text: 'Cloud 101', prompt: 'Apa itu Cloud Computing dan manfaat utamanya bagi bisnis?' },
        { icon: Binary, text: 'Blockchain', prompt: 'Bagaimana cara kerja blockchain dan contoh penerapannya?' },
        { icon: Globe2, text: 'Tech Trends', prompt: 'Jelaskan tren teknologi paling berdampak di tahun ini.' },
    ];

    return {
        // state
        messages,
        input,
        setInput,
        isLoading,
        sheetOpen,
        setSheetOpen,
        isListening,
        isSpeechSupported,
        historyItems,
        suggestedPrompts,
        // refs
        messagesEndRef,
        messagesContainerRef,
        textareaRef,
        // handlers
        handleSubmit,
        handleHistoryClick,
        toggleVoiceRecognition,
    };
}
