import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownIt from "markdown-it";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {md.render(content)}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
