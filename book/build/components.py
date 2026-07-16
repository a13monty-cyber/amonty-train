# -*- coding: utf-8 -*-
"""Reusable HTML component builders for the manual (Hebrew, RTL)."""
import re
import sources as S
import svglib as V

_slug_i = [0]

# ---------------------------------------------------------------- inline
def en(t):
    """Wrap Latin/English term for correct bidi isolation."""
    return f'<span class="en">{t}</span>'

def ref(n):
    return f'<sup>{n}</sup>'

# ---------------------------------------------------------------- boxes
_BOX_ICON = {"why":"🏀","evid":"🔬","coach":"📋","error":"⛔","safe":"⚠️",
             "key":"✅","anat":"🦴"}
_BOX_TTL  = {"why":"למה זה חשוב בכדורסל","evid":"מבוסס מחקר","coach":"דגש למאמן",
             "error":"טעות נפוצה","safe":"בטיחות ועומסים","key":"נקודות מפתח",
             "anat":"רקע אנטומי"}

def box(kind, body, title=None, cite=None):
    t = title if title is not None else _BOX_TTL.get(kind, "")
    head = f'<div class="box-t">{t}</div>' if t else ""
    c = f'<small>{cite}</small>' if cite else ""
    return f'<div class="box {kind}">{head}{body}{c}</div>'

# ---------------------------------------------------------------- lists
def ul(items, cls=""):
    lis = "".join(f"<li>{i}</li>" for i in items)
    return f'<ul class="{cls}">{lis}</ul>'

def ol(items, cls=""):
    lis = "".join(f"<li>{i}</li>" for i in items)
    return f'<ol class="{cls}">{lis}</ol>'

def check(items):
    lis = "".join(f"<li>{i}</li>" for i in items)
    return f'<ul class="check">{lis}</ul>'

# ---------------------------------------------------------------- headings
def h2(t, anchor=None):
    a = f' id="{anchor}"' if anchor else ""
    return f'<h2{a}>{t}</h2>'
def h3(t, anchor=None):
    a = f' id="{anchor}"' if anchor else ""
    return f'<h3{a}>{t}</h3>'
def h4(t):
    return f'<h4>{t}</h4>'
def p(t):
    return f'<p>{t}</p>'

# ---------------------------------------------------------------- tables
def table(headers, rows, caption=None, note=None, cls="zebra"):
    cap = f"<caption>{caption}</caption>" if caption else ""
    th = "".join(f"<th>{h}</th>" for h in headers)
    body = ""
    for r in rows:
        tds = ""
        for cell in r:
            if isinstance(cell, tuple):
                val, klass = cell
                tds += f'<td class="{klass}">{val}</td>'
            else:
                tds += f"<td>{cell}</td>"
        body += f"<tr>{tds}</tr>"
    nt = f'<div class="tblnote">{note}</div>' if note else ""
    return f'<table class="{cls}">{cap}<thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>{nt}'

# ---------------------------------------------------------------- figures
def figure_svg(svg, caption=None, maxw=None):
    style = f' style="max-width:{maxw}"' if maxw else ""
    cap = f"<figcaption>{caption}</figcaption>" if caption else ""
    return f'<figure><div class="diagram"{style}>{svg}</div>{cap}</figure>'

def figpair(svg_ok, cap_ok, svg_no, cap_no, caption=None):
    cap = f"<figcaption>{caption}</figcaption>" if caption else ""
    return (f'<figure><div class="figpair">'
            f'<div class="figcard ok"><div class="cap"><span class="ic">✓</span>ביצוע נכון · {cap_ok}</div>{svg_ok}</div>'
            f'<div class="figcard no"><div class="cap"><span class="ic">✕</span>ביצוע שגוי · {cap_no}</div>{svg_no}</div>'
            f'</div>{cap}</figure>')

# ---------------------------------------------------------------- media / QR
def media(*blocks):
    return f'<div class="media">{"".join(blocks)}</div>'

qr_video = S.qr_video
qr_link  = S.qr_link

# ---------------------------------------------------------------- exercise card
def ex(num, name, name_en, purpose, why, how, cues_coach, cues_player,
       mistakes, sets, reps, tempo, rest, when, when_not,
       progression, regression, media_block=None, fig=None, why_it_works=None):
    """Full structured exercise card matching the author's required schema."""
    def field(lbl, val):
        return f'<div class="ex-field"><span class="lbl">{lbl}</span>{val}</div>'
    left = ""
    left += field("מטרה", purpose)
    if why_it_works:
        left += field("למה זה עובד", why_it_works)
    left += field("איך לבצע", how if isinstance(how, str) else ol(how, "tight"))
    left += field("טעויות נפוצות", ul(mistakes, "tight") if isinstance(mistakes, list) else mistakes)
    right = ""
    right += field("דגשים למאמן", ul(cues_coach, "tight") if isinstance(cues_coach, list) else cues_coach)
    right += field("דגשים לשחקן", ul(cues_player, "tight") if isinstance(cues_player, list) else cues_player)
    right += field("מתי להשתמש", when)
    right += field("מתי <u>לא</u> להשתמש", when_not)

    dose = (f'<div class="dose">'
            f'<span class="chip">סטים <b>{sets}</b></span>'
            f'<span class="chip">חזרות <b>{reps}</b></span>'
            f'<span class="chip">קצב <b>{tempo}</b></span>'
            f'<span class="chip">מנוחה <b>{rest}</b></span></div>')
    prog = (f'<div class="prog">'
            f'<div class="p"><span class="lbl">↑ התקדמות (Progression)</span>{progression}</div>'
            f'<div class="r"><span class="lbl">↓ רגרסיה (Regression)</span>{regression}</div></div>')

    figblock = fig or ""
    mediablock = media_block or ""
    body = (f'<div class="ex-body">{dose}'
            f'<div class="ex-grid"><div>{left}</div><div>{right}</div></div>'
            f'{figblock}{prog}{mediablock}</div>')
    head = (f'<div class="ex-head"><span class="exn">תרגיל {num}</span>'
            f'<span class="exname">{name} <span class="en">{name_en}</span></span></div>')
    return f'<div class="ex big">{head}{body}</div>'

# ---------------------------------------------------------------- references
def refs(items):
    """items: list of html strings (already formatted citation + link)."""
    lis = "".join(f"<li>{i}</li>" for i in items)
    return f'<div class="refs"><h3>מקורות ומחקרים</h3><ol>{lis}</ol></div>'

def cite(authors, year, title, journal, url, pmid=None):
    j = f'<span class="jr">{journal}</span>'
    pm = f' <span class="pmid">PMID: {pmid}</span>' if pmid else ""
    return f'{authors} ({year}). {title}. {j}.{pm}<br><a href="{url}">{url}</a>'

# ---------------------------------------------------------------- chapter frame
def chapter(num, cnum_label, title, lead, body, chap_map=None):
    cm = f'<div class="chap-map">{chap_map}</div>' if chap_map else ""
    opener = (f'<div class="chap-opener">'
              f'<div class="cnum">{cnum_label}</div>'
              f'<h2 class="ctitle" id="ch{num}">{title}</h2>'
              f'<div class="chap-rule"></div>'
              f'<div class="lead">{lead}</div></div>')
    return f'<section class="chapter">{opener}{cm}{body}</section>'
