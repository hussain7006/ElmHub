#!/usr/bin/env python3
"""
Simple test script to verify OpenAI API key
"""
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def test_openai_api():
    """Test OpenAI API connection"""
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ OPENAI_API_KEY not found in environment variables")
        return False
    
    print(f"🔑 API Key found: {api_key[:20]}...{api_key[-10:] if len(api_key) > 30 else 'short'}")
    print(f"📏 API Key length: {len(api_key)} characters")
    
    # Check if it starts with the expected prefix
    if not api_key.startswith("sk-"):
        print("❌ API key doesn't start with 'sk-' prefix")
        return False
    
    try:
        client = OpenAI(api_key=api_key)
        
        # Test with a simple request
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, this is a test."}],
            max_tokens=10
        )
        
        print("✅ OpenAI API test successful!")
        print(f"Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {e}")
        return False

if __name__ == "__main__":
    test_openai_api() 