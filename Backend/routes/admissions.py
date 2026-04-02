from flask import Blueprint, request, jsonify
from sheets_service import get_sheet
import uuid
from datetime import datetime

admissions_bp = Blueprint("admissions", __name__)


# -----------------------------------
# GET SHEETS FROM REQUEST
# -----------------------------------
def get_sheets_from_request():

    if request.method in ["POST", "PUT", "PATCH"]:
        data = request.get_json(silent=True) or {}
        sheet_url = data.get("sheet_url")
    else:
        sheet_url = request.args.get("sheet_url")

    if not sheet_url:
        return None, None, jsonify({"error": "sheet_url required"}), 400

    admissions_sheet = get_sheet(sheet_url, "Admissions")
    installments_sheet = get_sheet(sheet_url, "Installments")
    standards_sheet = get_sheet(sheet_url, "Standard")
    students_sheet = get_sheet(sheet_url, "Students")

    return admissions_sheet, installments_sheet, None, None


# -----------------------------------
# ADD ADMISSION
# POST /api/admissions
# -----------------------------------
@admissions_bp.route("/api/admissions", methods=["POST"])
def add_admission():

    admissions_sheet, _, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = request.json

    student_id = data.get("student_id")
    standard_id = data.get("standard_id")
    fees_total = data.get("fees_total")

    if not student_id or not standard_id or not fees_total:
        return jsonify({"error": "student_id, standard_id and fees_total required"}), 400

    records = admissions_sheet.get_all_records()

    # prevent duplicate admission for same student + standard
    for row in records:
        if row["student_id"] == student_id and row["standard_id"] == standard_id:
            return jsonify({
                "error": "Admission already exists for this student in this standard",
                "admission_id": row["admission_id"]
            }), 409

    admission_id = str(uuid.uuid4())

    admissions_sheet.append_row([
        admission_id,
        student_id,
        standard_id,
        fees_total,
        datetime.utcnow().isoformat()
    ])

    return jsonify({
        "message": "Admission created successfully",
        "admission_id": admission_id
    })


# -----------------------------------
# GET ADMISSIONS OF STUDENT
# GET /api/admissions/student/{id}
# -----------------------------------
@admissions_bp.route("/api/admissions/student/<student_id>", methods=["GET"])
def get_student_admissions(student_id):

    admissions_sheet, _, error, code = get_sheets_from_request()
    if error:
        return error, code

    records = admissions_sheet.get_all_records()

    results = []

    for row in records:
        if row["student_id"] == student_id:
            results.append(row)

    return jsonify({
        "student_id": student_id,
        "admissions": results
    })


# -----------------------------------
# ADD INSTALLMENT
# POST /api/installments
# -----------------------------------
@admissions_bp.route("/api/installments", methods=["POST"])
def add_installment():

    _, installments_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = request.json

    admission_id = data.get("admission_id")
    amount = data.get("amount")

    if not admission_id or not amount:
        return jsonify({"error": "admission_id and amount required"}), 400

    installment_id = str(uuid.uuid4())

    installments_sheet.append_row([
        installment_id,
        admission_id,
        amount,
        datetime.utcnow().isoformat()
    ])

    return jsonify({
        "message": "Installment added successfully",
        "installment_id": installment_id
    })


# -----------------------------------
# GET INSTALLMENT HISTORY
# GET /api/installments/{id}
# -----------------------------------
@admissions_bp.route("/api/installments/<admission_id>", methods=["GET"])
def get_installments(admission_id):

    _, installments_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    records = installments_sheet.get_all_records()

    history = []

    for row in records:
        if row["admission_id"] == admission_id:
            history.append(row)

    return jsonify({
        "admission_id": admission_id,
        "installments": history
    })
    
    
    
# -----------------------------------
# FEES SUMMARY OF STUDENT
# GET /api/fees/summary/{student_id}
# -----------------------------------
@admissions_bp.route("/api/fees/summary/<student_id>", methods=["GET"])
def fees_summary(student_id):

    admissions_sheet, installments_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    admissions = admissions_sheet.get_all_records()
    installments = installments_sheet.get_all_records()

    student_admissions = []

    for admission in admissions:
        if admission["student_id"] == student_id:
            student_admissions.append(admission)

    if not student_admissions:
        return jsonify({
            "error": "No admissions found for this student"
        }), 404

    total_fees = 0
    total_paid = 0
    installment_count = 0

    for admission in student_admissions:

        admission_id = admission["admission_id"]
        # total_fees += float(admission["fees_total"])
        total_fees += float(admission.get("fees_total", 0))

        for inst in installments:
            if inst["admission_id"] == admission_id:
                total_paid += float(inst.get("amount", 0))
                # total_paid += float(inst["amount"])
                installment_count += 1

    remaining = total_fees - total_paid

    return jsonify({
        "student_id": student_id,
        "total_fees": total_fees,
        "total_paid": total_paid,
        "remaining_fees": remaining,
        "installments_paid": installment_count
    })