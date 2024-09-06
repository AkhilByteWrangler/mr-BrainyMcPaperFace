import openai
import fitz  # PyMuPDF for PDF text extraction
# fitz sounds fancy, but it’s really just the library we're using to crack open PDFs and yank the text out.

import re  # For text cleaning
# re is our 'RegEx' ninja, here to chop out the unnecessary bits in the text like headers, footers, and those sneaky page numbers.

import tiktoken  # For counting tokens
# Not TikTok (sorry), but tiktoken is here to count tokens for GPT-4. Yes, GPT-4 cares about tokens like they're calories.

# Load the OpenAI API key from environment variables
openai.api_key = "ENTER YOUR OPENAI API KEY HERE, OR ELSE IT WON'T RUN :)"
# Never hardcode your API key. Like, ever. It's supposed to be hidden in environment variables, but here we are, breaking that rule.

# Tokenizer for GPT-4
ENCODER = tiktoken.encoding_for_model("gpt-4")
# We summon the all-knowing GPT-4 tokenizer. It’ll count tokens so we don’t accidentally feed GPT-4 too much text. 
# Think of it as portion control for AI models.

# Function to clean extracted text (remove headers, footers, extra whitespace, etc.)
def clean_text(text):
    # Remove unnecessary whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Cleaning up all that unnecessary space. Whitespace is great in design, but terrible in data. Bye-bye extra spaces!

    # Remove common header/footer patterns (e.g., page numbers)
    text = re.sub(r'Page \d+', '', text)
    # If your text mentions “Page 5” or “Page 10,” we don’t care. We’re here for the content, not the pagination.

    return text
    # Voilà! A cleaner, simpler text. It's basically text that just went through a digital car wash.

# Function to count the number of tokens in a string using GPT-4's tokenizer
def count_tokens(text):
    return len(ENCODER.encode(text))
    # We call the tokenizer and ask it to count how many tokens our text uses. GPT-4 can only handle so much at once, 
    # so we gotta keep an eye on this.

# Function to chunk text into smaller parts
def chunk_text(text, chunk_size=3000):
    # Split text into smaller chunks of roughly 'chunk_size' characters
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    # We divide the text into digestible chunks because GPT-4 has token limits.

# Function to summarize each chunk of text using GPT-4
def summarize_chunk(chunk):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Summarize the following text briefly."},
                {"role": "user", "content": chunk}
            ],
            max_tokens=300,  # We want a brief summary
            temperature=0.5
        )
        return response['choices'][0]['message']['content']
        # Get the first (and likely best) summary from GPT-4. Nothing too wordy, just the essentials.
    except Exception as e:
        print(f"Error summarizing chunk: {e}")
        return None
        # Something went wrong with the summarization, but we handle it gracefully.

# Function to summarize long text by splitting it into chunks
def summarize_long_text(text):
    chunks = chunk_text(text)
    summaries = [summarize_chunk(chunk) for chunk in chunks]
    return " ".join(summaries)  # Combine the summaries into a single summary
    # By summarizing each chunk and combining the results, we shrink the long document into something more manageable.

# Function to extract and refine text from the PDF dynamically
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)  # Load the PDF
    # Pop open that PDF file like a treasure chest. What secrets will we find inside? Probably a lot of text.

    text = ""
    for page in doc:  # Iterate over each page
        text += page.get_text()  # Extract the text from each page
        # Going through the PDF, page by page, collecting text like a digital librarian on a mission.

    # Clean and refine the extracted text
    refined_text = clean_text(text)
    # Send the raw text through our cleaning function because we want it looking fresh and presentable for GPT-4.

    return refined_text
    # Our cleaned-up text is now ready to face the world! Or at least GPT-4.

# Function to query GPT-4 using the ChatCompletion API
def query_gpt4(question, context=None):
    try:
        # Set a token limit for the context (reduce to fit within GPT-4's total token limit)
        max_context_tokens = 6692  # Keeping 1500 tokens for the question and response
        # GPT-4 isn't a bottomless pit for tokens. We must ensure our context fits nicely within the limit.
        # 8192 tokens total - 1500 tokens reserved for GPT-4's answer = 6692 tokens available for context.

        # Handle small talk or general questions
        if not context:
            # If no context is provided, assume it's small talk or a general question.
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant. You can answer any question or engage in small talk."},
                    {"role": "user", "content": question}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            return response['choices'][0]['message']['content']
            # We engage in a friendly chat with the user if no document context is available.

        context_tokens = count_tokens(context)
        # Let’s count how many tokens our context is using to make sure it’s not overeating.

        # Trim the context if it exceeds the token limit
        if context_tokens > max_context_tokens:
            print(f"Context is too large: {context_tokens} tokens. Summarizing to fit within {max_context_tokens} tokens.")
            # If the context is too big, summarize it instead of just trimming it.
            context = summarize_long_text(context)

        # Use the ChatCompletion API for context-based answers
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "You are an AI assistant tasked with answering questions "
                        "strictly based on the following context. If the question "
                        "is outside the scope of the provided context, respond with "
                        "'This question is outside the scope of the provided document.'"
                    )
                    # We tell GPT-4 to keep it strictly professional—stick to the context and don't go wandering off-topic.
                },
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
                # We hand over the cleaned context and the user's question to GPT-4 for its wisdom.
            ],
            max_tokens=1500,  # Allocate space for the answer
            # 1500 tokens max for the answer. We’re not looking for an AI monologue, just a thoughtful reply.
            temperature=0.7,
            # Temperature controls how creative GPT-4 gets. We're keeping it at a nice 0.7—not too spicy, not too bland.
        )

        # Return the assistant's response
        return response['choices'][0]['message']['content']
        # The oracle has spoken. We take the first answer (no need for a multiple-choice quiz) and send it back.

    except openai.error.OpenAIError as e:
        # Catch OpenAI-specific errors and log them
        print(f"OpenAI API error: {e}")
        # If OpenAI runs into trouble, we log the error and try to move on.
        return None

    except Exception as e:
        # Catch general exceptions
        print(f"General error: {e}")
        # If something else goes wrong, we catch that too. No need to crash the whole party.
        return None
