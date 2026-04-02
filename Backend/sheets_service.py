import gspread

gc = gspread.service_account(filename="service_account.json")

def get_sheet(sheet_url, sheet_name):
    sheet = gc.open_by_url(sheet_url)
    return sheet.worksheet(sheet_name)