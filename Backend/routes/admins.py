from flask import Blueprint, request, jsonify
from sheets_service import get_sheet
import uuid
from datetime import datetime

admins_bp = Blueprint("admins", __name__)


# -----------------------------------
# GET SHEET FROM REQUEST
# -----------------------------------
def get_admin_sheet():

    if request.method in ["POST", "PUT", "PATCH"]:
        data = request.get_json(silent=True) or {}
        sheet_url = data.get("sheet_url")
    else:
        sheet_url = request.args.get("sheet_url")

    if not sheet_url:
        return None, jsonify({"error": "sheet_url required"}), 400

    admins_sheet = get_sheet(sheet_url, "Admins")

    return admins_sheet, None, None


# -----------------------------------
# ADD ADMIN / COLLECTOR
# POST /api/admins
# -----------------------------------
@admins_bp.route("/api/admins", methods=["POST"])
def create_admin():

    admins_sheet, error, code = get_admin_sheet()
    if error:
        return error, code

    data = request.json

    name = data.get("name")
    mobile = data.get("mobile")
    role = data.get("role", "collector")

    if not name or not mobile:
        return jsonify({"error": "name and mobile required"}), 400

    records = admins_sheet.get_all_records()

    # prevent duplicate mobile
    for row in records:
        if str(row["mobile"]) == str(mobile):
            return jsonify({
                "error": "Admin with this mobile already exists",
                "admin_id": row["admin_id"]
            }), 409

    admin_id = str(uuid.uuid4())

    admins_sheet.append_row([
        admin_id,
        name,
        mobile,
        role,
        datetime.utcnow().isoformat()
    ])

    return jsonify({
        "message": "Admin created successfully",
        "admin_id": admin_id
    })


# -----------------------------------
# LIST ADMINS
# GET /api/admins
# -----------------------------------
@admins_bp.route("/api/admins", methods=["GET"])
def get_admins():

    admins_sheet, error, code = get_admin_sheet()
    if error:
        return error, code

    admins = admins_sheet.get_all_records()

    return jsonify({
        "admins": admins
    })