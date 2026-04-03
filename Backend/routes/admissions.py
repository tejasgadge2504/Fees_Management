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

    admissions_sheet, installments_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = request.json
    admission_id = data.get("admission_id")
    amount = int(data.get("amount"))
    received_by = data.get("received_by")

    if not admission_id or not amount:
        return jsonify({"error": "admission_id and amount required"}), 400

    # ------------------------
    # ADD INSTALLMENT
    # ------------------------
    installment_id = str(uuid.uuid4())

    installments_sheet.append_row([
        installment_id,
        admission_id,
        amount,
        received_by,
        datetime.utcnow().isoformat()
    ])

    # ------------------------
    # CALCULATE TOTAL PAID
    # ------------------------
    installments_records = installments_sheet.get_all_records()

    total_paid = 0
    for row in installments_records:
        if row["admission_id"] == admission_id:
            total_paid += int(row["amount"])

    # ------------------------
    # GET TOTAL FEES
    # ------------------------
    admissions_records = admissions_sheet.get_all_records()

    for idx, row in enumerate(admissions_records, start=2):

        if row["admission_id"] == admission_id:

            total_fees = int(row["total_fees"])
            balance = total_fees - total_paid

            # update balance column (column 5)
            admissions_sheet.update_cell(idx, 5, balance)

            break

    return jsonify({
        "message": "Installment added successfully",
        "installment_id": installment_id,
        "balance": balance
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
    
    
# -----------------------------------
# CREATE STUDENT + ADMISSION + INSTALLMENT
# POST /api/full-admission
# -----------------------------------
@admissions_bp.route("/api/full-admission", methods=["POST"])
def full_admission():

    admissions_sheet, installments_sheet, error, code = get_sheets_from_request()
    if error:
        return error, code

    data = request.json
    sheet_url = data.get("sheet_url")

    students_sheet = get_sheet(sheet_url, "Students")

    student_name = data.get("student_name")
    mobile = data.get("mobile")
    standard_id = data.get("standard_id")
    fees_total = int(data.get("fees_total"))
    amount_paid = int(data.get("amount_paid", 0))
    received_by = data.get("received_by", "")

    if not student_name or not mobile or not standard_id or not fees_total:
        return jsonify({"error": "Missing required fields"}), 400


    # ------------------------
    # CHECK / CREATE STUDENT
    # ------------------------
    records = students_sheet.get_all_records()

    student_id = None

    for row in records:
        if str(row["mobile"]) == str(mobile):
            student_id = row["student_id"]
            break

    if not student_id:
        student_id = str(uuid.uuid4())

        students_sheet.append_row([
            student_id,
            student_name,
            mobile,
            datetime.utcnow().isoformat()
        ])


    # ------------------------
    # CREATE ADMISSION
    # ------------------------
    admissions_records = admissions_sheet.get_all_records()

    for row in admissions_records:
        if row["student_id"] == student_id and row["standard_id"] == standard_id:
            return jsonify({
                "error": "Admission already exists",
                "admission_id": row["admission_id"]
            }), 409

    admission_id = str(uuid.uuid4())

    # balance initially = total fees
    balance = fees_total

    admissions_sheet.append_row([
        admission_id,
        student_id,
        standard_id,
        fees_total,
        balance,
        datetime.utcnow().isoformat()
    ])


    # ------------------------
    # ADD INSTALLMENT
    # ------------------------
    if amount_paid > 0:

        installment_id = str(uuid.uuid4())

        installments_sheet.append_row([
            installment_id,
            admission_id,
            amount_paid,
            received_by,
            datetime.utcnow().isoformat()
        ])

        # update balance
        balance = fees_total - amount_paid

        admissions_records = admissions_sheet.get_all_records()

        for idx, row in enumerate(admissions_records, start=2):  # row index in sheet
            if row["admission_id"] == admission_id:
                admissions_sheet.update_cell(idx, 5, balance)  # column 5 = balance
                break


    return jsonify({
        "message": "Admission completed successfully",
        "student_id": student_id,
        "admission_id": admission_id,
        "balance": balance
    })
    
    
    
# -----------------------------------
# GET ALL ADMISSIONS
# GET /api/admissions
# -----------------------------------
@admissions_bp.route("/api/admissions", methods=["GET"])
def get_all_admissions():

    admissions_sheet, _, error, code = get_sheets_from_request()
    if error:
        return error, code

    sheet_url = request.args.get("sheet_url")

    students_sheet = get_sheet(sheet_url, "Students")
    standards_sheet = get_sheet(sheet_url, "Standard")

    admissions_records = admissions_sheet.get_all_records()
    students_records = students_sheet.get_all_records()
    standards_records = standards_sheet.get_all_records()

    # convert students into lookup dict
    students_map = {
        row["student_id"]: row for row in students_records
    }

    # convert standards into lookup dict
    standards_map = {
        row["standard_id"]: row for row in standards_records
    }

    result = []

    for admission in admissions_records:

        student = students_map.get(admission["student_id"], {})
        standard = standards_map.get(admission["standard_id"], {})

        result.append({
            "admission_id": admission["admission_id"],
            "student_id": admission["student_id"],
            "student_name": student.get("student_name"),
            "mobile": student.get("mobile"),
            "student_created_at": student.get("created_at"),

            "standard_id": admission["standard_id"],
            "standard": standard.get("standard"),
            "batch": standard.get("batch"),
            "standard_created_at": standard.get("created_at"),

            "total_fees": admission.get("total_fees"),
            "balance": admission.get("balance"),
            "created_at": admission.get("created_at")
        })

    return jsonify({
        "count": len(result),
        "data": result
    })
    
    
