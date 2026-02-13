/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f0f11',
                surface: '#18181b',
                primary: '#3b82f6', // Premium Blue
                secondary: '#a855f7', // Purple accent
                accent: '#22d3ee', // Cyan
                danger: '#ef4444',
                success: '#22c55e',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
