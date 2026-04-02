import os
import json
import gspread
from google.oauth2.service_account import Credentials

from dotenv import load_dotenv
load_dotenv()

SERVICE_ACCOUNT_INFO = json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT"])

scope = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

creds = Credentials.from_service_account_info(
    SERVICE_ACCOUNT_INFO,
    scopes=scope
)

client = gspread.authorize(creds)


def get_sheet(sheet_url, sheet_name):
    sheet = client.open_by_url(sheet_url)
    return sheet.worksheet(sheet_name)