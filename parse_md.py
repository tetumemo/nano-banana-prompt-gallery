import re
import json
import os

md_path = '【Manus用】Nano Banana Pro_インフォグラフィックプロンプト集.md'
output_file = 'prompts.js'

with open(md_path, 'r', encoding='utf-8') as f:
    full_content = f.read()

# Separate logical sections
# They start with ## 1., ## 2., etc.
sections = re.split(r'\n##\s+(?=\d+\.)', full_content)

prompt_data = []

for section in sections:
    # Skip preamble
    if not re.search(r'^\d+\.', section.strip()):
        continue
    
    # Extract Title: e.g. "1. Title"
    lines = section.strip().split('\n')
    title_line = lines[0]
    title_match = re.match(r'(\d+)\.(.*)', title_line)
    if not title_match: continue
    
    id_num = title_match.group(1)
    title = title_match.group(2).strip()

    # Extract image index
    img_match = re.search(r'!\[\]\[image(\d+)\]', section)
    img_idx = img_match.group(1) if img_match else id_num

    # Extract exact prompt text
    # It starts after "### ■プロンプト"
    prompt_marker = "### ■プロンプト"
    if prompt_marker in section:
        prompt_content = section.split(prompt_marker)[1].strip()
        # Remove trailing image definitions if they are at the end of the file/section
        prompt_content = re.split(r'\[image\d+\]:', prompt_content)[0].strip()
    else:
        prompt_content = "Prompt content not found."

    # Tags
    tags = []
    t_lower = title.lower()
    if any(k in t_lower for k in ["スタートアップ", "saas", "ピッチ"]): tags.append("Business")
    if "インフォグラフィック" in t_lower: tags.append("Infographic")
    if any(k in t_lower for k in ["手書き", "スケッチ"]): tags.append("Sketch")
    if any(k in t_lower for k in ["ir", "決算", "企業"]): tags.append("Corporate")
    if "アイソメトリック" in t_lower: tags.append("Isometric")
    if any(k in t_lower for k in ["マガジン", "エディトリアル"]): tags.append("Editorial")
    if not tags: tags.append("General")

    prompt_data.append({
        "id": id_num,
        "title": title,
        "image": f"images/image{img_idx}.png",
        "prompt": prompt_content,
        "tags": tags
    })

# Write prompts.js
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("const promptData = ")
    json.dump(prompt_data, f, ensure_ascii=False, indent=2)
    f.write(";")

print(f"Extraction successful. {len(prompt_data)} items processed.")
