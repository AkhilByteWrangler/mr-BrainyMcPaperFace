import fitz  # PyMuPDF
# fitz: the oddly-named hero from PyMuPDF that's going to help us crack open PDFs like they're treasure chests.

from sentence_transformers import util
# Importing some serious AI magic here. This utility will help us find similarities between sentences.
# Think of it like a digital detective that’s really good at "matching vibes" between text snippets.

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    # PDF extraction 101: Open the PDF, grab all the text, and hope it doesn't look like gibberish at the end.
    doc = fitz.open(pdf_path)  
    # fitz, do your thing! We open the PDF here, because staring at a blank file won’t help anyone.
    
    text = ""
    # We need a variable to hold all the text we extract. This empty string will soon be stuffed with PDF goodness.
    
    for page in doc:
        text += page.get_text()
        # For every page in the PDF, we're extracting the text and dumping it into our 'text' variable.
        # It's like a for-loop buffet: take a little from every page and add it to the pile.
    
    return text
    # Voila! We've now got a full string of text from the entire PDF. It’s all yours.

# Find the most relevant section in the PDF using embeddings
def get_relevant_passage(question, sections, embedding_model):
    # We're about to get serious. This function finds the most relevant section of the PDF based on your question.
    # Buckle up for some AI-powered text-matching!

    question_embedding = embedding_model.encode(question)
    # First step: Turn the question into a dense numerical representation. 
    # We call this an "embedding", but you can think of it as AI translating your question into numbers (because robots speak math).

    section_embeddings = embedding_model.encode(sections)
    # Now we do the same for all the sections from the PDF. Each section gets its own fancy numerical identity.

    scores = util.pytorch_cos_sim(question_embedding, section_embeddings)
    # Here comes the fun part! We compare how "close" the question is to each section using cosine similarity.
    # If you're wondering what cosine similarity is: imagine it as asking, "Are these texts pointing in the same direction?" 
    # The closer the angle, the more similar the texts. Math, yeah!

    best_section_idx = scores.argmax()
    # After comparing, we pick the section with the highest similarity score. This is the AI's way of saying, 
    # "Yep, this section is the best match for your question."

    return sections[best_section_idx]
    # We return the best-matching section like a proud parent bringing home the perfect science project.
