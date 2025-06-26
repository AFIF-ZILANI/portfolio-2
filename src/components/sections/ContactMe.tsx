"use client";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ContactFormState {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const initialState: ContactFormState = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

const ContactForm: React.FC = (): React.JSX.Element => {
    const [form, setForm] = useState<ContactFormState>(initialState);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!response.ok) throw new Error("Network response was not ok");
            toast("Message sent! I will get back to you soon.");
            setForm(initialState);
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <form
                onSubmit={handleSubmit}
                className="space-y-6 w-full p-6 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Your message"
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </>
    );
};

export default ContactForm;
