import os, time
from playwright.sync_api import sync_playwright

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ASSETS_DIR = r"d:\CONNECT\conNECt\report_assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True
        )
        
        # 1. Capture Login Screen
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        print("Navigating to Login...")
        page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_login.png"))
        print("Captured fig_login.png")

        # 2. Login as Joseph (Student)
        page.fill('input[type="email"]', "24205052@nec.edu.in")
        page.fill('input[type="password"]', "password123")
        page.click('button[type="submit"]')
        page.wait_for_url("**/dashboard", timeout=15000)
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_student_dashboard.png"))
        print("Captured fig_student_dashboard.png")

        # 3. Campus Feed
        page.goto("http://localhost:5173/network-feed", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_campus_feed.png"))
        print("Captured fig_campus_feed.png")

        # 4. Network / Connections
        page.goto("http://localhost:5173/network", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_network.png"))
        print("Captured fig_network.png")

        # 5. Projects & Mentorship
        page.goto("http://localhost:5173/mentorship", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_mentorship.png"))
        print("Captured fig_mentorship.png")

        # 6. Academic Dashboard
        page.goto("http://localhost:5173/academic", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_academic.png"))
        print("Captured fig_academic.png")

        # 7. Messages
        page.goto("http://localhost:5173/messages", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_messages.png"))
        print("Captured fig_messages.png")

        # 8. Notifications
        page.goto("http://localhost:5173/notifications", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_notifications.png"))
        print("Captured fig_notifications.png")

        # 9. Student Profile
        page.goto("http://localhost:5173/profile", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(ASSETS_DIR, "fig_student_profile.png"))
        print("Captured fig_student_profile.png")

        context.close()

        # 10. Login as Admin
        admin_ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        admin_page = admin_ctx.new_page()
        admin_page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1)
        # Click Admin Tab
        admin_page.click('button:has-text("Admin")')
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

        # 11. Login as Alumni (Vijay)
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
        print("ALL SCREENSHOTS CAPTURED SUCCESSFULLY!")

if __name__ == "__main__":
    run()
