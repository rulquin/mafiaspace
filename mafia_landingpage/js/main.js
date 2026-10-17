/**
 * MAFIA INFORMATION SYSTEMS
 * Core Script — Orchestrator, Animations, Dynamic Stats, and Navigation
 */

(function () {
  "use strict";

  /* ---------- Modal Management & Accessibility ---------- */
  let lastFocusedElement = null;

  function setInert(on) {
    document.querySelectorAll("header, main, footer").forEach(el => {
      el.inert = on;
    });
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    setInert(true);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector("[data-close]") || modal;
    closeBtn.focus();
  }

  function closeModals() {
    const openM = document.querySelector(".modal:not([hidden])");
    if (!openM) return;
    document.querySelectorAll(".modal").forEach(m => (m.hidden = true));
    document.body.style.overflow = "";
    setInert(false);
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  // Attach backdrop click and close button listeners to all modals
  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", e => {
      if (e.target === m || e.target.closest("[data-close]")) {
        closeModals();
      }
    });
  });

  // Global Keyboard Navigation (ESC, TAB Trap)
  addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModals();
      setMenu(false);
    }

    const openM = document.querySelector(".modal:not([hidden])");
    if (e.key === "Tab" && openM) {
      const focusables = [...openM.querySelectorAll("button, a[href], input, [tabindex]:not([tabindex='-1'])")].filter(
        n => n.getClientRects().length > 0 && !n.disabled
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.openModal = openModal;
  window.closeModals = closeModals;

  /* ---------- Nav & Mobile Menu ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("solid", window.scrollY > 40);
  }, { passive: true });

  function setMenu(open) {
    if (!links || !toggle) return;
    links.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }

  if (toggle) {
    toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  }
  if (links) {
    links.addEventListener("click", e => {
      if (e.target.closest("a")) setMenu(false);
    });
  }
  addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  // ScrollSpy for Active Navigation Link
  const spy = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && links) {
          links.querySelectorAll("a").forEach(a => {
            const isMatch = a.getAttribute("href") === "#" + entry.target.id;
            a.classList.toggle("active", isMatch);
            if (isMatch) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

  /* ---------- Dynamic Statistics & Count-Up (Sections 4 & 5) ---------- */
  let statsCounted = false;

  function animateCount(elem, targetVal, duration = 1200) {
    if (!elem) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      elem.textContent = String(targetVal);
      return;
    }

    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (targetVal - start) * easeOut);
      elem.textContent = String(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        elem.textContent = String(targetVal);
      }
    }
    requestAnimationFrame(update);
  }

  function updateStatsCounter() {
    const memberCount = (window.MAFIA_MEMBERS && window.MAFIA_MEMBERS.length) || 12;
    const momentCount = (window.MAFIA_MOMENTS && window.MAFIA_MOMENTS.length) || 15;
    const projectCount = (window.MAFIA_PROJECTS && window.MAFIA_PROJECTS.length) || 5;

    const elMembers = $("#statMembers");
    const elMoments = $("#statMoments");
    const elProjects = $("#statProjects");
    const elYear = $("#statYear");

    if (elYear) elYear.textContent = String(SITE_CONFIG.classYear || 2023);

    // If already in view, trigger count-up
    if (!statsCounted) {
      const hero = $("#home");
      if (hero) {
        const obs = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                animateCount(elMembers, memberCount);
                animateCount(elMoments, momentCount);
                animateCount(elProjects, projectCount);
                obs.disconnect();
              }
            });
          },
          { threshold: 0.2 }
        );
        obs.observe(hero);
      }
    } else {
      if (elMembers) elMembers.textContent = String(memberCount);
      if (elMoments) elMoments.textContent = String(momentCount);
      if (elProjects) elProjects.textContent = String(projectCount);
    }
  }
  window.updateStatsCounter = updateStatsCounter;

  /* ---------- Mafia Roles (Section 46 / 04) ---------- */
  function renderRoles() {
    const rolesEl = $("#roleGrid");
    if (!rolesEl) return;
    rolesEl.replaceChildren();

    ROLES.forEach(([name, desc], i) => {
      const stickerText = STICKERS[i % STICKERS.length];
      const c = el(
        "article",
        "role",
        `<span class="sticker" style="--r:${i % 2 ? 5 : -6}deg">${esc(stickerText)}</span>
         <h3>${esc(name)}</h3>
         <p>${esc(desc)}</p>`
      );
      c.style.setProperty("--c", color(i));
      rolesEl.append(c);
    });
  }

  /* ---------- Brand Identity Philosophy (Section 1 & 2) ---------- */
  function renderPhilosophy() {
    const philGrid = $("#philGrid");
    if (!philGrid) return;
    philGrid.replaceChildren();

    BRAND_PHILOSOPHY.forEach((item, i) => {
      const card = el(
        "article",
        "phil-card",
        `<span class="phil-num">0${i + 1}</span>
         <h3 class="phil-title">${esc(item.title)}</h3>
         <p class="phil-desc">${esc(item.description)}</p>`
      );
      card.style.setProperty("--c", color(i));
      philGrid.append(card);
    });
  }

  /* ---------- Graduation Countdown (Section 20, 21, 22) ---------- */
  function initGraduationCountdown() {
    const daysEl = $("#cdDays");
    const hoursEl = $("#cdHours");
    const minutesEl = $("#cdMinutes");
    const secondsEl = $("#cdSeconds");
    const statusEl = $("#cdStatus");
    const gridEl = $("#countdownGrid");

    const targetDateStr = SITE_CONFIG.graduationDate;

    // State 1: Graduation date is not set (null or empty)
    if (!targetDateStr) {
      if (gridEl) gridEl.hidden = true;
      if (statusEl) {
        statusEl.textContent = "COMING SOON";
        statusEl.className = "cd-coming-soon";
        statusEl.hidden = false;
      }
      return;
    }

    // State 2: Graduation date is specified
    const targetTime = new Date(targetDateStr).getTime();
    if (isNaN(targetTime)) {
      if (gridEl) gridEl.hidden = true;
      if (statusEl) {
        statusEl.textContent = "COMING SOON";
        statusEl.hidden = false;
      }
      return;
    }

    function update() {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        // Zero or negative reached: The Next Chapter Has Arrived!
        if (gridEl) gridEl.hidden = true;
        if (statusEl) {
          statusEl.textContent = "THE NEXT CHAPTER HAS ARRIVED.";
          statusEl.className = "cd-arrived";
          statusEl.hidden = false;
        }
        return;
      }

      if (gridEl) gridEl.hidden = false;
      if (statusEl) statusEl.hidden = true;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(d);
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  /* ---------- Cursor Effect ---------- */
  function initCursor() {
    if (
      matchMedia("(hover:hover) and (pointer:fine)").matches &&
      !matchMedia("(prefers-reduced-motion:reduce)").matches
    ) {
      const cur = $("#cursor");
      if (!cur) return;
      const dot = cur.firstElementChild;
      document.body.classList.add("has-cursor");

      let x = 0, y = 0, raf = 0;
      addEventListener("mousemove", e => {
        cur.classList.add("on");
        x = e.clientX;
        y = e.clientY;
        raf ||= requestAnimationFrame(() => {
          cur.style.transform = `translate(${x}px,${y}px)`;
          raf = 0;
        });
      });

      const labels = {
        view: "VIEW",
        meet: "MEET",
        go: "GO",
        open: "OPEN",
        share: "SHARE"
      };

      document.addEventListener("mouseleave", () => cur.classList.remove("on"));
      document.addEventListener("mouseover", e => {
        const t = e.target.closest("[data-cursor]");
        cur.classList.toggle("big", !!t);
        dot.textContent = t ? labels[t.dataset.cursor] || "" : "";
      });
    }
  }

  /* ---------- Global Startup Sequence ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderRoles();
    renderPhilosophy();
    initGraduationCountdown();
    initCursor();

    // Trigger modules
    if (window.MemberEngine) window.MemberEngine.init();
    if (window.GalleryEngine) window.GalleryEngine.init();
    if (window.MemoryWallEngine) window.MemoryWallEngine.init();
    if (window.ProjectEngine) window.ProjectEngine.init();
    if (window.QREngine) window.QREngine.init();
  });
})();
