import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: "default" | "compact";
}

/**
 * Reusable component for rendering markdown content with consistent styling
 */
export function MarkdownRenderer({
  content,
  className,
  variant = "default",
}: MarkdownRendererProps) {
  // Define markdown components with proper TypeScript types
  const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    h1: ({ children }) => (
      <h1
        className={cn(
          "font-semibold mt-3 mb-2",
          variant === "default" ? "text-lg" : "text-base"
        )}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={cn(
          "font-semibold mt-3 mb-2",
          variant === "default" ? "text-md" : "text-sm"
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={cn(
          "font-semibold mt-2 mb-1",
          variant === "default" ? "text-sm" : "text-xs"
        )}
      >
        {children}
      </h3>
    ),
    // @ts-expect-error - The ReactMarkdown types don't fully match the actual props passed
    code: ({ inline, children, ...props }) => {
      if (inline) {
        return (
          <code
            className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <pre className="p-3 rounded-md bg-slate-100 mb-2 overflow-x-auto">
          <code className="text-xs text-slate-800 font-mono" {...props}>
            {children}
          </code>
        </pre>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto mb-2">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
    tbody: ({ children }) => (
      <tbody className="divide-y divide-slate-100">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="px-3 py-2">{children}</td>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pl-4 border-l-2 border-slate-300 italic text-slate-700 my-2">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-4 border-slate-200" />,
  };

  return (
    <div
      className={cn(
        "prose prose-slate prose-sm max-w-none dark:prose-invert",
        className
      )}
    >
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}
