/**
 * MAFIA INFORMATION SYSTEMS
 * Members Management & Profile Modal
 */

(function () {
  "use strict";

  let allMembers = [];
  let roleFilter = "All";
  let visibleMembersCount = 8;

  const grid = $("#memberGrid");
  const search = $("#search");
  const chips = $("#chips");
  const countEl = $("#count");

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

  function renderMembers() {
    if (!grid) return;
    const q = (search ? search.value.trim().toLowerCase() : "");
    const list = allMembers.filter(m =>
      (roleFilter === "All" || m.role === roleFilter) &&
      (!q || [m.name, m.nickname, m.role, ...(m.skills || [])].join(" ").toLowerCase().includes(q))
    );

    if (visibleMembersCount > list.length) {
      visibleMembersCount = list.length || 8;
    }

    grid.replaceChildren();
    if (countEl) countEl.textContent = `${list.length} anggota`;

    if (!list.length) {
      grid.append(el("p", "empty", "Belum ada anggota yang cocok. Coba kata kunci lain."));
      return;
    }

    const visibleList = list.slice(0, visibleMembersCount);

    visibleList.forEach(m => {
      const a = el("article", "card");
      a.dataset.cursor = "meet";
      a.style.setProperty("--c", color(m.id));

      const im = el("div", "card__img");
      im.append(createMedia(m.photo, `Foto ${m.name}`, m.nickname ? m.nickname[0] : "M", m.id));

      const personalityTags = (m.personality || []).map(p => `<span class="tag tag--sm">${esc(p)}</span>`).join("");

      const body = el(
        "div",
        "card__body",
        `<h3><button type="button" class="card__btn">${esc(m.name)}</button></h3>
         <p class="card__nick">“${esc(m.nickname || "")}”</p>
         <span class="tag">${esc(m.role || "")}</span>
         <div class="card__pers">${personalityTags}</div>`
      );

      body.querySelector("button").onclick = (e) => {
        e.stopPropagation();
        openProfile(m);
      };

      a.onclick = () => openProfile(m);

      a.append(im, body);
      grid.append(a);
    });

    if (list.length > visibleMembersCount) {
      const loadMoreBtn = el("button", "btn btn--yellow btn--sm member-load-more", "Tampilkan lebih banyak");
      loadMoreBtn.type = "button";
      loadMoreBtn.onclick = () => {
        visibleMembersCount = Math.min(visibleMembersCount + 8, list.length);
        renderMembers();
      };
      grid.append(loadMoreBtn);
    }
  }

  function openProfile(m) {
    const modal = $("#modal");
    const body = $("#modalBody");
    if (!modal || !body) return;

    const box = el("div", "profile");
    const pic = el("div", "profile__pic");
    pic.append(createMedia(m.photo, `Foto ${m.name}`, m.nickname ? m.nickname[0] : "M", m.id));

    const s = m.social || {};
    const soc = [
      ["Instagram", s.instagram],
      ["LinkedIn", s.linkedin],
      ["GitHub", s.github]
    ]
      .filter(([, u]) => u && u !== "#")
      .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" class="social-link">${n} ↗</a>`)
      .join("");

    const persPills = (m.personality || []).map(p => `<span class="tag tag--accent">${esc(p)}</span>`).join(" ");

    box.append(
      pic,
      el(
        "div",
        "profile__txt",
        `<div class="profile__header">
           <h3 id="mName">${esc(m.name)}</h3>
           <p class="profile__meta">“${esc(m.nickname)}” &nbsp;·&nbsp; <span class="tag">${esc(m.role)}</span></p>
         </div>
         <p class="profile__bio">${esc(m.bio)}</p>
         <div class="profile__section">
           <b>Personality:</b>
           <div class="tag-row">${persPills}</div>
         </div>
         <p class="profile__skills"><b>Skills:</b> ${esc((m.skills || []).join(", "))}</p>
         <blockquote class="profile__quote">“${esc(m.quote)}”</blockquote>
         ${soc ? `<div class="profile__soc"><b>Connect:</b> ${soc}</div>` : ""}`
      )
    );

    body.replaceChildren(box);
    openModal(modal);
  }

  // Open profile by member name (used by Mafia Moments people tags)
  function openMemberProfileByName(name) {
    if (!name) return false;
    const trimmed = name.trim().toLowerCase();
    const found = allMembers.find(m =>
      m.name.toLowerCase() === trimmed ||
      (m.nickname && m.nickname.toLowerCase() === trimmed)
    );
    if (found) {
      openProfile(found);
      return true;
    }
    return false;
  }

  function initMembers() {
    loadJSON("data/members.json", "members")
      .then(d => {
        allMembers = d;
        window.MAFIA_MEMBERS = allMembers;

        if (chips) {
          const roleNames = Array.from(new Set(allMembers.map(m => m.role).filter(Boolean)));
          renderChips(chips, ["All", ...roleNames], v => {
            roleFilter = v;
            visibleMembersCount = 8;
            renderMembers();
          });
        }

        if (search) {
          search.addEventListener("input", () => {
            visibleMembersCount = 8;
            renderMembers();
          });
        }

        renderMembers();

        // Trigger dynamic stats calculation if main is ready
        if (window.updateStatsCounter) {
          window.updateStatsCounter();
        }
      })
      .catch(() => {
        if (grid) {
          const hint = location.protocol === "file:"
            ? "Buka lewat Live Server atau web server lokal untuk memuat data JSON."
            : "Coba muat ulang halaman.";
          grid.innerHTML = `<p class="empty">The circle is temporarily offline. ${hint}</p>`;
        }
      });
  }

  window.MemberEngine = {
    init: initMembers,
    getAll: () => allMembers,
    openProfile: openProfile,
    openByName: openMemberProfileByName
  };
})();
