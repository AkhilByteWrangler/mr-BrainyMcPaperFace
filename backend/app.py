from flask import Flask, request, jsonify
# Importing Flask like we're importing magic. Flask is the thing that makes this whole app run.
# `request` lets us handle incoming HTTP requests, and `jsonify` makes it super easy to return JSON responses.

import os
import fitz  # PyMuPDF for handling PDFs
# PyMuPDF is here to help us rip the text out of PDFs. It's like our digital crowbar for extracting knowledge.

from flask_cors import CORS
# CORS = Cross-Origin Resource Sharing. This basically prevents modern browsers from having a meltdown when 
# someone tries to call this API from another domain. A little internet peace treaty.

from models import extract_text_from_pdf, query_gpt4
# Bringing in some of our custom magic. One function will handle extracting text from a PDF (good luck with that), 
# and the other will talk to GPT-4—basically summoning an AI wizard to answer our questions.

app = Flask(__name__)
# Hey Flask, here's our app! We hand over control to this Flask thingy and it does all the web magic for us.
CORS(app)
# Setting up CORS for our app, because we're not gatekeeping here. Other domains are welcome to make requests.

# Configuring where to store uploaded files. 
# Think of this as a locker room where we stash all the PDFs users upload.
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Make sure the 'uploads' folder exists. 
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    # We create the folder if it doesn't already exist. We're that organized!

@app.route('/ask', methods=['POST'])
# Here's the route. When someone sends a POST request to `/ask`, we’ll run this function.
# Like a bouncer at a club, we’re saying, "Only POST requests, please."
def ask():
    try:
        # Retrieve the JSON body from the request
        data = request.json
        question = data.get('question')
        context = data.get('context')

        # Check if question or context is missing
        if not question or not context:
            return jsonify({'error': 'Missing question or context'}), 400

        # Call GPT-4 with the question and context
        answer = query_gpt4(question, context)

        # Return the AI's answer
        return jsonify({'answer': answer})

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': 'Error processing request'}), 500


@app.route('/extract', methods=['POST'])
# This route listens for POST requests to "/extract". Think of it as the "drop your PDF here and we'll handle it" endpoint.
def extract():
    try:
        # We're about to try something risky: handling a PDF. Let's hope everything goes well.
        
        file = request.files['file']
        # Here we check the user's "digital hand" for a file. If they're not holding anything, we'll be sad.

        if not file:
            # Oops! The user forgot to bring their homework (PDF). 
            # So, we gently tell them, "No file uploaded!" and hit them with a 400 Bad Request.
            return jsonify({'error': 'No file uploaded!'}), 400
        
        # If we made it here, congrats, we have a file! 🎉
        file_path = f"uploads/{file.filename}"
        # Now we’re giving this PDF a cozy spot in our "uploads" folder. It’s like saving a digital pet into its new home.

        file.save(file_path)
        # We save the file at the designated path. No more floating files; it’s safely stored now!

        # Now, it’s time for the real magic:
        # We summon our text-extracting powers and dig into the PDF.
        context = extract_text_from_pdf(file_path)
        # The 'context' variable now holds all the secrets of the PDF. 🕵️‍♂️ Time to put it to good use.

        return jsonify({'summary': context})
        # We return the juicy, extracted text wrapped in a JSON response. Here you go, user, your PDF's content on a platter!
        
    except Exception as e:
        # Uh-oh. Something went wrong. Did the PDF fight back? 😨 Whatever happened, we catch the error like a pro.

        return jsonify({'error': f'Error extracting PDF: {str(e)}'}), 500
        # We return a 500 Internal Server Error, meaning "We messed up, but we’ll try again later!"
        # Also, we share the error message with the user—just enough info to keep them informed, but not enough to bore them.

if __name__ == '__main__':
    app.run(debug=True, port=5050)
    # Time to launch the app. Debug mode is on because, let's face it, we're still testing this thing.
    # Running on port 5050 because 5000 is too mainstream. Let’s live a little.
