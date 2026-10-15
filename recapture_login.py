import os, time
from playwright.sync_api import sync_playwright

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ASSETS_DIR = r"d:\CONNECT\conNECt\report_assets"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        # Clear storage / fresh context
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.goto("http://localhost:5173/login", wait_until="networkidle")
        try:
            page.wait_for_selector("input", timeout=8000)
            time.sleep(1.5)
        except Exception as e:
            print("Selector wait exception:", e)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_login.png"))
        print("Captured fig_login.png successfully!")
        browser.close()

if __name__ == "__main__":
    run()
