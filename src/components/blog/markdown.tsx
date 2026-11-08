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
                prose-headings:font-bold prose-headings:tracking-[-0.025em]
                prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-10
                prose-a:text-foreground prose-a:underline prose-a:decoration-gold prose-a:decoration-2 prose-a:underline-offset-4
                prose-code:text-gold-ink prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-pre:text-sm
                prose-blockquote:border-l-gold prose-blockquote:text-xl prose-blockquote:font-semibold prose-blockquote:not-italic
                prose-img:rounded-2xl prose-img:border prose-img:border-border
                prose-hr:border-border"
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
