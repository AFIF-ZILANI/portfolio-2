import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/**
 * The one markdown renderer. The public post page and the admin live preview both
 * use it, so what you see while writing is exactly what ships.
 *
 * Raw HTML stays disabled (react-markdown's default), so no sanitizer is needed.
 */
export function Markdown({ children }: { children: string }) {
    return (
        <div
            className="prose prose-invert max-w-none
                prose-headings:font-display prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                prose-blockquote:border-l-primary prose-blockquote:not-italic
                prose-img:border prose-img:border-border
                prose-hr:border-border"
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
