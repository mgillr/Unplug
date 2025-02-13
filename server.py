from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

def run_server():
    class CORSRequestHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', '*')
            self.send_header('Access-Control-Allow-Headers', '*')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            return super().end_headers()

        def do_GET(self):
            # Ensure we're in the public directory
            if not os.getcwd().endswith('public'):
                os.chdir('public')
            return super().do_GET()

    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Ensure we're serving from public
    if os.path.exists('public'):
        os.chdir('public')
    
    port = 52111
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"Server running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()