/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        vhs: {
          black: '#0a0a0c',
          dark: '#12121a',
          shelf: '#1a1a2e',
          neon: {
            blue: '#00d4ff',
            magenta: '#ff00aa',
            cyan: '#00fff5',
            yellow: '#ffe156',
          },
          tape: '#2a2a3e',
          label: '#e8e0d0',
          sticker: '#ff6b35',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body: ['"VT323"', 'monospace'],
        ui: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'tracking': 'tracking 0.8s ease-out',
        'vhs-in': 'vhsIn 0.6s ease-out',
        'star-pop': 'starPop 0.5s ease-out',
        'shelf-slide': 'shelfSlide 0.4s ease-out',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        tracking: {
          '0%': { transform: 'translateY(-4px)', opacity: '0', filter: 'blur(4px)' },
          '40%': { transform: 'translateY(2px)', opacity: '0.7', filter: 'blur(2px)' },
          '100%': { transform: 'translateY(0)', opacity: '1', filter: 'blur(0)' },
        },
        vhsIn: {
          '0%': { transform: 'scaleY(0.01) scaleX(1.2)', opacity: '0' },
          '50%': { transform: 'scaleY(0.5) scaleX(1.05)', opacity: '0.6' },
          '100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
        },
        starPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shelfSlide: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
