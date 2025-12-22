/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['"Terminal Grotesque"', 'monospace'],
            },
            colors: {
                background: '#0a0a0a',
                surface: '#121212',
                surfaceHighlight: '#1e1e1e',
                primary: '#3b82f6',
                primaryHover: '#2563eb',
                accent: '#8b5cf6',
                text: '#e5e5e5',
                textMuted: '#a3a3a3',
                border: '#262626',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
