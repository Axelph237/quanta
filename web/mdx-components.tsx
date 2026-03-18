import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { HTMLAttributes } from "react";

export function NoFormat(props: HTMLAttributes<HTMLElement>) {
  return <section {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="heading-text-lg font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="heading-text-md font-semibold mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="heading-text-sm font-semibold mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="heading-text-sm font-semibold mb-2 opacity-60">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="mb-6 body-text leading-relaxed">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-quanta-primary hover:underline">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-quanta-surface-variant px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-quanta-surface-variant p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-4 ml-6 body-text">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-quanta-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    img: ({ src, alt }) => (
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        className="w-full h-auto rounded-lg my-4"
      />
    ),
    ...components,
  };
}
