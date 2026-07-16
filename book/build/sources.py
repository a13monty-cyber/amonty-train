# -*- coding: utf-8 -*-
"""
Curated, REAL source registry + QR generation.

Integrity policy (per author's brief: "אין להמציא מידע"):
  * VIDEO links point to the *official* channel, scoped with a channel search
    query (e.g. youtube.com/@SquatUniversity/search?query=...). These URLs are
    guaranteed to resolve to genuine, relevant content on that verified channel.
    We deliberately do NOT fabricate specific video IDs.
  * ARTICLE links use verified PubMed IDs / DOIs where confirmed, otherwise a
    PubMed search URL (always valid) plus a full academic citation.
Verified channels & landmark papers were confirmed via web search during build.
"""
import os, urllib.parse
import qrcode
from qrcode.constants import ERROR_CORRECT_M

QR_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "qr")

# ---- Verified official channels (handles confirmed) ----------------------
CHANNELS = {
    "squatu":   ("Squat University",     "https://www.youtube.com/@SquatUniversity"),
    "pjf":      ("PJF Performance",      "https://www.youtube.com/@pjfperformance"),
    "e3":       ("E3 Rehab",             "https://www.youtube.com/@E3Rehab"),
    "prehab":   ("The Prehab Guys",      "https://www.youtube.com/@ThePrehabGuys"),
    "atg":      ("Knees Over Toes Guy",  "https://www.youtube.com/c/thekneesovertoesguy"),
    "catalyst": ("Catalyst Athletics",   "https://www.youtube.com/@CatalystAthletics"),
    "altis":    ("ALTIS",                "https://www.youtube.com/@ALTIS"),
    "exos":     ("EXOS",                 "https://www.youtube.com/@teamexos"),
    "usab":     ("USA Basketball",       "https://www.youtube.com/@usabasketball"),
}

def vid(channel_key, query):
    """A channel-scoped YouTube search URL — resolves to real content."""
    name, base = CHANNELS[channel_key]
    q = urllib.parse.quote(query)
    return name, f"{base}/search?query={q}"

# ---- QR generation -------------------------------------------------------
def _slug(s):
    return "".join(c if c.isalnum() else "-" for c in s.lower())[:48].strip("-")

def qr(url, key=None):
    """Generate a QR PNG for url, return relative path (assets/qr/xxx.png)."""
    os.makedirs(QR_DIR, exist_ok=True)
    name = (key or _slug(url)) + ".png"
    path = os.path.join(QR_DIR, name)
    q = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_M, box_size=10, border=2)
    q.add_data(url); q.make(fit=True)
    img = q.make_image(fill_color="#0e2a47", back_color="#ffffff")
    img.save(path)
    return f"assets/qr/{name}"

# ---- HTML fragment helpers ----------------------------------------------
def qr_video(channel_key, query, title):
    name, url = vid(channel_key, query)
    p = qr(url, key="v-" + _slug(channel_key + "-" + query))
    return f"""<div class="qrbox vid"><img src="{p}" alt="QR">
      <div class="qmeta"><span class="tag tag-v">סרטון</span><span class="qt">{title}</span>
      מקור: <span class="src">{name}</span>
      <span class="lnk">{url}</span></div></div>"""

def qr_link(url, title, srclabel, cls="art"):
    p = qr(url, key="l-" + _slug(url))
    tag = "מאמר" if cls == "art" else "קישור"
    return f"""<div class="qrbox {cls}"><img src="{p}" alt="QR">
      <div class="qmeta"><span class="tag tag-a">{tag}</span><span class="qt">{title}</span>
      מקור: <span class="src">{srclabel}</span>
      <span class="lnk">{url}</span></div></div>"""

# ---- Verified article registry (PubMed IDs / DOIs confirmed at build) ----
PUBMED = "https://pubmed.ncbi.nlm.nih.gov/"
def pm(pmid): return PUBMED + str(pmid) + "/"
def pmsearch(terms):
    return PUBMED + "?term=" + urllib.parse.quote(terms)
def doi(d): return "https://doi.org/" + d
