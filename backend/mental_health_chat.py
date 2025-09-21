import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# --- MODIFIED: Configure Flask to serve the frontend directory ---
# The static_folder is set to '../frontend' to point one level up from the 'backend' directory
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# --- MODIFIED: Route to serve index.html from the root ---
@app.route("/")
def index():
    """Serves the index.html file."""
    return send_from_directory(app.static_folder, 'index.html')

# --- ADDED: Route to serve other static files (CSS, JS, images) ---
@app.route("/<path:path>")
def static_files(path):
    """Serves other static files needed by the frontend."""
    return send_from_directory(app.static_folder, path)

# --- Step 2: Setup and Configuration for Gemini ---
def setup_gemini():
    """Loads the API key from .env and configures the Gemini API."""
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("🔴 Error: GEMINI_API_KEY not found.")
        return False
    try:
        genai.configure(api_key=api_key)
        print("✅ Gemini API configured successfully.")
        return True
    except Exception as e:
        print(f"🔴 Error configuring Gemini API: {e}")
        return False

# --- Step 3: Define the AI's DUAL Persona ---
def get_ai_persona():
    """Defines the system instructions for the AI's dual personality."""
    return (
        "You are Aura, an AI companion with two modes."
        # ... (rest of your persona definition remains the same) ...
    )

# --- Step 4: Initialize the Chat Model ---
def initialize_chat():
    """Initializes the Gemini model and starts a new chat session."""
    global chat_session
    try:
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=get_ai_persona()
        )
        chat_session = model.start_chat(history=[])
        print("✅ Generative model and chat session initialized.")
        return True
    except Exception as e:
        print(f"🔴 Error initializing model: {e}")
        return False

# --- Global variable for the chat session ---
chat_session = None

# --- Step 5: Create the API Endpoint for the Chat ---
@app.route("/chat", methods=["POST"])
def chat():
    """Handles chat requests from the front-end."""
    global chat_session
    # ... (rest of your chat function remains the same) ...
    user_message = request.json.get("message")
    response = chat_session.send_message(user_message)
    return jsonify({"reply": response.text})

# --- Endpoint to reset the conversation ---
@app.route("/reset_chat", methods=["POST"])
def reset_chat():
    """Resets the chat session."""
    # ... (rest of your reset_chat function remains the same) ...
    initialize_chat()
    return jsonify({"status": "Chat reset successfully"})

# --- Main Execution ---
if __name__ == "__main__":
    if setup_gemini():
        initialize_chat()
        app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
