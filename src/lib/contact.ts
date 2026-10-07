/** Shared by the contact form and /api/contact, so the server only accepts topics the form offers. */
export const CONTACT_TOPICS = [
    { value: "buying", label: "Buying poultry" },
    { value: "supplying", label: "Supplying the farm" },
    { value: "partnership", label: "Partnership or investment" },
    { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const topicLabel = (value: string) =>
    CONTACT_TOPICS.find((t) => t.value === value)?.label ?? "Something else";
