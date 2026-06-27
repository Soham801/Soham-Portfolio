with open(r"c:\Users\Shubham\Desktop\Soham\Portfolio_Website\script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
for idx, line in enumerate(lines):
    if "addEventListener" in line:
        print(f"Line {idx+1}: {line.strip()}")
