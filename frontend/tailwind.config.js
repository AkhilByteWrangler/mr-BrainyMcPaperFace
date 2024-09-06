/** @type {import('tailwindcss').Config} */
// This line is basically telling TypeScript (if you're using it) what kind of file this is. 
// It's like leaving a sticky note saying, "Hey TypeScript, this is a Tailwind CSS config, don't freak out!"

module.exports = {
  // Here we go. Exporting the config object because Tailwind needs to know what to do with all this. 
  // It’s like sending out the rules for the fashion show. Tailwind needs these to style your project.

  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // Here we specify which files Tailwind should scan for class names. This is like saying, 
    // "Tailwind, check out everything in 'src' folder with these file extensions. 
    // If you find any classes, make them look fancy."
  ],
  
  theme: {
    extend: {
      // Ah yes, "extend." The way we tell Tailwind, "You're cool, but let's make you even cooler."
      // Everything in here is like adding sprinkles to an already awesome cupcake.
      
      colors: {
        primary: '#3b82f6',  // Custom primary blue color
        // Here we’re creating a custom blue color. We could’ve gone with Tailwind’s built-in blues,
        // but nah, we’re too cool for default shades.

        secondary: '#6366f1', // Custom secondary purple color
        // And here’s our secondary color: a nice purple. Because, why not? Every good palette needs some royalty vibes.
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        // Tailwind's built-in `spin` animation is great, but sometimes you just want things to spin... slower. 
        // Like, "I’m too chill to spin fast" slow. So, here’s a custom one that takes 3 seconds per rotation.
      },
    },
  },

  plugins: [],
  // No plugins here! We could add some to extend Tailwind even further, but for now, we're keeping it simple. 
  // Sometimes it's better to keep things minimalistic — unless you're adding glitter.
}

