# -*- coding: utf-8 -*-
"""
Original schematic line-illustrations (SVG) for the manual.
These are honest diagrams (not photographs). Palette matches the print CSS.
Hebrew labels use the same webfont as the page (inherited).
"""

NAVY="#0e2a47"; ACC="#e0531f"; GOOD="#1f7a4d"; BAD="#b0202e"; STEEL="#5b6b7b"
LINE="#c9d3dd"; SOFT="#eef2f6"

def _svg(w,h,body):
    return (f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" '
            f'font-family="RubHe, RubLa, sans-serif">{body}</svg>')

def _lab(x,y,t,fill=NAVY,size=11,anchor="middle",weight="600"):
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" font-weight="{weight}" direction="rtl">{t}</text>')

def _arrow(x1,y1,x2,y2,color=ACC,w=2.4,dash=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
            f'stroke-width="{w}" marker-end="url(#ah-{color[1:]})"{d}/>')

def _defs():
    out="<defs>"
    for c in (ACC,GOOD,BAD,NAVY,STEEL):
        out+=(f'<marker id="ah-{c[1:]}" markerWidth="9" markerHeight="9" refX="7" refY="3" '
              f'orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="{c}"/></marker>')
    out+="</defs>"
    return out

def _floor(w,y):
    return f'<line x1="8" y1="{y}" x2="{w-8}" y2="{y}" stroke="{STEEL}" stroke-width="2.5"/>'

# ---- generic stick-figure primitives ------------------------------------
def _joint(x,y,r=4.2,c=NAVY):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def _bone(x1,y1,x2,y2,c=NAVY,w=5):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
def _head(x,y,r=12,c=NAVY):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{c}" stroke-width="4"/>'

# =========================================================================
# 1) Frontal-plane knee alignment on landing  (valgus vs neutral)
# =========================================================================
def knee_frontal(valgus=False, title=""):
    w,h=250,270; c=BAD if valgus else GOOD
    cx=125; hipY=120; kneeY=185; ankY=238
    hipL,hipR=cx-30,cx+30
    if valgus:
        kneeL,kneeR=cx-12,cx+12          # knees cave in
        ankL,ankR=cx-40,cx+40; footOut=16
    else:
        kneeL,kneeR=cx-30,cx+30          # knees track over toes
        ankL,ankR=cx-30,cx+30; footOut=8
    b=_defs()
    b+=_floor(w,258)
    # pelvis + torso + head
    b+=_bone(hipL,hipY,hipR,hipY,NAVY,6)
    b+=_bone(cx,hipY,cx,68,NAVY,6)+_head(cx,52)
    b+=_bone(cx,80,cx-34,110,NAVY,5)+_bone(cx,80,cx+34,110,NAVY,5)  # arms out
    # legs
    for hipX,knX,anX,fo in ((hipL,kneeL,ankL,-footOut),(hipR,kneeR,ankR,footOut)):
        b+=_bone(hipX,hipY,knX,kneeY,c,6)
        b+=_bone(knX,kneeY,anX,ankY,c,6)
        b+=_bone(anX-abs(fo)/2 if fo<0 else anX, ankY, anX+fo, ankY+10, NAVY,6)  # foot
        b+=_joint(knX,kneeY,5,c)
        b+=_joint(hipX,hipY)+_joint(anX,ankY)
    # knee tracking guide arrows
    if valgus:
        b+=_arrow(kneeL-2,kneeY,kneeL+16,kneeY,BAD,2.2)
        b+=_arrow(kneeR+2,kneeY,kneeR-16,kneeY,BAD,2.2)
        b+=_lab(cx,205,"קריסת ברך פנימה (Valgus)",BAD,11)
    else:
        b+=f'<line x1="{kneeL}" y1="{kneeY-14}" x2="{ankL}" y2="{ankY-6}" stroke="{GOOD}" stroke-width="1.6" stroke-dasharray="3 3"/>'
        b+=f'<line x1="{kneeR}" y1="{kneeY-14}" x2="{ankR}" y2="{ankY-6}" stroke="{GOOD}" stroke-width="1.6" stroke-dasharray="3 3"/>'
        b+=_lab(cx,205,"ברך מעל האצבע 2–3",GOOD,11)
    return _svg(w,h,b)

# =========================================================================
# 2) Sagittal landing mechanics (soft triple-flexion vs stiff)
# =========================================================================
def landing_side(soft=True, title=""):
    w,h=250,270; c=GOOD if soft else BAD
    ankX,ankY=150,238
    if soft:
        kneeX,kneeY=120,180; hipX,hipY=150,132; shX,shY=132,86; headX,headY=140,64
    else:
        kneeX,kneeY=140,182; hipX,hipY=150,120; shX,shY=150,74; headX,headY=150,52
    b=_defs()+_floor(w,258)
    b+=_bone(ankX,ankY,kneeX,kneeY,c,6)      # shank
    b+=_bone(kneeX,kneeY,hipX,hipY,c,6)      # thigh
    b+=_bone(hipX,hipY,shX,shY,NAVY,6)       # trunk
    b+=_head(headX,headY-2)
    b+=_bone(shX,shY,shX-30,shY+18,NAVY,5)   # arm
    b+=_bone(ankX,ankY,ankX+24,ankY+9,NAVY,6)# foot
    for (x,y) in ((ankX,ankY),(kneeX,kneeY),(hipX,hipY),(shX,shY)):
        b+=_joint(x,y,4.5,c if (x,y) in ((kneeX,kneeY),(hipX,hipY)) else NAVY)
    # COM marker
    comY = 150 if soft else 128
    b+=f'<circle cx="{hipX-6}" cy="{comY}" r="6" fill="none" stroke="{ACC}" stroke-width="2"/>'
    b+=f'<line x1="{hipX-12}" y1="{comY}" x2="{hipX}" y2="{comY}" stroke="{ACC}" stroke-width="2"/>'
    b+=f'<line x1="{hipX-6}" y1="{comY-6}" x2="{hipX-6}" y2="{comY+6}" stroke="{ACC}" stroke-width="2"/>'
    if soft:
        b+=_lab(70,150,"פירוק כוח",GOOD,11)+_lab(70,164,"ב-3 מפרקים",GOOD,11)
    else:
        b+=_lab(72,150,"נחיתה נוקשה",BAD,11)+_lab(72,164,"ברך חשופה",BAD,11)
    return _svg(w,h,b)

# =========================================================================
# 3) Hip hinge vs rounded / squat
# =========================================================================
def hip_hinge(good=True):
    w,h=260,250; c=GOOD if good else BAD
    ankX,ankY=150,220
    if good:  # neutral spine, hips back, shin vertical
        kneeX,kneeY=150,168; hipX,hipY=178,138; shX,shY=118,96; headX,headY=104,80
    else:     # rounded lumbar, knees forward
        kneeX,kneeY=132,168; hipX,hipY=150,140; shX,shY=132,104; headX,headY=124,90
    b=_defs()+_floor(w,235)
    b+=_bone(ankX,ankY,kneeX,kneeY,NAVY,6)
    b+=_bone(kneeX,kneeY,hipX,hipY,NAVY,6)
    if good:
        b+=_bone(hipX,hipY,shX,shY,c,7)   # straight back
    else:    # curved back (quadratic)
        b+=(f'<path d="M{hipX},{hipY} Q{hipX-6},{hipY-30} {shX},{shY}" fill="none" '
            f'stroke="{c}" stroke-width="7" stroke-linecap="round"/>')
    b+=_head(headX,headY)
    b+=_bone(shX,shY,shX+14,shY+34,NAVY,5)  # arm hanging
    b+=_bone(ankX,ankY,ankX+22,ankY+8,NAVY,6)
    for (x,y) in ((ankX,ankY),(kneeX,kneeY),(hipX,hipY),(shX,shY)):
        b+=_joint(x,y)
    # hip motion arrow
    if good:
        b+=_arrow(hipX+8,hipY-6,hipX+26,hipY-2,ACC,2.4)
        b+=_lab(150,208,"עמוד שדרה ניטרלי · ירך אחורה",GOOD,10.5)
    else:
        b+=_lab(150,208,"גב מעוגל · עומס על הדיסק",BAD,10.5)
    return _svg(w,h,b)

# =========================================================================
# 4) Knee-to-wall dorsiflexion test
# =========================================================================
def dorsiflexion():
    w,h=250,210
    toeX,heelX,footY=170,120,180
    kneeX,kneeY=176,120
    wallX=196
    b=_defs()
    b+=f'<rect x="{wallX}" y="30" width="10" height="150" fill="{SOFT}" stroke="{STEEL}"/>'
    b+=_lab(201,26,"קיר",STEEL,10)
    b+=f'<line x1="60" y1="{footY}" x2="{wallX}" y2="{footY}" stroke="{STEEL}" stroke-width="2.5"/>'
    b+=_bone(heelX,footY,toeX,footY,NAVY,6)               # foot
    b+=_bone(toeX,footY,kneeX,kneeY,ACC,6)               # shin over toe
    b+=_bone(kneeX,kneeY,120,70,NAVY,6)                  # thigh up
    b+=_joint(kneeX,kneeY,5,ACC)+_joint(toeX,footY)+_joint(heelX,footY)
    # angle arc at ankle
    b+=(f'<path d="M{toeX+16},{footY} A18,18 0 0 0 {toeX+11},{footY-14}" fill="none" '
        f'stroke="{ACC}" stroke-width="2"/>')
    b+=_lab(toeX+2,footY-22,"זווית DF",ACC,10)
    b+=_arrow(kneeX,kneeY-2,wallX-4,kneeY-2,GOOD,2.2,"3 3")
    b+=_lab(120,200,"מרחק בוהן–קיר (ס”מ)",STEEL,10)
    return _svg(w,h,b)

# =========================================================================
# 5) Snap-down / lowering the center of mass
# =========================================================================
def snapdown():
    w,h=300,250
    b=_defs()+_floor(w,235)
    # pose A: tall
    def fig(x0,tall,c):
        if tall:
            ank=(x0,220);kn=(x0,176);hip=(x0,140);sh=(x0,96);hd=(x0,80)
        else:
            ank=(x0,220);kn=(x0-16,176);hip=(x0+14,150);sh=(x0-10,112);hd=(x0-18,98)
        s=_bone(*ank,*kn,c,6)+_bone(*kn,*hip,c,6)+_bone(*hip,*sh,NAVY,6)+_head(*hd)
        s+=_bone(*ank,ank[0]+18,ank[1]+8,NAVY,6)
        for j in (ank,kn,hip,sh): s+=_joint(*j)
        return s
    b+=fig(90,True,STEEL)
    b+=fig(210,False,GOOD)
    b+=_arrow(120,150,180,150,ACC,3)
    b+=_lab(90,244,"עמידה זקופה",STEEL,10.5)
    b+=_lab(212,244,"בסיס אתלטי נמוך",GOOD,10.5)
    b+=_lab(150,140,"Snap Down",ACC,10.5)
    return _svg(w,h,b)

# =========================================================================
# 6) Change-of-direction cutting angles (top view)
# =========================================================================
def cod_angles():
    w,h=250,230; ox,oy=125,180
    b=_defs()
    b+=_arrow(ox,215,ox,oy,STEEL,3)  # approach
    b+=_lab(ox,228,"כיוון ריצה",STEEL,10)
    import math
    for ang,c,lab in ((45,"#2b5f8a","45°"),(90,ACC,"90°"),(135,"#6a3d9a","135°"),(180,BAD,"180°")):
        rad=math.radians(ang); L=120
        ex=ox+ L*math.sin(rad); ey=oy - L*math.cos(rad)*-1  # forward is up
        ey=oy - L*math.cos(rad)
        b+=_arrow(ox,oy,ex,ey,c,2.6)
        b+=_lab(ex,ey-4 if ey<oy else ey+12,lab,c,10.5)
    b+=_joint(ox,oy,5,NAVY)
    b+=_lab(ox+2,175,"נקודת חיתוך",NAVY,9,anchor="start")
    return _svg(w,h,b)

# =========================================================================
# 7) Braking force–time curve (deceleration)
# =========================================================================
def force_time():
    w,h=250,200; x0,y0=40,160; x1,y1=235,160
    b=_defs()
    b+=f'<line x1="{x0}" y1="30" x2="{x0}" y2="{y0}" stroke="{STEEL}" stroke-width="2"/>'
    b+=f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y0}" stroke="{STEEL}" stroke-width="2"/>'
    b+=_lab(x0-6,26,"כוח",STEEL,10,anchor="end")
    b+=_lab(x1,y0+16,"זמן",STEEL,10)
    # steep braking curve (high RFD, high peak, short contact)
    b+=(f'<path d="M{x0},{y0} C60,60 78,40 96,44 C120,50 150,150 {x1-10},{y0}" '
        f'fill="none" stroke="{ACC}" stroke-width="3"/>')
    b+=_arrow(70,120,88,60,GOOD,2.2)
    b+=_lab(70,132,"RFD",GOOD,10)
    b+=f'<line x1="96" y1="44" x2="96" y2="{y0}" stroke="{LINE}" stroke-width="1.4" stroke-dasharray="3 3"/>'
    b+=_lab(96,40,"שיא GRF",ACC,10)
    b+=_lab(150,120,"ספיגת כוח",STEEL,10)
    return _svg(w,h,b)

# =========================================================================
# 8) Defensive slide stance (frontal)
# =========================================================================
def defensive_slide():
    w,h=270,230; cx=135; hipY=120; kneeY=168; ankY=210
    b=_defs()+_floor(w,222)
    hipL,hipR=cx-26,cx+26; knL,knR=cx-46,cx+46; anL,anR=cx-64,cx+64
    b+=_bone(hipL,hipY,hipR,hipY,NAVY,6)
    b+=_bone(cx,hipY,cx,74,NAVY,6)+_head(cx,58)
    b+=_bone(cx,86,cx-46,104,NAVY,5)+_bone(cx,86,cx+46,104,NAVY,5)  # arms wide
    for hx,kx,ax in ((hipL,knL,anL),(hipR,knR,anR)):
        b+=_bone(hx,hipY,kx,kneeY,GOOD,6)+_bone(kx,kneeY,ax,ankY,GOOD,6)
        b+=_bone(ax,ankY,ax+(14 if ax>cx else -14),ankY+8,NAVY,6)
        b+=_joint(kx,kneeY,5,GOOD)+_joint(hx,hipY)+_joint(ax,ankY)
    b+=_lab(cx,196,"בסיס רחב · מרכז כובד נמוך",GOOD,10.5)
    b+=_lab(cx,212,"אין הצלבת רגליים",STEEL,9.5)
    return _svg(w,h,b)

# =========================================================================
# 9) Foot arch / short-foot
# =========================================================================
def short_foot():
    w,h=250,150
    b=_defs()+_floor(w,120)
    # medial arch outline
    b+=(f'<path d="M40,120 L40,104 Q70,60 120,78 Q160,90 205,86 L205,120 Z" '
        f'fill="{SOFT}" stroke="{NAVY}" stroke-width="3"/>')
    b+=(f'<path d="M60,116 Q110,86 160,104" fill="none" stroke="{ACC}" '
        f'stroke-width="2.6" stroke-dasharray="4 3"/>')
    b+=_lab(110,74,"קשת אורכית מדיאלית",NAVY,10)
    b+=_arrow(150,116,120,116,ACC,2.4)
    b+=_lab(96,138,"קיצור כף הרגל: קירוב הבוהן לעקב ללא כיפוף אצבעות",STEEL,9)
    return _svg(w,h,b)

# =========================================================================
# 10) Kinetic chain (full body nodes)
# =========================================================================
def kinetic_chain():
    w,h=210,300
    b=_defs()+_floor(w,285)
    x=120
    b+=_bone(x,258,x,208,NAVY,6)+_bone(x,208,x,158,NAVY,6)+_bone(x,158,x,110,NAVY,6)
    b+=_head(x,86)
    nodes=[("קרסול",258),("ברך",208),("ירך/אגן",158),("core / גו",116)]
    for lab,y in nodes:
        b+=_joint(x,y,7,ACC)
        b+=_lab(x-16,y+4,lab,NAVY,10.5,anchor="end")
    b+=_arrow(x+18,262,x+18,120,GOOD,2.4)
    b+=_lab(x+40,190,"העברת כוח",GOOD,10,anchor="start")
    b+=_lab(x,298,"שרשרת קינטית — מהקרקע כלפי מעלה",STEEL,9.5)
    return _svg(w,h,b)

# registry for convenience
FIGS = {
    "knee_ok": lambda: knee_frontal(False),
    "knee_bad": lambda: knee_frontal(True),
    "land_ok": lambda: landing_side(True),
    "land_bad": lambda: landing_side(False),
    "hinge_ok": lambda: hip_hinge(True),
    "hinge_bad": lambda: hip_hinge(False),
    "dorsi": dorsiflexion,
    "snapdown": snapdown,
    "cod": cod_angles,
    "forcetime": force_time,
    "dslide": defensive_slide,
    "shortfoot": short_foot,
    "chain": kinetic_chain,
}
