import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in",
    robots: { index: false, follow: false },
};

export default function SignInPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
            <div className="font-mono text-center">
                <p className="text-primary text-sm">afif@dev:~$ auth --admin</p>
                <p className="text-muted-foreground text-sm mt-2">
                    Restricted area. Admin access only.
                </p>
            </div>
            <SignIn
                routing="path"
                path="/signin"
                fallbackRedirectUrl="/admin/blogs"
                // ponytail: appearance variables instead of the @clerk/themes package —
                // matches the site's actual terminal palette, one less dependency.
                appearance={{
                    variables: {
                        colorBackground: "hsl(240 10% 6%)",
                        colorPrimary: "hsl(152 45% 26%)",
                        borderRadius: "0",
                    },
                }}
            />
        </main>
    );
}
