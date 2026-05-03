"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: any) {
          const language = className?.replace("language-", "") || "";

          if (!inline && language) {
            return (
              <SyntaxHighlighter
                style={oneLight as any}
                language={language}
                PreTag="div"
                className="rounded-lg border border-neutral-200 my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }

          return (
            <code
              className={`${className} bg-neutral-100 px-1.5 py-0.5 rounded-md text-sm font-mono`}
              {...props}
            >
              {children}
            </code>
          );
        },
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc ml-6 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-6 mb-4">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        h1: ({ children }) => (
          <h1 className="text-xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-bold mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-bold mb-2">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-neutral-200 pl-4 italic my-4 text-neutral-500">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-lg border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-neutral-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider border-x border-neutral-100 first:border-l-0 last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-sm text-neutral-900 border-t border-x border-neutral-100 first:border-l-0 last:border-r-0">
            {children}
          </td>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
