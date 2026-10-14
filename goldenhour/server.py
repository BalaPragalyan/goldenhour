#!/usr/bin/env python3
"""
GoldenHour Pre-Hospital Emergency Telemetry Platform - Local Development Server
Includes built-in proxy for Groq LLM API to prevent browser CORS / network restrictions
"""
import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error

PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
GROQ_API_KEY = "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"
GROQ_MODEL = "qwen/qwen3.8-27b"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            
            try:
                client_data = json.loads(post_body.decode('utf-8'))
                messages = client_data.get('messages', [])
                
                # Forward to Groq API
                groq_payload = {
                    "model": GROQ_MODEL,
                    "messages": messages,
                    "max_tokens": 512,
                    "temperature": 0.3
                }
                
                req = urllib.request.Request(
                    "https://api.groq.com/openai/v1/chat/completions",
                    data=json.dumps(groq_payload).encode('utf-8'),
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json",
                        "User-Agent": "GoldenHour-Telemetry/2.4"
                    }
                )
                
                with urllib.request.urlopen(req, timeout=15) as resp:
                    resp_body = resp.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(resp_body)
                    return

            except urllib.error.HTTPError as e:
                err_data = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_data)
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        super().do_POST()

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/"
        print("=" * 65)
        print("  GoldenHour — Pre-Hospital Emergency Telemetry Gateway")
        print("  Groq LLM API Key Active: gsk_jKXtOrjwsR...b0ALsGDWO1")
        print(f"  Model: {GROQ_MODEL}")
        print("=" * 65)
        print(f"  Server running at: {url}")
        print(f"  Serving directory: {DIRECTORY}")
        print("=" * 65)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.server_close()

if __name__ == '__main__':
    main()
