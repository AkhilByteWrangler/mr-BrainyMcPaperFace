import React, { useState, useEffect } from 'react';
// React! We're also pulling in `useEffect` because we need to simulate the progress bar.

import axios from 'axios';
// Axios: our trusty HTTP request-making sidekick.

import QuestionForm from './components/QuestionForm';
// Importing the `QuestionForm` component where the user uploads their PDF and asks a question.

import AnswerDisplay from './components/AnswerDisplay';
// This component is for displaying the AI’s answer.

import LoadingSpinner from './components/LoadingSpinner';
// Nothing says "Hold tight" like a good loading spinner.

function App() {
  const [answer, setAnswer] = useState('');
  // Storing the AI’s answer in state. Starts off empty because no questions have been asked yet.

  const [loading, setLoading] = useState(false);
  // Tracks whether the AI is busy answering a question.

  const [progress, setProgress] = useState(0);
  // This state keeps track of the progress bar percentage. It starts at 0%.

  // Simulate progress bar updates
  useEffect(() => {
    if (loading) {
      setProgress(0); // Reset progress to 0 when loading starts

      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval); // Stop updating when progress reaches 100%
            return 100;
          }
          const increase = Math.random() * 20; // Random progress increments (makes it feel more real!)
          return Math.min(oldProgress + increase, 100); // Make sure we don't go over 100%
        });
      }, 500); // Update every half second

      return () => clearInterval(interval); // Cleanup the interval when loading stops
    }
  }, [loading]);

  const fetchAnswer = async (formData) => {
    setLoading(true);  // The AI is now thinking, so we start the loading process.

    try {
      // **Step 1: Send the PDF and question to the backend for text extraction**
      const response = await axios.post('http://localhost:5050/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Sends the form data (PDF and question) to the backend for extraction.

      const fileSummary = response.data.summary;
      // We store the summary of the PDF.

      // **Step 2: Send the question and PDF summary to the AI**
      const questionResponse = await axios.post('http://localhost:5050/ask', {
        question: formData.get('question'),
        context: fileSummary
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setAnswer(questionResponse.data.answer);
      // The AI's answer is now stored in state!

    } catch (error) {
      console.error("Error fetching the answer:", error);
      setAnswer("Sorry, something went wrong with answering the question.");
    } finally {
      setLoading(false);  // Done loading, so we stop the spinner and progress bar.
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
    //   {/* Setting up a smooth background gradient. */}

  <div className="relative min-h-screen flex items-center justify-center">  
    {/* Adding 'relative' to position the video behind everything */}      
      {/* Background Video */}
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/background-video.mp4" type="video/mp4" />
        {/* Make sure the video is in your 'public' folder or provide a direct link */}
      </video> 

    
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-3xl w-full transition-all duration-300 transform hover:scale-105">
        {/* This is our main content card. */}
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Ask Mr. BrainyMcPaperFace Anything </h1>
        {/* Big title to grab attention. */}

        <QuestionForm fetchAnswer={fetchAnswer} loading={loading} />
        {/* Passing down `fetchAnswer` and `loading` to `QuestionForm`. */}

        {loading && (
          <div className="mt-4">
            <LoadingSpinner />
            {/* Spinner shows up when the AI is thinking. */}

            <div className="w-full bg-gray-200 rounded-full mt-4">
              {/* The background of the progress bar */}
              <div 
                className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
              >
                {`${Math.round(progress)}%`}
              </div>
              {/* The actual progress bar. It fills up as `progress` increases. */}
            </div>
          </div>
        )}
        {/* If the AI is thinking, we show the spinner and progress bar. */}
        
        {answer && !loading && <AnswerDisplay answer={answer} />}
        {/* When we have an answer and we're not loading, display the answer. */}
      </div>
    </div>
  );
}

export default App;
// Exporting this component. It handles everything: uploading, asking questions, showing spinners, and displaying answers.