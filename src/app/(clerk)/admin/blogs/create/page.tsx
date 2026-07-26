import { getAllSeries } from "@/lib/blog";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function CreatePostPage() {
    const series = await getAllSeries();
    return <PostEditor series={series.map((s) => ({ id: s.id, title: s.title }))} />;
}
