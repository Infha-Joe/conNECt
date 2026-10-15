import os, subprocess

PY_PATH = r"d:\CONNECT\conNECt\generate_pdf_report.py"

with open(PY_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# Replace unicode dashes with ASCII hyphen
text = text.replace("–", "-").replace("—", "-")

# Make sure Chrome opens via file:/// URL
old_line = "    HTML_FILE"
new_line = "    f\"file:///{HTML_FILE.replace(os.sep, '/')}\""
if old_line in text:
    text = text.replace(old_line, new_line)

with open(PY_PATH, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated generate_pdf_report.py.")

# Now execute generate_pdf_report.py
subprocess.run(["python", PY_PATH], check=True)
print("Build finished successfully!")
