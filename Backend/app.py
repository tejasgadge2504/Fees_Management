from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.standards import standards_bp
from routes.admissions import admissions_bp
from routes.admins import admins_bp
# Initialize Flask App
app = Flask(__name__)
CORS(app)


app.register_blueprint(auth_bp)
app.register_blueprint(standards_bp)
app.register_blueprint(admissions_bp)
app.register_blueprint(admins_bp)

# Home Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Flask API is running"
    })
@app.route('/favicon.ico')
def favicon():
    return '', 204

# Health Check Route
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "API working properly"
    })


# Example POST API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Example processing
        response = {
            "received_data": data,
            "result": "Processing successful"
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# Run Server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)