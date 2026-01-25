'use client';

import React from 'react';
import {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyP,
    TypographyBlockquote,
    TypographyList,
    TypographyOrderedList,
    TypographyListItem,
    TypographyCode,
} from '@/components/ui/typography';
import { CodeBlock } from '@/components/code-block';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    // Split content into lines
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let currentOrderedList: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';
    let inTable = false;
    let tableRows: string[] = [];

    const flushList = () => {
        if (currentList.length > 0) {
            elements.push(
                <TypographyList key={`list-${elements.length}`}>
                    {currentList.map((item, idx) => (
                        <TypographyListItem key={idx}>
                            <MarkdownInline text={item} />
                        </TypographyListItem>
                    ))}
                </TypographyList>
            );
            currentList = [];
        }
    };

    const flushOrderedList = () => {
        if (currentOrderedList.length > 0) {
            elements.push(
                <TypographyOrderedList key={`olist-${elements.length}`}>
                    {currentOrderedList.map((item, idx) => (
                        <TypographyListItem key={idx}>
                            <MarkdownInline text={item} />
                        </TypographyListItem>
                    ))}
                </TypographyOrderedList>
            );
            currentOrderedList = [];
        }
    };

    const flushCodeBlock = () => {
        if (codeBlockContent.length > 0) {
            const code = codeBlockContent.join('\n');
            elements.push(
                <CodeBlock
                    key={`codeblock-${elements.length}`}
                    code={code}
                    language={codeBlockLanguage || undefined}
                    showLineNumbers={code.split('\n').length > 5}
                />
            );
            codeBlockContent = [];
            codeBlockLanguage = '';
        }
    };

    const flushTable = () => {
        if (tableRows.length > 0) {
            const table = parseTable(tableRows);
            if (table.headers.length > 0) {
                elements.push(
                    <div key={`table-${elements.length}`} className="my-3 sm:my-4 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {table.headers.map((header: string, idx: number) => (
                                        <TableHead key={idx} className="text-xs sm:text-sm">
                                            <div className="space-y-1">
                                                {header.trim().split('<br>').map((part: string, partIdx: number, parts: string[]) => (
                                                    <React.Fragment key={partIdx}>
                                                        <MarkdownInline text={part.trim()} />
                                                        {partIdx < parts.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {table.rows.map((row: string[], rowIdx: number) => (
                                    <TableRow key={rowIdx}>
                                        {row.map((cell: string, cellIdx: number) => (
                                            <TableCell key={cellIdx} className="text-xs sm:text-sm">
                                                <div className="space-y-1">
                                                    {cell.trim().split('<br>').map((part: string, partIdx: number, parts: string[]) => (
                                                        <React.Fragment key={partIdx}>
                                                            <MarkdownInline text={part.trim()} />
                                                            {partIdx < parts.length - 1 && <br />}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                );
            }
            tableRows = [];
        }
    };

    const splitTableRow = (row: string): string[] => {
        // Remove leading and trailing |
        const trimmed = row.trim();
        if (trimmed.startsWith('|')) {
            const cells = trimmed.slice(1);
            if (cells.endsWith('|')) {
                return cells.slice(0, -1).split('|').map((cell: string) => cell.trim());
            }
            return cells.split('|').map((cell: string) => cell.trim());
        }
        return [];
    };

    const parseTable = (rows: string[]): { headers: string[]; rows: string[][] } => {
        if (rows.length < 2) return { headers: [], rows: [] };

        // First row is headers
        const headers = splitTableRow(rows[0]);

        // Skip separator row (second row with |---|)
        const dataRows = rows.slice(2).map((row: string) => splitTableRow(row));

        return { headers, rows: dataRows };
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Check for code blocks
        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                flushCodeBlock();
                inCodeBlock = false;
            } else {
                flushList();
                flushOrderedList();
                flushTable();
                inCodeBlock = true;
                // Extract language from ```language
                const lang = trimmedLine.slice(3).trim();
                codeBlockLanguage = lang || '';
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
            continue;
        }

        // Check for table
        const isTableRow = trimmedLine.includes('|') && trimmedLine.split('|').length >= 3;
        const isTableSeparator = /^\|[\s\-:]+\|/.test(trimmedLine);

        if (isTableRow && !isTableSeparator) {
            if (!inTable) {
                flushList();
                flushOrderedList();
                inTable = true;
            }
            tableRows.push(line);
            continue;
        } else if (isTableSeparator) {
            if (inTable) {
                tableRows.push(line); // Keep separator for parsing
            }
            continue;
        } else if (inTable) {
            // End of table
            flushTable();
            inTable = false;
        }

        // Check for headings
        if (trimmedLine.startsWith('####')) {
            flushList();
            flushOrderedList();
            flushTable();
            const text = trimmedLine.slice(4).trim();
            if (text) {
                elements.push(
                    <TypographyH4 key={`h4-${elements.length}`}>
                        <MarkdownInline text={text} />
                    </TypographyH4>
                );
            }
            continue;
        }

        if (trimmedLine.startsWith('###')) {
            flushList();
            flushOrderedList();
            flushTable();
            const text = trimmedLine.slice(3).trim();
            if (text) {
                elements.push(
                    <TypographyH3 key={`h3-${elements.length}`}>
                        <MarkdownInline text={text} />
                    </TypographyH3>
                );
            }
            continue;
        }

        if (trimmedLine.startsWith('##')) {
            flushList();
            flushOrderedList();
            flushTable();
            const text = trimmedLine.slice(2).trim();
            if (text) {
                elements.push(
                    <TypographyH2 key={`h2-${elements.length}`}>
                        <MarkdownInline text={text} />
                    </TypographyH2>
                );
            }
            continue;
        }

        if (trimmedLine.startsWith('#')) {
            flushList();
            flushOrderedList();
            flushTable();
            const text = trimmedLine.slice(1).trim();
            if (text) {
                elements.push(
                    <TypographyH1 key={`h1-${elements.length}`}>
                        <MarkdownInline text={text} />
                    </TypographyH1>
                );
            }
            continue;
        }

        // Check for blockquote
        if (trimmedLine.startsWith('>')) {
            flushList();
            flushOrderedList();
            flushTable();
            const text = trimmedLine.slice(1).trim();
            if (text) {
                elements.push(
                    <TypographyBlockquote key={`quote-${elements.length}`}>
                        <MarkdownInline text={text} />
                    </TypographyBlockquote>
                );
            }
            continue;
        }

        // Check for unordered list
        if (trimmedLine.match(/^[-*+]\s/)) {
            flushOrderedList();
            flushTable();
            const text = trimmedLine.slice(2).trim();
            if (text) {
                currentList.push(text);
            }
            continue;
        }

        // Check for ordered list
        if (trimmedLine.match(/^\d+\.\s/)) {
            flushList();
            flushTable();
            const text = trimmedLine.replace(/^\d+\.\s/, '').trim();
            if (text) {
                currentOrderedList.push(text);
            }
            continue;
        }

        // Regular paragraph
        if (trimmedLine) {
            flushList();
            flushOrderedList();
            flushTable();
            elements.push(
                <TypographyP key={`p-${elements.length}`}>
                    <MarkdownInline text={trimmedLine} />
                </TypographyP>
            );
        } else {
            // Empty line - flush lists and tables
            flushList();
            flushOrderedList();
            flushTable();
        }
    }

    // Flush any remaining lists, tables, and code blocks
    flushList();
    flushOrderedList();
    flushTable();
    flushCodeBlock();

    return (
        <div className={cn('max-w-none space-y-2 sm:space-y-3 md:space-y-4', className)}>
            {elements}
        </div>
    );
}

// Component untuk merender inline markdown (bold, italic, code, links)
function MarkdownInline({ text }: { text: string }) {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Pattern untuk markdown inline
    const patterns = [
        { regex: /\*\*\*(.+?)\*\*\*/g, type: 'bolditalic' }, // ***bold italic***
        { regex: /\*\*(.+?)\*\*/g, type: 'bold' }, // **bold**
        { regex: /\*(.+?)\*/g, type: 'italic' }, // *italic*
        { regex: /`(.+?)`/g, type: 'code' }, // `code`
        { regex: /\[(.+?)\]\((.+?)\)/g, type: 'link' }, // [text](url)
    ];

    let lastIndex = 0;
    const matches: Array<{ start: number; end: number; type: string; content: string; url?: string }> = [];

    // Find all matches
    patterns.forEach(({ regex, type }) => {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                type,
                content: match[1],
                url: match[2],
            });
        }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep the first one)
    const filteredMatches: typeof matches = [];
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const overlaps = filteredMatches.some(
            (m) => !(match.end <= m.start || match.start >= m.end)
        );
        if (!overlaps) {
            filteredMatches.push(match);
        }
    }

    // Build parts
    filteredMatches.forEach((match) => {
        // Add text before match
        if (match.start > lastIndex) {
            parts.push(<span key={key++}>{text.slice(lastIndex, match.start)}</span>);
        }

        // Add match
        switch (match.type) {
            case 'bold':
                parts.push(
                    <strong key={key++}>
                        <MarkdownInline text={match.content} />
                    </strong>
                );
                break;
            case 'italic':
                parts.push(
                    <em key={key++}>
                        <MarkdownInline text={match.content} />
                    </em>
                );
                break;
            case 'bolditalic':
                parts.push(
                    <strong key={key++}>
                        <em>
                            <MarkdownInline text={match.content} />
                        </em>
                    </strong>
                );
                break;
            case 'code':
                parts.push(<TypographyCode key={key++}>{match.content}</TypographyCode>);
                break;
            case 'link':
                parts.push(
                    <a
                        key={key++}
                        href={match.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        {match.content}
                    </a>
                );
                break;
        }

        lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    return <>{parts.length > 0 ? parts : text}</>;
}

