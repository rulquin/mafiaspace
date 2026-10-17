/**
 * MAFIA INFORMATION SYSTEMS
 * Digital Yearbook Engine — Chapters & Storytelling
 */

(function () {
  "use strict";

  const CHAPTERS = [
    {
      num: "01",
      title: "THE BEGINNING",
      quote: "Just a group of students trying to figure things out.",
      story: "Tahun 2023 menjadi titik temu. Kami datang dari berbagai penjuru, latar belakang, dan kesibukan, membawa satu tujuan bersama: menempuh perkuliahan Sistem Informasi di Universitas Terbuka. Pertemuan pertama dipenuhi rasa canggung, perkenalan singkat di grup WhatsApp, dan rasa penasaran tentang bagaimana perjalanan ini akan berlangsung.",
      tags: ["Orientation", "First Steps", "Hello World", "2023"],
      highlights: [
        { label: "Genesis", val: "September 2023" },
        { label: "Vibe", val: "Awkward yet hopeful" },
        { label: "Status", val: "Circle Established" }
      ],
      momentsFilter: "THE BEGINNING"
    },
    {
      num: "02",
      title: "THE CHAOS",
      quote: "Somewhere between assignments and deadlines, the chaos became part of the journey.",
      story: "Semester terus bergulir dan kenyataan mulai terasa. Diskusi malam yang berlarut-larut, 47 tab browser terbuka sekaligus, server praktikum yang lambat, dan tawa di balik kepanikan tugas kelompok. Di tengah kekacauan jadwal dan error pemrograman, circle ini menemukan ritmenya. Humor dan obrolan random menjadi penyelamat terbaik.",
      tags: ["Late Night Calls", "Bug Hunting", "Internal Memes", "Chaos Mode"],
      highlights: [
        { label: "Discord Hours", val: "100+ Hours" },
        { label: "Energy Drink", val: "Unlimited" },
        { label: "Survival Rate", val: "100%" }
      ],
      momentsFilter: "THE CHAOS"
    },
    {
      num: "03",
      title: "THE DEADLINES",
      quote: "Sleep was optional. Deadlines were not.",
      story: "Pekan ujian, laporan praktikum, presentasi akhir modul. Jam 23:59 adalah jam keramat. Di fase inilah mental hustler teruji. Saling mengingatkan tugas di grup, berbagi catatan belajar, dan memastikan tidak ada satu pun anggota circle yang tertinggal di belakang. Tekanan deadline justru mengikat kami semakin erat.",
      tags: ["23:59 WIB", "Sat-set Beres", "Group Sprint", "No Excuses"],
      highlights: [
        { label: "Clock", val: "23:59:50" },
        { label: "Teamwork", val: "Peak Performance" },
        { label: "Submission", val: "On Time" }
      ],
      momentsFilter: "THE DEADLINES"
    },
    {
      num: "04",
      title: "THE MEMORIES",
      quote: "The photos became memories. The memories became stories.",
      story: "Kuliah bukan cuma soal nilai indeks prestasi kumulatif (IPK). Ini tentang buka puasa bersama, kopi sore sepulang ujian, candaan di kafe, dan perjalanan singkat melepas penat. Foto-foto tanpa rencana yang tersimpan di galeri ponsel kini menjadi arsip berharga yang akan selalu kami ceritakan kembali.",
      tags: ["Hangout", "Bukber", "Road Trips", "Unfiltered Laughter"],
      highlights: [
        { label: "Unplanned Trips", val: "The Best Ones" },
        { label: "Inside Jokes", val: "Too Many" },
        { label: "Bond", val: "Unbreakable" }
      ],
      momentsFilter: "THE MEMORIES"
    },
    {
      num: "05",
      title: "THE FUTURE",
      quote: "We don't know exactly where this journey ends. But we know it doesn't end here.",
      story: "Masa depan menanti di depan mata. Karier di bidang rekayasa data, arsitektur software, manajemen teknologi, hingga wirausaha digital. Satu hal yang pasti: lingkaran ini akan selalu ada. Kami melangkah dengan kepala tegak, siap menyongsong babak berikutnya dengan keyakinan penuh.",
      tags: ["Graduation", "Career Ready", "Dream Big", "Next Chapter"],
      highlights: [
        { label: "Destination", val: "Tomorrow & Beyond" },
        { label: "Motto", val: "One Circle. Many Stories." },
        { label: "Chapter", val: "To Be Continued" }
      ],
      momentsFilter: "THE FUTURE"
    }
  ];

  let currentChapterIdx = 0;

  function renderChapter(idx) {
    if (idx < 0 || idx >= CHAPTERS.length) return;
    currentChapterIdx = idx;
    const ch = CHAPTERS[idx];

    // Update Progress Indicator
    const indicator = $("#chapterIndicator");
    if (indicator) {
      indicator.textContent = `${ch.num} / 05`;
    }

    // Update Buttons State
    const prevBtn = $("#prevChapterBtn");
    const nextBtn = $("#nextChapterBtn");
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === CHAPTERS.length - 1;

    // Update Chapter Title & Body
    const titleEl = $("#chapterTitle");
    const quoteEl = $("#chapterQuote");
    const storyEl = $("#chapterStory");
    const tagsEl = $("#chapterTags");
    const highlightsEl = $("#chapterHighlights");
    const chapterBadge = $("#chapterBadge");

    if (chapterBadge) chapterBadge.textContent = `CHAPTER ${ch.num}`;
    if (titleEl) titleEl.textContent = ch.title;
    if (quoteEl) quoteEl.textContent = `“${ch.quote}”`;
    if (storyEl) storyEl.textContent = ch.story;

    if (tagsEl) {
      tagsEl.innerHTML = ch.tags.map(t => `<span class="tag tag--accent">${esc(t)}</span>`).join(" ");
    }

    if (highlightsEl) {
      highlightsEl.innerHTML = ch.highlights.map(h => `
        <div class="yb-highlight-item">
          <span class="yb-highlight-val">${esc(h.val)}</span>
          <span class="yb-highlight-lbl">${esc(h.label)}</span>
        </div>
      `).join("");
    }

    // Update Tab / Pill list
    $$(".chapter-nav-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === idx);
      btn.setAttribute("aria-selected", i === idx ? "true" : "false");
    });

    // Render associated chapter moments if on yearbook page
    renderChapterPhotos(ch.momentsFilter);
  }

  function renderChapterPhotos(filterKey) {
    const photoContainer = $("#chapterPhotoSpread");
    if (!photoContainer) return;

    const all = window.MAFIA_MOMENTS || [];
    const moments = all.filter(m => m.chapter === filterKey);
    const displayList = moments.length > 0 ? moments.slice(0, 3) : all.slice(0, 3);

    photoContainer.replaceChildren();
    displayList.forEach((m, i) => {
      const card = el("div", `yb-spread-card yb-card-${i + 1}`);
      card.append(
        createMedia(m.image || m.src, m.title || m.caption, m.category, m.id),
        el("div", "yb-spread-cap", `<b>#${String(m.id).padStart(3, "0")}</b> · ${esc(m.title || m.caption)}`)
      );
      if (window.GalleryEngine) {
        card.onclick = () => window.GalleryEngine.openMoment(m);
      }
      photoContainer.append(card);
    });
  }

  function initYearbook() {
    const prevBtn = $("#prevChapterBtn");
    const nextBtn = $("#nextChapterBtn");

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentChapterIdx > 0) renderChapter(currentChapterIdx - 1);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (currentChapterIdx < CHAPTERS.length - 1) renderChapter(currentChapterIdx + 1);
      };
    }

    // Chapter selector pills
    $$(".chapter-nav-btn").forEach((btn, i) => {
      btn.onclick = () => renderChapter(i);
    });

    // Initial render
    renderChapter(0);
  }

  window.YearbookEngine = {
    init: initYearbook,
    goToChapter: renderChapter,
    chapters: CHAPTERS
  };
})();
