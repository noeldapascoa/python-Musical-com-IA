import json
import os
import re
import sys

import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "").strip()
model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if not api_key or "sua_chave" in api_key or "cole" in api_key:
    print("ERRO: configure sua GEMINI_API_KEY no arquivo .env")
    sys.exit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
payload = {
    "contents": [
        {"parts": [{"text": "Responda apenas com este JSON: {\"ok\": true, \"mensagem\": \"Conexão funcionando\"}"}]}
    ]
}

try:
    resp = requests.post(url, json=payload, timeout=30)
    print("Status HTTP:", resp.status_code)
    data = resp.json()
    print(json.dumps(data, ensure_ascii=False, indent=2)[:2000])
except Exception as e:
    print("ERRO ao testar Gemini:", e)
    sys.exit(1)
