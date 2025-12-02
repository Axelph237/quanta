import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize MDX components here
    // For example, you can style headings, links, code blocks, etc.
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-4 text-on-surface">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mb-3 text-on-surface">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-2 text-on-surface">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-on-surface leading-relaxed">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-primary hover:underline">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-surface-variant px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-surface-variant p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 text-on-surface">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 text-on-surface">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="mb-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-on-surface-variant">
        {children}
      </blockquote>
    ),
    ...components,
  };
}
