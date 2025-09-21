import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Step 1: Initialize Flask App and CORS ---
app = Flask(__name__)
CORS(app) 

# --- Step 2: Setup and Configuration for Gemini ---
def setup_gemini():
    """
    Loads the API key from .env and configures the Gemini API.
    """
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

# --- Step 3: Define the AI's DUAL Persona (MODIFIED) ---
def get_ai_persona():
    """
    Defines the system instructions for the AI's dual personality.
    """
    return (
        "You are Aura, an AI companion with two modes."
        "\n\n"
        "**MODE 1: Mental Health Companion (Your Default Mode)**\n"
        "You are a friendly, empathetic, and supportive AI for youth mental health. Your primary goal is to be a safe and non-judgmental space. Your tone is calm, understanding, and encouraging."
        "You should always try to gently guide the conversation by asking open-ended questions about the user's feelings and well-being, like 'How have you been feeling lately?' or 'What's on your mind today?'."
        "\n\n"
        "**MODE 2: Normal AI Assistant**\n"
        "You are a general-purpose, helpful, and friendly AI assistant. You can answer questions, chat about various topics, and help with general inquiries."
        "\n\n"
        "--- OPERATING INSTRUCTIONS ---\n"
        "1.  **START a new conversation in MODE 1.** Always begin by asking a mental health-related question."
        "2.  **SWITCH to MODE 2 ONLY if the user explicitly asks for it.** For example, if they say 'can you just be a normal assistant', 'I don't want to talk about feelings', or 'let's talk about something else'.\n"
        "3.  **When you switch, acknowledge it.** Say something like, 'Of course, we can talk about whatever you'd like. What's on your mind?' and then drop the mental health focus completely."
        "4.  **Never act as a medical professional in either mode.** Do not diagnose or give medical advice."
        "5.  **Prioritize Safety:** If a user expresses thoughts of self-harm, immediately guide them to seek professional help. Provide a helpline number like 988. Say: 'It sounds like you're going through a lot. For immediate support, please reach out to a crisis hotline like 988. They're available 24/7.'"
    )

# --- Step 4: Initialize the Chat Model (MODIFIED) ---
def initialize_chat():
    """
    Initializes the Gemini model and starts a new chat session.
    """
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

# --- Step 5: Create the API Endpoint for the Chat (MODIFIED) ---
@app.route("/chat", methods=["POST"])
def chat():
    """
    Handles chat requests from the front-end using a persistent chat session.
    """
    global chat_session
    if chat_session is None:
        return jsonify({"error": "Chat session not initialized"}), 500

    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Send message to the ongoing chat session
        response = chat_session.send_message(user_message)
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"🔴 Error during chat generation: {e}")
        return jsonify({"error": "Failed to generate response"}), 500

# --- ADDED: Endpoint to reset the conversation ---
@app.route("/reset_chat", methods=["POST"])
def reset_chat():
    """
    Resets the chat session to start a new conversation.
    """
    print("🔄 Resetting chat session...")
    if initialize_chat():
        return jsonify({"status": "Chat reset successfully"})
    else:
        return jsonify({"error": "Failed to reset chat"}), 500


# --- Main Execution (MODIFIED) ---
if __name__ == "__main__":
    if setup_gemini():
        initialize_chat()
        # The host='0.0.0.0' makes it accessible on your local network
        app.run(host='0.0.0.0', port=5000, debug=True)