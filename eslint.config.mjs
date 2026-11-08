import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Vendored from the stageshow skill; kept as shipped so it can be re-synced.
    { ignores: ["src/components/stageshow/kit/**"] },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
