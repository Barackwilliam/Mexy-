/**
 * JamiiTek Website Status Check
 * ================================
 * Add this script to any static website (HTML/CSS/JS) managed by JamiiTek.
 * It checks the site status on every page load and shows a suspension or
 * maintenance screen if needed.
 *
 * INSTALLATION:
 * Add ONE line before </body> in every HTML page (or in a shared layout):
 *
 *   <script
 *     src="jamiitek-status.js"
 *     data-api-key="YOUR_API_KEY_HERE"
 *     data-api-url="https://jamiitek.co.tz/api/site-status/">
 *   </script>
 *
 * That's it. No other configuration needed.
 */

(function () {
  const script = document.currentScript;
  const API_KEY = script?.dataset?.apiKey || '';
  const API_URL = (script?.dataset?.apiUrl || 'https://jamiitek.co.tz/api/site-status/').replace(/\/$/, '');
  const CACHE_KEY = 'jamiitek_status_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

  if (!API_KEY) return; // No key = do nothing

  // ── Inline styles injected once ──────────────────────────────────────────
  const STYLES = `
    #jt-overlay {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }
    #jt-overlay.suspended { background: #f8fafc; }
    #jt-overlay.maintenance { background: #fffbeb; }

    #jt-box {
      background: #ffffff; border-radius: 20px;
      padding: 60px 50px; text-align: center;
      max-width: 480px; width: calc(100% - 40px);
      box-shadow: 0 8px 48px rgba(0,0,0,0.12);
      animation: jt-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes jt-pop {
      from { opacity:0; transform:scale(0.88) translateY(20px); }
      to   { opacity:1; transform:scale(1)    translateY(0); }
    }

    #jt-icon { font-size: 72px; margin-bottom: 20px; line-height: 1; }

    #jt-title {
      font-size: 26px; font-weight: 700; margin-bottom: 14px; line-height: 1.2;
    }
    .suspended #jt-title { color: #dc2626; }
    .maintenance #jt-title { color: #d97706; }

    #jt-message {
      font-size: 15px; color: #6b7280; line-height: 1.75;
      margin-bottom: 0;
    }

    #jt-footer {
      margin-top: 36px; font-size: 12px; color: #d1d5db;
      letter-spacing: 0.3px;
    }
    #jt-footer a { color: #9ca3af; text-decoration: none; }
    #jt-footer a:hover { color: #6b7280; }
  `;

  // ── HTML templates ────────────────────────────────────────────────────────
  function buildOverlay(type, message) {
    const isSuspended = type === 'suspended';
    return `
      <div id="jt-overlay" class="${isSuspended ? 'suspended' : 'maintenance'}">
        <div id="jt-box">
          <div id="jt-icon">${isSuspended ? '🔒' : '🔧'}</div>
          <div id="jt-title">${isSuspended ? 'Service Suspended' : 'Under Maintenance'}</div>
          <p id="jt-message">${escapeHtml(message)}</p>
          <div id="jt-footer">Powered by <a href="https://jamiitek.co.tz" target="_blank">JamiiTek</a></div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Show overlay ──────────────────────────────────────────────────────────
  function showOverlay(type, message) {
    // Inject styles once
    if (!document.getElementById('jt-styles')) {
      const style = document.createElement('style');
      style.id = 'jt-styles';
      style.textContent = STYLES;
      document.head.appendChild(style);
    }

    // Inject overlay
    const div = document.createElement('div');
    div.innerHTML = buildOverlay(type, message);
    document.body.appendChild(div.firstElementChild);

    // Prevent scrolling underneath
    document.body.style.overflow = 'hidden';
  }

  // ── Cache helpers ─────────────────────────────────────────────────────────
  function getCached() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { data, expires } = JSON.parse(raw);
      if (Date.now() > expires) { sessionStorage.removeItem(CACHE_KEY); return null; }
      return data;
    } catch { return null; }
  }

  function setCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        expires: Date.now() + CACHE_TTL
      }));
    } catch {}
  }

  // ── Main check ────────────────────────────────────────────────────────────
  function checkStatus(data) {
    const status  = data?.status || 'active';
    const message = data?.suspension_message || (
      status === 'suspended'
        ? 'This service has been suspended. Please contact support.'
        : 'We are performing scheduled maintenance. We will be back shortly.'
    );

    if (status === 'suspended' || status === 'maintenance') {
      showOverlay(status, message);
    }
  }

  function run() {
    const cached = getCached();
    if (cached) { checkStatus(cached); return; }

    fetch(`${API_URL}/${API_KEY}/`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setCache(data); checkStatus(data); }
      })
      .catch(() => {}); // Fail silently — don't break the site
  }

  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();