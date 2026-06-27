with open(r"c:\Users\Shubham\Desktop\Soham\Portfolio_Website\style.css", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r"(--accent-[a-z0-9\-]+|hsla?\(28,\s*\d+%\s*,\s*\d+%\s*(?:,\s*\d*(?:\.\d+)?)?\))", content)
print(f"Total occurrences of accent tokens: {len(matches)}")
from collections import Counter
print(Counter(matches))
