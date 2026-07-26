"use client";

import { deletePost } from "@/app/(clerk)/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";

/**
 * The post list is a server component, so it can't hand a closure to DeleteButton
 * without creating an inline Server Action per row. This client wrapper imports the
 * action directly instead — one boring indirection, no per-row action ids.
 */
export function DeletePostButton({ id, title }: { id: string; title: string }) {
    return <DeleteButton name={title} onDelete={() => deletePost(id)} />;
}
