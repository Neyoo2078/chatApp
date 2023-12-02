import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',

    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'whatapp-bg': "url('/peakpx.jpg')",
        'chat-bg': "url('/chatbg.jpg')",
        'chat-plain': "url('/chatbg-plain.jpg')",
        'black-bg': "url('/what_black.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
