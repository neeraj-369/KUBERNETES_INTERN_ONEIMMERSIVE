from flask import Flask, jsonify
import time
from datetime import datetime


app = Flask(__name__)

@app.route("/")
def hello_world():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return jsonify({"Time to call": current_time})

if __name__ == "__main__":
    app.run(debug = True, port = 5001)

