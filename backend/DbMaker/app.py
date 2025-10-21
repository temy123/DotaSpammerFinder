import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'db')

@app.route('/databases', methods=['GET'])
def list_databases():
    try:
        # List .db files in the db directory
        files = [f for f in os.listdir(DB_FOLDER) if f.endswith('.db')]
        # Sort files by name (which will be by date)
        files.sort(reverse=True)
        return jsonify(files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/db/<path:filename>')
def download_file(filename):
    return send_from_directory(DB_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
