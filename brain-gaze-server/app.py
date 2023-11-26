from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import json
import base64
import io
from PIL import Image  # Pillow library for image processing
import traceback

app = Flask(__name__)
app.debug = True;
CORS(app)  # Initialize CORS extension

@app.route('/api/save_calibration_data', methods=['POST'])
def save_calibration_data():
    try:
        data = request.get_json()  # Get data sent from the React app
        # Process and store the calibration data in your database
        # Return a response if needed
        print("POST request: save_calibration_data")
        print(json.dumps(data, indent=4))  # Pretty print the JSON data
        # Process and store the data as needed

        return jsonify({'message': 'Calibration data received and saved'})
    except Exception as e:
        print('Exception occurred:', str(e))
        traceback.print_exc()  # This will print the full traceback
        return jsonify({'error': 'Error processing data'}), 500  # Return an error response if there's an issue


@app.route('/api/save_media_data', methods=['POST'])
def save_media_data():
    try:
        data = request.get_json()  # Get data sent from the React app
        # Process and store the media data in your database
        # Return a response if needed
        print("POST request: save_media_data")
        print(json.dumps(data, indent=4))  # Pretty print the JSON data
        # Process and store the data as needed

        return jsonify({'message': 'Media data received and saved'})
    except Exception as e:
        print('Exception occurred:', str(e))
        traceback.print_exc()  # This will print the full traceback
        return jsonify({'error': 'Error processing data'}), 500  # Return an error response if there's an issue

@app.route('/api/save_webcam_snapshot', methods=['POST'])
def save_webcam_snapshot():
    try:
        import re
        data = request.get_json()
        image_data = re.sub('^data:image/.+;base64,', '', data['img'])

        img = Image.open(io.BytesIO(base64.b64decode(image_data)))

        # Save the image to a file (e.g., as a JPEG image)
        img.save('webcam_snapshot.jpg', 'JPEG')

        # Process and store the image in your database (replace this with your logic)
        # ...

        return jsonify({'message': 'Webcam snapshot received and saved'})
    except Exception as e:
        print('Exception occurred:', str(e))
        traceback.print_exc()  # This will print the full traceback
        return jsonify({'error': 'Error processing webcam snapshot'}), 500


if __name__ == '__main__':
    app.run(debug=True)
