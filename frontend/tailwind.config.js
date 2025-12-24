/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    dark: '#4f46e5', // Indigo 600
                },
                secondary: '#1e293b', // Slate 800
                background: '#0f172a', // Slate 900
                surface: '#1e293b', // Slate 800
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
