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
            className="prose prose-lg dark:prose-invert max-w-none
                prose-p:leading-relaxed
                prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight
                prose-h2:text-4xl prose-h2:mt-14 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-pre:text-sm
                prose-blockquote:border-l-primary prose-blockquote:font-serif prose-blockquote:text-2xl prose-blockquote:font-normal
                prose-img:rounded-2xl prose-img:border prose-img:border-border
                prose-hr:border-border"
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
