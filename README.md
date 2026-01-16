# Al-Quran Digital

Web aplikasi Al-Quran yang responsive dengan fitur lengkap untuk membaca Al-Quran dengan mudah.

## ✨ Fitur

- **Autentikasi**: Login dan Daftar akun
- **Baca Al-Quran**: Akses semua 114 surah dengan terjemahan Indonesia
- **Transliterasi Latin**: Bacaan latin untuk memudahkan membaca ayat
- **Audio Player**: Dengarkan bacaan Al-Quran dengan fitur lengkap:
  - 6 pilihan qari terkenal (Mishary Alafasy, Abdul Basit, dll)
  - Play/pause/previous/next controls
  - Loop ayat
  - Speed control (0.5x - 2x)
  - Auto-scroll ke ayat yang sedang diputar
  - Progress bar dengan seek
- **Tafsir Al-Quran**: Penjelasan mendalam setiap ayat dengan multiple sumber:
  - Tafsir Jalalayn
  - Tafsir Quraish Shihab
- **Bookmark Ayat**: Simpan ayat favorit untuk akses cepat
- **Last Read**: Otomatis menyimpan surah terakhir dibaca
- **Font Settings**: Pengaturan aksesibilitas untuk kenyamanan membaca:
  - Slider ukuran font Arab (1-3rem)
  - Slider ukuran font terjemahan (0.75-1.5rem)
  - Toggle show/hide bacaan latin
  - Toggle show/hide terjemahan
  - Reset ke pengaturan default
- **Copy & Share Ayat**: Bagikan ayat dengan mudah:
  - Copy ayat (Arab + Latin + Terjemahan) dengan 1 klik
  - Share ke WhatsApp/Social Media
  - Format yang rapi dan profesional
- **Jadwal Sholat**: Waktu sholat real-time:
  - Deteksi lokasi otomatis (Geolocation)
  - Countdown ke waktu sholat berikutnya
  - Widget compact di dock navigation
  - Update setiap detik
- **Doa & Dzikir Collection**: Koleksi lengkap doa dan dzikir:
  - Doa harian (pagi, sore, makan, perjalanan, dll)
  - Dzikir counter dengan haptic feedback
  - 4 jenis dzikir (Tasbih, Tahmid, Takbir, Tahlil)
  - Target counter (33x, 100x, 1000x)
  - Copy & share doa
  - API integration dengan fallback static data
- **Islamic Calendar Integration**: Kalender Islam lengkap:
  - Tanggal Hijriah real-time dengan API Aladhan
  - Ramadan countdown dengan timer live
  - Event Islam penting (Ramadan, Eid, Maulid, dll)
  - Hari-hari istimewa dalam Islam
  - Navigation bulan Hijriah
  - Persiapan khusus Ramadan 1446 H
- **Night Reading Mode**: Mode baca malam untuk kenyamanan mata:
  - 3 mode: Light, Dark, Night
  - Toggle cepat dengan 1 klik
  - Warna yang nyaman untuk mata
- **Profil User**: Sistem profil lengkap dengan gamification:
  - Avatar customizable (6 pilihan)
  - Statistik bacaan (surah dibaca, bookmark, streak)
  - Achievement badges (5 pencapaian)
  - Edit profil (nama, avatar)
- **Pencarian**: Cari surah berdasarkan nama atau nomor
- **Responsive**: Tampilan optimal di mobile, tablet, dan desktop
- **Dark Mode**: Toggle antara light dan dark theme
- **Particle Background**: Animasi background interaktif
- **Glassmorphism UI**: Desain modern dengan efek glass

## 🎨 Design System

Aplikasi ini menggunakan brand guidelines dari Hilmi Khaidar N Portfolio dengan:
- Color palette minimalis (light & dark mode)
- Typography system fonts untuk performa optimal
- Spacing berbasis 8px grid system
- Smooth animations dengan cubic-bezier easing
- Glassmorphism effects dengan backdrop blur

## 🚀 Cara Menggunakan

### Web Version
1. Buka `index.html` di browser
2. Daftar akun baru atau login
3. Browse dan baca surah Al-Quran
4. Gunakan search untuk mencari surah
5. Toggle dark mode sesuai preferensi

### Build APK (Android)
Untuk membuat aplikasi Android (APK), ikuti panduan lengkap di **[BUILD_APK.md](BUILD_APK.md)**

Ringkasan langkah:
1. Install Node.js dan Android Studio
2. Jalankan `npm install`
3. Jalankan `npx cap add android`
4. Jalankan `npx cap copy android`
5. Jalankan `npx cap open android`
6. Build APK di Android Studio

Lihat [BUILD_APK.md](BUILD_APK.md) untuk panduan detail dengan troubleshooting.

## 📱 Responsive Breakpoints

- Mobile: < 480px
- Mobile Large: 480px - 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔌 API

Menggunakan:
- [Al-Quran Cloud API](https://alquran.cloud/api) untuk data Al-Quran dan terjemahan
- [Aladhan API](https://aladhan.com/api) untuk waktu sholat dan konversi tanggal Hijriah
- [Islamic API Indonesia](https://islamic-api-indonesia.herokuapp.com) untuk doa harian

## 💾 Local Storage

Data yang disimpan:
- User accounts (email, password, nama)
- Current user session
- Theme preference (light/dark/night)
- Bookmarks per user (ayat favorit)
- Last read position per user
- Font settings (ukuran, visibility)
- Dzikir counter progress
- User statistics & achievements

## 🎯 Teknologi

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Canvas API (Particle animation)
- Fetch API (Al-Quran data)
- Capacitor (untuk build APK Android)

## 📱 Mobile Optimizations

Aplikasi ini sudah dioptimasi untuk mobile dengan:
- Viewport meta tags untuk mobile devices
- Touch-friendly UI dengan minimum tap target 44x44px
- Responsive design untuk semua ukuran layar
- PWA-ready dengan meta tags untuk iOS dan Android
- Smooth scrolling dan animations
- Offline-capable dengan localStorage
- No zoom/pinch untuk pengalaman native-like

## 📄 Lisensi

Personal project - Free to use
