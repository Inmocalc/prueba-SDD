import json
import secrets
import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer

history = []

USERS = {
    'admin': 'admin',
    'user1': 'pass1',
}

sessions = {}  # token -> username


class Handler(BaseHTTPRequestHandler):

    def _cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def _get_token(self):
        auth = self.headers.get('Authorization', '')
        if auth.startswith('Bearer '):
            return auth[len('Bearer '):]
        return None

    def _authenticated_user(self):
        token = self._get_token()
        if token:
            return sessions.get(token)
        return None

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/history':
            body = json.dumps(history).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._cors_headers()
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/login':
            length = int(self.headers.get('Content-Length', 0))
            try:
                data = json.loads(self.rfile.read(length))
                username = data['username']
                password = data['password']
            except (json.JSONDecodeError, KeyError, ValueError):
                self.send_response(400)
                self._cors_headers()
                self.end_headers()
                return

            if USERS.get(username) != password:
                self.send_response(401)
                self._cors_headers()
                self.end_headers()
                return

            token = secrets.token_hex(16)
            sessions[token] = username
            body = json.dumps({'token': token, 'username': username}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._cors_headers()
            self.end_headers()
            self.wfile.write(body)

        elif self.path == '/logout':
            token = self._get_token()
            if token:
                sessions.pop(token, None)
            self.send_response(200)
            self._cors_headers()
            self.end_headers()

        elif self.path == '/history':
            if self._authenticated_user() is None:
                self.send_response(401)
                self._cors_headers()
                self.end_headers()
                return

            length = int(self.headers.get('Content-Length', 0))
            try:
                data = json.loads(self.rfile.read(length))
                value = data['value']
                if not isinstance(value, (int, float)):
                    raise ValueError('value must be numeric')
            except (json.JSONDecodeError, KeyError, ValueError):
                self.send_response(400)
                self._cors_headers()
                self.end_headers()
                return

            record = {
                'value': value,
                'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            }
            history.append(record)

            body = json.dumps(record).encode()
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self._cors_headers()
            self.end_headers()
            self.wfile.write(body)

        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # suppress default request logging


if __name__ == '__main__':
    server = HTTPServer(('', 8000), Handler)
    print('Server running on http://localhost:8000')
    server.serve_forever()
