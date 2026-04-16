import time
import logging
from huggingface_hub import InferenceClient
from app.config import HF_API_TOKEN, HF_MODEL_ID

logger = logging.getLogger(__name__)

def ask_huggingface_llm(query: str) -> dict:
    """
    Calls the Hugging Face Inference API using the official InferenceClient.
    Returns a dictionary with 'answer' and 'source'.
    """
    if not HF_API_TOKEN:
        return {
            "source": "llm_fallback",
            "answer": "AI fallback unavailable: HF_API_TOKEN is missing in .env."
        }

    # Initialize the official client
    client = InferenceClient(token=HF_API_TOKEN)
    
    # Use Chat completion with a Senior Architect persona - demanding high volume detail
    messages = [
        {
            "role": "system", 
            "content": (
                "You are a Senior Technical Solution Architect. Your goal is to provide "
                "EXTREMELY detailed, comprehensive, and multi-paragraph technical answers. "
                "NEVER give short answers. Divide your response into at least 3-4 clearly explained sections. "
                "Include technical background, comparisons, implementation steps, and best practices. "
                "Your responses should feel like a mini-article or a deep-dive technical blog post."
            )
        },
        {"role": "user", "content": f"Please provide an extremely detailed and comprehensive explanation for: {query}"}
    ]
    
    # Attempt with retry logic for "model waking up" scenarios
    for attempt in range(2):
        try:
            response = client.chat_completion(
                model=HF_MODEL_ID,
                messages=messages,
                max_tokens=1000, # Increased to 1000 for maximum detail
                temperature=0.5, # Slightly higher for more descriptive depth
            )

            
            return {
                "source": "llm_fallback",
                "answer": response.choices[0].message.content.strip()
            }
                
        except Exception as e:
            error_msg = str(e)
            logger.error(f"[LLM Error] Attempt {attempt+1}: {error_msg}")
            
            if "503" in error_msg:  # Model is loading
                time.sleep(3)
                continue
            
            return {
                "source": "llm_fallback",
                "answer": f"The AI Service encountered a technical issue ({type(e).__name__}). Please try again shortly."
            }

    return {
        "source": "llm_fallback",
        "answer": "The AI is still warming up on Hugging Face servers. Please try again in a few moments."
    }
