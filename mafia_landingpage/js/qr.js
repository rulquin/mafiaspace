/**
 * MAFIA INFORMATION SYSTEMS
 * QR Code Generator for Social Hub
 */

(function () {
  "use strict";

  function initQRCode() {
    const box = $("#qr");
    if (!box) return;

    const targetUrl = (window.SITE_CONFIG && window.SITE_CONFIG.socialHubUrl)
      ? window.SITE_CONFIG.socialHubUrl
      : "social.html";

    try {
      if (typeof qrcode === "function") {
        // Resolve absolute URL if relative
        const fullUrl = new URL(targetUrl, window.location.href).href;
        const qr = qrcode(0, "M");
        qr.addData(fullUrl);
        qr.make();

        box.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true });
        if (box.firstElementChild) {
          box.firstElementChild.setAttribute("role", "img");
          box.firstElementChild.setAttribute("aria-label", "QR code to Mafia Social Hub");
        }
      } else {
        box.innerHTML = `
          <div class="qr-fallback">
            <a href="${esc(targetUrl)}" class="btn btn--sm">Buka Social Hub ↗</a>
          </div>
        `;
      }
    } catch {
      box.innerHTML = `
        <div class="qr-fallback">
          <a href="${esc(targetUrl)}" class="btn btn--sm">Buka Social Hub ↗</a>
        </div>
      `;
    }
  }

  window.QREngine = {
    init: initQRCode
  };
})();
