from flask import Flask
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def get_current_time():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"<h1>Current Time:</h1><p>{current_time}</p>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
