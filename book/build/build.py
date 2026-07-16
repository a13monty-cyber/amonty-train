# -*- coding: utf-8 -*-
"""
Assemble the manual: cover + front matter + TOC + chapters + appendices,
render to PDF (WeasyPrint) and an editable DOCX (LibreOffice).

Run:  python3 build/build.py
"""
import os, sys, importlib, subprocess, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
BOOK = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "chapters"))

import frontmatter as F
import components as C

# ---- chapter registry: (module, number, short-title, [ (anchor,label) subs ])
CHAPTERS = [
    ("ch01", "1",  "ביומכניקה של הבלימה"),
    ("ch02", "2",  "ניידות דורסיפלקשן בקרסול"),
    ("ch03", "3",  "שליטה בכף הרגל"),
    ("ch04", "4",  "שליטה באגן ובירך"),
    ("ch05", "5",  "הורדת מרכז הכובד"),
    ("ch06", "6",  "מכניקת נחיתה (Landing)"),
    ("ch07", "7",  "בלימה, האצה וספיגת כוח"),
    ("ch08", "8",  "שינויי כיוון (Change of Direction)"),
    ("ch09", "9",  "יישום ישיר בכדורסל"),
    ("ch10", "10", "תוכנית עבודה — 8 שבועות"),
    ("ch11", "11", "בדיקות ומעקב חודשי"),
    ("ch12", "12", "נספחים: צ'קליסטים ומעקב"),
]

def build_toc():
    rows = ""
    parts = [
        ("חלק א' · יסודות ובקרה", ["1","2","3","4"]),
        ("חלק ב' · ספיגה ותנועה", ["5","6","7","8"]),
        ("חלק ג' · יישום ותכנון", ["9","10","11","12"]),
    ]
    body = ""
    for part_title, nums in parts:
        body += f'<div style="margin:10pt 0 3pt"><span class="pill">{part_title}</span></div>'
        for mod, num, title in CHAPTERS:
            if num not in nums:
                continue
            body += (f'<div class="tocline"><a href="#ch{num}" style="display:flex;width:100%">'
                     f'<span class="tocnum">{num}</span>'
                     f'<span class="toctitle">{title}</span>'
                     f'<span class="tocfill"></span>'
                     f'<span class="tocpage"></span></a></div>')
    return f'<section class="frontpage toc">{C.h2("תוכן העניינים")}{body}</section>'

def assemble():
    parts = []
    parts.append(F.cover())
    parts.append(F.verso())
    parts.append(build_toc())
    parts.append(F.howto())
    for mod, num, title in CHAPTERS:
        try:
            m = importlib.import_module(mod)
            importlib.reload(m)
            parts.append(m.html())
        except ModuleNotFoundError:
            parts.append(f'<section class="chapter"><div class="chap-opener">'
                         f'<div class="cnum">פרק {num}</div>'
                         f'<h2 class="ctitle" id="ch{num}">{title}</h2></div>'
                         f'<p><em>[בהכנה]</em></p></section>')
    css_href = "style.css"
    head = (f'<html dir="rtl" lang="he"><head><meta charset="utf-8">'
            f'<title>יסודות התנועה בכדורסל — Movement Foundation for Basketball</title>'
            f'<link rel="stylesheet" href="{css_href}"></head><body dir="rtl">')
    return head + "".join(parts) + "</body></html>"

def main():
    html = assemble()
    out_html = os.path.join(BOOK, "index.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", out_html, f"({len(html)//1024} KB)")

    from weasyprint import HTML
    pdf = os.path.join(BOOK, "Movement_Foundation_Basketball.pdf")
    doc = HTML(out_html, base_url=BOOK + "/").render()
    doc.write_pdf(pdf)
    print("wrote", pdf, "· pages:", len(doc.pages))
    return pdf, len(doc.pages)

if __name__ == "__main__":
    main()
