import os, time
from playwright.sync_api import sync_playwright

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ASSETS_DIR = r"d:\CONNECT\conNECt\report_assets"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)

        # 1. Admin Dashboard & Admin Users
        admin_ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        admin_page = admin_ctx.new_page()
        admin_page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1)
        admin_page.fill('input[type="email"]', "balamuruganrjpam@gmail.com")
        admin_page.fill('input[type="password"]', "password123")
        admin_page.click('button[type="submit"]')
        admin_page.wait_for_url("**/admin", timeout=15000)
        time.sleep(2)
        admin_page.screenshot(path=os.path.join(ASSETS_DIR, "fig_admin_dashboard.png"))
        print("Captured fig_admin_dashboard.png")

        # Admin Users
        admin_page.click('button:has-text("Users")')
        time.sleep(2)
        admin_page.screenshot(path=os.path.join(ASSETS_DIR, "fig_admin_users.png"))
        print("Captured fig_admin_users.png")
        admin_ctx.close()

        # 2. Alumni Dashboard
        alumni_ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        alumni_page = alumni_ctx.new_page()
        alumni_page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1)
        alumni_page.click('button:has-text("Alumni")')
        alumni_page.fill('input[type="email"]', "vijaychockalingam28@gmail.com")
        alumni_page.fill('input[type="password"]', "password123")
        alumni_page.click('button[type="submit"]')
        alumni_page.wait_for_url("**/dashboard", timeout=15000)
        time.sleep(2)
        alumni_page.screenshot(path=os.path.join(ASSETS_DIR, "fig_alumni_dashboard.png"))
        print("Captured fig_alumni_dashboard.png")
        alumni_ctx.close()

        browser.close()
        print("Remaining screenshots captured!")

if __name__ == "__main__":
    run()
