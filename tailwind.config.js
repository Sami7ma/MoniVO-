/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tells Tailwind which files to scan for class names
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      //  Our custom MoniVo color palette!
      // Now we can write className="bg-background" instead of style={{ backgroundColor: '#080D18' }}
      colors: {
        background: '#080D18',   // Deep navy — the main app background
        surface: '#121A28',      // Slightly lighter navy — for cards and sections
        champagne: '#C8A96B',    // Gold accent — buttons, highlights, active states
        ivory: '#F4F0E6',        // Off-white — primary text color
        muted: '#8D939E',        // Gray — secondary text, labels, placeholders
      },
    },
  },
  plugins: [],
};
