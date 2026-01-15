import createMDX from "@next/mdx";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const rehypeMathdefsPath = fileURLToPath(
  new URL("./src/lib/mdx/rehype-mathdefs.mjs", import.meta.url)
);

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-math', 'remark-gfm'],
    rehypePlugins: [['rehype-mathjax/chtml', {chtml: {fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'}}],
  ],
    
  },
});

export default withMDX(nextConfig);
