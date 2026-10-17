/**
 * MAFIA INFORMATION SYSTEMS
 * Central Site Configuration & Constants
 *
 * Silakan modifikasi konfigurasi di bawah ini sesuai kebutuhan produksi.
 */

const SITE_CONFIG = {
  siteName: "Mafia Information Systems",
  tagline: "One Circle. Many Stories.",
  classYear: 2023,
  faculty: "Fakultas Sains dan Teknologi",
  university: "Universitas Terbuka",
  studyProgram: "Sistem Informasi",

  // Official Social Media URLs
  instagramUrl: "https://www.instagram.com/mafia.insystems/",
  youtubeUrl: "https://www.youtube.com/channel/UCd2Jshkolu7lEIdCZVqCGZg",

  // Destination for QR Code & Social Hub
  // Ganti dengan URL domain produksi jika sudah dideploy, misalnya: "https://mafiainsystems.com/social.html"
  socialHubUrl: "social.html",

  // Graduation Countdown Date
  // Biarkan `null` untuk menampilkan status "COMING SOON".
  // Jika tanggal resmi sudah tersedia, isi dengan format YYYY-MM-DD, contoh: "2027-09-15"
  graduationDate: null
};

const BRAND_PHILOSOPHY = [
  {
    key: "CONNECTED",
    title: "Connected",
    description: "Kami mungkin datang dari latar belakang yang berbeda, tetapi terhubung melalui satu perjalanan."
  },
  {
    key: "LOYALTY",
    title: "Loyalty",
    description: "Kami tumbuh bersama, saling membantu, dan tetap menjaga hubungan meskipun perjalanan kuliah berubah."
  },
  {
    key: "VISIONARY",
    title: "Visionary",
    description: "Kami tidak hanya belajar untuk menyelesaikan tugas, tetapi membangun cara berpikir untuk masa depan."
  },
  {
    key: "DREAM_BIG",
    title: "Dream Big",
    description: "Kami memiliki tujuan yang berbeda, namun berani bermimpi lebih besar mewujudkan karir yang gemilang."
  },
  {
    key: "HUSTLER",
    title: "Hustler",
    description: "Kami belajar menghadapi tantangan dan tidak menunggu kesempatan datang dengan terus bergerak maju."
  }
];

const ROLES = [
  ["The Brain", "Selalu punya ide ketika kelompok mulai bingung."],
  ["The Hustler", "Kalau sudah deadline, orang ini tiba-tiba menjadi sangat produktif."],
  ["The Creative", "Orang yang membuat tugas biasa menjadi terlihat keren."],
  ["The Debugger", "Dipanggil ketika kode mulai mengatakan 'error'."],
  ["The Connector", "Orang yang tahu siapa melakukan apa dan siapa harus dihubungi."],
  ["The Ghost", "Jarang terlihat, tetapi tiba-tiba muncul ketika dibutuhkan."],
  ["The Chaos Agent", "Sumber jokes, meme, dan keributan internal."],
  ["The Caretaker", "Yang selalu memastikan semua orang baik-baik saja."]
];

const STICKERS = [
  "Deadline mode",
  "Gang of ideas",
  "404: sleep not found",
  "Trust the process",
  "Mafia moment",
  "No deadline? Impossible."
];

const COLORS = ["var(--red)", "var(--yellow)", "var(--blue)", "var(--mint)"];

// Helper functions
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));
const color = i => COLORS[Math.abs(Number(i) || 0) % COLORS.length];

async function loadJSON(path, key) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(path);
  const data = (await res.json())[key];
  if (!Array.isArray(data)) throw new Error(`${path}: invalid data`);
  return data;
}

function showToast(msg, duration = 3000) {
  let toast = $("#siteToast");
  if (!toast) {
    toast = el("div", "site-toast", "");
    toast.id = "siteToast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), duration);
}

/* Graceful image / avatar creator */
function createMedia(src, alt, label, i) {
  const wrap = el("span", "media");
  const fallback = () => {
    const p = el("span", "placeholder", esc(label || "M"));
    p.style.setProperty("--c", color(i));
    p.setAttribute("role", "img");
    p.setAttribute("aria-label", alt || "Placeholder");
    wrap.replaceChildren(p);
  };
  if (!src) {
    fallback();
    return wrap;
  }
  const im = new Image();
  im.alt = alt || "";
  im.loading = "lazy";
  im.decoding = "async";
  im.onerror = fallback;
  im.src = src;
  wrap.append(im);
  return wrap;
}
