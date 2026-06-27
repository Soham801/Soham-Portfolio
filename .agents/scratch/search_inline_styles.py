with open(r"c:\Users\Shubham\Desktop\Soham\Portfolio_Website\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
for idx, line in enumerate(lines):
    if "style=" in line and ("#ff" in line.lower() or "hsla(28" in line.lower() or "rgba" in line.lower() or "color" in line.lower()):
        print(f"Line {idx+1}: {line.strip()}")
