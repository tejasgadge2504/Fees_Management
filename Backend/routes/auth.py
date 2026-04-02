from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import bcrypt
import os
from bson.objectid import ObjectId

auth_bp = Blueprint("auth", __name__)

# MongoDB connection
# MONGO_URI = "YOUR_MONGODB_ATLAS_CONNECTION_STRING"
MONGO_URI = "mongodb+srv://teaminspire2226:INSPIRE%402226@cluster0.6ahzj5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["fees_management"]
institutes_collection = db["institutes"]


# -------------------------
# Register Institute
# -------------------------
@auth_bp.route("/auth/register", methods=["POST"])
def register():

    data = request.json

    institute_name = data.get("institute_name")
    email = data.get("email")
    pin = data.get("pin")

    if not institute_name or not email or not pin:
        return jsonify({"error": "All fields required"}), 400

    if len(pin) != 4:
        return jsonify({"error": "PIN must be 4 digits"}), 400

    existing = institutes_collection.find_one({"email": email})

    if existing:
        return jsonify({"error": "Institute already registered"}), 400

    hashed_pin = bcrypt.hashpw(pin.encode("utf-8"), bcrypt.gensalt())

    institute = {
        "institute_name": institute_name,
        "email": email,
        "pin": hashed_pin
    }

    institutes_collection.insert_one(institute)

    return jsonify({
        "message": "Institute registered successfully"
    })


# -------------------------
# Login
# -------------------------
@auth_bp.route("/auth/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    pin = data.get("pin")

    institute = institutes_collection.find_one({"email": email})

    if not institute:
        return jsonify({"error": "Institute not found"}), 404

    stored_pin = institute["pin"]

    if bcrypt.checkpw(pin.encode("utf-8"), stored_pin):

        return jsonify({
            "message": "Login successful",
            "institute_id": str(institute["_id"]),
            "institute_name": institute["institute_name"]
        })

    else:
        return jsonify({"error": "Invalid PIN"}), 401
    

# -------------------------
# Update Spreadsheet Link
# -------------------------
@auth_bp.route("/auth/institute/sheet", methods=["PATCH"])
def update_sheet_link():

    data = request.json

    institute_id = data.get("institute_id")
    sheet_url = data.get("sheet_url")

    if not institute_id or not sheet_url:
        return jsonify({"error": "institute_id and sheet_url required"}), 400

    try:
        result = institutes_collection.update_one(
            {"_id": ObjectId(institute_id)},
            {"$set": {"sheet_url": sheet_url}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Institute not found"}), 404

        return jsonify({
            "message": "Spreadsheet link updated successfully",
            "sheet_url": sheet_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500