import React, { useState, useEffect } from 'react';
// React and useState? Check. We’re also bringing in useEffect because we’re going to animate the answer letter-by-letter, 
// and useEffect helps us make things happen after the component has been rendered.

const AnswerDisplay = ({ answer }) => {
  const [displayedText, setDisplayedText] = useState('');
  // We need a place to store the letters as they come in one by one, so here’s our 'displayedText'. 
  // Starts off as an empty string because the typing hasn’t begun yet.

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + answer[index]);
      // Every 50 milliseconds, we add one more letter to 'displayedText' from the 'answer'. It’s like a typewriter effect! 
      // This makes it look like the AI is typing out the answer in real-time.

      index++;
      if (index >= answer.length) clearInterval(interval);
      // Once we’ve typed out the entire answer, we stop the interval so it doesn’t keep running forever.
    }, 50); // Each letter appears every 50 milliseconds. Adjust this number to make it faster or slower.

    return () => clearInterval(interval);
    // Clean up after ourselves! When the component is destroyed, we clear the interval so it doesn’t keep running in the background.
  }, [answer]);
  // The effect only runs when the 'answer' changes. That way, when a new answer comes in, we start typing all over again.

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
      {/* A nice light-gray box with rounded corners to display the answer. It’s styled to feel like a safe, welcoming space 
      for the AI’s response. */}

      <p className="text-gray-800 text-lg">{displayedText}</p>
      {/* Here’s where we show the answer. But instead of showing it all at once, it comes in letter-by-letter, 
      thanks to the magic of 'displayedText'. */}
    </div>
  );
};

export default AnswerDisplay;
// The typing effect is ready! We export the component so the App component can use it to display the AI’s answers.