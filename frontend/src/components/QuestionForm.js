import React, { useState, useEffect } from 'react';
// React again! And this time we’re bringing along `useState` for tracking the user’s question and file, 
// and `useEffect` because we might want to do some magical caching stuff later.

const QuestionForm = ({ fetchAnswer, loading }) => {
  const [question, setQuestion] = useState('');
  // We need somewhere to store the user's brilliant question. 
  // Right now, it’s empty because they haven’t typed anything yet. 

  const [file, setFile] = useState(null);
  // Here’s where we’ll store the PDF the user uploads. It’s like an empty briefcase—ready to hold some important documents.

  const [error, setError] = useState(null);
  // If anything goes wrong (like a missing question or file), we’ll keep the error message here and show it to the user. 
  // Error starts off as `null` because, hey, everything’s fine so far!

  const [cachedFile, setCachedFile] = useState(null);
  // This is where we store the previously uploaded file, so if the user uploads the same one again, we don’t need to process it twice. 
  // Efficiency, people!

  const [cachedSummary, setCachedSummary] = useState('');
  // Same thing here, but for the PDF summary. We’re holding onto the summary of the file so we don’t have to extract it again for every question.

  // Let’s pull in any cached data from `localStorage` if the user refreshes the page or comes back later.
  useEffect(() => {
    const cachedFileFromStorage = localStorage.getItem('cachedFile');
    const cachedSummaryFromStorage = localStorage.getItem('cachedSummary');
    if (cachedFileFromStorage) setCachedFile(JSON.parse(cachedFileFromStorage));
    if (cachedSummaryFromStorage) setCachedSummary(cachedSummaryFromStorage);
    // We’re retrieving cached file and summary from `localStorage`. It’s like pulling out old notes from your backpack.
  }, []);

  // Save the cached data into `localStorage` whenever the user uploads a new file or we generate a new summary.
  useEffect(() => {
    if (cachedFile) localStorage.setItem('cachedFile', JSON.stringify(cachedFile));
    if (cachedSummary) localStorage.setItem('cachedSummary', cachedSummary);
    // We’re saving the cached data so that it persists across sessions. If the user leaves and comes back, we’ve still got their stuff.
  }, [cachedFile, cachedSummary]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // The user just uploaded a file, and we’re grabbing it. 

    setFile(selectedFile);
    // Now we store that file in state so we can hold onto it while we process the question.

    if (!selectedFile || (cachedFile && selectedFile.name === cachedFile.name && selectedFile.size === cachedFile.size)) {
      // If the user uploads the same file or no file at all, we don’t need to process it again. 
      // We’re being smart here and checking the file name and size to avoid unnecessary work.
      return;
    }

    setCachedFile(null);
    setCachedSummary('');
    // If it's a new file, we reset the cached file and summary, because we’re starting from scratch.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don’t let the form submit the old-fashioned way! No page refreshes here. We’re keeping everything smooth with JavaScript.

    setError(null);
    // Reset any previous error messages because we’re starting fresh.

    if (!file) {
      setError('Please upload a PDF file.');
      // If the user didn’t upload a file, we show a friendly reminder.
      // "Hey, we need that PDF file before we can ask the AI anything!"
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question.');
      // No question? No answer. We need the user to give us something to work with.
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      // No sneaky Word docs or JPGs, please. We want PDFs and only PDFs. 
      // Let the user know they’ve got to stick to the format.
      return;
    }

    const fileSize = file.size / 1024 / 1024;
    // Let’s measure the file size. We're converting bytes into megabytes because reading file sizes in bytes is just... painful.

    if (fileSize > 10) {
      setError('File size exceeds the limit of 10MB.');
      // Whoa, hold up! If the file is larger than 10MB, we’ve got to stop it. 
      // Tell the user to go on a PDF diet.
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);
    // Packing up the file and question into a nice, neat `FormData` package, 
    // ready to send off to the backend for some AI magic.

    fetchAnswer(formData);
    // Now we pass the `FormData` package to `fetchAnswer`, which will take care of talking to the backend AI.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* The form’s `onSubmit` event is tied to `handleSubmit`. This is where all the file validation and question sending happens.
      Tailwind’s `space-y-4` adds some nice spacing between form elements—because no one likes squished forms. */}

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* This is where the user types their question. It’s linked to the `question` state, so every keystroke updates what we store in memory. 
      Tailwind gives it a neat border and a cool blue focus ring when selected, because we like making things look nice. */}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      {/* Here’s where the user uploads their PDF. We only accept `.pdf` files because we’re PDF purists. 
      Tailwind gives it the same classy border treatment as the question input field. */}

      {error && <p className="text-red-500">{error}</p>}
      {/* If something goes wrong, we display an error message in red, because that’s the universal color for "Oops, something’s wrong." 
      Whether it's a missing file or question, the user gets instant feedback. */}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-lg transition-all duration-300 transform hover:bg-blue-700 hover:scale-105"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Ask'}
      </button>
      {/* The `Ask` button! When clicked, it sends the form data to the backend. 
      Tailwind makes it pop with a blue background, rounded corners, and a subtle hover effect. 
      We also disable the button if the AI is already working on a question (don’t want to overload it). */}
    </form>
  );
};

export default QuestionForm;
// Exporting this form so the App component can use it. This form is ready to take questions, process PDFs, and send everything to the AI.