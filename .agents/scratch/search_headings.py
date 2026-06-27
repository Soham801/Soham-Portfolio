with open(r"c:\Users\Shubham\Desktop\Soham\Portfolio_Website\style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()
for idx, line in enumerate(lines):
    if "h1" in line or "h2" in line or "h3" in line:
        if "{" in line or "," in line:
            print(f"Line {idx+1}: {line.strip()}")
