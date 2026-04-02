from flask import Blueprint, request, jsonify
from sheets_service import get_sheet
import uuid
from datetime import datetime

standards_bp = Blueprint("standards", __name__)

# SHEET_URL = "https://docs.google.com/spreadsheets/d/17WWragEco3AwuBLE97uTHD6f72InWOX6nM3dT8Rvji8/edit?usp=sharing"

# standards_sheet = get_sheet(SHEET_URL, "Standard")
# students_sheet = get_sheet(SHEET_URL, "Students")


def get_sheets_from_request():
    
    if request.method in ["POST", "PUT", "PATCH"]:
        data = request.get_json(silent=True) or {}
        sheet_url = data.get("sheet_url")
    else:
        sheet_url = request.args.get("sheet_url")

    if not sheet_url:
        return None, None, jsonify({"error": "sheet_url required"}), 400

    standards_sheet = get_sheet(sheet_url, "Standard")
    students_sheet = get_sheet(sheet_url, "Students")

    return standards_sheet, students_sheet, None, None
# -------------------------------
# CREATE STANDARD
# -------------------------------

@standards_bp.route("/api/standards", methods=["POST"])
def create_standard():

    standards_sheet, _, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = request.json
    standard = data.get("standard")
    batch = data.get("batch")

    if not standard or not batch:
        return jsonify({"error": "standard and batch required"}), 400

    standard_id = f"{standard}_{batch}"

    records = standards_sheet.get_all_records()

    for row in records:
        if row["standard_id"] == standard_id:
            return jsonify({"error": "Standard already exists"}), 409

    standards_sheet.append_row([
        standard_id,
        standard,
        batch,
        datetime.utcnow().isoformat()
    ])

    return jsonify({
        "message": "Standard created successfully",
        "standard_id": standard_id
    })

# -------------------------------
# GET STANDARDS
# -------------------------------
@standards_bp.route("/api/standards", methods=["GET"])
def get_standards():

    standards_sheet, _, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = standards_sheet.get_all_records()

    return jsonify({
        "standards": data
    })

# -------------------------------
# DELETE STANDARD
# -------------------------------
@standards_bp.route("/api/standards/<standard_id>", methods=["DELETE"])
def delete_standard(standard_id):

    standards_sheet, _, error, code = get_sheets_from_request()
    if error:
        return error, code

    records = standards_sheet.get_all_records()

    for idx, row in enumerate(records, start=2):
        if row["standard_id"] == standard_id:
            standards_sheet.delete_rows(idx)

            return jsonify({
                "message": "Standard deleted successfully"
            })

    return jsonify({"error": "Standard not found"}), 404

# -------------------------------
# CREATE STUDENT
# -------------------------------
@standards_bp.route("/api/students", methods=["POST"])
def create_student():

    _, students_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = request.json

    student_name = data.get("student_name")
    mobile = data.get("mobile")

    if not student_name or not mobile:
        return jsonify({"error": "student_name and mobile required"}), 400

    records = students_sheet.get_all_records()

    for row in records:
        if str(row["mobile"]) == str(mobile):
            return jsonify({
                "error": "Student with this mobile already exists",
                "student_id": row["student_id"]
            }), 409

    student_id = str(uuid.uuid4())

    students_sheet.append_row([
        student_id,
        student_name,
        mobile,
        datetime.utcnow().isoformat()
    ])

    return jsonify({
        "message": "Student created successfully",
        "student_id": student_id
    })

# -------------------------------
# GET STUDENTS
# -------------------------------
@standards_bp.route("/api/students", methods=["GET"])
def get_students():

    _, students_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    students = students_sheet.get_all_records()

    return jsonify({
        "students": students
    })
# -------------------------------
# SEARCH STUDENTS
# -------------------------------
@standards_bp.route("/api/students/search", methods=["GET"])
def search_students():

    _, students_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    query = request.args.get("q", "").lower()

    students = students_sheet.get_all_records()

    results = []

    for student in students:
        if query in student["student_name"].lower() or query in str(student["mobile"]):
            results.append(student)

    return jsonify({
        "results": results
    })
    
    
     
# -------------------------------
# GET STUDENT DETAILS
# -------------------------------
@standards_bp.route("/api/students/<student_id>", methods=["GET"])
def get_student(student_id):

    _, students_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    students = students_sheet.get_all_records()

    for student in students:
        if student["student_id"] == student_id:
            return jsonify(student)

    return jsonify({
        "error": "Student not found"
    }), 404


  