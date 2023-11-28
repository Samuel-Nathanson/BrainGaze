import json
from flask_cors import CORS
from flask import Flask, jsonify, request
import awsgi

app = Flask(__name__)
CORS(app)

def handler(event, context):
    return awsgi.response(app, event, context)

    # Constant variable with path prefix
BASE_ROUTE = "/braingazeapi"

@app.route(BASE_ROUTE, methods=['GET'])
def calibration_test():
    return jsonify(message="hello world")