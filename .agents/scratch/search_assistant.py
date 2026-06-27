with open(r"c:\Users\Shubham\Desktop\Soham\Portfolio_Website\style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()
for idx, line in enumerate(lines):
    if "assistant-trigger" in line or "message-bubble" in line or "chat-window" in line:
        print(f"Line {idx+1}: {line.strip()}")
