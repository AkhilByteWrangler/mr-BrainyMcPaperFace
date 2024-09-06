const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      {/* A flexbox container that centers everything horizontally. Because we love symmetry and centering stuff in CSS. */}
  
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-400"></div>
      {/* The actual spinner! It’s a little circle that spins around and around. 
      We made the top border transparent so it looks like a real spinning animation. Tailwind makes it easy to style! */}
  
      <span className="text-gray-600">Thinking...</span>
      {/* Just a little message to let the user know that the AI is thinking. No pressure, but we like to keep the user in the loop. */}
    </div>
  );
  
  export default LoadingSpinner;
  // Exporting the spinner so it can make an appearance while the AI is doing its thing.
  