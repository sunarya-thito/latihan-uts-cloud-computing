"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface BlogPostProps {
  content: string
}

export function BlogPost({ content }: BlogPostProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md !bg-muted"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          img({ node, ...props }) {
            return <img {...props} className="rounded-md shadow-md" loading="lazy" />
          },
          blockquote({ node, ...props }) {
            return <blockquote {...props} className="border-l-4 border-primary/30 pl-4 italic" />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
