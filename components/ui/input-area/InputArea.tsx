'use client';

import React from 'react';
import { LucideIcon, Loader2, ArrowUp, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AsideFooter } from '@/components/ui/aside/Aside';

export interface InputAreaProps {
    /** Current input value */
    value: string;
    /** Input change handler */
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    /** Input key down handler */
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    /** Submit handler */
    onSubmit: () => void;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Whether the form is loading */
    isLoading?: boolean;
    /** Icon to display on the left side */
    icon?: LucideIcon;
    /** Whether voice recognition is currently listening */
    isListening?: boolean;
    /** Whether speech recognition is supported by the browser */
    isSpeechSupported?: boolean;
    /** Handler for toggling voice recognition */
    onVoiceToggle?: () => void;
    /** Submit button icon (default: ArrowUp) */
    submitIcon?: LucideIcon;
    /** Textarea ref for auto-resize functionality */
    textareaRef?: React.RefObject<HTMLTextAreaElement | null> | ((instance: HTMLTextAreaElement | null) => void) | null;
    /** Custom className for the container */
    className?: string;
    /** Custom className for the textarea */
    textareaClassName?: string;
    /** Custom max-width for AsideFooter */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    /** Additional footer className */
    footerClassName?: string;
    /** Wrap with relative group container */
    wrapperClassName?: string;
    /** Enable glow background effect */
    showGlow?: boolean;
    /** Glow background className */
    glowClassName?: string;
    /** Optional hint/disclaimer below the form (e.g. <p className="text-xs text-muted-foreground text-center mt-2">...</p>) */
    hint?: React.ReactNode;
    /** Optional content rendered above the input row (e.g. video preview) */
    topSlot?: React.ReactNode;
    /** Optional content inside the textarea cell, before the textarea (e.g. file input + Upload button). When set, textarea gets pl-10. */
    beforeTextarea?: React.ReactNode;
    /** Override submit button disabled state (e.g. when submit is allowed with empty value if other data exists) */
    submitDisabled?: boolean;
}

export function InputArea({
    value,
    onChange,
    onKeyDown,
    onSubmit,
    placeholder = 'Type your message... (Enter to send)',
    disabled = false,
    isLoading = false,
    icon: Icon,
    submitIcon: SubmitIcon = ArrowUp,
    textareaRef,
    className,
    textareaClassName,
    maxWidth = '7xl',
    footerClassName,
    wrapperClassName,
    showGlow = false,
    glowClassName,
    hint,
    topSlot,
    beforeTextarea,
    submitDisabled,
    isListening = false,
    isSpeechSupported = false,
    onVoiceToggle,
}: InputAreaProps) {
    const isSubmitDisabled = submitDisabled !== undefined ? submitDisabled : (!value.trim() || disabled || isLoading);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isSubmitDisabled) {
            onSubmit();
        }
    };

    return (
        <AsideFooter maxWidth={maxWidth} className={footerClassName}>
            <form onSubmit={handleSubmit} className="w-full">
                {topSlot && <div className="mb-3">{topSlot}</div>}
                <div className={`relative ${wrapperClassName || ''}`}>
                    {showGlow && (
                        <div
                            className={
                                glowClassName ||
                                'absolute -inset-1 bg-linear-to-r from-primary to-chart-3 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000'
                            }
                        />
                    )}
                    <div
                        className={`relative flex items-end gap-3 rounded-2xl border-2 border-border/50 bg-card/80 backdrop-blur-sm p-4 shadow-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all ${className || ''}`}
                    >
                        <div className="flex-1 flex items-center gap-3">
                            {beforeTextarea ? (
                                <div className="flex-1 relative">
                                    {beforeTextarea}
                                    <textarea
                                        ref={textareaRef}
                                        value={value}
                                        onChange={onChange}
                                        onKeyDown={onKeyDown}
                                        placeholder={placeholder}
                                        disabled={disabled || isLoading}
                                        className={`flex-1 w-full bg-transparent text-foreground resize-none min-h-14 max-h-36 py-2 pl-10 pr-3 focus:outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 text-base ${textareaClassName || ''}`}
                                        rows={1}
                                    />
                                </div>
                            ) : (
                                <>
                                    {Icon && (
                                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                    <textarea
                                        ref={textareaRef}
                                        value={value}
                                        onChange={onChange}
                                        onKeyDown={onKeyDown}
                                        placeholder={placeholder}
                                        disabled={disabled || isLoading}
                                        className={`flex-1 bg-transparent text-foreground resize-none min-h-14 max-h-36 py-2 px-3 focus:outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 text-base ${textareaClassName || ''}`}
                                        rows={1}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {isSpeechSupported && onVoiceToggle && (
                                <Button
                                    type="button"
                                    onClick={onVoiceToggle}
                                    disabled={isLoading}
                                    size="lg"
                                    variant={isListening ? "default" : "ghost"}
                                    className={`h-12 w-12 shrink-0 rounded-xl ${isListening
                                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                        : 'bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary'
                                        }`}
                                    title={isListening ? 'Stop listening' : 'Start voice input'}
                                >
                                    {isListening ? (
                                        <MicOff className="w-5 h-5" />
                                    ) : (
                                        <Mic className="w-5 h-5" />
                                    )}
                                </Button>
                            )}
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                                size="lg"
                                type="submit"
                                className="h-12 w-12 shrink-0 rounded-xl bg-primary hover:bg-primary/90"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SubmitIcon className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            {hint && hint}
        </AsideFooter>
    );
}
