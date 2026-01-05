'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
    showLineNumbers?: boolean;
}

// Simple syntax highlighting function
function highlightCode(code: string, language?: string): React.ReactNode {
    if (!language) {
        return code;
    }

    const lang = language.toLowerCase();

    // HTML highlighting
    if (lang === 'html' || lang === 'xml') {
        return highlightHTML(code);
    }

    // CSS highlighting
    if (lang === 'css') {
        return highlightCSS(code);
    }

    // JavaScript/TypeScript highlighting
    if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts' || lang === 'jsx' || lang === 'tsx') {
        return highlightJS(code);
    }

    // Python highlighting
    if (lang === 'python' || lang === 'py') {
        return highlightPython(code);
    }

    // JSON highlighting
    if (lang === 'json') {
        return highlightJSON(code);
    }

    return code;
}

function highlightHTML(code: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const tagRegex = /(&lt;\/?[\w\s="'-]+&gt;|&lt;[\w\s="'-]+\/?&gt;)/g;

    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(code)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`}>{code.slice(lastIndex, match.index)}</span>);
        }

        const tag = match[0];
        const highlightedTag = tag
            .replace(/&lt;(\/?)([\w]+)/g, '<span style={{color: "#569cd6"}}>&lt;$1</span><span style={{color: "#4ec9b0"}}>$2</span>')
            .replace(/(\w+)="([^"]*)"/g, '<span style={{color: "#9cdcfe"}}>$1</span>="<span style={{color: "#ce9178"}}>$2</span>"')
            .replace(/&gt;/g, '<span style={{color: "#569cd6"}}>&gt;</span>');

        parts.push(<span key={`tag-${match.index}`} dangerouslySetInnerHTML={{ __html: highlightedTag }} />);
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < code.length) {
        parts.push(<span key={`text-end`}>{code.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? <>{parts}</> : code;
}

function highlightCSS(code: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const selectorRegex = /([^{}]+)\{/g;

    let lastIndex = 0;
    let match;

    while ((match = selectorRegex.exec(code)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`}>{code.slice(lastIndex, match.index)}</span>);
        }

        parts.push(
            <span key={`selector-${match.index}`}>
                <span style={{ color: '#d7ba7d' }}>{match[1]}</span>
                <span style={{ color: '#569cd6' }}>{'{'}</span>
            </span>
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < code.length) {
        parts.push(<span key={`text-end`}>{code.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? <>{parts}</> : code;
}

function highlightJS(code: string): React.ReactNode {
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch', 'finally'];
    const builtins = ['console', 'document', 'window', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise'];

    let highlighted = code;

    // Highlight strings
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)(\1)/g, '<span style="color: #ce9178">$1$2$3</span>');

    // Highlight keywords
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span style="color: #569cd6">$1</span>');
    });

    // Highlight builtins
    builtins.forEach(builtin => {
        const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span style="color: #4ec9b0">$1</span>');
    });

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #b5cea8">$1</span>');

    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color: #6a9955">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

function highlightPython(code: string): React.ReactNode {
    const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'import', 'from', 'as', 'return', 'yield', 'lambda', 'with', 'async', 'await'];
    const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple'];

    let highlighted = code;

    // Highlight strings
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)(\1)/g, '<span style="color: #ce9178">$1$2$3</span>');

    // Highlight keywords
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span style="color: #569cd6">$1</span>');
    });

    // Highlight builtins
    builtins.forEach(builtin => {
        const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span style="color: #4ec9b0">$1</span>');
    });

    // Highlight comments
    highlighted = highlighted.replace(/(#.*$)/gm, '<span style="color: #6a9955">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

function highlightJSON(code: string): React.ReactNode {
    let highlighted = code;

    // Highlight keys
    highlighted = highlighted.replace(/"([^"]+)":/g, '<span style="color: #9cdcfe">"$1"</span>:');

    // Highlight strings
    highlighted = highlighted.replace(/: "([^"]+)"/g, ': <span style="color: #ce9178">"$1"</span>');

    // Highlight numbers
    highlighted = highlighted.replace(/: (\d+\.?\d*)/g, ': <span style="color: #b5cea8">$1</span>');

    // Highlight booleans and null
    highlighted = highlighted.replace(/\b(true|false|null)\b/g, '<span style="color: #569cd6">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

export function CodeBlock({
    code,
    language,
    className,
    showLineNumbers = false
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const lines = code.split('\n');
    const hasContent = code.trim().length > 0;

    return (
        <div
            className={cn(
                'relative group my-4 rounded-lg overflow-hidden border border-border shadow-sm',
                className
            )}
        >
            {/* Header dengan language dan copy button */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] dark:bg-[#161b22] border-b border-border/60">
                {language && (
                    <span className="text-xs font-mono uppercase rounded px-2 py-1 bg-[#3c3c3c] text-[#9cdcfe]">
                        {language}
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                    title="Copy code"
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                </Button>
            </div>

            {/* Code content */}
            <div className="relative overflow-x-auto bg-[#1e1e1e] dark:bg-[#0d1117] text-[#d4d4d4] shadow-inner">
                {showLineNumbers ? (
                    <div className="flex">
                        {/* Line numbers */}
                        <div className="shrink-0 px-4 py-3 text-right select-none border-r border-border/50 bg-[#252526] dark:bg-[#161b22]">
                            <div className="font-mono text-xs text-[#858585] leading-6">
                                {lines.map((_, index) => (
                                    <div key={index}>{index + 1}</div>
                                ))}
                            </div>
                        </div>
                        {/* Code */}
                        <pre className="flex-1 overflow-x-auto py-3 px-4">
                            <code className="font-mono text-sm leading-6 text-[#d4d4d4]">
                                {lines.map((line, index) => (
                                    <div key={index} className="whitespace-pre">
                                        {highlightCode(line, language) || '\u00A0'}
                                    </div>
                                ))}
                            </code>
                        </pre>
                    </div>
                ) : (
                    <pre className="overflow-x-auto py-3 px-4">
                        <code className="font-mono text-sm leading-6 text-[#d4d4d4] block">
                            {hasContent ? (
                                lines.map((line, index) => (
                                    <div key={index} className="whitespace-pre">
                                        {highlightCode(line, language) || '\u00A0'}
                                    </div>
                                ))
                            ) : (
                                <span className="text-muted-foreground">No code</span>
                            )}
                        </code>
                    </pre>
                )}
            </div>
        </div>
    );
}

