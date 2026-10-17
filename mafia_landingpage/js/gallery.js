/**
 * MAFIA INFORMATION SYSTEMS
 * Mafia Moments & Memory Record Engine
 */

(function () {
  "use strict";

  let allMoments = [];
  let currentCategory = "All";

  const momentGrid = $("#momentGrid");
  const momentChips = $("#momentChips");
  const galleryGrid = $("#galleryGrid");
  const galleryChips = $("#galleryChips");
  const randomBtn = $("#randomMomentBtn");

  // Format date: "2024-05-12" -> "12 MAY 2024"
  function formatMomentDate(dateStr) {
    if (!dateStr) return "DATE UNKNOWN";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  }

  // Format ID to #001 format
  function padId(id) {
    return "#" + String(id || 1).padStart(3, "0");
  }

  function renderChips(container, values, onPick) {
    if (!container) return;
    container.replaceChildren();
    values.forEach((v, i) => {
      const b = el("button", "chip", esc(v));
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0);
      b.onclick = () => {
        container.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b));
        onPick(v);
      };
      container.append(b);
    });
  }

  // Render moment cards in the Mafia Moments featured section
  function renderMoments(items) {
    if (!momentGrid) return;
    momentGrid.replaceChildren();

    const filtered = currentCategory === "All"
      ? items
      : items.filter(m => m.category === currentCategory);

    if (!filtered.length) {
      momentGrid.append(el("p", "empty", "Belum ada momen untuk kategori ini."));
      return;
    }

    filtered.forEach((m, i) => {
      const btn = el("button", "tile moment-tile");
      btn.type = "button";
      btn.dataset.cursor = "view";
      btn.setAttribute("aria-label", `Buka Memory Record ${padId(m.id)}: ${m.title || m.caption}`);

      if (i === 0 && currentCategory === "All") btn.classList.add("big");
      else if (m.shape === "portrait") btn.classList.add("tall");

      const imgWrap = createMedia(m.image || m.src, m.title || m.caption, m.category, m.id);

      const overlay = el("div", "moment-overlay");
      overlay.innerHTML = `
        <span class="moment-overlay__tag">${esc(m.category)}</span>
        <span class="moment-overlay__id">${padId(m.id)}</span>
        <p class="moment-overlay__title">${esc(m.title || m.caption)}</p>
      `;

      btn.append(imgWrap, overlay);
      btn.onclick = () => openMomentModal(m);
      momentGrid.append(btn);

      if (i === 2 && currentCategory === "All") {
        const quoteBox = el("div", "momentq", "Small moments.<br>Big memories.");
        momentGrid.append(quoteBox);
      }
    });
  }

  // Render gallery section
  function renderGallery(items) {
    if (!galleryGrid) return;
    galleryGrid.replaceChildren();

    items.forEach(m => {
      const btn = el("button", "tile");
      btn.type = "button";
      btn.dataset.cursor = "view";
      btn.style.setProperty("--ar", m.shape === "portrait" ? "3/4" : "4/3");
      btn.setAttribute("aria-label", `Buka foto: ${m.title || m.caption}`);

      btn.append(
        createMedia(m.image || m.src, m.title || m.caption, m.category, m.id),
        el("span", "cap", `${padId(m.id)} · ${esc(m.category)}`)
      );

      btn.onclick = () => openMomentModal(m);
      galleryGrid.append(btn);
    });
  }

  // Open Memory Record Modal (Section 8, 9, 10)
  function openMomentModal(m) {
    const modal = $("#momentModal");
    const body = $("#momentModalBody");
    if (!modal || !body) return;

    // Build people list with clickable member profiles (Section 9)
    let peopleHtml = "";
    if (Array.isArray(m.people) && m.people.length > 0) {
      const pills = m.people.map(personName => {
        return `<button type="button" class="people-pill" data-person="${esc(personName)}">👤 ${esc(personName)}</button>`;
      }).join(" ");
      peopleHtml = `
        <div class="moment-modal__people">
          <span class="moment-label">PEOPLE (${m.people.length})</span>
          <div class="people-pill-list">${pills}</div>
        </div>
      `;
    } else {
      peopleHtml = `
        <div class="moment-modal__people">
          <span class="moment-label">PEOPLE</span>
          <p class="moment-plain-text">The Whole Circle</p>
        </div>
      `;
    }

    const box = el("div", "moment-record");
    box.innerHTML = `
      <div class="moment-record__visual">
        <div class="moment-record__img" id="momentModalImgWrap"></div>
        <div class="moment-record__badges">
          <span class="tag tag--red">${padId(m.id)}</span>
          <span class="tag tag--dark">${esc(m.category)}</span>
          ${m.chapter ? `<span class="tag tag--accent">${esc(m.chapter)}</span>` : ""}
        </div>
      </div>
      <div class="moment-record__content">
        <div class="moment-record__header">
          <div class="moment-meta-line">
            <span class="moment-meta-item"><b>DATE:</b> ${esc(formatMomentDate(m.date))}</span>
            <span class="moment-meta-item"><b>LOCATION:</b> ${esc(m.location || "Universitas Terbuka")}</span>
          </div>
          <h3 class="moment-title">${esc(m.title || "Mafia Moment")}</h3>
        </div>

        <blockquote class="moment-caption">“${esc(m.caption || "")}”</blockquote>

        ${peopleHtml}

        ${m.chapter ? `
          <div class="moment-modal__chapter">
            <span class="moment-label">CHAPTER ARCHIVE</span>
            <p class="moment-chapter-val">📖 ${esc(m.chapter)}</p>
          </div>
        ` : ""}

        <div class="moment-record__actions">
          <button type="button" class="btn btn--sm moment-share-btn" id="shareMomentBtn">
            ↗ SHARE MOMENT
          </button>
        </div>
      </div>
    `;

    // Append photo media
    const imgWrap = box.querySelector("#momentModalImgWrap");
    imgWrap.append(createMedia(m.image || m.src, m.title || m.caption, m.category, m.id));

    // Handle Click on People Pills (Section 9)
    box.querySelectorAll(".people-pill").forEach(pill => {
      pill.onclick = () => {
        const name = pill.dataset.person;
        if (window.MemberEngine) {
          const success = window.MemberEngine.openByName(name);
          if (success) {
            // Close moment modal so member profile is prominently displayed
            modal.hidden = true;
          } else {
            showToast(`Profil ${name} belum tersedia.`);
          }
        }
      };
    });

    // Handle Share Moment (Section 10)
    const shareBtn = box.querySelector("#shareMomentBtn");
    if (shareBtn) {
      shareBtn.onclick = () => shareMoment(m);
    }

    body.replaceChildren(box);
    openModal(modal);

    // Update URL hash/query safely for deep linking without reload
    try {
      const url = new URL(window.location);
      url.searchParams.set("moment", m.id);
      window.history.replaceState({ momentId: m.id }, "", url.toString());
    } catch {}
  }

  // Share functionality with Web Share API or Clipboard Copy (Section 10)
  function shareMoment(m) {
    const url = new URL(window.location.href);
    url.searchParams.set("moment", m.id);
    const shareUrl = url.toString();
    const shareTitle = `Mafia Information Systems — Moment ${padId(m.id)}: ${m.title || "Memory Record"}`;
    const shareText = `“${m.caption || "Small moments. Big memories."}”`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      }).catch(() => {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Moment link copied.");
      }).catch(() => {
        showToast("Link: " + text);
      });
    } else {
      showToast("Moment link copied.");
    }
  }

  // Random Moment (Section 11)
  function pickRandomMoment() {
    if (!allMoments.length) return;
    const randomIndex = Math.floor(Math.random() * allMoments.length);
    const m = allMoments[randomIndex];

    // Trigger subtle button rotate/animation
    if (randomBtn) {
      randomBtn.classList.add("anim-spin");
      setTimeout(() => randomBtn.classList.remove("anim-spin"), 500);
    }

    openMomentModal(m);
  }

  // Check URL query parameter for deep linking (?moment=24)
  function checkDeepLink() {
    try {
      const params = new URLSearchParams(window.location.search);
      const momentId = params.get("moment");
      if (momentId) {
        const idNum = parseInt(momentId, 10);
        const found = allMoments.find(m => m.id === idNum);
        if (found) {
          setTimeout(() => openMomentModal(found), 500);
        }
      }
    } catch {}
  }

  function initMoments() {
    loadJSON("data/gallery.json", "items")
      .then(items => {
        allMoments = items;
        window.MAFIA_MOMENTS = allMoments;

        const categories = ["All", ...new Set(items.map(m => m.category).filter(Boolean))];

        if (momentChips) {
          renderChips(momentChips, categories, cat => {
            currentCategory = cat;
            renderMoments(allMoments);
          });
        }

        if (galleryChips) {
          renderChips(galleryChips, categories, cat => {
            const list = cat === "All" ? allMoments : allMoments.filter(m => m.category === cat);
            renderGallery(list);
          });
        }

        renderMoments(allMoments);
        renderGallery(allMoments);

        if (randomBtn) {
          randomBtn.onclick = pickRandomMoment;
        }

        // Check if user came from a shared URL (?moment=ID)
        checkDeepLink();

        // Update stats
        if (window.updateStatsCounter) {
          window.updateStatsCounter();
        }
      })
      .catch(() => {
        if (momentGrid) {
          momentGrid.innerHTML = `<p class="empty">The memory archive is temporarily offline.</p>`;
        }
      });
  }

  window.GalleryEngine = {
    init: initMoments,
    getAll: () => allMoments,
    openMoment: openMomentModal,
    pickRandom: pickRandomMoment
  };
})();
