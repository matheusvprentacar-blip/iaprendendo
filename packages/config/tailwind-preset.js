/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'adventure-purple':       '#7B2FBE',
        'adventure-purple-light': '#A855F7',
        'sunshine-yellow':        '#F59E0B',
        'sky-blue':               '#0EA5E9',
        'forest-green':           '#10B981',
        'coral-red':              '#F87171',
        'bg-deep':                '#0F0A1E',
        'bg-card':                '#1A1033',
        'bg-surface':             '#251B47',
        'text-primary':           '#F8F4FF',
        'text-secondary':         '#B8A9D9',
        'text-muted':             '#6E5F8A',
        'dash-bg':                '#F8F7FF',
        'dash-surface':           '#FFFFFF',
        'dash-border':            '#E5E0F5',
        'dash-accent':            '#7B2FBE',
      },
      fontFamily: {
        child: ['"Nunito"', '"Fredoka One"', 'system-ui'],
        dash:  ['"Inter"', 'system-ui'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};
