import tailwindTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: "100ch",
                        marginInline: "auto",
                        color: "#111111",
                        overflowWrap: "anywhere",
                    },
                },
            },
        },
    },
    plugins: [tailwindTypography],
};
