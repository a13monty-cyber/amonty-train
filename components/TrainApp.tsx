"use client"

import { useEffect } from "react"

const BODY_HTML = `

<header>
  <div class="wrap header-flex">
    <img class="logo" src="data:image/jpeg;base64,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" alt="AMONTY">
    <div class="brand">TRAIN WITH THE BRAIN<span class="slogan">Mind With The Muscle</span><small>AMONTY · Performance &amp; Recovery · בונה אימונים חכם לכל ענף</small></div>
  </div>
</header>

<div id="keybar">
  <div class="keybar-inner">
    <button id="keyToggle" onclick="toggleKey()">🔑 API</button>
    <div id="keyPanel">
      <input id="apikey" type="password" placeholder="sk-ant-...">
      <button onclick="saveKey()">שמור</button>
      <span class="keyhint">נשמר בדפדפן בלבד</span>
    </div>
  </div>
</div>

<div class="app-layout">

  <!-- Sidebar -->
  <nav class="sidebar" id="sidebar">
    <button class="sidebar-tab active" data-tab="build" onclick="switchTab('build')">
      <span class="tab-icon">📋</span>
      <span class="tab-label">בנייה</span>
    </button>
    <button class="sidebar-tab" data-tab="plans" onclick="switchTab('plans')">
      <span class="tab-icon">📚</span>
      <span class="tab-label">מערכים</span>
    </button>
    <button class="sidebar-tab" data-tab="advisor" onclick="switchTab('advisor')">
      <span class="tab-icon">💬</span>
      <span class="tab-label">יועץ</span>
    </button>
    <button class="sidebar-tab" data-tab="knowledge" onclick="switchTab('knowledge')">
      <span class="tab-icon">🧠</span>
      <span class="tab-label">ידע</span>
    </button>
    <button class="sidebar-tab" data-tab="transfer" onclick="switchTab('transfer')">
      <span class="tab-icon">🔄</span>
      <span class="tab-label">העברה</span>
    </button>
  </nav>

  <!-- Content -->
  <div class="main-content">

    <!-- לשונית: בנייה -->
    <div class="tab-panel active" id="panel-build">
  <form class="card" onsubmit="return false">
    <div class="grid">
      <div class="field">
        <label for="sport">ענף ספורט</label>
        <input id="sport" placeholder="כדורסל, כדורגל, אתלטיקה...">
      </div>
      <div class="field">
        <label for="players">מספר שחקנים</label>
        <input id="players" type="number" min="1" max="60" value="12">
      </div>
      <div class="field">
        <label for="age">קבוצת גיל / רמה</label>
        <input id="age" placeholder="ילדים, נוער, בוגרים, מתקדמים...">
      </div>
      <div class="field">
        <label for="duration">משך האימון (דקות)</label>
        <input id="duration" type="number" min="20" max="180" value="75">
      </div>
      <div class="field full">
        <label for="topic">נושא האימון <span class="hint">— מה רוצים לשפר?</span></label>
        <input id="topic" placeholder="מסירות תחת לחץ, זריזות רגליים, סיומות לסל...">
      </div>
      <div class="field full">
        <label for="equipment">ציוד זמין</label>
        <textarea id="equipment" placeholder="10 כדורים, 20 קונוסים, סולם זריזות, גומיות..."></textarea>
      </div>
      <div class="field full">
        <label for="base">הבסיס שלך לאימון <span class="hint">— אופציונלי. תרגילים או רעיון שאתה רוצה שהאימון ייבנה סביבם</span></label>
        <textarea id="base" placeholder="לדוגמה: תרגיל 1 נגד 1 בחצי מגרש שאני אוהב, משחק סיום 3 נגד 3... המערכת תפתח ותרחיב על מה שתכתוב"></textarea>
      </div>
      <div class="field full">
        <label>העלאת חומר לימוד (PDF) <span class="hint">— האי יקרא ויפיק ידע לבניית המערך</span></label>
        <div id="pdfDropZone">
          <input type="file" id="pdfFile" accept=".pdf" style="display:none">
          <button type="button" id="pdfPickBtn" onclick="document.getElementById('pdfFile').click()">📄 בחר קובץ PDF</button>
          <span id="pdfLabel">לא נבחר קובץ</span>
          <button type="button" id="pdfClearBtn" style="display:none" onclick="clearPdf()">✕</button>
        </div>
        <div id="savedKnowledgeBar" style="display:none;margin-top:8px;padding:8px 12px;background:rgba(43,76,155,.07);border-radius:8px;font-size:13px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span>📚 ידע שמור:</span>
          <span id="savedKnowledgeName" style="font-weight:600;color:var(--pitch);flex:1"></span>
          <button onclick="useSavedKnowledge()" style="padding:4px 10px;border:1.5px solid var(--pitch);border-radius:6px;background:#fff;color:var(--pitch);font-family:Heebo,sans-serif;font-size:12px;cursor:pointer">השתמש</button>
          <button onclick="clearSavedKnowledge()" style="padding:4px 10px;border:1.5px solid #E8B9B9;border-radius:6px;background:#fff;color:#B45252;font-family:Heebo,sans-serif;font-size:12px;cursor:pointer">מחק</button>
        </div>
      </div>
      <div class="field full">
        <label>שילוב תרגילים מענפים אחרים <span class="hint">— העברת למידה בין-ענפית</span></label>
        <div class="seg" id="crossSeg">
          <button type="button" data-v="none">בלי</button>
          <button type="button" data-v="light" class="on">קצת (1–2 תרגילים)</button>
          <button type="button" data-v="heavy">הרבה — תפתיע אותי</button>
        </div>
      </div>
    </div>
    <button class="go" id="goBtn" onclick="buildPlan()">בנה מערך אימון</button>
  </form>

  <div id="loading">
    <div class="whistle"></div>
    <div id="loadmsg">מסדר את הקונוסים...</div>
    <div class="progtrack"><div id="progbar"></div></div>
  </div>

  <div id="error"></div>

  <div id="result">
    <div class="plan-head">
      <img class="plan-logo" src="data:image/jpeg;base64,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" alt="AMONTY">
      <div>
        <div class="plan-title" id="rTitle"></div>
        <div class="plan-meta" id="rMeta"></div>
        <div class="plan-brand">TRAIN WITH THE BRAIN · Mind With The Muscle · AMONTY</div>
      </div>
    </div>
    <div class="timeline" id="rTimeline"></div>
    <div class="plan-body" id="rBody"></div>
    <div class="actions">
      <button class="primary" onclick="window.print()">הדפס / שמור PDF</button>
      <button onclick="savePlan()" id="saveBtn">שמור לספרייה</button>
      <button onclick="copyPlan()" id="copyBtn">העתק כטקסט</button>
      <button onclick="exportWord()" id="wordBtn">ייצוא Word</button>
      <button onclick="exportExcel()" id="xlsBtn">ייצוא Excel</button>
      <button onclick="openAdvisorPopup()" id="advisorPopupBtn" style="background:var(--cone);color:#fff;border:none">💬 התייעץ עם AI</button>
    </div>

  <!-- popup יועץ בתוך הבנייה -->
  <div id="advisorPopup" style="display:none;position:fixed;bottom:65px;left:8px;right:8px;max-width:520px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);z-index:500;flex-direction:column;max-height:380px">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line)">
      <span style="font-weight:600;font-size:14px;color:var(--pitch)">💬 יועץ AI</span>
      <button onclick="closeAdvisorPopup()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
    </div>
    <div id="advisorPopupMessages" style="flex:1;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:8px;min-height:140px;max-height:240px"></div>
    <div style="display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--line)">
      <textarea id="advisorPopupInput" placeholder="שאל שאלה..." style="flex:1;min-height:36px;max-height:80px;resize:none;font-size:13.5px;padding:7px 10px;border:1.5px solid var(--line);border-radius:8px;font-family:Heebo,sans-serif" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAdvisorPopup()}"></textarea>
      <button onclick="sendAdvisorPopup()" style="padding:8px 14px;background:var(--pitch);color:#fff;border:none;border-radius:8px;font-family:Heebo,sans-serif;font-size:13px;cursor:pointer">שלח</button>
    </div>
  </div>
  </div>

  <!-- מודל הוספת תרגיל -->
  <div class="modal-overlay" id="drillModal">
    <div class="modal">
      <h3>+ הוסף תרגיל משלך</h3>
      <div class="field">
        <label>שם התרגיל *</label>
        <input type="text" id="dm_name" placeholder="לדוגמה: משחק 3 על 3 בשטח קטן">
      </div>
      <div class="field">
        <label>תיאור התרגיל *</label>
        <textarea id="dm_desc" placeholder="תאר את מהלך התרגיל..."></textarea>
      </div>
      <div class="field">
        <label>ארגון <span style="font-weight:300;color:#6B7280;font-size:12.5px">— איך מסדרים את השחקנים?</span></label>
        <input type="text" id="dm_org" placeholder="לדוגמה: 4 קבוצות, תחנות, סבבים של 3 דק'">
      </div>
      <div class="field">
        <label>דגשי אימון <span style="font-weight:300;color:#6B7280;font-size:12.5px">— הפרד בפסיקים</span></label>
        <input type="text" id="dm_points" placeholder="לדוגמה: תקשורת, לחץ על הכדור, מעברים מהירים">
      </div>
      <div class="field">
        <label>ציוד</label>
        <input type="text" id="dm_equip" placeholder="לדוגמה: 8 כדורים, 16 קונוסים">
      </div>
      <div class="modal-actions">
        <button class="btn-add" onclick="confirmAddDrill()">הוסף למערך</button>
        <button class="btn-cancel" onclick="closeDrillModal()">ביטול</button>
      </div>
    </div>
  </div>

  <!-- לשונית: יועץ AI -->
  <div class="modal-overlay" id="photoModal">
    <div class="modal" style="max-width:560px">
      <h3>📸 ניתוח תרגיל מצולם</h3>
      <div id="photoStep1">
        <div class="field">
          <label>צלם או העלה תמונה של התרגיל</label>
          <div id="photoDropZone">
            <input type="file" id="photoFileInput" accept="image/*" capture="environment" style="display:none">
            <button type="button" class="photo-pick-btn" onclick="document.getElementById('photoFileInput').click()">📷 צלם / העלה תמונה</button>
            <span id="photoFileName">לא נבחרה תמונה</span>
          </div>
          <img id="photoPreview" style="display:none;width:100%;border-radius:10px;margin-top:10px;max-height:240px;object-fit:cover">
        </div>
        <div class="field">
          <label>הוסף הקשר <span style="font-weight:300;font-size:12px;color:#6B7280">— אופציונלי</span></label>
          <textarea id="photoContext" placeholder="לדוגמה: ראיתי את זה באימון כדורסל של נבחרת U16, תרגיל סיום עם לחץ..." style="min-height:60px"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-add" onclick="analyzePhoto()">✨ נתח תרגיל</button>
          <button class="btn-cancel" onclick="closePhotoModal()">ביטול</button>
        </div>
      </div>
      <div id="photoStep2" style="display:none">
        <div id="photoResult"></div>
        <div class="modal-actions" style="margin-top:16px">
          <button class="btn-add" id="photoSaveBtn" onclick="savePhotodrillToLibrary()">💾 שמור לספרייה</button>
          <button class="btn-cancel" onclick="closePhotoModal()">סגור</button>
        </div>
      </div>
    </div>
  </div>

  <!-- מסך מלא הדמיה -->
  <div class="court-fullscreen-overlay" id="courtFullscreen">
    <div class="court-fs-header">
      <span class="court-fs-title" id="courtFsTitle">🏟 הדמיה טקטית</span>
      <div style="display:flex;gap:8px;align-items:center">
        <button id="courtFsGenBtn" class="court-action-btn primary" style="font-family:Heebo,sans-serif;font-size:13px;padding:6px 14px;border:none;background:var(--cone);color:#fff;border-radius:8px;cursor:pointer">✨ צור מחדש</button>
        <button class="court-fs-close" onclick="closeCourtFullscreen()">✕ סגור</button>
      </div>
    </div>
    <div class="court-fs-toolbar" id="courtFsToolbar"></div>
    <div class="court-fs-body">
      <canvas id="courtFsCanvas"></canvas>
    </div>
    <div class="court-fs-popup" id="courtFsPopup">
      <label>תיאור הציוד:</label>
      <input type="text" id="courtFsInput" placeholder="לדוגמה: כיפה צהובה — סקוואט">
      <div class="court-fs-popup-actions">
        <button id="courtFsSave" style="background:var(--pitch);color:#fff;border-color:var(--pitch)">שמור</button>
        <button id="courtFsDel" style="color:#B45252;border-color:#E8B9B9">מחק</button>
        <button id="courtFsClose2">✕</button>
      </div>
    </div>
  </div>

  <div id="library" style="display:none">
    <div id="libList"></div>
  </div>

    </div><!-- /panel-build -->

  <!-- לשונית: יועץ AI -->
  <div class="tab-panel" id="panel-advisor">
    <div class="card" style="display:flex;flex-direction:column;height:calc(100vh - 220px);min-height:400px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div class="part-name" style="margin-bottom:0"><span class="dot" style="background:var(--pitch)"></span>💬 יועץ AI — שאל אותי הכל</div>
        <button onclick="clearAdvisorHistory()" style="background:none;border:1px solid var(--line);border-radius:6px;padding:3px 10px;font-family:Heebo,sans-serif;font-size:12px;cursor:pointer;color:var(--muted)">נקה שיחה</button>
      </div>
      <p style="font-size:12.5px;color:var(--muted);margin-bottom:10px">שאל על תרגילים, תכנון אימון, טכניקה, רעיונות — כל שאלה מקצועית.</p>
      <div id="advisorMessages" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:8px 0;margin-bottom:10px"></div>
      <div style="display:flex;gap:8px;align-items:flex-end">
        <textarea id="advisorInput" placeholder="שאל שאלה מקצועית..." style="flex:1;min-height:44px;max-height:120px;resize:none;font-size:14px" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAdvisor()}"></textarea>
        <button onclick="sendAdvisor()" style="padding:10px 16px;background:var(--pitch);color:#fff;border:none;border-radius:10px;font-family:Heebo,sans-serif;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap">שלח ↵</button>
      </div>
    </div>
  </div>

    <!-- לשונית: מערכים -->
    <div class="tab-panel" id="panel-plans">
      <div class="card">
        <div class="part-name" style="margin-bottom:14px"><span class="dot" style="background:var(--cone)"></span>המערכים השמורים שלי</div>
        <div class="lib-filters">
          <input type="text" class="lib-search" id="libSearch" placeholder="🔍 חפש מערך..." oninput="filterPlans()">
          <select class="lib-sort" id="libSort" onchange="filterPlans()">
            <option value="date">לפי תאריך</option>
            <option value="sport">לפי ענף</option>
            <option value="name">לפי שם</option>
          </select>
          <button class="lib-filter-btn active" data-sport="all" onclick="setLibFilter(this)">הכל</button>
          <button class="lib-filter-btn" data-sport="כדורסל" onclick="setLibFilter(this)">🏀 כדורסל</button>
          <button class="lib-filter-btn" data-sport="כדורגל" onclick="setLibFilter(this)">⚽ כדורגל</button>
          <button class="lib-filter-btn" data-sport="כדורעף" onclick="setLibFilter(this)">🏐 כדורעף</button>
          <button class="lib-filter-btn" data-sport="כדוריד" onclick="setLibFilter(this)">🤾 כדוריד</button>
          <button class="lib-filter-btn" data-sport="אתלטיקה" onclick="setLibFilter(this)">🏃 אתלטיקה</button>
        </div>
        <div id="plansGrid"></div>
      </div>
    </div>

    <!-- לשונית: ידע -->
    <div class="tab-panel" id="panel-knowledge">
      <div class="card" style="margin-bottom:16px">
        <div class="part-name" style="margin-bottom:14px"><span class="dot" style="background:var(--pitch)"></span>📚 חומרי לימוד שמורים</div>
        <div id="knowledgeList"><p style="color:var(--muted);font-size:13.5px">עדיין לא הועלו חומרים.</p></div>
      </div>

      <!-- ניתוח תרגיל מסרטון / מספר תמונות -->
      <div class="card" style="margin-bottom:16px">
        <div class="part-name" style="margin-bottom:6px"><span class="dot" style="background:var(--cone)"></span>🎬 ניתוח תרגיל מסרטון</div>
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">הורד סרטון מאינסטגרם / טיקטוק / פייסבוק → צלם מסך מכמה שלבים → העלה עד 5 תמונות → ה-AI מנתח ומפרק לשלבים.</p>
        <div id="multiImgZone">
          <input type="file" id="multiImgInput" accept="image/*" multiple style="display:none" onchange="addMultiImages(this)">
          <div id="multiImgPreviews" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"></div>
          <button class="photo-pick-btn" onclick="document.getElementById('multiImgInput').click()" style="width:100%;justify-content:center;margin-bottom:10px">
            📷 הוסף תמונות (עד 5)
          </button>
          <textarea id="multiImgContext" placeholder="הקשר (אופציונלי) — איזה ספורט? מה רואים בסרטון?" style="min-height:50px;margin-bottom:10px"></textarea>
          <div style="display:flex;gap:8px">
            <button onclick="analyzeMultiImages('drill')" style="flex:1;padding:11px;background:var(--pitch);color:#fff;border:none;border-radius:10px;font-family:Heebo,sans-serif;font-size:14px;font-weight:500;cursor:pointer">🔍 פרק תרגיל לשלבים</button>
            <button onclick="analyzeMultiImages('knowledge')" style="flex:1;padding:11px;background:var(--cone);color:#fff;border:none;border-radius:10px;font-family:Heebo,sans-serif;font-size:14px;font-weight:500;cursor:pointer">🧠 שמור לבסיס הידע</button>
          </div>
          <div id="multiImgResult" style="display:none;margin-top:14px"></div>
        </div>
      </div>

      <!-- העלאת PDF / תמונת דף -->
      <div class="card">
        <div class="part-name" style="margin-bottom:6px"><span class="dot" style="background:var(--pitch)"></span>📄 העלאת חומר לימוד</div>
        <p style="font-size:13px;color:var(--muted);margin-bottom:12px">העלה PDF, תמונת דף מספר, או גרף — ה-AI ינתח וישמור לבסיס הידע.</p>
        <div id="imgKnowledgeZone" style="border:1.5px dashed var(--line);border-radius:10px;padding:14px;background:var(--chalk)">
          <input type="file" id="imgKnowledgeInput" accept="image/*,application/pdf" style="display:none">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button class="photo-pick-btn" onclick="document.getElementById('imgKnowledgeInput').click()">📷 בחר קובץ / תמונה</button>
            <span id="imgKnowledgeName" style="font-size:13px;color:var(--muted)">לא נבחר קובץ</span>
          </div>
          <img id="imgKnowledgePreview" style="display:none;width:100%;max-height:180px;object-fit:cover;border-radius:8px;margin-top:10px">
          <textarea id="imgKnowledgeContext" placeholder="הוסף הקשר (אופציונלי)" style="margin-top:10px;min-height:50px"></textarea>
          <button onclick="analyzeImageKnowledge()" style="margin-top:10px;width:100%;padding:11px;background:var(--pitch);color:#fff;border:none;border-radius:10px;font-family:Heebo,sans-serif;font-size:14px;font-weight:500;cursor:pointer">✨ נתח ושמור לבסיס הידע</button>
        </div>
      </div>
    </div>

    <!-- לשונית: העברה בין מכשירים -->
    <div class="tab-panel" id="panel-transfer">
      <div class="card">
        <div class="part-name" style="margin-bottom:14px"><span class="dot" style="background:var(--pitch)"></span>🔄 העברה בין מכשירים</div>
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.6">ייצא את כל המערכים וחומרי הלימוד לקובץ JSON — ואז טען אותו במכשיר אחר.</p>
        <div class="transfer-section">
          <h4>📤 ייצוא</h4>
          <div class="transfer-btns">
            <button class="transfer-btn primary" onclick="exportAllData()">ייצא הכל (מערכים + ידע)</button>
            <button class="transfer-btn" onclick="exportPlansOnly()">ייצא מערכים בלבד</button>
          </div>
        </div>
        <div class="transfer-section">
          <h4>📥 ייבוא</h4>
          <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(this)">
          <div class="transfer-btns">
            <button class="transfer-btn primary" onclick="document.getElementById('importFile').click()">טען קובץ מייצוא</button>
          </div>
          <p style="font-size:12px;color:var(--muted);margin-top:8px">⚠️ הייבוא יוסיף על מה שקיים, לא ימחק.</p>
        </div>
        <div class="transfer-section" style="background:rgba(43,76,155,.04)">
          <h4 style="color:var(--muted)">🔮 בקרוב — סנכרון אוטומטי</h4>
          <p style="font-size:12.5px;color:var(--muted);margin-top:4px;line-height:1.6">סנכרון אמיתי בין מכשירים ללא ייצוא ידני — בגרסה הבאה עם Firebase.</p>
        </div>
      </div>
    </div>

  </div><!-- /main-content -->
</div><!-- /app-layout -->

<!-- modal: צפייה במערך — מחוץ ל-layout כדי לעבוד מכל לשונית -->
<div class="modal-overlay" id="planModal">
  <div class="modal" style="max-width:680px;max-height:92vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 id="planModalTitle" style="margin:0;font-size:22px">מערך אימון</h3>
      <button onclick="closePlanModal()" style="background:none;border:1.5px solid var(--line);border-radius:8px;padding:5px 12px;cursor:pointer;font-family:Heebo,sans-serif;font-size:14px">✕ סגור</button>
    </div>
    <div id="planModalContent"></div>
    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
      <button onclick="loadPlanToBuilder()" style="flex:1;padding:10px;background:var(--pitch);color:#fff;border:none;border-radius:9px;font-family:Heebo,sans-serif;font-size:13.5px;font-weight:500;cursor:pointer">✏️ עבור לעריכה</button>
      <button onclick="exportModalWord()" style="padding:10px 14px;border:1.5px solid var(--line);border-radius:9px;background:#fff;font-family:Heebo,sans-serif;font-size:13.5px;cursor:pointer">📄 Word</button>
      <button onclick="closePlanModal()" style="padding:10px 14px;border:1.5px solid var(--line);border-radius:9px;background:#fff;font-family:Heebo,sans-serif;font-size:13.5px;cursor:pointer">סגור</button>
    </div>
  </div>
</div>
`

const MAIN_JS = `
let crossLevel = 'light';

/* ===== modal מערך ===== */
let _modalPlanData = null;

function openPlanModal(plan, meta){
  if(!plan){ alert('לא ניתן לפתוח את המערך — נסה לשמור אותו מחדש'); return; }
  _modalPlanData = {plan, meta};
  document.getElementById('planModalTitle').textContent = plan.title||'מערך אימון';
  const c = document.getElementById('planModalContent');
  const parts = plan.parts || [];
  let html = \`<div style="font-size:12.5px;color:var(--muted);margin-bottom:12px">\${esc((meta&&meta.sport)||'')} · \${(meta&&meta.players)||''} שחקנים · \${esc((meta&&meta.age)||'')} · \${plan.total_minutes||''} דקות</div>\`;
  if(!parts.length){
    html += \`<p style="color:var(--muted);font-size:13.5px">המערך לא מכיל חלקים שמורים.</p>\`;
  }
  parts.forEach(p=>{
    html += \`<div class="plan-part"><div class="plan-part-title">\${esc(p.name||'')} — \${p.minutes||''} דק'</div>\`;
    (p.drills||[]).forEach(d=>{
      html += \`<div class="plan-drill">
        <div class="plan-drill-name">\${esc(d.name||'')}\${d.from_coach?' ★':''}</div>
        \${d.description?\`<div class="plan-drill-desc">\${esc(d.description)}</div>\`:''}
        \${d.organization?\`<div class="plan-drill-meta">ארגון: \${esc(d.organization)}</div>\`:''}
        \${(d.coaching_points||[]).length?\`<ul class="plan-drill-points">\${d.coaching_points.map(pt=>\`<li>\${esc(pt)}</li>\`).join('')}</ul>\`:''}
        \${d.equipment?\`<div class="plan-drill-meta">ציוד: \${esc(d.equipment)}</div>\`:''}
      </div>\`;
    });
    html += \`</div>\`;
  });
  if(plan.notes) html += \`<div style="background:#FFF7EF;border:1px solid #F4D8BE;padding:10px;border-radius:8px;font-size:13px"><b>הערות:</b> \${esc(plan.notes)}</div>\`;
  c.innerHTML = html;
  document.getElementById('planModal').classList.add('open');
}

function closePlanModal(){
  document.getElementById('planModal').classList.remove('open');
}

function loadPlanToBuilder(){
  if(!_modalPlanData) return;
  lastPlan = _modalPlanData.plan;
  lastMeta = _modalPlanData.meta;
  renderPlan(_modalPlanData.plan, _modalPlanData.meta, false);
  closePlanModal();
  switchTab('build');
  setTimeout(()=>document.getElementById('result')?.scrollIntoView({behavior:'smooth'}),200);
}

function exportModalWord(){
  if(!_modalPlanData) return;
  lastPlan = _modalPlanData.plan;
  lastMeta = _modalPlanData.meta;
  exportWord();
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('planModal')?.addEventListener('click',function(e){ if(e.target===this) closePlanModal(); });
});

/* ===== יועץ popup בתוך הבנייה ===== */
let advisorPopupHistory = [];

function openAdvisorPopup(){
  const p = document.getElementById('advisorPopup');
  p.style.display = p.style.display==='flex' ? 'none' : 'flex';
  p.style.flexDirection = 'column';
  if(p.style.display==='flex') document.getElementById('advisorPopupInput').focus();
}
function closeAdvisorPopup(){
  document.getElementById('advisorPopup').style.display='none';
}

function sendAdvisorPopup(){
  const input = document.getElementById('advisorPopupInput');
  const msg = input.value.trim(); if(!msg) return;
  const key = getKey();
  if(!key||key.length<10){ alert('צריך מפתח API'); return; }
  input.value='';
  appendAdvisorPopupMsg(msg,'user');
  const loading = appendAdvisorPopupMsg('מעבד...','loading');
  advisorPopupHistory.push({role:'user',content:msg});

  const knowledge = savedKnowledgeText ? \`\\n\\nחומרי לימוד שמורים:\\n\${savedKnowledgeText.substring(0,1500)}\` : '';
  const ctx = lastMeta && lastMeta.sport ? \`\\nהקשר האימון הנוכחי: ענף \${lastMeta.sport}, \${lastMeta.players||''} שחקנים, גיל \${lastMeta.age||''}.\` : '';
  const system = \`אתה מאמן ספורט מקצועי ומנוסה. אתה עונה תמיד בעברית תקנית וברורה, בסגנון של מאמן ישראלי מקצועי — לא תרגום מאנגלית. השתמש במונחים עבריים מקצועיים כמו: מסירה, קריאה, לחץ, מרחב, פינה, קונוס, כיפה, כדורסל, שליטה בכדור, תנועה בלי כדור וכו'.\${ctx}\${knowledge}\`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST","https://api.anthropic.com/v1/messages",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.setRequestHeader("x-api-key",key);
  xhr.setRequestHeader("anthropic-version","2023-06-01");
  xhr.setRequestHeader("anthropic-dangerous-direct-browser-access","true");
  xhr.timeout = 30000;
  xhr.onload = function(){
    loading.remove();
    try{
      const data = JSON.parse(xhr.responseText);
      if(data.error){ appendAdvisorPopupMsg('שגיאה: '+(data.error.message||xhr.status),'loading'); advisorPopupHistory.pop(); return; }
      const reply=(data.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('');
      if(!reply){ appendAdvisorPopupMsg('לא התקבלה תשובה','loading'); advisorPopupHistory.pop(); return; }
      advisorPopupHistory.push({role:'assistant',content:reply});
      appendAdvisorPopupMsg(reply,'ai');
    }catch(e){ appendAdvisorPopupMsg('שגיאה: '+e.message,'loading'); advisorPopupHistory.pop(); }
  };
  xhr.onerror = function(){ loading.remove(); appendAdvisorPopupMsg('שגיאת רשת','loading'); advisorPopupHistory.pop(); };
  xhr.ontimeout = function(){ loading.remove(); appendAdvisorPopupMsg('פסק זמן — נסה שוב','loading'); advisorPopupHistory.pop(); };
  xhr.send(JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,system,messages:advisorPopupHistory}));
}

function appendAdvisorPopupMsg(text,type){
  const wrap = document.getElementById('advisorPopupMessages');
  const el = document.createElement('div');
  el.className=\`advisor-msg \${type}\`;
  el.textContent=text;
  wrap.appendChild(el);
  wrap.scrollTop=wrap.scrollHeight;
  return el;
}

async function sendAdvisor(){
  const input = document.getElementById("advisorInput");
  const msg = input.value.trim();
  if(!msg) return;
  const key = getKey();
  if(!key||key.length<10){ appendAdvisorMsg("אין מפתח API","loading"); return; }
  input.value="";
  appendAdvisorMsg(msg,"user");
  const loading = appendAdvisorMsg("מעבד...","loading");

  const knowledge = savedKnowledgeText ? \`\\n\\nחומרי לימוד שמורים:\\n\${savedKnowledgeText.substring(0,1500)}\` : '';
  const ctx = lastMeta && lastMeta.sport ? \`\\nהקשר: ענף \${lastMeta.sport}, \${lastMeta.players||''} שחקנים, גיל \${lastMeta.age||''}.\` : '';
  const system = \`אתה מאמן ספורט מקצועי ומנוסה. אתה עונה תמיד בעברית תקנית וברורה, בסגנון של מאמן ישראלי מקצועי — לא תרגום מאנגלית. השתמש במונחים עבריים מקצועיים: מסירה, קריאה, לחץ, מרחב, פינה, קונוס, כיפה, שליטה בכדור, תנועה בלי כדור, סיום, חדירה, הגנה צמודה וכו'.\${ctx}\${knowledge}\`;

  const messages = [...advisorHistory,{role:"user",content:msg}];
  const xhr = new XMLHttpRequest();
  xhr.open("POST","https://api.anthropic.com/v1/messages",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.setRequestHeader("x-api-key",key);
  xhr.setRequestHeader("anthropic-version","2023-06-01");
  xhr.setRequestHeader("anthropic-dangerous-direct-browser-access","true");
  xhr.timeout = 30000;
  xhr.onload = function(){
    loading.remove();
    try{
      const data = JSON.parse(xhr.responseText);
      if(data.error){ appendAdvisorMsg("שגיאה: "+(data.error.message||xhr.status),"loading"); return; }
      const reply=(data.content||[]).filter(c=>c.type==="text").map(c=>c.text).join("");
      if(!reply){ appendAdvisorMsg("לא התקבלה תשובה","loading"); return; }
      advisorHistory.push({role:"user",content:msg});
      advisorHistory.push({role:"assistant",content:reply});
      appendAdvisorMsg(reply,"ai");
    }catch(e){ appendAdvisorMsg("שגיאה: "+e.message,"loading"); }
  };
  xhr.onerror = function(){ loading.remove(); appendAdvisorMsg("שגיאת רשת","loading"); };
  xhr.ontimeout = function(){ loading.remove(); appendAdvisorMsg("פסק זמן — נסה שוב","loading"); };
  xhr.send(JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,system,messages}));
}
function clearAdvisorHistory(){
  advisorHistory=[];
  const w=document.getElementById("advisorMessages"); if(w) w.innerHTML="";
}

function appendAdvisorMsg(text, type){
  const wrap = document.getElementById('advisorMessages');
  const el = document.createElement('div');
  el.className = \`advisor-msg \${type}\`;
  el.textContent = text;
  wrap.appendChild(el);
  wrap.scrollTop = wrap.scrollHeight;
  return el;
}
function switchTab(tab){
  document.querySelectorAll(".sidebar-tab").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
  const activeTab = document.querySelector(\`[data-tab="\${tab}"]\`);
  const activePanel = document.getElementById(\`panel-\${tab}\`);
  if(activeTab) activeTab.classList.add("active");
  if(activePanel) activePanel.classList.add("active");
  if(tab==="plans") renderPlansGrid();
  if(tab==="knowledge") renderKnowledgeList();
}

/* ===== ספרייה עם מיון ===== */
let libActiveFilter = 'all';
function setLibFilter(btn){
  document.querySelectorAll('.lib-filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  libActiveFilter = btn.dataset.sport;
  renderPlansGrid();
}
function filterPlans(){ renderPlansGrid(); }

function renderPlansGrid(){
  const grid = document.getElementById('plansGrid');
  if(!grid) return;
  const search = (document.getElementById('libSearch')||{}).value?.trim().toLowerCase()||'';
  const sort = (document.getElementById('libSort')||{}).value||'date';
  let plans = JSON.parse(localStorage.getItem('ttb_plans')||'[]');
  if(libActiveFilter !== 'all') plans = plans.filter(p=>p.meta?.sport?.includes(libActiveFilter));
  if(search) plans = plans.filter(p=>(p.plan?.title||'').toLowerCase().includes(search)||(p.meta?.sport||'').includes(search));
  if(sort==='date') plans.sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
  else if(sort==='sport') plans.sort((a,b)=>(a.meta?.sport||'').localeCompare(b.meta?.sport||''));
  else if(sort==='name') plans.sort((a,b)=>(a.plan?.title||'').localeCompare(b.plan?.title||''));
  if(!plans.length){ grid.innerHTML='<p style="color:var(--muted);font-size:13.5px;padding:8px 0">לא נמצאו מערכים.</p>'; return; }
  grid.innerHTML = plans.map((p,i)=>\`
    <div class="lib-card" onclick="loadPlanFromLib(\${i})">
      <div class="lib-card-title">\${esc(p.plan?.title||'מערך ללא שם')}</div>
      <div class="lib-card-meta">
        <span class="lib-card-badge">\${esc(p.meta?.sport||'')}</span>
        <span>\${p.meta?.players||''} שחקנים</span>
        <span>\${p.meta?.age||''}</span>
        <span>\${p.plan?.total_minutes||''} דק'</span>
        <span style="margin-right:auto;color:var(--muted)">\${p.savedAt?new Date(p.savedAt).toLocaleDateString('he-IL'):''}</span>
        <button onclick="event.stopPropagation();deletePlanFromLib(\${i})" style="background:none;border:none;color:#B45252;cursor:pointer;font-size:13px;padding:2px 6px">🗑</button>
      </div>
    </div>\`).join('');
}
function loadPlanFromLib(idx){
  const plans=JSON.parse(localStorage.getItem('ttb_plans')||'[]');
  const p=plans[idx]; if(!p) return;
  // תמיכה בפורמט ישן (plan/meta) וגם בפורמט חדש
  const plan = p.plan || p;
  const meta = p.meta || {sport: p.sport||'', players: p.players||'', age: p.age||'', duration: p.duration||''};
  openPlanModal(plan, meta);
}
function deletePlanFromLib(idx){
  if(!confirm('למחוק מערך זה?')) return;
  const plans=JSON.parse(localStorage.getItem('ttb_plans')||'[]');
  plans.splice(idx,1);
  localStorage.setItem('ttb_plans',JSON.stringify(plans));
  renderPlansGrid(); loadLibrary();
}

/* ===== ידע שמור ===== */
function renderKnowledgeList(){
  const list=document.getElementById('knowledgeList'); if(!list) return;
  const items=JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]');
  const single=localStorage.getItem('ttb_knowledge');
  const allItems=[];
  if(single){ try{allItems.push(JSON.parse(single));}catch(e){} }
  allItems.push(...items.filter(x=>x.name!==allItems[0]?.name));
  if(!allItems.length){ list.innerHTML='<p style="color:var(--muted);font-size:13.5px">עדיין לא הועלו חומרים.</p>'; return; }
  list.innerHTML=allItems.map((k,i)=>\`
    <div class="knowledge-card">
      <div class="knowledge-card-title">📄 \${esc(k.name||'חומר לימוד')}</div>
      <div class="knowledge-card-meta">\${k.date||''} · \${k.text?.length||0} תווים</div>
      <div class="knowledge-card-actions">
        <button onclick="activateKnowledge(\${i})" style="background:var(--pitch);color:#fff;border-color:var(--pitch)">השתמש בבנייה הבאה</button>
        <button onclick="deleteKnowledge(\${i})" style="color:#B45252;border-color:#E8B9B9">מחק</button>
      </div>
    </div>\`).join('');
}
function activateKnowledge(i){
  const single=localStorage.getItem('ttb_knowledge');
  const items=JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]');
  const allItems=[]; if(single){try{allItems.push(JSON.parse(single));}catch(e){}} allItems.push(...items.filter(x=>x.name!==allItems[0]?.name));
  const k=allItems[i]; if(!k) return;
  savedKnowledgeText=k.text;
  localStorage.setItem('ttb_knowledge',JSON.stringify(k));
  const bar=document.getElementById('savedKnowledgeBar');
  if(bar){bar.style.display='flex';document.getElementById('savedKnowledgeName').textContent=k.name;}
  switchTab('build'); alert('✓ הידע הופעל לבנייה הבאה');
}
function deleteKnowledge(i){ if(!confirm('למחוק?')) return; localStorage.removeItem('ttb_knowledge'); renderKnowledgeList(); loadSavedKnowledge(); }

/* ===== ניתוח מספר תמונות (סרטון) ===== */
let _multiImages = []; // [{base64, name}]

function addMultiImages(input){
  const files = Array.from(input.files);
  const remaining = 5 - _multiImages.length;
  if(remaining <= 0){ alert('הגעת למקסימום 5 תמונות'); return; }
  const toAdd = files.slice(0, remaining);
  toAdd.forEach(file=>{
    const r = new FileReader();
    r.onload = e=>{
      _multiImages.push({base64: e.target.result.split(',')[1], name: file.name});
      renderMultiPreviews();
    };
    r.readAsDataURL(file);
  });
  input.value='';
}

function renderMultiPreviews(){
  const wrap = document.getElementById('multiImgPreviews');
  wrap.innerHTML = _multiImages.map((img,i)=>\`
    <div style="position:relative;display:inline-block">
      <img src="data:image/jpeg;base64,\${img.base64}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid var(--line)">
      <button onclick="removeMultiImg(\${i})" style="position:absolute;top:-6px;right:-6px;background:#E74C3C;color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
      <div style="font-size:9px;color:var(--muted);text-align:center;margin-top:2px">\${i+1}</div>
    </div>\`).join('');
  const btn = document.querySelector('#multiImgZone .photo-pick-btn');
  if(btn) btn.textContent = \`📷 הוסף תמונות (\${_multiImages.length}/5)\`;
}

function removeMultiImg(i){
  _multiImages.splice(i,1);
  renderMultiPreviews();
}

async function analyzeMultiImages(mode){
  if(!_multiImages.length){ alert('יש להעלות לפחות תמונה אחת'); return; }
  if(!getKey()){ alert('צריך מפתח API'); return; }

  const btn = mode==='drill'
    ? document.querySelector('#multiImgZone button[onclick*="drill"]')
    : document.querySelector('#multiImgZone button[onclick*="knowledge"]');
  const orig = btn.textContent; btn.disabled=true; btn.textContent='⏳ מנתח...';

  const ctx = document.getElementById('multiImgContext').value.trim();
  const prompt = mode==='drill'
    ? \`אתה מאמן ספורט מקצועי. אלו \${_multiImages.length} צילומי מסך מסרטון של תרגיל אחד.\${ctx?'\\nהקשר: '+ctx:''}

נתח את התרגיל ופרק אותו לשלבים ברורים. כתוב בעברית:

**שם התרגיל:**
**ענף הספורט:**
**מטרת התרגיל:**
**ציוד נדרש:**

**שלבי ביצוע:**
1. ...
2. ...
3. ...

**דגשי אימון:**
- ...

**וריאציות אפשריות:**
- ...\`
    : \`סכם את הידע המקצועי שבתמונות לשימוש בבניית מערכי אימון.\${ctx?'\\nהקשר: '+ctx:''}
כלול: עקרונות, תרגילים, מתודולוגיה, נקודות מפתח. כתוב בעברית.\`;

  const content = [
    ..._multiImages.map((img,i)=>({
      type:"image",
      source:{type:"base64",media_type:"image/jpeg",data:img.base64}
    })),
    {type:"text",text:prompt}
  ];

  try{
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,messages:[{role:"user",content}]})
    });
    const data = await res.json();
    const text = (data.content||[]).map(c=>c.text||'').join('');

    if(mode==='drill'){
      // הצג תוצאה + כפתור שמירה
      const resultDiv = document.getElementById('multiImgResult');
      resultDiv.style.display='block';
      resultDiv.innerHTML = \`
        <div style="background:var(--chalk);border-radius:10px;padding:14px;border:1px solid var(--line)">
          <div style="font-size:13.5px;line-height:1.8;white-space:pre-wrap">\${esc(text)}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button onclick="saveMultiDrillToLibrary()" style="flex:1;padding:10px;background:var(--pitch);color:#fff;border:none;border-radius:9px;font-family:Heebo,sans-serif;font-size:13.5px;font-weight:500;cursor:pointer">💾 שמור לבסיס הידע</button>
          <button onclick="clearMultiSession()" style="padding:10px 14px;border:1.5px solid var(--line);border-radius:9px;background:#fff;font-family:Heebo,sans-serif;font-size:13.5px;cursor:pointer">נקה</button>
        </div>\`;
      window._lastMultiText = text;
    } else {
      // שמור לבסיס הידע
      const name = ctx||\`ניתוח סרטון — \${new Date().toLocaleDateString('he-IL')}\`;
      const entry={name,text,date:new Date().toLocaleDateString('he-IL'),type:'video_frames'};
      const list=JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]');
      list.push(entry);
      localStorage.setItem('ttb_knowledge_list',JSON.stringify(list));
      savedKnowledgeText=text;
      localStorage.setItem('ttb_knowledge',JSON.stringify(entry));
      const bar=document.getElementById('savedKnowledgeBar');
      if(bar){bar.style.display='flex';document.getElementById('savedKnowledgeName').textContent=name;}
      alert('✓ הידע נשמר לבסיס הידע');
      clearMultiSession();
      renderKnowledgeList();
    }
  }catch(e){ alert('שגיאה בניתוח — נסה שוב'); console.error(e); }
  finally{ btn.disabled=false; btn.textContent=orig; }
}

function saveMultiDrillToLibrary(){
  if(!window._lastMultiText) return;
  const ctx = document.getElementById('multiImgContext').value.trim();
  const name = ctx||\`תרגיל מסרטון — \${new Date().toLocaleDateString('he-IL')}\`;
  const entry={name,text:window._lastMultiText,date:new Date().toLocaleDateString('he-IL'),type:'video_frames'};
  const list=JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]');
  list.push(entry);
  localStorage.setItem('ttb_knowledge_list',JSON.stringify(list));
  savedKnowledgeText=window._lastMultiText;
  localStorage.setItem('ttb_knowledge',JSON.stringify(entry));
  const bar=document.getElementById('savedKnowledgeBar');
  if(bar){bar.style.display='flex';document.getElementById('savedKnowledgeName').textContent=name;}
  alert('✓ נשמר לבסיס הידע');
  renderKnowledgeList();
}

function clearMultiSession(){
  _multiImages=[];
  renderMultiPreviews();
  document.getElementById('multiImgContext').value='';
  document.getElementById('multiImgResult').style.display='none';
  window._lastMultiText=null;
}
document.addEventListener('DOMContentLoaded',()=>{
  const inp=document.getElementById('imgKnowledgeInput');
  if(inp) inp.addEventListener('change',function(){
    const file=this.files[0]; if(!file) return;
    document.getElementById('imgKnowledgeName').textContent=file.name;
    const r=new FileReader();
    r.onload=e=>{ _imgKnowledgeBase64=e.target.result.split(',')[1]; const p=document.getElementById('imgKnowledgePreview'); p.src=e.target.result; p.style.display='block'; };
    r.readAsDataURL(file);
  });
});
async function analyzeImageKnowledge(){
  if(!_imgKnowledgeBase64){alert('יש לבחור תמונה');return;} if(!getKey()){alert('צריך API');return;}
  const btn=document.querySelector('#imgKnowledgeZone button:last-child');
  const orig=btn.textContent; btn.disabled=true; btn.textContent='⏳ מנתח...';
  const ctx=document.getElementById('imgKnowledgeContext').value.trim();
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,messages:[{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:_imgKnowledgeBase64}},
        {type:"text",text:\`סכם את הידע המקצועי שבתמונה לשימוש בבניית מערכי אימון.\${ctx?'\\nהקשר: '+ctx:''}\\nכלול: עקרונות, תרגילים, מתודולוגיה. כתוב בעברית.\`}
      ]}]})});
    const data=await res.json();
    const text=(data.content||[]).map(c=>c.text||'').join('');
    const name=document.getElementById('imgKnowledgeName').textContent;
    const entry={name,text,date:new Date().toLocaleDateString('he-IL'),type:'image'};
    const list=JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]'); list.push(entry);
    localStorage.setItem('ttb_knowledge_list',JSON.stringify(list));
    savedKnowledgeText=text; localStorage.setItem('ttb_knowledge',JSON.stringify(entry));
    const bar=document.getElementById('savedKnowledgeBar');
    if(bar){bar.style.display='flex';document.getElementById('savedKnowledgeName').textContent=name;}
    alert('✓ הידע מהתמונה נשמר'); _imgKnowledgeBase64=null;
    document.getElementById('imgKnowledgePreview').style.display='none';
    document.getElementById('imgKnowledgeName').textContent='לא נבחרה תמונה';
    document.getElementById('imgKnowledgeContext').value='';
    renderKnowledgeList();
  }catch(e){alert('שגיאה');console.error(e);}
  finally{btn.disabled=false;btn.textContent=orig;}
}

/* ===== ייצוא/ייבוא ===== */
function exportAllData(){
  const data={version:1,exported:new Date().toISOString(),plans:JSON.parse(localStorage.getItem('ttb_plans')||'[]'),knowledge:JSON.parse(localStorage.getItem('ttb_knowledge')||'null'),knowledgeList:JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]')};
  _dlJSON(data,'amonty-backup-'+new Date().toLocaleDateString('he-IL').replace(/\\//g,'-')+'.json');
}
function exportPlansOnly(){ _dlJSON({version:1,exported:new Date().toISOString(),plans:JSON.parse(localStorage.getItem('ttb_plans')||'[]')},'amonty-plans.json'); }
function _dlJSON(data,name){ const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=name; a.click(); URL.revokeObjectURL(u); }
function importData(input){
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    try{
      const data=JSON.parse(e.target.result); let imported=0;
      if(data.plans?.length){ const ex=JSON.parse(localStorage.getItem('ttb_plans')||'[]'); localStorage.setItem('ttb_plans',JSON.stringify([...ex,...data.plans])); imported+=data.plans.length; }
      if(data.knowledge){ localStorage.setItem('ttb_knowledge',JSON.stringify(data.knowledge)); savedKnowledgeText=data.knowledge.text; }
      if(data.knowledgeList?.length){ const ex=JSON.parse(localStorage.getItem('ttb_knowledge_list')||'[]'); localStorage.setItem('ttb_knowledge_list',JSON.stringify([...ex,...data.knowledgeList])); }
      loadLibrary(); loadSavedKnowledge(); alert(\`✓ יובאו: \${imported} מערכים\`);
    }catch(ex){alert('שגיאה בקריאת הקובץ');}
  };
  r.readAsText(file); input.value='';
}

/* ===== ניהול מפתח API ===== */
function getKey(){ try{ return localStorage.getItem('ttb_api_key') || ''; }catch(e){ return ''; } }
function toggleKey(){ document.getElementById('keyPanel').classList.toggle('open'); }
function saveKey(){
  const k = document.getElementById('apikey').value.trim();
  if(!k.startsWith('sk-ant-')){ alert('זה לא נראה כמו מפתח תקין של Anthropic (אמור להתחיל ב-sk-ant)'); return; }
  try{ localStorage.setItem('ttb_api_key', k); }catch(e){}
  refreshKeyUI();
  document.getElementById('keyPanel').classList.remove('open');
}
function refreshKeyUI(){
  const has = !!getKey();
  const t = document.getElementById('keyToggle');
  t.textContent = has ? '🔑 מפתח שמור ✓' : '🔑 מפתח API — חובה להזין';
  t.classList.toggle('ok', has);
}
window.addEventListener('DOMContentLoaded', ()=>{
  refreshKeyUI();
  loadSavedKnowledge();
  if(!getKey()) document.getElementById('keyPanel').classList.add('open');
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  const buildPanel = document.getElementById('panel-build');
  if(buildPanel) buildPanel.classList.add('active');
});

/* ===== אחסון מקומי בדפדפן (במקום אחסון הארטיפקט) ===== */
if(typeof window !== 'undefined' && !window.storage){
  window.storage = {
    async get(k){ const v = localStorage.getItem('ttb_'+k); if(v===null) throw new Error('not found'); return {key:k, value:v}; },
    async set(k,v){ localStorage.setItem('ttb_'+k, String(v)); return {key:k, value:v}; },
    async delete(k){ localStorage.removeItem('ttb_'+k); return {key:k, deleted:true}; }
  };
}
document.querySelectorAll('#crossSeg button').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('#crossSeg button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    crossLevel = b.dataset.v;
  });
});

const PART_COLORS = ['#F2A93B','#2B4C9B','#E8821E','#5B8DD9','#8C5E3C','#5B4A8A'];
const loadMsgs = ['מסדר את הקונוסים...','בונה את המערך — זה לוקח עד דקה','שורק לפתיחת האימון...','בודק את לוח הטקטיקה...','עוד רגע, מחלק דקות בין התרגילים...','מחפש תרגילים מענפים אחרים...'];
let lastPlan = null;
let pdfBase64 = null;
let savedKnowledgeText = null;

/* ===== ידע שמור מ-PDF ===== */
function loadSavedKnowledge(){
  try{
    const k = localStorage.getItem('ttb_knowledge');
    if(k){
      const parsed = JSON.parse(k);
      savedKnowledgeText = parsed.text;
      const bar = document.getElementById('savedKnowledgeBar');
      if(bar){
        bar.style.display='flex';
        document.getElementById('savedKnowledgeName').textContent = parsed.name;
      }
    }
  }catch(e){}
}
function useSavedKnowledge(){
  if(savedKnowledgeText){
    document.getElementById('pdfLabel').textContent = '✓ משתמש בידע שמור';
    document.getElementById('pdfLabel').classList.add('loaded');
    pdfBase64 = null; // נשתמש בטקסט ישירות
  }
}
function clearSavedKnowledge(){
  if(!confirm('למחוק את הידע השמור?')) return;
  localStorage.removeItem('ttb_knowledge');
  savedKnowledgeText = null;
  document.getElementById('savedKnowledgeBar').style.display='none';
  if(document.getElementById('pdfLabel').textContent.includes('ידע שמור')){
    document.getElementById('pdfLabel').textContent='לא נבחר קובץ';
    document.getElementById('pdfLabel').classList.remove('loaded');
  }
}

document.getElementById('pdfFile').addEventListener('change', async function(){
  const file = this.files[0]; if(!file) return;
  const label = document.getElementById('pdfLabel');
  const clearBtn = document.getElementById('pdfClearBtn');
  label.textContent = 'טוען וחולץ ידע...';
  try{
    pdfBase64 = await new Promise((res, rej)=>{
      const r = new FileReader();
      r.onload = ()=> res(r.result.split(',')[1]);
      r.onerror = ()=> rej(new Error('שגיאה בקריאת הקובץ'));
      r.readAsDataURL(file);
    });
    label.textContent = '✓ ' + file.name + ' — שולח לניתוח...';
    label.classList.add('loaded');
    clearBtn.style.display = 'inline-block';

    // חלץ ידע מה-PDF ושמור
    if(getKey()){
      try{
        const res = await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:3000,messages:[{role:"user",content:[
            {type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},
            {type:"text",text:"סכם את כל הידע המקצועי, התרגילים, המתודולוגיה, ועקרונות האימון שבמסמך זה בצורה מפורטת. הסיכום ישמש בסיס לבניית מערכי אימון. שמור על כל הפרטים החשובים."}
          ]}]})
        });
        const data = await res.json();
        const text = (data.content||[]).map(c=>c.text||'').join('');
        if(text){
          savedKnowledgeText = text;
          localStorage.setItem('ttb_knowledge', JSON.stringify({name: file.name, text, date: new Date().toLocaleDateString('he-IL')}));
          const bar = document.getElementById('savedKnowledgeBar');
          if(bar){ bar.style.display='flex'; document.getElementById('savedKnowledgeName').textContent = file.name; }
          label.textContent = '✓ ' + file.name + ' — נשמר לשימוש עתידי';
        }
      }catch(e){ console.error('שגיאה בחילוץ ידע',e); }
    }
  }catch(e){
    label.textContent = 'שגיאה בטעינת הקובץ';
    pdfBase64 = null;
  }
});

function clearPdf(){
  pdfBase64 = null;
  document.getElementById('pdfFile').value = '';
  document.getElementById('pdfLabel').textContent = 'לא נבחר קובץ';
  document.getElementById('pdfLabel').classList.remove('loaded');
  document.getElementById('pdfClearBtn').style.display = 'none';
}

async function buildPlan(){
  if(!getKey()){
    showError('צריך להזין מפתח API קודם — לחץ על \\'מפתח API\\' למעלה.');
    document.getElementById('keyPanel').classList.add('open');
    return;
  }
  const sport = document.getElementById('sport').value.trim();
  const topic = document.getElementById('topic').value.trim();
  if(!sport || !topic){
    showError('צריך לפחות ענף ספורט ונושא אימון כדי להתחיל.');
    return;
  }
  const players = document.getElementById('players').value || '12';
  const age = document.getElementById('age').value.trim() || 'לא צוין';
  const duration = document.getElementById('duration').value || '75';
  const equipment = document.getElementById('equipment').value.trim() || 'ציוד בסיסי של הענף';
  const base = document.getElementById('base').value.trim();

  const baseText = base
    ? \`המאמן סיפק בסיס משלו לאימון, וזו הליבה — בנה את האימון סביבו:
"""\${base}"""
שמור על התרגילים/הרעיון של המאמן, פתח אותם, הוסף להם פרוגרסיה (גרסה קלה → מורכבת → תחרותית), והשלם סביבם חימום, תרגילים משלימים וסיום. סמן כל תרגיל שמבוסס על מה שהמאמן כתב עם "from_coach": true.\`
    : 'המאמן לא סיפק בסיס משלו — בנה את האימון כולו בעצמך.';

  const crossText = {
    none: 'אל תשלב תרגילים מענפי ספורט אחרים. כל התרגילים מהענף עצמו.',
    light: 'שלב 1-2 תרגילים שמקורם בענפי ספורט אחרים, מותאמים לענף המבוקש. סמן אותם בשדה origin_sport.',
    heavy: 'שלב באופן משמעותי (3-5 תרגילים) תרגילים שמקורם בענפי ספורט אחרים והתאם אותם בצורה יצירתית לענף ולנושא. סמן כל אחד בשדה origin_sport.'
  }[crossLevel];

  // UI
  document.getElementById('error').style.display='none';
  document.getElementById('result').style.display='none';
  document.getElementById('loading').style.display='block';
  const _pb = document.getElementById('progbar'); if(_pb) _pb.style.width='0';
  document.getElementById('goBtn').disabled = true;
  let mi=0;
  const msgTimer = setInterval(()=>{
    mi=(mi+1)%loadMsgs.length;
    document.getElementById('loadmsg').textContent = loadMsgs[mi];
  }, 2200);

  const prompt = \`אתה מומחה בכיר למדעי האימון ולמתודיקה של אימון בענפי ספורט שונים.
בנה מערך אימון מפורט ומקצועי לפי הנתונים הבאים:

- ענף ספורט: \${sport}
- מספר שחקנים: \${players}
- קבוצת גיל/רמה: \${age}
- משך האימון: \${duration} דקות
- נושא האימון: \${topic}
- ציוד זמין: \${equipment}

הנחיה לשילוב בין-ענפי: \${crossText}

\${baseText}

דרישות מקצועיות:
1. מבנה אימון נכון: חימום (כללי + ספציפי לנושא), חלק עיקרי בנוי בהדרגה (מהפשוט למורכב, מטכני לתחרותי), משחק/יישום תחת לחץ, וסיום/שחרור.
2. סכום הדקות של כל החלקים חייב להיות בדיוק \${duration} דקות.
3. כל תרגיל מותאם למספר השחקנים שצוין ולציוד הזמין בלבד — אל תמציא ציוד שאין.
4. בכל תרגיל: תיאור תמציתי (2-3 משפטים), ארגון על המגרש בשורה אחת, ו-2-3 דגשי אימון קצרים.
5. כתוב הכל בעברית מקצועית, תמציתית וברורה. עדיף קצר ומדויק מארוך ומסורבל.

החזר אך ורק JSON תקין, בלי שום טקסט נוסף, בלי markdown, בלי backticks, במבנה הבא:
{
  "title": "כותרת קצרה למערך",
  "total_minutes": \${duration},
  "parts": [
    {
      "name": "שם החלק",
      "minutes": 0,
      "drills": [
        {
          "name": "שם התרגיל",
          "origin_sport": "שם הענף אם התרגיל הותאם מענף אחר, אחרת null",
          "from_coach": false,
          "description": "תיאור התרגיל",
          "organization": "ארגון: קבוצות, תחנות, סבבים",
          "coaching_points": ["דגש 1", "דגש 2"],
          "equipment": "הציוד הנדרש לתרגיל"
        }
      ]
    }
  ],
  "notes": "הערות למאמן: התאמות אפשריות, נקודות בטיחות, אופציה להקשות/להקל"
}\`;

  try{
    const timeoutPromise = (ms)=> new Promise((_, reject)=>
      setTimeout(()=>reject(new Error('TIMEOUT')), ms));

    function doFetch(){
      return fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getKey(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          stream: true,
          messages: [{ role: "user", content: pdfBase64 ? [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: "חומר הלימוד המצורף הוא מקור ידע עבורך. קרא אותו והשתמש בעקרונות, בתרגילים ובמתודולוגיה שבו כבסיס לבניית המערך הבא.\\n\\n" + prompt }
          ] : savedKnowledgeText ? "להלן ידע מקצועי שנשמר מחומר לימוד:\\n\\n" + savedKnowledgeText + "\\n\\n---\\n\\n" + prompt : prompt }]
        })
      });
    }

    // עד 3 ניסיונות אוטומטיים לפני שמודיעים על כשל
    let response, lastErr = null;
    for(let attempt=1; attempt<=3; attempt++){
      try{
        document.getElementById('loadmsg').textContent =
          attempt===1 ? loadMsgs[0] : 'מנסה שוב (' + attempt + '/3)...';
        response = await Promise.race([ doFetch(), timeoutPromise(120000) ]);
        lastErr = null;
        break;
      }catch(e){
        lastErr = e;
        if(e.message === 'TIMEOUT') break;
        await new Promise(r=>setTimeout(r, 800*attempt));
      }
    }
    if(lastErr) throw lastErr;

    // אם הבקשה נכשלה ברמת ה-HTTP — שולפים את הודעת השגיאה
    if(!response.ok){
      let et = '';
      try{ const ej = await response.json(); et = (ej.error && ej.error.type) || ''; if(ej.error && JSON.stringify(ej.error).includes('credit')) et='credit'; }catch(e){}
      if(et === 'authentication_error'){ throw new Error('המפתח לא תקין או בוטל — בדוק אותו ב-console.anthropic.com'); }
      if(et === 'rate_limit_error' || et === 'overloaded_error'){ throw new Error('עומס זמני — חכה חצי דקה ונסה שוב'); }
      if(et === 'credit'){ throw new Error('אין יתרה בחשבון ה-API — טען קרדיט ב-console.anthropic.com'); }
      throw new Error('API error ' + response.status);
    }

    // קריאת הזרם: צוברים טקסט תוך כדי, ומראים התקדמות
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = '', buffer = '', got = false;
    const bar = document.getElementById('progbar');
    document.getElementById('loadmsg').textContent = 'המנוע כותב את המערך...';
    while(true){
      const { done, value } = await reader.read();
      if(done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\\n');
      buffer = lines.pop();
      for(const line of lines){
        const s = line.trim();
        if(!s.startsWith('data:')) continue;
        const payload = s.slice(5).trim();
        if(payload === '[DONE]') continue;
        try{
          const ev = JSON.parse(payload);
          if(ev.type === 'content_block_delta' && ev.delta && ev.delta.text){
            text += ev.delta.text; got = true;
          }else if(ev.type === 'error'){
            throw new Error((ev.error && ev.error.message) || 'stream error');
          }
        }catch(e){ if(e.message && e.message!=='Unexpected end of JSON input') { /* התעלם מחתיכות חלקיות */ } }
      }
      // מחוון התקדמות לפי אורך הצפוי (~2500 תווים למערך טיפוסי)
      if(bar){ const pct = Math.min(95, Math.round(text.length/4500*100)); bar.style.width = pct + '%'; }
    }
    if(!got || !text.trim()) throw new Error('Empty response');
    if(bar) bar.style.width = '100%';
    const clean = text.replace(/\`\`\`json|\`\`\`/g,'').trim();
    const plan = parseJsonSafe(clean);
    lastPlan = plan;
    lastMeta = {sport, players, age, duration};
    currentId = null;
    renderPlan(plan, lastMeta);
  }catch(err){
    console.error(err);
    if(err.message === 'TIMEOUT'){
      showError('הבקשה לקחה יותר מ-2 דקות ובוטלה. נסה שוב, או קצר את משך האימון.');
    }else{
      showError('משהו השתבש בבניית המערך. נסה שוב — לפעמים ניסיון שני עובד. (פרטים טכניים: ' + (err.message||'') + ')');
    }
  }finally{
    clearInterval(msgTimer);
    document.getElementById('loading').style.display='none';
    document.getElementById('goBtn').disabled = false;
  }
}

function renderPlan(plan, meta, scroll){
  document.getElementById('rTitle').textContent = plan.title || 'מערך אימון';
  document.getElementById('rMeta').textContent =
    \`\${meta.sport} · \${meta.players} שחקנים · \${meta.age} · \${plan.total_minutes || meta.duration} דקות\`;

  // ציר זמן
  const tl = document.getElementById('rTimeline');
  tl.innerHTML='';
  const total = (plan.parts||[]).reduce((s,p)=>s+(p.minutes||0),0) || 1;
  (plan.parts||[]).forEach((p,i)=>{
    const seg = document.createElement('div');
    seg.style.width = ((p.minutes||0)/total*100)+'%';
    seg.style.background = PART_COLORS[i % PART_COLORS.length];
    seg.textContent = \`\${p.minutes}'\`;
    seg.title = p.name;
    tl.appendChild(seg);
  });

  // גוף המערך
  const body = document.getElementById('rBody');
  body.innerHTML='<div class="edit-hint">✏️ אפשר ללחוץ על כל טקסט בתרגיל, לערוך אותו, ואז "שמור לספרייה" — השינויים נשמרים</div>';
  (plan.parts||[]).forEach((p,i)=>{
    const part = document.createElement('div');
    part.className='part';
    part.innerHTML = \`<div class="part-name">
        <span class="dot" style="background:\${PART_COLORS[i % PART_COLORS.length]}"></span>
        \${esc(p.name)}<span class="mins">\${p.minutes} דקות</span></div>\`;
    (p.drills||[]).forEach((d,di)=>{
      const el = document.createElement('div');
      el.className='drill';
      const badge = (d.origin_sport && d.origin_sport !== 'null'
        ? \`<span class="badge">מותאם מ\${esc(d.origin_sport)}</span>\` : '')
        + (d.from_coach ? \`<span class="badge coach">הבסיס שלך</span>\` : '');
      el.innerHTML = \`<button class="drill-del" title="מחק תרגיל">✕</button><h4><span class="ed" data-f="name">\${esc(d.name)}</span> \${badge}</h4>
        <p class="ed" data-f="description">\${esc(d.description||'')}</p>
        <div class="org">📋 <span class="ed" data-f="organization">\${esc(d.organization||'')}</span></div>
        \${(d.coaching_points&&d.coaching_points.length)?\`<ul class="points">\${d.coaching_points.map((c,ci)=>\`<li class="ed" data-f="cp" data-ci="\${ci}">\${esc(c)}</li>\`).join('')}</ul>\`:''}
        <div class="equip">ציוד: <span class="ed" data-f="equipment">\${esc(d.equipment||'')}</span></div>\`;
      el.querySelectorAll('.ed').forEach(node=>{
        node.contentEditable = 'true';
        node.spellcheck = false;
        node.addEventListener('blur', ()=>{
          const f = node.dataset.f;
          const v = node.textContent.trim();
          if(f === 'cp') d.coaching_points[Number(node.dataset.ci)] = v;
          else d[f] = v;
        });
      });
      el.querySelector('.drill-del').onclick = ()=>{
        if(!confirm('למחוק את התרגיל "' + (d.name||'') + '"?')) return;
        p.drills.splice(di,1);
        renderPlan(lastPlan, lastMeta, false);
      };

      // ===== הדמיה טקטית =====
      const courtToggle = document.createElement('button');
      courtToggle.className = 'court-toggle';
      courtToggle.innerHTML = '🏟 הצג מגרש';
      let courtVisible = false;

      const courtSection = document.createElement('div');
      courtSection.className = 'court-section';
      courtSection.style.display = 'none';

      const courtState = {
        sport: lastMeta && lastMeta.sport
          ? ([{id:'basketball',label:'כדורסל'},{id:'football',label:'כדורגל'},{id:'volleyball',label:'כדורעף'},{id:'handball',label:'כדוריד'},{id:'athletics',label:'אתלטיקה'}].find(s=>lastMeta.sport.includes(s.label))||{id:'basketball'}).id
          : 'basketball',
        items: [], selected: null, dragging: null, mode: null // null = בחירת מצב
      };

      // ── בחירת מצב ──
      const modeSelect = document.createElement('div');
      modeSelect.className = 'court-mode-select';
      modeSelect.innerHTML = \`
        <div class="court-mode-title">🏟 כיצד תרצה להמשיך?</div>
        <div class="court-mode-btns">
          <button class="court-mode-btn auto">
            <span class="mode-icon">✨</span>
            <span class="mode-label">הדמיה אוטומטית</span>
            <span class="mode-desc">AI מנתח את התרגיל ומציב ציוד ושחקנים</span>
          </button>
          <button class="court-mode-btn manual">
            <span class="mode-icon">✏️</span>
            <span class="mode-label">בנייה ידנית</span>
            <span class="mode-desc">בנה בעצמך — גרור ציוד לכל מקום שתרצה</span>
          </button>
        </div>\`;

      // ── toolbar (מוסתר עד בחירת מצב) ──
      const toolbar = document.createElement('div');
      toolbar.className = 'court-toolbar';
      toolbar.style.display = 'none';

      // בחירת ענף
      const sportRow = document.createElement('div');
      sportRow.className = 'court-toolbar-row';
      const sportLabel = document.createElement('span');
      sportLabel.textContent = 'מגרש:';
      sportRow.appendChild(sportLabel);
      const SPORTS = [{id:'basketball',label:'כדורסל'},{id:'football',label:'כדורגל'},{id:'volleyball',label:'כדורעף'},{id:'handball',label:'כדוריד'},{id:'athletics',label:'אתלטיקה'}];
      SPORTS.forEach(s=>{
        const b = document.createElement('button');
        b.className='court-sport-btn'+(s.id===courtState.sport?' active':'');
        b.textContent=s.label;
        b.onclick=()=>{
          sportRow.querySelectorAll('.court-sport-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          courtState.sport=s.id;
          redrawCourt();
        };
        sportRow.appendChild(b);
      });
      toolbar.appendChild(sportRow);

      // כלי הוספה (רק במצב ידני)
      const manualTools = document.createElement('div');
      manualTools.className = 'court-toolbar-row';
      const addLabel = document.createElement('span');
      addLabel.textContent = '+ הוסף:';
      manualTools.appendChild(addLabel);
      const ITEMS = [
        {type:'cone',   color:'#F2A93B', label:'קונוס כתום'},
        {type:'cone',   color:'#E74C3C', label:'קונוס אדום'},
        {type:'cone',   color:'#3498DB', label:'קונוס כחול'},
        {type:'hat',    color:'#F2A93B', label:'כיפה צהובה'},
        {type:'hat',    color:'#E74C3C', label:'כיפה אדומה'},
        {type:'hat',    color:'#3498DB', label:'כיפה כחולה'},
        {type:'hoop',   color:'#F2A93B', label:'חישוק צהוב'},
        {type:'hoop',   color:'#E74C3C', label:'חישוק אדום'},
        {type:'player', color:'#2B4C9B', label:'שחקן כחול'},
        {type:'player', color:'#E74C3C', label:'שחקן אדום'},
        {type:'arrow',  color:'#fff',    label:'חץ'},
      ];
      ITEMS.forEach(item=>{
        const b = document.createElement('button');
        b.className='court-add-btn'; b.title=item.label;
        b.style.cssText=\`background:\${item.color};border:2px solid rgba(0,0,0,.2)\`;
        b.innerHTML=item.type==='cone'?'▲':item.type==='hat'?'⬟':item.type==='hoop'?'○':item.type==='player'?'●':'→';
        b.onclick=()=>{ courtState.items.push({...item,x:0.5,y:0.5,id:Date.now()+Math.random(),customLabel:item.label}); redrawCourt(); };
        manualTools.appendChild(b);
      });
      toolbar.appendChild(manualTools);

      // שורת פעולות
      const actRow = document.createElement('div');
      actRow.className = 'court-toolbar-row';
      const genBtn = document.createElement('button');
      genBtn.className='court-action-btn primary'; genBtn.innerHTML='✨ צור הדמיה מחדש';
      genBtn.style.display='none';
      genBtn.onclick=()=>generateTacticalLayout(d,courtState,redrawCourt,genBtn);
      actRow.appendChild(genBtn);
      const fsBtn = document.createElement('button');
      fsBtn.className='court-action-btn'; fsBtn.innerHTML='⛶ מסך מלא';
      fsBtn.onclick=()=> openCourtFullscreen(d, courtState, redrawCourt);
      actRow.appendChild(fsBtn);
      const clearBtn2 = document.createElement('button');
      clearBtn2.className='court-action-btn'; clearBtn2.textContent='נקה מגרש';
      clearBtn2.onclick=()=>{ courtState.items=[]; courtState.selected=null; redrawCourt(); };
      actRow.appendChild(clearBtn2);
      const switchBtn = document.createElement('button');
      switchBtn.className='court-action-btn'; switchBtn.textContent='החלף מצב';
      switchBtn.onclick=()=>{
        courtState.mode=null; courtState.items=[]; courtState.selected=null;
        modeSelect.style.display='block'; toolbar.style.display='none';
        canvasWrap.style.display='none'; itemPopup.style.display='none';
      };
      actRow.appendChild(switchBtn);
      toolbar.appendChild(actRow);

      // ── canvas ──
      const canvasWrap = document.createElement('div');
      canvasWrap.className='court-canvas-wrap';
      canvasWrap.style.display='none';
      const canvas = document.createElement('canvas');
      canvas.width=520; canvas.height=310; canvas.style.cursor='grab';
      canvasWrap.appendChild(canvas);

      // ── popup עריכת פריט ──
      const itemPopup = document.createElement('div');
      itemPopup.className='item-popup'; itemPopup.style.display='none';
      itemPopup.innerHTML=\`<div class="item-popup-inner">
        <label>תיאור הציוד:</label>
        <input type="text" id="ipLabel_\${di}" placeholder="לדוגמה: כיפה צהובה — סקוואט">
        <div class="item-popup-actions">
          <button class="ip-save">שמור</button>
          <button class="ip-del">מחק פריט</button>
          <button class="ip-close">✕</button>
        </div>
      </div>\`;
      const ipInput = itemPopup.querySelector('input');
      itemPopup.querySelector('.ip-save').onclick=()=>{
        if(courtState.selected){ const it=courtState.items.find(x=>x.id===courtState.selected); if(it){it.customLabel=ipInput.value;redrawCourt();} }
        itemPopup.style.display='none';
      };
      itemPopup.querySelector('.ip-del').onclick=()=>{
        courtState.items=courtState.items.filter(x=>x.id!==courtState.selected);
        courtState.selected=null; itemPopup.style.display='none'; redrawCourt();
      };
      itemPopup.querySelector('.ip-close').onclick=()=>{ itemPopup.style.display='none'; };

      // ── בחירת מצב: handlers ──
      modeSelect.querySelector('.auto').onclick = async ()=>{
        courtState.mode='auto';
        modeSelect.style.display='none';
        toolbar.style.display='flex';
        canvasWrap.style.display='flex';
        manualTools.style.display='none';
        genBtn.style.display='inline-block';
        redrawCourt();
        await generateTacticalLayout(d, courtState, redrawCourt, genBtn);
      };
      modeSelect.querySelector('.manual').onclick = ()=>{
        courtState.mode='manual';
        modeSelect.style.display='none';
        toolbar.style.display='flex';
        canvasWrap.style.display='flex';
        manualTools.style.display='flex';
        genBtn.style.display='none';
        redrawCourt();
      };

      courtSection.appendChild(modeSelect);
      courtSection.appendChild(toolbar);
      courtSection.appendChild(canvasWrap);
      courtSection.appendChild(itemPopup);

      // ── ציור ──
      const logoImg = new Image();
      const logoSrc = document.querySelector('.logo');
      if(logoSrc) logoImg.src = logoSrc.src;
      function redrawCourt(){ drawCourtFull(canvas, courtState, logoImg); }

      // ── drag & drop ──
      function getPos(e){ const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e; return{x:(t.clientX-r.left)/r.width,y:(t.clientY-r.top)/r.height}; }
      function findItem(px,py){ const W=canvas.width,H=canvas.height; return[...courtState.items].reverse().find(it=>{const dx=(it.x-px)*W,dy=(it.y-py)*H;return Math.sqrt(dx*dx+dy*dy)<18;}); }
      canvas.addEventListener('mousedown',e=>{ const p=getPos(e),it=findItem(p.x,p.y); if(it){courtState.dragging=it;courtState.selected=it.id;canvas.style.cursor='grabbing';}else{courtState.selected=null;itemPopup.style.display='none';} redrawCourt(); });
      canvas.addEventListener('mousemove',e=>{ if(!courtState.dragging)return; const p=getPos(e); courtState.dragging.x=Math.max(0.02,Math.min(0.98,p.x)); courtState.dragging.y=Math.max(0.02,Math.min(0.98,p.y)); redrawCourt(); });
      canvas.addEventListener('mouseup',()=>{ courtState.dragging=null; canvas.style.cursor='grab'; });
      canvas.addEventListener('click',e=>{ const p=getPos(e),it=findItem(p.x,p.y); if(it){courtState.selected=it.id;ipInput.value=it.customLabel||it.label||'';itemPopup.style.display='block';redrawCourt();} });
      canvas.addEventListener('touchstart',e=>{ e.preventDefault(); const p=getPos(e),it=findItem(p.x,p.y); if(it){courtState.dragging=it;courtState.selected=it.id;redrawCourt();} },{passive:false});
      canvas.addEventListener('touchmove',e=>{ e.preventDefault(); if(!courtState.dragging)return; const p=getPos(e); courtState.dragging.x=Math.max(0.02,Math.min(0.98,p.x)); courtState.dragging.y=Math.max(0.02,Math.min(0.98,p.y)); redrawCourt(); },{passive:false});
      canvas.addEventListener('touchend',()=>{ courtState.dragging=null; });

      courtToggle.onclick=()=>{
        courtVisible=!courtVisible;
        courtSection.style.display=courtVisible?'block':'none';
        courtToggle.innerHTML=courtVisible?'🏟 הסתר מגרש':'🏟 הצג מגרש';
      };

      el.appendChild(courtToggle);
      el.appendChild(courtSection);

      const photoBtn = document.createElement('button');
      photoBtn.className = 'analyze-photo-btn';
      photoBtn.innerHTML = '📸 נתח תרגיל מצולם';
      photoBtn.onclick = ()=> openPhotoModal(p);
      el.appendChild(photoBtn);

      part.appendChild(el);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'add-drill';
    addBtn.textContent = '+ הוסף תרגיל משלך';
    addBtn.onclick = ()=> openDrillModal(p);
    part.appendChild(addBtn);
    body.appendChild(part);
  });
  if(plan.notes){
    const n = document.createElement('div');
    n.className='notes';
    n.innerHTML = \`<strong>הערות למאמן:</strong> \${esc(plan.notes)}\`;
    body.appendChild(n);
  }
  document.getElementById('result').style.display='block';
  if(scroll !== false) document.getElementById('result').scrollIntoView({behavior:'smooth'});
}

function copyPlan(){
  if(!lastPlan) return;
  let t = lastPlan.title + '\\n\\n';
  (lastPlan.parts||[]).forEach(p=>{
    t += \`== \${p.name} (\${p.minutes} דק') ==\\n\`;
    (p.drills||[]).forEach(d=>{
      t += \`\\n• \${d.name}\${d.origin_sport && d.origin_sport!=='null' ? ' (מותאם מ'+d.origin_sport+')':''}\\n\`;
      t += \`\${d.description||''}\\n\`;
      if(d.organization) t += \`ארגון: \${d.organization}\\n\`;
      (d.coaching_points||[]).forEach(c=>t+=\`- \${c}\\n\`);
    });
    t += '\\n';
  });
  if(lastPlan.notes) t += 'הערות: ' + lastPlan.notes;
  navigator.clipboard.writeText(t).then(()=>{
    const b = document.getElementById('copyBtn');
    b.textContent = 'הועתק ✓';
    setTimeout(()=>b.textContent='העתק כטקסט', 2000);
  });
}

function exportWord(){
  const plan = lastPlan || (_modalPlanData && _modalPlanData.plan);
  const meta = lastMeta || (_modalPlanData && _modalPlanData.meta) || {};
  if(!plan){ alert('אין מערך לייצוא'); return; }

  let html = \`<!DOCTYPE html><html dir="rtl" lang="he">
<head><meta charset='utf-8'><title>\${esc(plan.title||'מערך אימון')}</title>
<style>
  body{font-family:Arial,sans-serif;direction:rtl;font-size:14px;color:#1F2840;max-width:800px;margin:20px auto;padding:20px;line-height:1.6}
  h1{font-size:24px;color:#2B4C9B;border-bottom:3px solid #F2A93B;padding-bottom:8px}
  h2{font-size:17px;color:#2B4C9B;margin-top:20px;border-right:4px solid #F2A93B;padding-right:8px}
  h3{font-size:14px;color:#1F2840;margin-top:12px}
  .drill{border-right:3px solid #F2A93B;padding-right:10px;margin:10px 0;background:#FFF9F3;padding:10px}
  .label{font-weight:bold;color:#6B7280;font-size:12px}
  ul{margin:4px 0;padding-right:20px}
  li{color:#2B4C9B;margin-bottom:3px}
  .meta{color:#6B7280;margin-bottom:16px;font-size:13px}
  .brand{font-size:11px;color:#6B7280;margin-top:6px}
  @media print{body{margin:0;padding:10px}}
</style></head><body>
<h1>\${esc(plan.title||'מערך אימון')}</h1>
<div class="meta">\${esc(meta.sport||'')} · \${meta.players||''} שחקנים · \${esc(meta.age||'')} · \${plan.total_minutes||''} דקות</div>
<div class="brand">TRAIN WITH THE BRAIN · AMONTY Performance &amp; Recovery</div><hr>\`;

  (plan.parts||[]).forEach(p=>{
    html += \`<h2>\${esc(p.name||'')} — \${p.minutes||''} דקות</h2>\`;
    (p.drills||[]).forEach(d=>{
      html += \`<div class="drill"><h3>\${esc(d.name||'')}\${d.from_coach?' ★':''}</h3>\`;
      if(d.description) html += \`<p>\${esc(d.description)}</p>\`;
      if(d.organization) html += \`<p><span class="label">ארגון: </span>\${esc(d.organization)}</p>\`;
      if(d.coaching_points&&d.coaching_points.length){
        html += \`<p class="label">דגשי אימון:</p><ul>\`;
        d.coaching_points.forEach(c=>{ html+=\`<li>\${esc(c)}</li>\`; });
        html += \`</ul>\`;
      }
      if(d.equipment) html += \`<p><span class="label">ציוד: </span>\${esc(d.equipment)}</p>\`;
      html += \`</div>\`;
    });
  });
  if(plan.notes) html += \`<p><b>הערות:</b> \${esc(plan.notes)}</p>\`;
  html += \`<script>window.onload=function(){window.print()}<\\/script></body></html>\`;

  const w = window.open('','_blank');
  if(w){ w.document.write(html); w.document.close(); }
  else{ alert('אפשר את החלונות הקופצים בדפדפן ונסה שוב'); }
}

function exportExcel(){
  if(!lastPlan) return;
  const meta = lastMeta || {};
  const cx = v=>\`<Data ss:Type="String">\${String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</Data>\`;
  const cell = (v,bold)=>\`<Cell\${bold?' ss:StyleID="hdr"':''}><\${cx(v)}</Cell>\`;
  const row = (...cells)=>\`<Row>\${cells.map((c,i)=>typeof c==='object'?\`<Cell\${c.bold?' ss:StyleID="hdr"':''}><\${cx(c.v)}</Cell>\`:\`<Cell><\${cx(c)}</Cell>\`).join('')}</Row>\\n\`;

  let rows = '';
  rows += \`<Row><Cell ss:StyleID="hdr"><Data ss:Type="String">\${(lastPlan.title||'מערך אימון').replace(/&/g,'&amp;')}</Data></Cell></Row>\\n\`;
  rows += \`<Row><Cell><Data ss:Type="String">\${esc(meta.sport||'')} · \${meta.players||''} שחקנים · \${esc(meta.age||'')} · \${lastPlan.total_minutes||meta.duration||''} דקות</Data></Cell></Row>\\n\`;
  rows += \`<Row><Cell><Data ss:Type="String">TRAIN WITH THE BRAIN · AMONTY</Data></Cell></Row>\\n<Row/>\\n\`;
  rows += \`<Row>\${['חלק','תרגיל','תיאור','ארגון','דגשי אימון','ציוד'].map(h=>\`<Cell ss:StyleID="hdr"><Data ss:Type="String">\${h}</Data></Cell>\`).join('')}</Row>\\n\`;

  (lastPlan.parts||[]).forEach(p=>{
    (p.drills||[]).forEach((d,i)=>{
      const vals = [
        i===0?\`\${p.name} (\${p.minutes} דק')\`:'',
        d.name+(d.from_coach?' ★':''),
        d.description||'',
        d.organization||'',
        (d.coaching_points||[]).join(' | '),
        d.equipment||''
      ];
      rows += \`<Row>\${vals.map(v=>\`<Cell><Data ss:Type="String">\${String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</Data></Cell>\`).join('')}</Row>\\n\`;
    });
  });

  const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles><Style ss:ID="hdr"><Font ss:Bold="1" ss:Color="#2B4C9B"/></Style></Styles>
<Worksheet ss:Name="מערך אימון"><Table>\${rows}</Table></Worksheet></Workbook>\`;

  const blob = new Blob(['\\ufeff'+xml], {type:'application/vnd.ms-excel'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=(lastPlan.title||'מערך-אימון')+'.xls';
  a.click(); URL.revokeObjectURL(url);
}

let _modalPart = null;
function openDrillModal(part){
  _modalPart = part;
  document.getElementById('dm_name').value = '';
  document.getElementById('dm_desc').value = '';
  document.getElementById('dm_org').value = '';
  document.getElementById('dm_points').value = '';
  document.getElementById('dm_equip').value = '';
  document.getElementById('drillModal').classList.add('open');
  setTimeout(()=>document.getElementById('dm_name').focus(), 100);
}
function closeDrillModal(){
  document.getElementById('drillModal').classList.remove('open');
  _modalPart = null;
}
function confirmAddDrill(){
  const name = document.getElementById('dm_name').value.trim();
  const desc = document.getElementById('dm_desc').value.trim();
  if(!name){ alert('יש להזין שם לתרגיל'); return; }
  const pointsRaw = document.getElementById('dm_points').value.trim();
  const points = pointsRaw ? pointsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [];
  _modalPart.drills = _modalPart.drills || [];
  _modalPart.drills.push({
    name,
    from_coach: true,
    description: desc,
    organization: document.getElementById('dm_org').value.trim(),
    coaching_points: points,
    equipment: document.getElementById('dm_equip').value.trim()
  });
  closeDrillModal();
  renderPlan(lastPlan, lastMeta, false);
}
// סגירת מודל בלחיצה על הרקע
document.getElementById('drillModal').addEventListener('click', function(e){
  if(e.target === this) closeDrillModal();
});

let _photoBase64 = null, _photoTargetPart = null, _photoAnalyzedDrill = null;

function openPhotoModal(part){
  _photoTargetPart = part;
  _photoBase64 = null;
  _photoAnalyzedDrill = null;
  document.getElementById('photoFileInput').value='';
  document.getElementById('photoFileName').textContent='לא נבחרה תמונה';
  document.getElementById('photoPreview').style.display='none';
  document.getElementById('photoContext').value='';
  document.getElementById('photoStep1').style.display='block';
  document.getElementById('photoStep2').style.display='none';
  document.getElementById('photoModal').classList.add('open');
}
function closePhotoModal(){
  document.getElementById('photoModal').classList.remove('open');
}

document.getElementById('photoFileInput').addEventListener('change', function(){
  const file = this.files[0]; if(!file) return;
  document.getElementById('photoFileName').textContent = file.name;
  const reader = new FileReader();
  reader.onload = e=>{
    const src = e.target.result;
    const preview = document.getElementById('photoPreview');
    preview.src = src; preview.style.display='block';
    _photoBase64 = src.split(',')[1];
  };
  reader.readAsDataURL(file);
});

async function analyzePhoto(){
  if(!_photoBase64){ alert('יש לבחור תמונה קודם'); return; }
  if(!getKey()){ alert('צריך מפתח API'); return; }
  const btn = document.querySelector('#photoStep1 .btn-add');
  const orig = btn.textContent;
  btn.disabled=true; btn.textContent='⏳ מנתח...';
  const context = document.getElementById('photoContext').value.trim();
  const prompt = \`אתה מאמן ספורט מקצועי. נתח את התמונה המצורפת וזהה את התרגיל שבה.
\${context ? 'הקשר נוסף: '+context : ''}

החזר JSON תקין בלבד (ללא backticks):
{
  "name": "שם התרגיל",
  "description": "תיאור מפורט של מה שרואים בתמונה ואיך התרגיל עובד",
  "organization": "איך השחקנים מסודרים",
  "coaching_points": ["דגש 1","דגש 2","דגש 3"],
  "equipment": "ציוד שנראה בתמונה",
  "sport": "ענף הספורט",
  "notes": "הערות נוספות שנראות חשובות"
}\`;

  try{
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1200,messages:[{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:_photoBase64}},
        {type:"text",text:prompt}
      ]}]})
    });
    const data = await res.json();
    const text = (data.content||[]).map(c=>c.text||'').join('').replace(/\`\`\`json|\`\`\`/g,'').trim();
    _photoAnalyzedDrill = JSON.parse(text);
    showPhotoResult(_photoAnalyzedDrill);
  }catch(e){
    alert('שגיאה בניתוח — נסה שוב'); console.error(e);
  }finally{
    btn.disabled=false; btn.textContent=orig;
  }
}

function showPhotoResult(d){
  const pts = (d.coaching_points||[]).map(p=>\`<li>\${esc(p)}</li>\`).join('');
  document.getElementById('photoResult').innerHTML = \`
    <div class="photo-drill-card">
      <h4>🏅 \${esc(d.name||'תרגיל מזוהה')}</h4>
      \${d.sport?\`<div class="pdc-row"><span class="pdc-label">ענף</span>\${esc(d.sport)}</div>\`:''}
      <div class="pdc-row"><span class="pdc-label">תיאור</span>\${esc(d.description||'')}</div>
      \${d.organization?\`<div class="pdc-row"><span class="pdc-label">ארגון</span>\${esc(d.organization)}</div>\`:''}
      \${pts?\`<div class="pdc-row"><span class="pdc-label">דגשי אימון</span><ul>\${pts}</ul></div>\`:''}
      \${d.equipment?\`<div class="pdc-row"><span class="pdc-label">ציוד</span>\${esc(d.equipment)}</div>\`:''}
      \${d.notes?\`<div class="pdc-row"><span class="pdc-label">הערות</span>\${esc(d.notes)}</div>\`:''}
    </div>\`;
  document.getElementById('photoStep1').style.display='none';
  document.getElementById('photoStep2').style.display='block';
}

function savePhotodrillToLibrary(){
  if(!_photoAnalyzedDrill) return;
  const d = {
    ..._photoAnalyzedDrill,
    from_photo: true,
    id: Date.now()
  };
  // שמור לספרייה
  const libs = JSON.parse(localStorage.getItem('drillLib')||'[]');
  libs.push(d);
  localStorage.setItem('drillLib', JSON.stringify(libs));
  // אם יש חלק פתוח — הוסף גם שם
  if(_photoTargetPart){
    _photoTargetPart.drills = _photoTargetPart.drills||[];
    _photoTargetPart.drills.push({...d, from_coach:true});
    renderPlan(lastPlan, lastMeta, false);
  }
  closePhotoModal();
  alert('התרגיל נשמר לספרייה ✓');
}

document.getElementById('photoModal').addEventListener('click',function(e){ if(e.target===this) closePhotoModal(); });

function openCourtFullscreen(drill, state, redrawSmall){
  if(!state.mode){ alert('בחר מצב הדמיה קודם'); return; }
  _fsState = state; _fsRedraw = redrawSmall; _fsDrill = drill;

  const overlay = document.getElementById('courtFullscreen');
  document.getElementById('courtFsTitle').textContent = '🏟 ' + (drill.name||'הדמיה טקטית');
  overlay.classList.add('open');

  // בנה toolbar
  const tb = document.getElementById('courtFsToolbar');
  tb.innerHTML = '';
  const sp = document.createElement('span'); sp.textContent='מגרש:'; tb.appendChild(sp);
  const SPORTS=[{id:'basketball',label:'כדורסל'},{id:'football',label:'כדורגל'},{id:'volleyball',label:'כדורעף'},{id:'handball',label:'כדוריד'},{id:'athletics',label:'אתלטיקה'}];
  SPORTS.forEach(s=>{
    const b=document.createElement('button');
    b.className='court-sport-btn'+(s.id===state.sport?' active':'');
    b.textContent=s.label;
    b.style.cssText='padding:4px 10px;border:1.5px solid rgba(255,255,255,.3);border-radius:20px;background:rgba(255,255,255,.08);font-family:Heebo,sans-serif;font-size:12px;cursor:pointer;color:#fff';
    if(s.id===state.sport) b.style.background='var(--cone)';
    b.onclick=()=>{
      tb.querySelectorAll('.court-sport-btn').forEach(x=>{x.style.background='rgba(255,255,255,.08)';});
      b.style.background='var(--cone)';
      state.sport=s.id; fsRedraw();
    };
    tb.appendChild(b);
  });

  if(state.mode==='manual'){
    const sep=document.createElement('div'); sep.style.cssText='width:1px;height:20px;background:rgba(255,255,255,.2);margin:0 4px'; tb.appendChild(sep);
    const addSp=document.createElement('span'); addSp.textContent='+ הוסף:'; tb.appendChild(addSp);
    const ITEMS=[{type:'cone',color:'#F2A93B',label:'קונוס כתום'},{type:'cone',color:'#E74C3C',label:'קונוס אדום'},{type:'cone',color:'#3498DB',label:'קונוס כחול'},{type:'hat',color:'#F2A93B',label:'כיפה צהובה'},{type:'hat',color:'#E74C3C',label:'כיפה אדומה'},{type:'hat',color:'#3498DB',label:'כיפה כחולה'},{type:'hoop',color:'#F2A93B',label:'חישוק צהוב'},{type:'hoop',color:'#E74C3C',label:'חישוק אדום'},{type:'player',color:'#2B4C9B',label:'שחקן כחול'},{type:'player',color:'#E74C3C',label:'שחקן אדום'},{type:'arrow',color:'#fff',label:'חץ'}];
    ITEMS.forEach(item=>{
      const b=document.createElement('button');
      b.className='court-add-btn'; b.title=item.label;
      b.style.cssText=\`background:\${item.color};border:2px solid rgba(0,0,0,.2);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px;color:#fff;font-weight:700\`;
      b.innerHTML=item.type==='cone'?'▲':item.type==='hat'?'⬟':item.type==='hoop'?'○':item.type==='player'?'●':'→';
      b.onclick=()=>{ state.items.push({...item,x:0.5,y:0.5,id:Date.now()+Math.random(),customLabel:item.label}); fsRedraw(); redrawSmall(); };
      tb.appendChild(b);
    });
  }

  // כפתור צור מחדש
  const genBtnFs = document.getElementById('courtFsGenBtn');
  genBtnFs.style.display = state.mode==='auto' ? 'inline-block' : 'none';
  genBtnFs.onclick = ()=> generateTacticalLayout(drill, state, ()=>{ fsRedraw(); redrawSmall(); }, genBtnFs);

  // canvas
  const canvas = document.getElementById('courtFsCanvas');
  const body = canvas.parentElement;
  setTimeout(()=>{
    canvas.width = body.clientWidth - 24;
    canvas.height = body.clientHeight - 24;
    fsRedraw();
  }, 30);

  // popup
  const popup = document.getElementById('courtFsPopup');
  const fsInput = document.getElementById('courtFsInput');
  document.getElementById('courtFsSave').onclick=()=>{
    if(state.selected){ const it=state.items.find(x=>x.id===state.selected); if(it){ it.customLabel=fsInput.value; fsRedraw(); redrawSmall(); } }
    popup.style.display='none';
  };
  document.getElementById('courtFsDel').onclick=()=>{
    state.items=state.items.filter(x=>x.id!==state.selected);
    state.selected=null; popup.style.display='none'; fsRedraw(); redrawSmall();
  };
  document.getElementById('courtFsClose2').onclick=()=>{ popup.style.display='none'; };

  // drag
  const logoImg=new Image(); const ls=document.querySelector('.logo'); if(ls)logoImg.src=ls.src;
  function fsRedraw(){ drawCourtFull(canvas, state, logoImg); }
  function getPos(e){ const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e; return{x:(t.clientX-r.left)/r.width,y:(t.clientY-r.top)/r.height}; }
  function findIt(px,py){ const W=canvas.width,H=canvas.height; return[...state.items].reverse().find(it=>{const dx=(it.x-px)*W,dy=(it.y-py)*H;return Math.sqrt(dx*dx+dy*dy)<22;}); }

  canvas.onmousedown=e=>{ const p=getPos(e),it=findIt(p.x,p.y); if(it){state.dragging=it;state.selected=it.id;canvas.style.cursor='grabbing';}else{state.selected=null;popup.style.display='none';} fsRedraw(); };
  canvas.onmousemove=e=>{ if(!state.dragging)return; const p=getPos(e); state.dragging.x=Math.max(0.02,Math.min(0.98,p.x)); state.dragging.y=Math.max(0.02,Math.min(0.98,p.y)); fsRedraw(); };
  canvas.onmouseup=()=>{ state.dragging=null; canvas.style.cursor='grab'; redrawSmall(); };
  canvas.onclick=e=>{ const p=getPos(e),it=findIt(p.x,p.y); if(it){state.selected=it.id;fsInput.value=it.customLabel||it.label||'';popup.style.display='block';fsRedraw();} };
  canvas.ontouchstart=e=>{ e.preventDefault(); const p=getPos(e),it=findIt(p.x,p.y); if(it){state.dragging=it;state.selected=it.id;fsRedraw();} };
  canvas.ontouchmove=e=>{ e.preventDefault(); if(!state.dragging)return; const p=getPos(e); state.dragging.x=Math.max(0.02,Math.min(0.98,p.x)); state.dragging.y=Math.max(0.02,Math.min(0.98,p.y)); fsRedraw(); };
  canvas.ontouchend=()=>{ state.dragging=null; redrawSmall(); };

  window.addEventListener('resize', ()=>{ canvas.width=body.clientWidth-24; canvas.height=body.clientHeight-24; fsRedraw(); });
}

function closeCourtFullscreen(){
  document.getElementById('courtFullscreen').classList.remove('open');
  if(_fsRedraw) _fsRedraw();
  _fsState=null; _fsRedraw=null; _fsDrill=null;
}

function drawCourtFull(canvas, state, logoImg){
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  // ── צייר מגרש בסיסי ──
  const courts = {
    basketball: ()=>{
      ctx.fillStyle='#C8A96E'; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#fff'; ctx.lineWidth=2;
      ctx.strokeRect(18,18,W-36,H-36);
      ctx.beginPath(); ctx.moveTo(W/2,18); ctx.lineTo(W/2,H-18); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2,H/2,38,0,Math.PI*2); ctx.stroke();
      ctx.strokeRect(18,H/2-60,105,120);
      ctx.strokeRect(W-123,H/2-60,105,120);
      ctx.beginPath(); ctx.arc(75,H/2,108,Math.PI*0.55,Math.PI*1.45,true); ctx.stroke();
      ctx.beginPath(); ctx.arc(W-75,H/2,108,Math.PI*0.55,Math.PI*1.45,false); ctx.stroke();
      // לוגו AMONTY בעיגול האמצע
      if(logoImg && logoImg.complete && logoImg.naturalWidth>0){
        ctx.save();
        ctx.beginPath(); ctx.arc(W/2,H/2,36,0,Math.PI*2); ctx.clip();
        ctx.globalAlpha=0.35;
        ctx.drawImage(logoImg,W/2-36,H/2-36,72,72);
        ctx.restore();
      }
      // סלוגן לאורך קו אמצע
      ctx.save(); ctx.translate(W/2,H/2); ctx.rotate(-Math.PI/2);
      ctx.font='bold 9px Heebo,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.45)';
      ctx.textAlign='center'; ctx.fillText('TRAIN WITH THE BRAIN · AMONTY',0,-46);
      ctx.restore();
    },
    football: ()=>{
      ctx.fillStyle='#3a7d44'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#357340';
      for(let i=0;i<5;i++){ if(i%2===0) ctx.fillRect(0,i*(H/5),W,H/5); }
      ctx.strokeStyle='#fff'; ctx.lineWidth=2;
      ctx.strokeRect(18,18,W-36,H-36);
      ctx.beginPath(); ctx.moveTo(W/2,18); ctx.lineTo(W/2,H-18); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2,H/2,42,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(W/2,H/2,3,0,Math.PI*2); ctx.fill();
      ctx.strokeRect(18,H/2-50,90,100); ctx.strokeRect(18,H/2-25,38,50);
      ctx.strokeRect(W-108,H/2-50,90,100); ctx.strokeRect(W-56,H/2-25,38,50);
      ctx.lineWidth=3;
      ctx.strokeRect(10,H/2-20,10,40); ctx.strokeRect(W-20,H/2-20,10,40);
      // פרסומת לאורך קו חוץ עליון
      ctx.fillStyle='rgba(43,76,155,0.55)';
      ctx.fillRect(18,18,W-36,16);
      ctx.font='bold 9px Heebo,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.textAlign='center'; ctx.fillText('TRAIN WITH THE BRAIN · AMONTY · Performance & Recovery',W/2,30);
      // לוגו קטן
      if(logoImg && logoImg.complete && logoImg.naturalWidth>0){
        ctx.save(); ctx.globalAlpha=0.3;
        ctx.beginPath(); ctx.arc(W/2,H/2,30,0,Math.PI*2); ctx.clip();
        ctx.drawImage(logoImg,W/2-30,H/2-30,60,60);
        ctx.restore();
      }
    },
    volleyball: ()=>{
      ctx.fillStyle='#D4A96A'; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#fff'; ctx.lineWidth=2;
      ctx.strokeRect(18,18,W-36,H-36);
      ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(W/2,18); ctx.lineTo(W/2,H-18); ctx.stroke();
      ctx.lineWidth=1.5; ctx.setLineDash([6,4]);
      ctx.beginPath(); ctx.moveTo(W/2-85,18); ctx.lineTo(W/2-85,H-18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W/2+85,18); ctx.lineTo(W/2+85,H-18); ctx.stroke();
      ctx.setLineDash([]);
      // לוגו בשני צידי הרשת
      if(logoImg && logoImg.complete && logoImg.naturalWidth>0){
        ctx.save(); ctx.globalAlpha=0.25;
        ctx.drawImage(logoImg,W/4-24,H/2-24,48,48);
        ctx.drawImage(logoImg,3*W/4-24,H/2-24,48,48);
        ctx.restore();
      }
      ctx.font='bold 8.5px Heebo,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.5)';
      ctx.textAlign='center'; ctx.fillText('AMONTY · TRAIN WITH THE BRAIN',W/2,H-6);
    },
    handball: ()=>{
      ctx.fillStyle='#6B8E6B'; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#fff'; ctx.lineWidth=2;
      ctx.strokeRect(18,18,W-36,H-36);
      ctx.beginPath(); ctx.moveTo(W/2,18); ctx.lineTo(W/2,H-18); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2,H/2,36,0,Math.PI*2); ctx.stroke();
      ctx.strokeRect(18,H/2-28,7,56); ctx.strokeRect(W-25,H/2-28,7,56);
      ctx.beginPath(); ctx.arc(18,H/2,75,Math.PI*0.5,Math.PI*1.5,true); ctx.stroke();
      ctx.beginPath(); ctx.arc(W-18,H/2,75,Math.PI*0.5,Math.PI*1.5,false); ctx.stroke();
      ctx.setLineDash([5,4]);
      ctx.beginPath(); ctx.arc(18,H/2,112,Math.PI*0.45,Math.PI*1.55,true); ctx.stroke();
      ctx.beginPath(); ctx.arc(W-18,H/2,112,Math.PI*0.45,Math.PI*1.55,false); ctx.stroke();
      ctx.setLineDash([]);
      if(logoImg && logoImg.complete && logoImg.naturalWidth>0){
        ctx.save(); ctx.globalAlpha=0.28;
        ctx.beginPath(); ctx.arc(W/2,H/2,30,0,Math.PI*2); ctx.clip();
        ctx.drawImage(logoImg,W/2-30,H/2-30,60,60);
        ctx.restore();
      }
      ctx.font='bold 8.5px Heebo,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.5)';
      ctx.textAlign='center'; ctx.fillText('AMONTY · TRAIN WITH THE BRAIN',W/2,H-6);
    },
    athletics: ()=>{
      ctx.fillStyle='#2D5A1B'; ctx.fillRect(0,0,W,H);
      const tx=28,ty=28,tw=W-56,th=H-56,r=th/2;
      ctx.fillStyle='#C0392B';
      ctx.beginPath();
      ctx.moveTo(tx+r,ty); ctx.lineTo(tx+tw-r,ty);
      ctx.arc(tx+tw-r,ty+th/2,th/2,Math.PI*1.5,Math.PI*0.5);
      ctx.lineTo(tx+r,ty+th);
      ctx.arc(tx+r,ty+th/2,th/2,Math.PI*0.5,Math.PI*1.5);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle='#3a7d44';
      const iw=tw-th*0.85, ih=th-28;
      ctx.fillRect(tx+th/2*0.85,ty+14,iw,ih);
      // לוגו על הדשא הפנימי
      if(logoImg && logoImg.complete && logoImg.naturalWidth>0){
        ctx.save(); ctx.globalAlpha=0.28;
        ctx.drawImage(logoImg,W/2-28,H/2-28,56,56);
        ctx.restore();
      }
      ctx.strokeStyle='#fff'; ctx.lineWidth=1.2;
      for(let i=1;i<8;i++){
        const off=i*((th/2)/8);
        ctx.beginPath();
        ctx.moveTo(tx+r,ty+off); ctx.lineTo(tx+tw-r,ty+off);
        ctx.arc(tx+tw-r,ty+th/2,th/2-off,Math.PI*1.5,Math.PI*0.5);
        ctx.moveTo(tx+tw-r,ty+th-off); ctx.lineTo(tx+r,ty+th-off);
        ctx.arc(tx+r,ty+th/2,th/2-off,Math.PI*0.5,Math.PI*1.5);
        ctx.stroke();
      }
      ctx.lineWidth=2; ctx.strokeStyle='#fff';
      ctx.beginPath(); ctx.moveTo(tx+r,ty); ctx.lineTo(tx+r,ty+th); ctx.stroke();
      ctx.font='bold 8.5px Heebo,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.textAlign='center'; ctx.fillText('AMONTY · אתלטיקה',W/2,H-6);
    }
  };
  if(courts[state.sport]) courts[state.sport]();

  // ── צייר פריטים ──
  state.items.forEach(it=>{
    const x=it.x*W, y=it.y*H;
    const sel = it.id===state.selected;
    ctx.save();
    if(sel){
      ctx.shadowColor='#fff'; ctx.shadowBlur=10;
    }
    if(it.type==='cone'){
      ctx.fillStyle=it.color;
      ctx.beginPath();
      ctx.moveTo(x,y-12); ctx.lineTo(x-9,y+8); ctx.lineTo(x+9,y+8);
      ctx.closePath(); ctx.fill();
      if(sel){ ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke(); }
    } else if(it.type==='hat'){
      ctx.fillStyle=it.color;
      ctx.beginPath(); ctx.arc(x,y,9,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.ellipse(x,y+9,9,4,0,0,Math.PI*2); ctx.fill();
      if(sel){ ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(x,y,9,0,Math.PI*2); ctx.stroke(); }
    } else if(it.type==='hoop'){
      ctx.strokeStyle=it.color; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.stroke();
      if(sel){ ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x,y,15,0,Math.PI*2); ctx.stroke(); }
    } else if(it.type==='player'){
      ctx.fillStyle=it.color;
      ctx.beginPath(); ctx.arc(x,y-3,8,0,Math.PI*2); ctx.fill(); // ראש
      ctx.beginPath(); ctx.arc(x,y+9,6,Math.PI,0); ctx.fill(); // גוף
      if(sel){ ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(x,y-3,8,0,Math.PI*2); ctx.stroke(); }
    } else if(it.type==='arrow'){
      ctx.strokeStyle='#fff'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(x-15,y); ctx.lineTo(x+15,y); ctx.stroke();
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.moveTo(x+15,y); ctx.lineTo(x+6,y-5); ctx.lineTo(x+6,y+5); ctx.closePath(); ctx.fill();
    }
    // תווית קטנה
    if(it.customLabel && it.customLabel !== it.label){
      ctx.font='bold 9px Heebo,sans-serif';
      ctx.fillStyle='rgba(0,0,0,0.75)';
      const tw2=ctx.measureText(it.customLabel).width+8;
      ctx.fillRect(x-tw2/2,y+16,tw2,14);
      ctx.fillStyle='#fff'; ctx.textAlign='center';
      ctx.fillText(it.customLabel,x,y+27);
    }
    ctx.restore();
  });

  // ── צייר זרימת תנועה (moves) ──
  const MOVE_COLORS = { run:'#2ECC71', pass:'#F2A93B', dribble:'#3498DB' };
  (state.moves||[]).forEach(mv=>{
    const x1=mv.fromX*W, y1=mv.fromY*H, x2=mv.toX*W, y2=mv.toY*H;
    const color = MOVE_COLORS[mv.type]||'#fff';
    ctx.save();
    ctx.strokeStyle=color; ctx.lineWidth=2.5;
    if(mv.type==='dribble') ctx.setLineDash([6,4]);
    else if(mv.type==='pass') ctx.setLineDash([]);
    else ctx.setLineDash([8,3]); // run = מקווקו

    // קו
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.setLineDash([]);

    // ראש חץ
    const angle = Math.atan2(y2-y1,x2-x1);
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(x2,y2);
    ctx.lineTo(x2-14*Math.cos(angle-0.4),y2-14*Math.sin(angle-0.4));
    ctx.lineTo(x2-14*Math.cos(angle+0.4),y2-14*Math.sin(angle+0.4));
    ctx.closePath(); ctx.fill();

    // מספר שלב בנקודת האמצע
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    ctx.fillStyle='rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.arc(mx,my,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 10px Heebo,sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(mv.step||'',mx,my);
    ctx.textBaseline='alphabetic';

    // תווית
    if(mv.label){
      ctx.font='9px Heebo,sans-serif'; ctx.fillStyle='rgba(0,0,0,0.7)';
      const lw=ctx.measureText(mv.label).width+8;
      ctx.fillRect(mx-lw/2,my+13,lw,13);
      ctx.fillStyle=color; ctx.textAlign='center';
      ctx.fillText(mv.label,mx,my+23);
    }
    ctx.restore();
  });
}

async function generateTacticalLayout(drill, courtState, redrawFn, btn){
  if(!getKey()){ alert('צריך מפתח API'); return; }
  const orig = btn.innerHTML;
  btn.disabled=true; btn.innerHTML='⏳ יוצר הדמיה...';
  const prompt = \`קרא את תיאור התרגיל הבא וצור הדמיה טקטית מלאה עם זרימת תנועה.

תרגיל: \${drill.name}
תיאור: \${drill.description||''}
ארגון: \${drill.organization||''}
ציוד: \${drill.equipment||''}
דגשים: \${(drill.coaching_points||[]).join(', ')}

החזר JSON תקין בלבד (ללא backticks, ללא טקסט נוסף) עם שני מערכים:

1. items — ציוד ושחקנים על המגרש:
   - x,y: ערכים 0–1 (יחסי, 0=שמאל/למעלה)
   - type: "cone" / "hat" / "hoop" / "player"
   - color: "#F2A93B"=כתום, "#E74C3C"=אדום, "#3498DB"=כחול, "#2ECC71"=ירוק, "#9B59B6"=סגול
   - customLabel: תיאור קצר ("כיפה — סקוואט", "שחקן מגן")
   - step: מספר שלב (1,2,3...) אם השחקן/ציוד שייך לשלב מסוים

2. moves — זרימת תנועה (חצים ממוספרים):
   - step: מספר שלב (1,2,3...)
   - fromX,fromY: נקודת התחלה (0–1)
   - toX,toY: נקודת סיום (0–1)
   - type: "run"=ריצת שחקן / "pass"=מסירה / "dribble"=דריבל
   - label: תיאור קצר אופציונלי

דוגמה:
{"items":[
  {"type":"player","color":"#2B4C9B","x":0.15,"y":0.5,"customLabel":"שחקן 1 — מתחיל","step":1},
  {"type":"cone","color":"#F2A93B","x":0.5,"y":0.3,"customLabel":"קונוס — עצור"},
  {"type":"player","color":"#E74C3C","x":0.8,"y":0.5,"customLabel":"שחקן 2 — מקבל","step":2}
],
"moves":[
  {"step":1,"fromX":0.15,"fromY":0.5,"toX":0.5,"toY":0.3,"type":"run","label":"ריצה לקונוס"},
  {"step":2,"fromX":0.5,"fromY":0.3,"toX":0.8,"toY":0.5,"type":"pass","label":"מסירה"}
]}

מקסימום 12 items ו-8 moves. התאם לתרגיל. החזר JSON בלבד.\`;

  try{
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1500,messages:[{role:"user",content:prompt}]})
    });
    const data = await res.json();
    const text = (data.content||[]).map(c=>c.text||'').join('').replace(/\`\`\`json|\`\`\`/g,'').trim();
    const parsed = JSON.parse(text);
    courtState.items = (parsed.items||[]).map(it=>({...it, id:Date.now()+Math.random(), label:it.customLabel||it.type}));
    courtState.moves = parsed.moves||[];
    courtState.generated=true;
    redrawFn();
  }catch(e){
    alert('שגיאה ביצירת ההדמיה — נסה שוב');
    console.error(e);
  }finally{
    btn.disabled=false; btn.innerHTML=orig;
  }
}

function parseJsonSafe(s){
  try{ return JSON.parse(s); }catch(e){}
  // ניסיון 1: סגירה פשוטה של מחרוזות/סוגריים פתוחים
  try{ return JSON.parse(closeOpen(s)); }catch(e){}
  // ניסיון 2: אם התשובה נחתכה באמצע ערך — חוזרים אחורה לתו האחרון
  // שמסיים ערך תקין (} ] " או ספרה), ומשם סוגרים
  let cut = s.length;
  while(cut > 0){
    const ch = s[cut-1];
    if(ch === '}' || ch === ']' || ch === '"' || /[0-9]/.test(ch)){
      try{ return JSON.parse(closeOpen(s.slice(0, cut))); }catch(e){}
    }
    cut--;
    // קיצור: קופצים אחורה לפסיק הקודם כדי לא לבדוק כל תו
    const comma = s.lastIndexOf(',', cut-1);
    if(comma > 0 && comma < cut) cut = comma;
    else if(comma < 0) break;
  }
  // ניסיון אחרון: חיתוך אחרי הפסיק האחרון ואז סגירה
  const lastComma = s.lastIndexOf(',');
  if(lastComma > 0) return JSON.parse(closeOpen(s.slice(0, lastComma)));
  throw new Error('cannot parse');
}

function closeOpen(t){
  // מסיר פסיק תלוי בסוף
  t = t.replace(/,\\s*$/, '');
  // סוגר מרכאות אם אי-זוגי
  const quotes = (t.match(/(?<!\\\\)"/g)||[]).length;
  if(quotes % 2 === 1) t += '"';
  t = t.replace(/,\\s*$/, '');
  // סוגר סוגריים חסרים לפי ספירה (מתעלם מאלו בתוך מחרוזות באופן גס אך מספיק)
  const opens = (t.match(/{/g)||[]).length - (t.match(/}/g)||[]).length;
  const opensArr = (t.match(/\\[/g)||[]).length - (t.match(/]/g)||[]).length;
  t += ']'.repeat(Math.max(0, opensArr)) + '}'.repeat(Math.max(0, opens));
  return t;
}

function showError(msg){
  const e = document.getElementById('error');
  e.textContent = msg;
  e.style.display='block';
}

function esc(s){
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ===== ספריית מערכים (אחסון קבוע בארטיפקט) ===== */
let lastMeta = null;
let currentId = null;
function storageOk(){ return typeof window !== 'undefined' && !!window.storage; }

async function loadLibrary(){
  let plans = [];
  // קודם בדוק localStorage
  try{
    const local = localStorage.getItem('ttb_plans');
    if(local) plans = JSON.parse(local);
  }catch(e){}

  // אם יש artifact storage — מזג
  if(storageOk()){
    try{
      const r = await window.storage.get('maarach_plans');
      if(r && r.value){
        const stored = JSON.parse(r.value);
        // מזג — הוסף מהאחסון אם לא קיים ב-localStorage
        stored.forEach(sp=>{
          if(!plans.find(lp=>lp.id===sp.id)){
            plans.push({...sp, savedAt: sp.savedAt||Date.now()});
          }
        });
        // שמור מוזג ב-localStorage
        localStorage.setItem('ttb_plans', JSON.stringify(plans));
      }
    }catch(e){}
  }
  renderPlansGrid();
}

async function getPlans(){
  try{
    const r = await window.storage.get('maarach_plans');
    return (r && r.value) ? JSON.parse(r.value) : [];
  }catch(e){ return []; }
}
async function setPlans(plans){
  try{ await window.storage.set('maarach_plans', JSON.stringify(plans)); }
  catch(e){ showError('השמירה נכשלה — נסה שוב.'); }
}

async function savePlan(){
  if(!lastPlan) return;
  const entry = {
    id: currentId || Date.now().toString(36),
    date: new Date().toLocaleDateString('he-IL'),
    savedAt: Date.now(),
    meta: lastMeta || {sport:'', players:'', age:'', duration:''},
    plan: lastPlan
  };

  // שמור ב-localStorage
  try{
    const existing = JSON.parse(localStorage.getItem('ttb_plans')||'[]');
    const idx = existing.findIndex(x=>x.id === entry.id);
    if(idx >= 0) existing[idx] = entry; else existing.push(entry);
    localStorage.setItem('ttb_plans', JSON.stringify(existing));
  }catch(e){ console.error('שגיאת שמירה',e); }

  // שמור גם ב-artifact storage אם זמין
  if(storageOk()){
    try{
      const plans = await getPlans();
      const idx = plans.findIndex(x=>x.id === entry.id);
      if(idx >= 0) plans[idx] = entry; else plans.push(entry);
      currentId = entry.id;
      await setPlans(plans);
    }catch(e){ console.error('artifact storage error',e); }
  }

  currentId = entry.id;
  const b = document.getElementById('saveBtn');
  b.textContent = 'נשמר ✓';
  setTimeout(()=>b.textContent='שמור לספרייה', 2000);
  loadLibrary();
}

if(typeof window !== 'undefined'){
  window.addEventListener('DOMContentLoaded', loadLibrary);
}
`

export default function TrainWithTheBrain() {
  useEffect(() => {
    const script = document.createElement("script")
    script.textContent = MAIN_JS
    document.body.appendChild(script)
    return () => {
      try { document.body.removeChild(script) } catch(e) {}
    }
  }, [])

  return (
    <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
  )
}
