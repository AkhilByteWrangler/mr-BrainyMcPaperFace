# mr-BrainyMcPaperFace : AI-Powered PDF Q&A App

Welcome to the **mr-BrainyMcPaperFace, an AI-Powered PDF Q&A App**! This project allows you to upload a PDF, ask questions based on its content, and get responses from an AI model (GPT-4). Whether you're trying to summarize, extract specific information, or get clarity on something in your PDF, this app has you covered.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [How to Run](#how-to-run)
6. [Usage](#usage)
7. [Troubleshooting](#troubleshooting)

---

## Project Overview

This web application allows users to:
1. Upload a PDF file.
2. Ask questions related to the content of the PDF.
3. Get responses from a GPT-4 AI model based on the PDF's content.

The backend extracts text from the uploaded PDF using **PyMuPDF** and sends it along with the user's question to the GPT-4 API. The frontend shows the process progress and displays the AI's response to the user.

---

## Technologies Used

### Backend:
- **Python** (Flask)
- **PyMuPDF** (for PDF text extraction)
- **OpenAI GPT-4 API** (for AI question-answering)
- **Flask-CORS** (for handling cross-origin requests)

### Frontend:
- **React.js**
- **Axios** (for making API requests)
- **TailwindCSS** (for styling)
- **HTML5 Video** (for background video functionality)

---

## Project Structure

![image](https://github.com/user-attachments/assets/c12c46ed-f0f4-47d1-a8da-6b29ee68bb1c)



---

## Setup Instructions

### Prerequisites

Make sure you have the following installed:
1. **Node.js** (for the frontend)
2. **Python 3.x** (for the backend)
3. **pip** (for managing Python packages)

---

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/AkhilByteWrangler/mr-BrainyMcPaperFace.git
cd mr-BrainyMcPaperFace/backend
```

2. Install the Python dependencies:

```bash
pip install -r requirements.txt
```

3. Set up your OpenAI API key:

Create an .env file in the backend directory and add your OpenAI API key to models.py line 12:

```bash
openai.api_key = "ENTER YOUR OPENAI API KEY HERE, OR ELSE IT WON'T RUN :)"
```

4. Run the Flask server:

```bash
python app.py
```

The backend server will start on http://localhost:5050.

---

### Frontend Setup

5. Navigate to the frontend directory:

```bash
cd ../frontend
```

6. Install the frontend dependencies:

``` bash
npm install
```

7. Start the React development server:

```bash
npm start
```

The frontend will run on http://localhost:3000. 

Visit http://localhost:3000 in your browser.

---

### Usage

1. Upload a PDF: Use the file input to upload a PDF.
2. Ask a Question: Type a question based on the PDF content in the text field.
3. Get an Answer: The AI will process the PDF, answer your question, and display the response.

### Troubleshooting

1. CORS Issues: Ensure Flask-CORS is installed and enabled in your app.py file to avoid cross-origin issues between the frontend and backend. If not installed:

```bash
pip install flask-cors
```

2. Install react-scripts. Install other common frontend packages like axios. Use this command : ```npm install react react-dom react-scripts axios postcss autoprefixer react-icons ```
3. If you haven't yet installed Tailwind, you’ll need to install it and configure it.

```bash
npm install -D tailwindcss
npx tailwindcss init
```
4. Backend Crashes: Make sure your OpenAI API key is correctly set.
5. Ensure the Flask server is running before attempting to use the frontend.
6. API Errors: Double-check your OpenAI API limits. GPT-4 has a maximum number of tokens it can process at once, so reduce the file size if necessary.

---

### Contributing

Feel free to submit a pull request or open an issue if you find a bug or have suggestions for improvements!
