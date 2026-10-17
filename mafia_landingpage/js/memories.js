/**
 * MAFIA INFORMATION SYSTEMS
 * Memory Wall — Sticky Notes & Quotes from the Circle
 */

(function () {
  "use strict";

  const wallGrid = $("#memoryWallGrid");

  function initMemoryWall() {
    if (!wallGrid) return;

    loadJSON("data/memories.json", "memories")
      .then(memories => {
        wallGrid.replaceChildren();

        if (!memories.length) {
          wallGrid.innerHTML = `<p class="empty">No handwritten notes found yet.</p>`;
          return;
        }

        const noteColors = ["note--yellow", "note--mint", "note--pink", "note--blue"];

        memories.forEach((item, idx) => {
          const rot = item.rotation !== undefined ? item.rotation : ((idx % 5) - 2) * 1.5;
          const colorClass = noteColors[idx % noteColors.length];

          const note = el("article", `sticky-note ${colorClass}`);
          note.style.setProperty("--rot", `${rot}deg`);
          note.dataset.cursor = "view";

          // Format date if available
          let dateStr = "";
          if (item.date) {
            try {
              const d = new Date(item.date);
              if (!isNaN(d.getTime())) {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                dateStr = `${months[d.getMonth()]} ${d.getFullYear()}`;
              }
            } catch {}
          }

          note.innerHTML = `
            <div class="sticky-note__pin" aria-hidden="true"></div>
            <p class="sticky-note__msg">“${esc(item.message)}”</p>
            <div class="sticky-note__footer">
              <span class="sticky-note__author">— ${esc(item.author)}</span>
              ${dateStr ? `<span class="sticky-note__date">${esc(dateStr)}</span>` : ""}
            </div>
          `;

          wallGrid.append(note);
        });
      })
      .catch(() => {
        wallGrid.innerHTML = `<p class="empty">Memory Wall is resting. Check back soon!</p>`;
      });
  }

  window.MemoryWallEngine = {
    init: initMemoryWall
  };
})();
