from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import json
from datetime import datetime
from urllib.parse import parse_qs, urlparse

class StakingHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if not os.getcwd().endswith('public'):
            os.chdir('public')
        return super().do_GET()

    def do_POST(self):
        if self.path == '/submit-stake':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                wallet = data.get('wallet', '').strip()
                tx = data.get('tx', '').strip()
                amount = data.get('amount', 0)
                
                if not all([wallet, tx, amount]):
                    self.send_error_response("All fields are required")
                    return
                
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                entry = f"\n[{timestamp}] Wallet: {wallet} | TX: {tx} | Amount: {amount}"
                
                with open('stake_submissions.txt', 'a') as f:
                    f.write(entry)
                
                self.send_success_response("Neural handshake complete. Your commitment has been recorded in the Matrix.")
            except Exception as e:
                self.send_error_response(f"System error: {str(e)}")
        else:
            self.send_error_response("Invalid endpoint")

    def send_success_response(self, message):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = json.dumps({"status": "success", "message": message})
        self.wfile.write(response.encode('utf-8'))

    def send_error_response(self, message):
        self.send_response(400)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = json.dumps({"status": "error", "message": message})
        self.wfile.write(response.encode('utf-8'))

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    if os.path.exists('public'):
        os.chdir('public')
    
    port = 52757  # Using the provided port
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, StakingHandler)
    print(f"Server running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
