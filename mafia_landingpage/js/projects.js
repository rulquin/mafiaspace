/**
 * MAFIA INFORMATION SYSTEMS
 * Projects Engine — Academic & Creative Builds
 */

(function () {
  "use strict";

  const pg = $("#projectGrid");

  function initProjects() {
    if (!pg) return;

    loadJSON("data/projects.json", "projects")
      .then(list => {
        window.MAFIA_PROJECTS = list;
        pg.replaceChildren();

        if (!list.length) {
          pg.innerHTML = `<p class="empty">No projects found.</p>`;
          return;
        }

        list.forEach((p, i) => {
          const hasLink = p.link && p.link !== "#";
          const card = el(hasLink ? "a" : "article", "card");
          if (hasLink) {
            card.href = p.link;
            card.target = "_blank";
            card.rel = "noopener";
          }
          card.dataset.cursor = "view";
          card.style.setProperty("--c", color(i));

          const im = el("div", "card__img");
          im.append(createMedia(p.image, p.title, p.category, i));

          const teamStr = Array.isArray(p.team) ? p.team.join(", ") : (p.team || "");
          const techTags = (p.technology || []).map(t => `<span class="tag tag--sm">${esc(t)}</span>`).join("");

          const body = el(
            "div",
            "card__body",
            `<h3>${esc(p.title)}</h3>
             <span class="tag">${esc(p.category)}</span>
             <p>${esc(p.description)}</p>
             <p class="card__meta"><small><b>Team:</b> ${esc(teamStr)}</small></p>
             <div class="card__tags">${techTags}</div>`
          );

          card.append(im, body);
          pg.append(card);
        });

        // Trigger dynamic stats update
        if (window.updateStatsCounter) {
          window.updateStatsCounter();
        }
      })
      .catch(() => {
        if (pg) {
          pg.innerHTML = `<p class="empty">Projects archive is temporarily offline.</p>`;
        }
      });
  }

  window.ProjectEngine = {
    init: initProjects,
    getAll: () => window.MAFIA_PROJECTS || []
  };
})();
