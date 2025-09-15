/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './public/index.html',
        './src/**/*.{ts,tsx,js,jsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: '#0b1220',
                panel: '#121a2a',
                accent: '#7ad3ff',
                accentWarm: '#ff9f43',
                accentRed: '#ff4f58',
                accentViolet: '#c6c0ff',
            },
            boxShadow: {
                glow: '0 0 15px rgba(122, 211, 255, 0.4)'
            }
        }
    },
    plugins: []
};


