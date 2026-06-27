with open(r"c:\Users\Shubham\Desktop\Soham\Portfolio_Website\script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
for idx, line in enumerate(lines):
    if "amber" in line.lower() or "#ff" in line.lower() or "hsla(28" in line.lower() or "hsla(38" in line.lower():
        print(f"Line {idx+1}: {line.strip()}")
