# Mafia Information Systems — Information Systems 2023, Universitas Terbuka

## Jalankan
VS Code + Live Server, atau `python3 -m http.server` lalu buka http://localhost:8000.
(Membuka index.html langsung lewat file:// memblokir pembacaan JSON.)

## Sebelum publish (satu kali)
Ganti domain placeholder di semua file sekaligus (canonical, Open Graph, QR):
    sed -i 's#https://example.com#https://DOMAIN-ANDA#g' index.html js/main.js
Deploy ke hosting statis apa pun (GitHub Pages, Netlify, Cloudflare Pages, dll).

## Ganti konten
- Anggota / project / gallery: `data/*.json`. Field `photo`, `image`, `src` kosong = placeholder. Isi dengan path, mis. `assets/members/member-01.jpg`.
- Role anggota harus salah satu dari 8 role di `ROLES` (js/main.js) agar filter berfungsi.
- Logo: master `assets/logo/mafia-logo.png`; versi web `mafia-logo-320/640/960.webp`; favicon di `assets/icons/`; kartu share `assets/og-image.png` (1200x630).

## Strategi gambar
Foto anggota: crop 4:5, lebar 800px. Foto gallery/project: lebar maksimum 1200px. Simpan sebagai WebP (kualitas 80) atau JPG, target di bawah 150 KB per foto. Semua gambar dimuat lazy dan async, jadi ukuran kecil menjaga halaman tetap cepat di HP.

## Arsitektur
HTML = struktur, css/style.css = visual + responsive + motion, js/main.js = rendering data, filter, modal, lightbox, cursor, QR, data/*.json = konten. js/vendor/qrcode.js = library QR lokal (MIT), tanpa CDN.
