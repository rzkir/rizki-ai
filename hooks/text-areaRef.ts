import { useRef, useEffect } from "react";

interface UseTextareaRefOptions {
  input: string;
  maxHeight?: number;
}

interface UseTextareaRefReturn {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  resetHeight: () => void;
}

export function useTextareaRef({
  input,
  maxHeight = 200,
}: UseTextareaRefOptions): UseTextareaRefReturn {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input, maxHeight]);

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return { textareaRef, resetHeight };
}
