// State Management
let currentUser = null;
let surahData = [];
let bookmarks = [];
let lastRead = null;
let currentSurahNumber = null;

// User Stats
let userStats = {
    surahsRead: [],
    totalAyahsRead: 0,
    totalReadingTime: 0,
    streak: 0,
    lastReadDate: null,
    achievements: []
};

// Audio Player State
let audioPlayer = null;
let currentAudio = null;
let isPlaying = false;
let currentAyahIndex = 0;
let currentQari = 'ar.alafasy'; // Default: Mishary Rashid Alafasy
let playbackSpeed = 1.0;
let isLooping = false;
let autoScroll = true;

// Font Settings State
let fontSettings = {
    arabicSize: 1.5, // rem
    translationSize: 1.0, // rem
    showLatin: true,
    showTranslation: true
};

// Islamic Calendar State
let currentHijriDate = null;
let ramadanDate = null;
let islamicEvents = [];
let prayerTimes = null;
let userLocation = null;

// Doa & Dzikir State
let doaData = [];
let currentDoaCategory = null;
let dzikirCounter = 0;
let dzikirTarget = 33;
let currentDzikir = 'tasbih';

// Islamic months in Arabic and Indonesian
const hijriMonths = [
    { arabic: 'مُحَرَّم', indonesian: 'Muharram' },
    { arabic: 'صَفَر', indonesian: 'Safar' },
    { arabic: 'رَبِيع الأَوَّل', indonesian: 'Rabiul Awwal' },
    { arabic: 'رَبِيع الآخِر', indonesian: 'Rabiul Akhir' },
    { arabic: 'جُمَادَى الأُولَى', indonesian: 'Jumadil Awwal' },
    { arabic: 'جُمَادَى الآخِرَة', indonesian: 'Jumadil Akhir' },
    { arabic: 'رَجَب', indonesian: 'Rajab' },
    { arabic: 'شَعْبَان', indonesian: 'Syaban' },
    { arabic: 'رَمَضَان', indonesian: 'Ramadan' },
    { arabic: 'شَوَّال', indonesian: 'Syawal' },
    { arabic: 'ذُو القَعْدَة', indonesian: 'Dzulqaidah' },
    { arabic: 'ذُو الحِجَّة', indonesian: 'Dzulhijjah' }
];

// Dzikir data
const dzikirData = {
    tasbih: {
        arabic: 'سُبْحَانَ اللَّهِ',
        latin: 'Subhanallah',
        meaning: 'Maha Suci Allah'
    },
    tahmid: {
        arabic: 'الْحَمْدُ لِلَّهِ',
        latin: 'Alhamdulillah',
        meaning: 'Segala puji bagi Allah'
    },
    takbir: {
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allahu Akbar',
        meaning: 'Allah Maha Besar'
    },
    tahlil: {
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
        latin: 'La ilaha illallah',
        meaning: 'Tiada Tuhan selain Allah'
    }
};

// Available Qaris (verified to have complete recordings)
const qaris = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', language: 'Arabic' },
    { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar', language: 'Arabic' },
    { id: 'ar.hanirifai', name: 'Hani Ar-Rifai', language: 'Arabic' },
    { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', language: 'Arabic' },
    { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', language: 'Arabic' },
    { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyub', language: 'Arabic' }
];

// DOM Elements with null checks
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const surahList = document.getElementById('surahList');
const surahDetail = document.getElementById('surahDetail');
const surahContent = document.getElementById('surahContent');
const backBtn = document.getElementById('backBtn');
const searchSurah = document.getElementById('searchSurah');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        initParticles();
        loadTheme();
        checkAuth();
        loadSurahList();
        loadBookmarks();
        loadLastRead();
        loadFontSettings();
        initReadingProgress();
        loadUserStats();
        initPrayerTimes();
        initPrayerDetailModal();
        
        // Ensure modals are hidden on load
        const prayerModal = document.getElementById('prayerTimesModal');
        const doaModal = document.getElementById('doaModal');
        const calendarModal = document.getElementById('islamicCalendarModal');
        const profileModal = document.getElementById('profileModal');
        const fontModal = document.getElementById('fontSettingsModal');
        const prayerDetailModal = document.getElementById('prayerDetailModal');
        
        if (prayerModal) prayerModal.classList.add('hidden');
        if (doaModal) doaModal.classList.add('hidden');
        if (calendarModal) calendarModal.classList.add('hidden');
        if (profileModal) profileModal.classList.add('hidden');
        if (fontModal) fontModal.classList.add('hidden');
        if (prayerDetailModal) prayerDetailModal.classList.add('hidden');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Reading Mode Toggle (2 modes: Light, Night)
function toggleReadingMode() {
    const currentMode = document.documentElement.getAttribute('data-theme') || 'light';
    const nextMode = currentMode === 'light' ? 'night' : 'light';
    
    document.documentElement.setAttribute('data-theme', nextMode);
    localStorage.setItem('theme', nextMode);
    
    // Update theme toggle icon with animation
    updateThemeIcon(nextMode);
    
    showNotification(`Mode: ${nextMode === 'night' ? '🌙 Night' : '☀️ Light'}`);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('dockThemeToggle');
    if (!themeToggle) return;
    
    // Add a subtle animation to the button
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 150);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Auth Functions
function checkAuth() {
    try {
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            showMainApp();
        } else {
            showLoginPage();
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        showLoginPage();
    }
}

function showLoginPage() {
    loginPage.classList.remove('hidden');
    registerPage.classList.add('hidden');
    mainApp.classList.add('hidden');
}

function showRegisterPage() {
    loginPage.classList.add('hidden');
    registerPage.classList.remove('hidden');
    mainApp.classList.add('hidden');
}

function showMainApp() {
    loginPage.classList.add('hidden');
    registerPage.classList.add('hidden');
    mainApp.classList.remove('hidden');
    loadBookmarks();
    loadLastRead();
    initFontSettingsModal();
    initProfileModal();
    initDockProfileDropdown();
    updateDockUserAvatar();
    
    // Initialize dock navigation event listeners
    initDockNavigation();
}

if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterPage();
    });
}

if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginPage();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            showMainApp();
        } else {
            alert('Email atau password salah!');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            alert('Email sudah terdaftar!');
            return;
        }
        
        const newUser = { 
            name, 
            email, 
            password,
            avatar: '👤',
            joinedDate: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Pendaftaran berhasil! Silakan login.');
        showLoginPage();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        showLoginPage();
    });
}

// Quran API Functions
async function loadSurahList() {
    // Show loading state
    surahList.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Memuat daftar surah...</p></div>';
    
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        surahData = data.data;
        displaySurahList(surahData);
    } catch (error) {
        console.error('Error loading surah list:', error);
        surahList.innerHTML = `
            <div class="error-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>Gagal memuat data</p>
                <button class="btn-retry" onclick="loadSurahList()">Coba Lagi</button>
            </div>
        `;
        showError('Gagal memuat daftar surah. Cek koneksi internet.');
    }
}

function displaySurahList(surahs) {
    surahList.innerHTML = '';
    surahs.forEach(surah => {
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.innerHTML = `
            <div class="surah-header">
                <div class="surah-number">${surah.number}</div>
                <div class="surah-arabic">${surah.name}</div>
            </div>
            <div class="surah-name">${surah.englishName}</div>
            <div class="surah-info">${surah.englishNameTranslation} • ${surah.numberOfAyahs} Ayat • ${surah.revelationType}</div>
        `;
        card.addEventListener('click', () => {
            window.loadSurahDetail(surah.number);
        });
        surahList.appendChild(card);
    });
}

window.loadSurahDetail = async function(surahNumber) {
    try {
        currentSurahNumber = surahNumber;
        saveLastRead(surahNumber);
        trackSurahRead(surahNumber);
        stopAudio(); // Stop any playing audio
        
        surahList.classList.add('hidden');
        surahDetail.classList.remove('hidden');
        surahContent.innerHTML = '<p style="text-align: center;">Memuat...</p>';
        
        const [arabicRes, translationRes, latinRes, tafsirJalalaynRes, tafsirQuraishRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.jalalayn`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.quraish`)
        ]);
        
        const arabicData = await arabicRes.json();
        const translationData = await translationRes.json();
        const latinData = await latinRes.json();
        const tafsirJalalayn = await tafsirJalalaynRes.json();
        const tafsirQuraish = await tafsirQuraishRes.json();
        
        const surah = arabicData.data;
        const translation = translationData.data;
        const latin = latinData.data;
        const jalalayn = tafsirJalalayn.data;
        const quraish = tafsirQuraish.data;
        
        let html = `
            <div class="surah-detail-header">
                <div class="surah-detail-arabic">${surah.name}</div>
                <div class="surah-detail-name">${surah.englishName}</div>
                <div class="surah-info">${surah.englishNameTranslation} • ${surah.numberOfAyahs} Ayat • ${surah.revelationType}</div>
            </div>
            
            <!-- Audio Player (Hidden - use floating button) -->
            <div class="audio-player-container" id="audioPlayerContainer" style="display: none;">
                <div class="audio-player">
                    <div class="audio-controls">
                        <button class="audio-btn" id="prevAyahBtn" title="Ayat sebelumnya">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                                <line x1="5" y1="19" x2="5" y2="5"></line>
                            </svg>
                        </button>
                        <button class="audio-btn audio-btn-play" id="playPauseBtn" title="Play/Pause">
                            <svg id="playIcon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <svg id="pauseIcon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        </button>
                        <button class="audio-btn" id="nextAyahBtn" title="Ayat berikutnya">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                <line x1="19" y1="5" x2="19" y2="19"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="audio-info">
                        <div class="audio-ayah-info" id="audioAyahInfo">Pilih ayat untuk diputar</div>
                        <div class="audio-progress-container">
                            <div class="audio-progress-bar" id="audioProgressBar">
                                <div class="audio-progress-fill" id="audioProgressFill"></div>
                            </div>
                            <div class="audio-time">
                                <span id="currentTime">0:00</span>
                                <span id="duration">0:00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="audio-settings">
                        <button class="audio-btn audio-btn-small ${isLooping ? 'active' : ''}" id="loopBtn" title="Loop ayat">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="17 1 21 5 17 9"></polyline>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                <polyline points="7 23 3 19 7 15"></polyline>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                            </svg>
                        </button>
                        <button class="audio-btn audio-btn-small ${autoScroll ? 'active' : ''}" id="autoScrollBtn" title="Auto scroll">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        </button>
                        <div class="speed-control">
                            <button class="audio-btn audio-btn-small" id="speedBtn" title="Kecepatan">
                                ${playbackSpeed}x
                            </button>
                        </div>
                        <div class="qari-selector">
                            <select id="qariSelect" class="qari-select">
                                ${qaris.map(q => `<option value="${q.id}" ${q.id === currentQari ? 'selected' : ''}>${q.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        surah.ayahs.forEach((ayah, index) => {
            const isBookmarked = bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayah.numberInSurah);
            const bookmarkIcon = isBookmarked ? 'bookmark-filled' : 'bookmark-outline';
            
            html += `
                <div class="ayah-card" data-ayah="${ayah.numberInSurah}" id="ayah-${surahNumber}-${ayah.numberInSurah}">
                    <div class="ayah-arabic">${ayah.text}</div>
                    <div class="ayah-latin">${latin.ayahs[index].text}</div>
                    <div class="ayah-translation">${translation.ayahs[index].text}</div>
                    <div class="ayah-footer">
                        <div class="ayah-number">Ayat ${ayah.numberInSurah}</div>
                        <div class="ayah-actions">
                            <button class="btn-audio" onclick="playAyah(${index})" title="Putar ayat ini">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            </button>
                            <button class="btn-copy" onclick="copyAyah(${surahNumber}, ${ayah.numberInSurah}, '${surah.englishName}')" title="Copy ayat">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <button class="btn-share" onclick="shareAyah(${surahNumber}, ${ayah.numberInSurah}, '${surah.englishName}')" title="Share ayat">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                            </button>
                            <button class="btn-bookmark ${bookmarkIcon}" onclick="toggleBookmark(${surahNumber}, ${ayah.numberInSurah}, '${surah.englishName}', '${ayah.text.substring(0, 50).replace(/'/g, "\\'")}...')" title="Bookmark ayat ini">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                            <button class="btn-tafsir" onclick="toggleTafsir(${ayah.numberInSurah})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                Tafsir
                            </button>
                        </div>
                    </div>
                    <div class="tafsir-container hidden" id="tafsir-${ayah.numberInSurah}">
                        <div class="tafsir-tabs">
                            <button class="tafsir-tab active" onclick="showTafsir(${ayah.numberInSurah}, 'jalalayn')">Tafsir Jalalayn</button>
                            <button class="tafsir-tab" onclick="showTafsir(${ayah.numberInSurah}, 'quraish')">Tafsir Quraish Shihab</button>
                        </div>
                        <div class="tafsir-content">
                            <div class="tafsir-text active" id="tafsir-${ayah.numberInSurah}-jalalayn">
                                <div class="tafsir-source">Tafsir Jalalayn</div>
                                <p>${jalalayn.ayahs[index].text}</p>
                            </div>
                            <div class="tafsir-text hidden" id="tafsir-${ayah.numberInSurah}-quraish">
                                <div class="tafsir-source">Tafsir Quraish Shihab</div>
                                <p>${quraish.ayahs[index].text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        surahContent.innerHTML = html;
        initAudioPlayer(surah);
    } catch (error) {
        console.error('Error loading surah detail:', error);
        surahContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Gagal memuat surah. Silakan coba lagi.</p>';
    }
}

// Toggle Tafsir Display
window.toggleTafsir = function(ayahNumber) {
    const tafsirContainer = document.getElementById(`tafsir-${ayahNumber}`);
    tafsirContainer.classList.toggle('hidden');
}

// Switch between Tafsir sources
window.showTafsir = function(ayahNumber, source) {
    const container = document.getElementById(`tafsir-${ayahNumber}`);
    const tabs = container.querySelectorAll('.tafsir-tab');
    const contents = container.querySelectorAll('.tafsir-text');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.add('hidden'));
    
    event.target.classList.add('active');
    document.getElementById(`tafsir-${ayahNumber}-${source}`).classList.remove('hidden');
}

// Bookmark Functions
function loadBookmarks() {
    const saved = localStorage.getItem(`bookmarks_${currentUser?.email}`);
    bookmarks = saved ? JSON.parse(saved) : [];
}

function saveBookmarks() {
    if (currentUser) {
        localStorage.setItem(`bookmarks_${currentUser.email}`, JSON.stringify(bookmarks));
    }
}

window.toggleBookmark = function(surahNumber, ayahNumber, surahName, ayahPreview) {
    const existingIndex = bookmarks.findIndex(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    
    if (existingIndex > -1) {
        bookmarks.splice(existingIndex, 1);
        showSuccess('Bookmark dihapus');
    } else {
        bookmarks.push({
            surahNumber,
            ayahNumber,
            surahName,
            ayahPreview,
            timestamp: new Date().toISOString()
        });
        showSuccess('Bookmark tersimpan');
    }
    
    saveBookmarks();
    
    // Update UI
    const bookmarkBtn = document.querySelector(`#ayah-${surahNumber}-${ayahNumber} .btn-bookmark`);
    if (bookmarkBtn) {
        const svg = bookmarkBtn.querySelector('svg');
        if (existingIndex > -1) {
            bookmarkBtn.classList.remove('bookmark-filled');
            bookmarkBtn.classList.add('bookmark-outline');
            svg.setAttribute('fill', 'none');
        } else {
            bookmarkBtn.classList.remove('bookmark-outline');
            bookmarkBtn.classList.add('bookmark-filled');
            svg.setAttribute('fill', 'currentColor');
        }
    }
}

function loadLastRead() {
    const saved = localStorage.getItem(`lastRead_${currentUser?.email}`);
    lastRead = saved ? JSON.parse(saved) : null;
}

function saveLastRead(surahNumber) {
    if (currentUser) {
        lastRead = {
            surahNumber,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`lastRead_${currentUser.email}`, JSON.stringify(lastRead));
    }
}

function showBookmarksView() {
    surahList.classList.add('hidden');
    surahDetail.classList.add('hidden');
    
    const bookmarksView = document.getElementById('bookmarksView');
    bookmarksView.classList.remove('hidden');
    
    displayBookmarks();
}

function displayBookmarks() {
    const bookmarksContainer = document.getElementById('bookmarksContainer');
    
    if (bookmarks.length === 0 && !lastRead) {
        bookmarksContainer.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3>Belum Ada Bookmark</h3>
                <p>Bookmark ayat favorit Anda untuk akses cepat</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    // Last Read Section
    if (lastRead) {
        const surah = surahData.find(s => s.number === lastRead.surahNumber);
        if (surah) {
            html += `
                <div class="bookmark-section">
                    <h3 class="bookmark-section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Terakhir Dibaca
                    </h3>
                    <div class="bookmark-card last-read" onclick="loadSurahDetail(${lastRead.surahNumber})">
                        <div class="bookmark-header">
                            <div class="surah-number">${surah.number}</div>
                            <div class="bookmark-info">
                                <div class="bookmark-surah">${surah.englishName}</div>
                                <div class="bookmark-meta">${surah.englishNameTranslation}</div>
                            </div>
                        </div>
                        <div class="bookmark-time">${formatTime(lastRead.timestamp)}</div>
                    </div>
                </div>
            `;
        }
    }
    
    // Bookmarks Section
    if (bookmarks.length > 0) {
        html += `
            <div class="bookmark-section">
                <h3 class="bookmark-section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Ayat Favorit (${bookmarks.length})
                </h3>
        `;
        
        bookmarks.slice().reverse().forEach(bookmark => {
            html += `
                <div class="bookmark-card" onclick="goToBookmark(${bookmark.surahNumber}, ${bookmark.ayahNumber})">
                    <div class="bookmark-header">
                        <div class="surah-number">${bookmark.surahNumber}:${bookmark.ayahNumber}</div>
                        <div class="bookmark-info">
                            <div class="bookmark-surah">${bookmark.surahName}</div>
                            <div class="bookmark-preview">${bookmark.ayahPreview}</div>
                        </div>
                    </div>
                    <div class="bookmark-footer">
                        <div class="bookmark-time">${formatTime(bookmark.timestamp)}</div>
                        <button class="btn-delete-bookmark" onclick="event.stopPropagation(); deleteBookmark(${bookmark.surahNumber}, ${bookmark.ayahNumber})" title="Hapus bookmark">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    bookmarksContainer.innerHTML = html;
}

window.goToBookmark = function(surahNumber, ayahNumber) {
    window.loadSurahDetail(surahNumber).then(() => {
        setTimeout(() => {
            const ayahElement = document.getElementById(`ayah-${surahNumber}-${ayahNumber}`);
            if (ayahElement) {
                ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                ayahElement.style.animation = 'highlight 2s ease';
            }
        }, 500);
    });
}

window.deleteBookmark = function(surahNumber, ayahNumber) {
    const index = bookmarks.findIndex(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    if (index > -1) {
        bookmarks.splice(index, 1);
        saveBookmarks();
        displayBookmarks();
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        stopAudio();
        surahDetail.classList.add('hidden');
        surahList.classList.remove('hidden');
    });
}

// Search Function
if (searchSurah) {
    searchSurah.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = surahData.filter(surah => 
            surah.englishName.toLowerCase().includes(query) ||
            surah.englishNameTranslation.toLowerCase().includes(query) ||
            surah.number.toString().includes(query)
        );
        displaySurahList(filtered);
    });
}

// Initialize Dock Navigation
function initDockNavigation() {
    // Dock Theme Toggle
    const dockThemeToggle = document.getElementById('dockThemeToggle');
    if (dockThemeToggle) {
        dockThemeToggle.addEventListener('click', toggleReadingMode);
    }

    // Dock Prayer Toggle
    const dockPrayerToggle = document.getElementById('dockPrayerToggle');
    if (dockPrayerToggle) {
        dockPrayerToggle.addEventListener('click', () => {
            const prayerModal = document.getElementById('prayerTimesModal');
            if (prayerModal) {
                prayerModal.classList.remove('hidden');
            }
        });
    }

    // Dock Doa Toggle
    const dockDoaToggle = document.getElementById('dockDoaToggle');
    if (dockDoaToggle) {
        dockDoaToggle.addEventListener('click', () => {
            const doaModal = document.getElementById('doaModal');
            if (doaModal) {
                doaModal.classList.remove('hidden');
                loadDoaData();
            }
        });
    }

    // Dock Calendar Toggle
    const dockCalendarToggle = document.getElementById('dockCalendarToggle');
    if (dockCalendarToggle) {
        dockCalendarToggle.addEventListener('click', () => {
            const calendarModal = document.getElementById('islamicCalendarModal');
            if (calendarModal) {
                calendarModal.classList.remove('hidden');
                loadIslamicCalendar();
            }
        });
    }

    // Font Settings Button
    const fontSettingsBtn = document.getElementById('fontSettingsBtn');
    if (fontSettingsBtn) {
        fontSettingsBtn.addEventListener('click', () => {
            const fontModal = document.getElementById('fontSettingsModal');
            if (fontModal) {
                fontModal.classList.remove('hidden');
            }
        });
    }

    // Dock Navigation Items (List and Bookmarks)
    document.querySelectorAll('.dock-item').forEach(item => {
        // Add click animation to all dock items
        item.addEventListener('mousedown', () => {
            item.classList.add('clicked');
        });
        
        item.addEventListener('mouseup', () => {
            setTimeout(() => {
                item.classList.remove('clicked');
            }, 150);
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('clicked');
        });
        
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            
            // Only update active state for view buttons (not theme toggle)
            if (view) {
                document.querySelectorAll('.dock-item').forEach(i => {
                    if (i.getAttribute('data-view')) {
                        i.classList.remove('active');
                    }
                });
                item.classList.add('active');
                
                if (view === 'list') {
                    surahDetail.classList.add('hidden');
                    document.getElementById('bookmarksView').classList.add('hidden');
                    surahList.classList.remove('hidden');
                } else if (view === 'bookmarks') {
                    showBookmarksView();
                }
            }
        });
    });

    // Add click animation to dock buttons
    addClickAnimation(dockPrayerToggle);
    addClickAnimation(dockDoaToggle);
    addClickAnimation(dockCalendarToggle);
    addClickAnimation(fontSettingsBtn);
    addClickAnimation(dockThemeToggle);
}

// Add click animation to individual dock buttons
function addClickAnimation(element) {
    if (!element) return;
    
    element.addEventListener('mousedown', () => {
        element.classList.add('clicked');
    });
    
    element.addEventListener('mouseup', () => {
        setTimeout(() => {
            element.classList.remove('clicked');
        }, 150);
    });
    
    element.addEventListener('mouseleave', () => {
        element.classList.remove('clicked');
    });
}

// Prayer Times Modal
const prayerTimesModal = document.getElementById('prayerTimesModal');
const closePrayerTimes = document.getElementById('closePrayerTimes');

if (prayerTimesModal && closePrayerTimes) {
    const prayerModalOverlay = prayerTimesModal.querySelector('.modal-overlay');
    
    closePrayerTimes.addEventListener('click', () => {
        prayerTimesModal.classList.add('hidden');
    });
    
    if (prayerModalOverlay) {
        prayerModalOverlay.addEventListener('click', () => {
            prayerTimesModal.classList.add('hidden');
        });
    }
}

// Doa & Dzikir Modal
const doaModal = document.getElementById('doaModal');
const closeDoaModal = document.getElementById('closeDoaModal');

if (doaModal && closeDoaModal) {
    const doaModalOverlay = doaModal.querySelector('.modal-overlay');
    
    closeDoaModal.addEventListener('click', () => {
        doaModal.classList.add('hidden');
    });
    
    if (doaModalOverlay) {
        doaModalOverlay.addEventListener('click', () => {
            doaModal.classList.add('hidden');
        });
    }
}

// Islamic Calendar Modal
const islamicCalendarModal = document.getElementById('islamicCalendarModal');
const closeIslamicCalendar = document.getElementById('closeIslamicCalendar');

if (islamicCalendarModal && closeIslamicCalendar) {
    const calendarModalOverlay = islamicCalendarModal.querySelector('.modal-overlay');
    
    closeIslamicCalendar.addEventListener('click', () => {
        islamicCalendarModal.classList.add('hidden');
    });
    
    if (calendarModalOverlay) {
        calendarModalOverlay.addEventListener('click', () => {
            islamicCalendarModal.classList.add('hidden');
        });
    }
}

// Doa & Dzikir Tabs
document.querySelectorAll('.doa-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        switchDoaTab(tabName);
    });
});

// Dzikir Controls
document.getElementById('dzikirSelect').addEventListener('change', (e) => {
    currentDzikir = e.target.value;
    updateDzikirDisplay();
});

document.getElementById('counterBtn').addEventListener('click', () => {
    incrementDzikirCounter();
});

document.getElementById('resetCounter').addEventListener('click', () => {
    resetDzikirCounter();
});

document.querySelectorAll('.target-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-target'));
        setDzikirTarget(target);
    });
});

document.getElementById('backToDoa').addEventListener('click', () => {
    showDoaCategories();
});

// Particle Background
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 120;
    const mouse = { x: null, y: null, radius: 150 };
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }
        
        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';
            
            ctx.fillStyle = `rgba(${color}, 0.6)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.3;
                    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
}

// Audio Player Functions
function initAudioPlayer(surah) {
    audioPlayer = surah;
    currentAyahIndex = 0;
    
    // Show floating audio button
    toggleFloatingAudioButton(true);
    
    // Event Listeners
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevAyahBtn = document.getElementById('prevAyahBtn');
    const nextAyahBtn = document.getElementById('nextAyahBtn');
    const loopBtn = document.getElementById('loopBtn');
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    const speedBtn = document.getElementById('speedBtn');
    const qariSelect = document.getElementById('qariSelect');
    const audioProgressBar = document.getElementById('audioProgressBar');
    
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (prevAyahBtn) prevAyahBtn.addEventListener('click', playPreviousAyah);
    if (nextAyahBtn) nextAyahBtn.addEventListener('click', playNextAyah);
    if (loopBtn) loopBtn.addEventListener('click', toggleLoop);
    if (autoScrollBtn) autoScrollBtn.addEventListener('click', toggleAutoScroll);
    if (speedBtn) speedBtn.addEventListener('click', cycleSpeed);
    if (qariSelect) qariSelect.addEventListener('change', changeQari);
    if (audioProgressBar) audioProgressBar.addEventListener('click', seekAudio);
}

window.playAyah = function(ayahIndex) {
    if (!audioPlayer) {
        console.error('Audio player not initialized');
        return;
    }
    
    currentAyahIndex = ayahIndex;
    const ayah = audioPlayer.ayahs[ayahIndex];
    
    // Stop current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    
    // Create new audio
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${currentQari}/${ayah.number}.mp3`;
    currentAudio = new Audio(audioUrl);
    currentAudio.playbackRate = playbackSpeed;
    
    // Update UI
    updateAudioInfo();
    highlightCurrentAyah();
    
    // Event listeners
    currentAudio.addEventListener('loadedmetadata', () => {
        const durationEl = document.getElementById('duration');
        if (durationEl && currentAudio) {
            durationEl.textContent = formatAudioTime(currentAudio.duration);
        }
    });
    
    currentAudio.addEventListener('timeupdate', () => {
        if (!currentAudio) return;
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        const progressFill = document.getElementById('audioProgressFill');
        const currentTimeEl = document.getElementById('currentTime');
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatAudioTime(currentAudio.currentTime);
    });
    
    currentAudio.addEventListener('ended', () => {
        if (isLooping) {
            window.playAyah(currentAyahIndex);
        } else if (currentAyahIndex < audioPlayer.ayahs.length - 1) {
            playNextAyah();
        } else {
            stopAudio();
        }
    });
    
    currentAudio.addEventListener('error', (e) => {
        console.error('Error loading audio:', e);
        console.error('Audio URL:', audioUrl);
        
        // Show user-friendly message
        const audioAyahInfo = document.getElementById('audioAyahInfo');
        if (audioAyahInfo) {
            audioAyahInfo.textContent = 'Audio tidak tersedia untuk ayat ini. Coba qari lain.';
            audioAyahInfo.style.color = '#FF3B30';
            setTimeout(() => {
                audioAyahInfo.style.color = '';
            }, 3000);
        }
        
        isPlaying = false;
        if (currentAudio) {
            currentAudio = null;
        }
        if (document.getElementById('playIcon')) {
            updatePlayPauseButton();
        }
    });
    
    // Play
    currentAudio.play().catch(err => {
        console.error('Error playing audio:', err);
        isPlaying = false;
        currentAudio = null;
        if (document.getElementById('playIcon')) {
            updatePlayPauseButton();
        }
    });
    
    isPlaying = true;
    updatePlayPauseButton();
    
    // Auto scroll
    if (autoScroll) {
        scrollToCurrentAyah();
    }
}

function togglePlayPause() {
    if (!currentAudio) {
        playAyah(0);
        return;
    }
    
    if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
        updateFloatingButtonState(false);
    } else {
        currentAudio.play();
        isPlaying = true;
        updateFloatingButtonState(true);
    }
    
    updatePlayPauseButton();
}

function playPreviousAyah() {
    if (currentAyahIndex > 0) {
        playAyah(currentAyahIndex - 1);
    }
}

function playNextAyah() {
    if (currentAyahIndex < audioPlayer.ayahs.length - 1) {
        playAyah(currentAyahIndex + 1);
    }
}

function stopAudio() {
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (err) {
            console.error('Error stopping audio:', err);
        }
        currentAudio = null;
    }
    isPlaying = false;
    currentAyahIndex = 0;
    if (document.getElementById('playIcon')) { // Only update if elements exist
        updatePlayPauseButton();
    }
    removeAyahHighlight();
}

function toggleLoop() {
    isLooping = !isLooping;
    const loopBtn = document.getElementById('loopBtn');
    if (isLooping) {
        loopBtn.classList.add('active');
    } else {
        loopBtn.classList.remove('active');
    }
}

function toggleAutoScroll() {
    autoScroll = !autoScroll;
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    if (autoScroll) {
        autoScrollBtn.classList.add('active');
    } else {
        autoScrollBtn.classList.remove('active');
    }
}

function cycleSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    if (currentAudio) {
        currentAudio.playbackRate = playbackSpeed;
    }
    
    document.getElementById('speedBtn').textContent = `${playbackSpeed}x`;
}

function changeQari(event) {
    currentQari = event.target.value;
    
    // If audio is playing, restart with new qari
    if (isPlaying && currentAudio) {
        const wasPlaying = isPlaying;
        const savedTime = currentAudio.currentTime;
        const savedIndex = currentAyahIndex;
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        if (wasPlaying) {
            window.playAyah(savedIndex);
        }
    }
}

function seekAudio(event) {
    if (!currentAudio) return;
    
    const progressBar = document.getElementById('audioProgressBar');
    if (!progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    
    try {
        currentAudio.currentTime = percent * currentAudio.duration;
    } catch (err) {
        console.error('Error seeking audio:', err);
    }
}

function updateAudioInfo() {
    if (!audioPlayer) return; // Guard clause
    const ayah = audioPlayer.ayahs[currentAyahIndex];
    const audioAyahInfo = document.getElementById('audioAyahInfo');
    if (audioAyahInfo) {
        audioAyahInfo.textContent = `${audioPlayer.englishName} - Ayat ${ayah.numberInSurah}`;
    }
}

function updatePlayPauseButton() {
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    if (!playIcon || !pauseIcon) return; // Guard clause
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

function highlightCurrentAyah() {
    if (!audioPlayer) return; // Guard clause
    removeAyahHighlight();
    const ayah = audioPlayer.ayahs[currentAyahIndex];
    const ayahElement = document.getElementById(`ayah-${currentSurahNumber}-${ayah.numberInSurah}`);
    if (ayahElement) {
        ayahElement.classList.add('playing');
    }
}

function removeAyahHighlight() {
    document.querySelectorAll('.ayah-card.playing').forEach(el => {
        el.classList.remove('playing');
    });
}

function scrollToCurrentAyah() {
    if (!audioPlayer || !audioPlayer.ayahs[currentAyahIndex]) return;
    const ayah = audioPlayer.ayahs[currentAyahIndex];
    const ayahElement = document.getElementById(`ayah-${currentSurahNumber}-${ayah.numberInSurah}`);
    if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function formatAudioTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Font Settings Functions
function loadFontSettings() {
    const saved = localStorage.getItem('fontSettings');
    if (saved) {
        fontSettings = JSON.parse(saved);
    }
    applyFontSettings();
}

function saveFontSettings() {
    localStorage.setItem('fontSettings', JSON.stringify(fontSettings));
}

function applyFontSettings() {
    // Apply to CSS custom properties
    document.documentElement.style.setProperty('--arabic-font-size', `${fontSettings.arabicSize}rem`);
    document.documentElement.style.setProperty('--translation-font-size', `${fontSettings.translationSize}rem`);
    
    // Toggle visibility
    const latinElements = document.querySelectorAll('.ayah-latin');
    const translationElements = document.querySelectorAll('.ayah-translation');
    
    latinElements.forEach(el => {
        el.style.display = fontSettings.showLatin ? 'block' : 'none';
    });
    
    translationElements.forEach(el => {
        el.style.display = fontSettings.showTranslation ? 'block' : 'none';
    });
}

function initFontSettingsModal() {
    const modal = document.getElementById('fontSettingsModal');
    const openBtn = document.getElementById('fontSettingsBtn');
    const closeBtn = document.getElementById('closeFontSettings');
    
    if (!modal || !openBtn || !closeBtn) return;
    
    const overlay = modal.querySelector('.modal-overlay');
    const arabicSlider = document.getElementById('arabicSizeSlider');
    const translationSlider = document.getElementById('translationSizeSlider');
    const latinToggle = document.getElementById('showLatinToggle');
    const translationToggle = document.getElementById('showTranslationToggle');
    const resetBtn = document.getElementById('resetFontSettings');
    const arabicValue = document.getElementById('arabicSizeValue');
    const translationValue = document.getElementById('translationSizeValue');
    
    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        // Set current values
        if (arabicSlider && arabicValue) {
            arabicSlider.value = fontSettings.arabicSize;
            arabicValue.textContent = `${fontSettings.arabicSize}rem`;
        }
        if (translationSlider && translationValue) {
            translationSlider.value = fontSettings.translationSize;
            translationValue.textContent = `${fontSettings.translationSize}rem`;
        }
        if (latinToggle) latinToggle.checked = fontSettings.showLatin;
        if (translationToggle) translationToggle.checked = fontSettings.showTranslation;
    });
    
    // Close modal
    const closeModal = () => modal.classList.add('hidden');
    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    // Arabic size slider
    if (arabicSlider && arabicValue) {
        arabicSlider.addEventListener('input', (e) => {
            fontSettings.arabicSize = parseFloat(e.target.value);
            arabicValue.textContent = `${fontSettings.arabicSize}rem`;
            applyFontSettings();
            saveFontSettings();
        });
    }
    
    // Translation size slider
    if (translationSlider && translationValue) {
        translationSlider.addEventListener('input', (e) => {
            fontSettings.translationSize = parseFloat(e.target.value);
            translationValue.textContent = `${fontSettings.translationSize}rem`;
            applyFontSettings();
            saveFontSettings();
        });
    }
    
    // Latin toggle
    if (latinToggle) {
        latinToggle.addEventListener('change', (e) => {
            fontSettings.showLatin = e.target.checked;
            applyFontSettings();
            saveFontSettings();
        });
    }
    
    // Translation toggle
    if (translationToggle) {
        translationToggle.addEventListener('change', (e) => {
            fontSettings.showTranslation = e.target.checked;
            applyFontSettings();
            saveFontSettings();
        });
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            fontSettings = {
                arabicSize: 1.5,
                translationSize: 1.0,
                showLatin: true,
                showTranslation: true
            };
            if (arabicSlider) arabicSlider.value = 1.5;
            if (translationSlider) translationSlider.value = 1.0;
            if (latinToggle) latinToggle.checked = true;
            if (translationToggle) translationToggle.checked = true;
            if (arabicValue) arabicValue.textContent = '1.5rem';
            if (translationValue) translationValue.textContent = '1.0rem';
            applyFontSettings();
            saveFontSettings();
        });
    }
}

// Reading Progress Bar
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        // Show/hide scroll to top button
        if (scrollToTopBtn) {
            if (scrolled > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });
    
    // Scroll to top on click
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// User Stats Functions
function loadUserStats() {
    const saved = localStorage.getItem(`userStats_${currentUser?.email}`);
    if (saved) {
        userStats = JSON.parse(saved);
    }
    updateStreak();
}

function saveUserStats() {
    if (currentUser) {
        localStorage.setItem(`userStats_${currentUser.email}`, JSON.stringify(userStats));
    }
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastRead = userStats.lastReadDate;
    
    if (lastRead) {
        const lastDate = new Date(lastRead);
        const diffTime = new Date(today) - new Date(lastDate.toDateString());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Same day, keep streak
        } else if (diffDays === 1) {
            // Next day, increment streak
            userStats.streak++;
        } else {
            // Streak broken
            userStats.streak = 1;
        }
    } else {
        userStats.streak = 1;
    }
    
    userStats.lastReadDate = today;
    saveUserStats();
    checkAchievements();
}

function trackSurahRead(surahNumber) {
    if (!userStats.surahsRead.includes(surahNumber)) {
        userStats.surahsRead.push(surahNumber);
        saveUserStats();
        checkAchievements();
    }
}

function checkAchievements() {
    const achievements = [];
    
    // First Read
    if (userStats.surahsRead.length >= 1) {
        achievements.push('first-read');
    }
    
    // 10 Surah
    if (userStats.surahsRead.length >= 10) {
        achievements.push('10-surah');
    }
    
    // 5 Bookmarks
    if (bookmarks.length >= 5) {
        achievements.push('bookmark-5');
    }
    
    // 7 Days Streak
    if (userStats.streak >= 7) {
        achievements.push('streak-7');
    }
    
    // Khatam
    if (userStats.surahsRead.length >= 114) {
        achievements.push('khatam');
    }
    
    userStats.achievements = achievements;
    saveUserStats();
}

// Initialize Dock Profile Dropdown
function initDockProfileDropdown() {
    const profileToggle = document.getElementById('dockProfileToggle');
    const profileDropdown = document.getElementById('dockProfileDropdown');
    const openProfileBtn = document.getElementById('dockOpenProfile');
    const logoutBtn = document.getElementById('dockLogoutBtn');
    
    if (!profileToggle || !profileDropdown) return;
    
    // Toggle dropdown
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !profileToggle.contains(e.target)) {
            profileDropdown.classList.add('hidden');
        }
    });
    
    // Open profile modal
    if (openProfileBtn) {
        openProfileBtn.addEventListener('click', () => {
            profileDropdown.classList.add('hidden');
            const profileModal = document.getElementById('profileModal');
            if (profileModal) {
                profileModal.classList.remove('hidden');
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            currentUser = null;
            profileDropdown.classList.add('hidden');
            showLoginPage();
        });
    }
    
    // Update dropdown info
    updateDockDropdownInfo();
}

// Profile Modal
function initProfileModal() {
    const modal = document.getElementById('profileModal');
    const closeBtn = document.getElementById('closeProfile');
    const overlay = modal.querySelector('.modal-overlay');
    
    const nameInput = document.getElementById('profileNameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarSelector = document.getElementById('avatarSelector');
    
    // Close modal
    const closeModal = () => modal.classList.add('hidden');
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Load profile data
    modal.addEventListener('transitionend', () => {
        if (!modal.classList.contains('hidden')) {
            loadProfileData();
        }
    });
    
    // Save name
    saveNameBtn.addEventListener('click', () => {
        const newName = nameInput.value.trim();
        if (newName) {
            currentUser.name = newName;
            updateUserInStorage();
            document.getElementById('userName').textContent = newName;
        }
    });
    
    // Change avatar
    changeAvatarBtn.addEventListener('click', () => {
        avatarSelector.classList.toggle('hidden');
    });
    
    // Select avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            const avatar = option.getAttribute('data-avatar');
            currentUser.avatar = avatar;
            updateUserInStorage();
            updateUserAvatar();
            avatarSelector.classList.add('hidden');
        });
    });
}

function loadProfileData() {
    // Basic info
    document.getElementById('profileNameInput').value = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    // Joined date
    const joinedDate = currentUser.joinedDate || new Date().toISOString();
    const date = new Date(joinedDate);
    document.getElementById('profileJoined').textContent = `Bergabung ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    
    // Avatar
    const avatar = currentUser.avatar || '👤';
    document.getElementById('profileAvatarLarge').textContent = avatar;
    
    // Stats
    document.getElementById('statSurahsRead').textContent = userStats.surahsRead.length;
    document.getElementById('statBookmarks').textContent = bookmarks.length;
    document.getElementById('statStreak').textContent = `${userStats.streak} 🔥`;
    const progress = Math.round((userStats.surahsRead.length / 114) * 100);
    document.getElementById('statProgress').textContent = `${progress}%`;
    
    // Achievements
    document.querySelectorAll('.achievement-badge').forEach(badge => {
        const achievement = badge.getAttribute('data-achievement');
        if (userStats.achievements.includes(achievement)) {
            badge.classList.add('unlocked');
        } else {
            badge.classList.remove('unlocked');
        }
    });
    
    // Quick settings
    const qariName = qaris.find(q => q.id === currentQari)?.name || 'Mishary Alafasy';
    document.getElementById('quickQari').textContent = qariName;
    
    const theme = document.documentElement.getAttribute('data-theme');
    document.getElementById('quickTheme').textContent = theme === 'night' ? 'Night' : 'Light';
}

function updateDockUserAvatar() {
    const dockAvatar = document.getElementById('dockUserAvatar');
    if (dockAvatar && currentUser) {
        dockAvatar.textContent = currentUser.avatar || '👤';
    }
}

function updateDockDropdownInfo() {
    if (!currentUser) return;
    
    const dockDropdownAvatar = document.getElementById('dockDropdownAvatar');
    const dockDropdownName = document.getElementById('dockDropdownName');
    const dockDropdownEmail = document.getElementById('dockDropdownEmail');
    
    if (dockDropdownAvatar) {
        dockDropdownAvatar.textContent = currentUser.avatar || '👤';
    }
    
    if (dockDropdownName) {
        dockDropdownName.textContent = currentUser.name || 'User';
    }
    
    if (dockDropdownEmail) {
        dockDropdownEmail.textContent = currentUser.email || 'user@email.com';
    }
}

function updateUserAvatar() {
    const avatar = currentUser.avatar || '👤';
    const avatarElements = document.querySelectorAll('#profileAvatarLarge, #dockUserAvatar, #dockDropdownAvatar');
    avatarElements.forEach(el => {
        if (el) el.textContent = avatar;
    });
    updateDockDropdownInfo();
}

function updateUserInStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index > -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Copy & Share Functions
window.copyAyah = function(surahNumber, ayahNumber, surahName) {
    const ayahCard = document.getElementById(`ayah-${surahNumber}-${ayahNumber}`);
    if (!ayahCard) return;
    
    const arabic = ayahCard.querySelector('.ayah-arabic').textContent;
    const latin = ayahCard.querySelector('.ayah-latin').textContent;
    const translation = ayahCard.querySelector('.ayah-translation').textContent;
    
    const text = `${arabic}\n\n${latin}\n\n${translation}\n\n(QS. ${surahName}: ${ayahNumber})\nVia Al-Quran Digital`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Ayat berhasil dicopy!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showSuccess('Ayat berhasil dicopy!');
    });
}

window.shareAyah = function(surahNumber, ayahNumber, surahName) {
    const ayahCard = document.getElementById(`ayah-${surahNumber}-${ayahNumber}`);
    if (!ayahCard) return;
    
    const arabic = ayahCard.querySelector('.ayah-arabic').textContent;
    const latin = ayahCard.querySelector('.ayah-latin').textContent;
    const translation = ayahCard.querySelector('.ayah-translation').textContent;
    
    const text = `${arabic}\n\n${latin}\n\n${translation}\n\n(QS. ${surahName}: ${ayahNumber})\nVia Al-Quran Digital`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: `QS. ${surahName}: ${ayahNumber}`,
            text: text
        }).catch(() => {
            // User cancelled or error
        });
    } else {
        // Fallback: Share to WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Prayer Times Functions
async function initPrayerTimes() {
    // Try to get location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                await fetchPrayerTimes();
                updatePrayerTimesDisplay();
                setInterval(updatePrayerTimesDisplay, 1000); // Update every second
            },
            () => {
                // Default to Jakarta if location denied
                userLocation = { latitude: -6.2088, longitude: 106.8456 };
                fetchPrayerTimes();
                updatePrayerTimesDisplay();
                setInterval(updatePrayerTimesDisplay, 1000);
            }
        );
    } else {
        // Default to Jakarta
        userLocation = { latitude: -6.2088, longitude: 106.8456 };
        await fetchPrayerTimes();
        updatePrayerTimesDisplay();
        setInterval(updatePrayerTimesDisplay, 1000);
    }
}

async function fetchPrayerTimes() {
    try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const response = await fetch(
            `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&method=2`
        );
        
        const data = await response.json();
        prayerTimes = data.data.timings;
        
        // Get location name
        const locationName = data.data.meta.timezone || 'Lokasi Anda';
        const prayerLocationEl = document.getElementById('prayerLocation');
        if (prayerLocationEl) {
            prayerLocationEl.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; margin-right: 6px; vertical-align: middle;">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${locationName}
            `;
        }
        
        // Save to localStorage
        localStorage.setItem('prayerTimes', JSON.stringify({
            times: prayerTimes,
            location: locationName,
            date: new Date().toDateString()
        }));
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        // Try to load from localStorage
        const saved = localStorage.getItem('prayerTimes');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.date === new Date().toDateString()) {
                prayerTimes = data.times;
                const prayerLocationEl = document.getElementById('prayerLocation');
                if (prayerLocationEl && data.location) {
                    prayerLocationEl.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; margin-right: 6px; vertical-align: middle;">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${data.location}
                    `;
                }
            }
        }
    }
}

function updatePrayerTimesDisplay() {
    if (!prayerTimes) return;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'Subuh', time: prayerTimes.Fajr, id: 'fajrTime' },
        { name: 'Dzuhur', time: prayerTimes.Dhuhr, id: 'dhuhrTime' },
        { name: 'Ashar', time: prayerTimes.Asr, id: 'asrTime' },
        { name: 'Maghrib', time: prayerTimes.Maghrib, id: 'maghribTime' },
        { name: 'Isya', time: prayerTimes.Isha, id: 'ishaTime' }
    ];
    
    // Update all prayer times in modal
    prayers.forEach(prayer => {
        const element = document.getElementById(prayer.id);
        if (element) {
            element.textContent = prayer.time;
        }
    });
    
    // Calculate and display sunnah prayer times
    updateSunnahPrayerTimes();
    
    // Find next prayer
    let nextPrayer = null;
    let nextPrayerIndex = -1;
    for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const [hours, minutes] = prayer.time.split(':');
        const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
        
        if (prayerTime > currentTime) {
            nextPrayer = { ...prayer, timeInMinutes: prayerTime };
            nextPrayerIndex = i;
            break;
        }
    }
    
    // If no prayer found today, next is Fajr tomorrow
    if (!nextPrayer) {
        const [hours, minutes] = prayers[0].time.split(':');
        nextPrayer = {
            name: prayers[0].name,
            time: prayers[0].time,
            timeInMinutes: parseInt(hours) * 60 + parseInt(minutes) + (24 * 60),
            id: prayers[0].id
        };
        nextPrayerIndex = 0;
    }
    
    // Calculate countdown
    const diff = nextPrayer.timeInMinutes - currentTime;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    const seconds = 59 - now.getSeconds();
    
    const countdownText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update modal display
    const modalNextPrayerName = document.getElementById('modalNextPrayerName');
    const modalNextPrayerTime = document.getElementById('modalNextPrayerTime');
    const modalNextPrayerCountdown = document.getElementById('modalNextPrayerCountdown');
    
    if (modalNextPrayerName) {
        modalNextPrayerName.textContent = nextPrayer.name;
    }
    
    if (modalNextPrayerTime) {
        modalNextPrayerTime.textContent = nextPrayer.time;
    }
    
    if (modalNextPrayerCountdown) {
        modalNextPrayerCountdown.textContent = countdownText;
    }
    
    // Highlight next prayer in list
    document.querySelectorAll('.prayer-time-item').forEach((item, index) => {
        if (index === nextPrayerIndex) {
            item.classList.add('next-prayer');
        } else {
            item.classList.remove('next-prayer');
        }
    });
}

function updateSunnahPrayerTimes() {
    if (!prayerTimes) return;
    
    try {
        // Parse prayer times
        const fajrTime = parseTime(prayerTimes.Fajr);
        const dhuhrTime = parseTime(prayerTimes.Dhuhr);
        const maghribTime = parseTime(prayerTimes.Maghrib);
        const ishaTime = parseTime(prayerTimes.Isha);
        
        // Tahajud: Last third of the night (between Isha and Fajr)
        let nightDuration;
        if (fajrTime < ishaTime) {
            // Fajr is next day
            nightDuration = (fajrTime + 24 * 60) - ishaTime;
        } else {
            // Same day (shouldn't happen normally)
            nightDuration = fajrTime - ishaTime;
        }
        
        const lastThirdStart = ishaTime + Math.floor(nightDuration * 2 / 3);
        const tahajudTime = formatTimeFromMinutes(lastThirdStart);
        
        // Dhuha: 15 minutes after sunrise until 30 minutes before Dhuhr
        const sunriseTime = fajrTime + 20; // Approximate sunrise (20 min after Fajr)
        const dhuhaStartTime = sunriseTime + 15;
        const dhuhaEndTime = dhuhrTime - 30;
        const dhuhaTime = `${formatTimeFromMinutes(dhuhaStartTime)} - ${formatTimeFromMinutes(dhuhaEndTime)}`;
        
        // Witir: After Isha until Fajr
        const witrTime = `${prayerTimes.Isha} - ${prayerTimes.Fajr}`;
        
        // Qabliyah Subuh: 30 minutes before Fajr
        const qabliyahSubuhTime = formatTimeFromMinutes(fajrTime - 30);
        
        // Qabliyah Dzuhur: 30 minutes before Dhuhr
        const qabliyahDzuhurTime = formatTimeFromMinutes(dhuhrTime - 30);
        
        // Ba'diyah Dzuhur: 15 minutes after Dhuhr
        const badiyahDzuhurTime = formatTimeFromMinutes(dhuhrTime + 15);
        
        // Update sunnah prayer times in UI
        updateSunnahTime('tahajudTime', tahajudTime);
        updateSunnahTime('dhuhaTime', dhuhaTime);
        updateSunnahTime('witrTime', witrTime);
        updateSunnahTime('qabliyahSubuhTime', qabliyahSubuhTime);
        updateSunnahTime('qabliyahDzuhurTime', qabliyahDzuhurTime);
        updateSunnahTime('badiyahDzuhurTime', badiyahDzuhurTime);
        
    } catch (error) {
        console.error('Error calculating sunnah prayer times:', error);
        // Set default values if calculation fails
        updateSunnahTime('tahajudTime', '--:--');
        updateSunnahTime('dhuhaTime', '--:--');
        updateSunnahTime('witrTime', '--:--');
        updateSunnahTime('qabliyahSubuhTime', '--:--');
        updateSunnahTime('qabliyahDzuhurTime', '--:--');
        updateSunnahTime('badiyahDzuhurTime', '--:--');
    }
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTimeFromMinutes(totalMinutes) {
    // Ensure totalMinutes is a valid number
    if (isNaN(totalMinutes) || !isFinite(totalMinutes)) {
        return '--:--';
    }
    
    // Normalize to 24-hour format
    totalMinutes = Math.round(totalMinutes);
    while (totalMinutes < 0) totalMinutes += 24 * 60;
    while (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function updateSunnahTime(elementId, time) {
    const element = document.getElementById(elementId);
    if (element) {
        // Ensure time is valid before displaying
        if (time && time !== 'NaN:NaN' && !time.includes('NaN')) {
            element.textContent = time;
        } else {
            element.textContent = '--:--';
        }
    }
}
// Prayer Detail Data
const prayerDetailData = {
    fajr: {
        name: 'Sholat Subuh',
        icon: '🌅',
        desc: 'Sholat fardhu di waktu fajar',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya fardha ash-shubhi rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat fardhu Subuh dua rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
            latin: 'Astaghfirullaahal \'azhiimal ladzii laa ilaaha illaa huwal hayyul qayyuumu wa atuubu ilaih',
            meaning: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya'
        },
        keutamaan: [
            'Sholat Subuh berjamaah seperti sholat sepanjang malam',
            'Orang yang sholat Subuh dalam perlindungan Allah hingga sore',
            'Malaikat malam dan siang berkumpul pada waktu Subuh',
            'Datang lebih awal ke masjid mendapat pahala seperti berqurban unta'
        ],
        teguran: [
            'Barangsiapa yang meninggalkan sholat Subuh, maka cahaya wajahnya akan hilang',
            'Sholat Subuh adalah sholat yang paling berat bagi orang munafik',
            'Orang yang meninggalkan sholat Subuh akan sulit mendapat rezeki yang berkah'
        ]
    },
    dhuhr: {
        name: 'Sholat Dzuhur',
        icon: '☀️',
        desc: 'Sholat fardhu di waktu tengah hari',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya fardha azh-zhuhri arba\'a raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat fardhu Dzuhur empat rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
            latin: 'Allaahumma a\'innii \'alaa dzikrika wa syukrika wa husni \'ibaadatik',
            meaning: 'Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan baik kepada-Mu'
        },
        keutamaan: [
            'Sholat Dzuhur adalah waktu pintu langit terbuka',
            'Doa dikabulkan pada waktu antara Dzuhur dan Ashar',
            'Sholat Dzuhur berjamaah mendapat 27 derajat pahala',
            'Datang lebih awal ke masjid Dzuhur seperti berqurban sapi'
        ],
        teguran: [
            'Meninggalkan sholat Dzuhur menyebabkan rezeki menjadi sempit',
            'Orang yang lalai dari sholat Dzuhur akan kehilangan barakah waktu',
            'Sholat Dzuhur yang terlewat sulit diganti pahalanya'
        ]
    },
    asr: {
        name: 'Sholat Ashar',
        icon: '🌇',
        desc: 'Sholat fardhu di waktu sore',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya fardhal \'ashri arba\'a raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat fardhu Ashar empat rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            latin: 'Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai-in qadiir',
            meaning: 'Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian, dan Dia Maha Kuasa atas segala sesuatu'
        },
        keutamaan: [
            'Sholat Ashar adalah sholat wustha (tengah) yang disebutkan dalam Al-Quran',
            'Orang yang menjaga sholat Ashar tidak akan rugi di akhirat',
            'Malaikat mencatat kebaikan berlipat pada waktu Ashar',
            'Datang lebih awal ke masjid Ashar seperti berqurban kambing'
        ],
        teguran: [
            'Barangsiapa yang meninggalkan sholat Ashar, maka amalnya terhapus',
            'Sholat Ashar yang terlewat seperti kehilangan keluarga dan harta',
            'Meninggalkan sholat Ashar menyebabkan hati menjadi gelap'
        ]
    },
    maghrib: {
        name: 'Sholat Maghrib',
        icon: '🌅',
        desc: 'Sholat fardhu di waktu maghrib',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya fardhal maghribi tsalaatsa raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat fardhu Maghrib tiga rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
            latin: 'Allaahumma ajirnii minan naar',
            meaning: 'Ya Allah, lindungilah aku dari api neraka'
        },
        keutamaan: [
            'Sholat Maghrib adalah waktu turunnya rahmat Allah',
            'Doa mustajab antara Maghrib dan Isya',
            'Sholat Maghrib berjamaah mendapat pahala berlipat',
            'Datang lebih awal ke masjid Maghrib seperti berqurban ayam'
        ],
        teguran: [
            'Meninggalkan sholat Maghrib menyebabkan wajah menjadi hitam di akhirat',
            'Sholat Maghrib yang terlewat sulit mendapat ampunan',
            'Orang yang lalai sholat Maghrib akan kesulitan di alam kubur'
        ]
    },
    isha: {
        name: 'Sholat Isya',
        icon: '🌙',
        desc: 'Sholat fardhu di waktu malam',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya fardhal \'isyaa-i arba\'a raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat fardhu Isya empat rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
            latin: 'Allaahumma bika amsainaa wa bika ashbahnaa wa bika nahyaa wa bika namuutu wa ilaikal mashiir',
            meaning: 'Ya Allah, dengan rahmat-Mu kami memasuki sore dan dengan rahmat-Mu kami memasuki pagi, dengan rahmat-Mu kami hidup dan dengan rahmat-Mu kami mati, dan kepada-Mu tempat kembali'
        },
        keutamaan: [
            'Sholat Isya berjamaah seperti qiyamul lail setengah malam',
            'Orang yang sholat Isya dalam perlindungan Allah hingga Subuh',
            'Sholat Isya adalah penutup amal shalih dalam sehari',
            'Datang lebih awal ke masjid Isya seperti berqurban telur'
        ],
        teguran: [
            'Meninggalkan sholat Isya menyebabkan tidur tidak tenang',
            'Sholat Isya yang terlewat membuat malam tidak berkah',
            'Orang yang lalai sholat Isya akan mimpi buruk'
        ]
    },
    // Sunnah Prayers
    tahajud: {
        name: 'Sholat Tahajud',
        icon: '🌙',
        desc: 'Sholat sunnah di sepertiga malam akhir',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya sunnatal tahajjudi rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat sunnah Tahajud dua rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'رَبِّ اغْفِرْ لِي ذَنْبِي وَخَطَئِي وَجَهْلِي',
            latin: 'Rabbighfir lii dzanbii wa khatha-ii wa jahlii',
            meaning: 'Ya Tuhanku, ampunilah dosaku, kesalahanku, dan kebodohanku'
        },
        keutamaan: [
            'Sholat Tahajud adalah sunnah para nabi dan orang shalih',
            'Doa di waktu Tahajud paling mustajab',
            'Tahajud mendekatkan diri kepada Allah dan menghapus dosa',
            'Orang yang tahajud wajahnya bercahaya di siang hari'
        ],
        teguran: [
            'Meninggalkan Tahajud membuat hati menjadi keras',
            'Orang yang malas Tahajud akan sulit bangun untuk kebaikan',
            'Tahajud yang ditinggalkan menyebabkan kehilangan berkah malam'
        ]
    },
    dhuha: {
        name: 'Sholat Dhuha',
        icon: '🌞',
        desc: 'Sholat sunnah di pagi hingga menjelang Dzuhur',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ الضُّحَى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya sunnata adh-dhuhaa rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat sunnah Dhuha dua rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ إِنَّ الضُّحَى ضُحَاؤُكَ وَالْبَهَاءَ بَهَاؤُكَ وَالْجَمَالَ جَمَالُكَ',
            latin: 'Allaahumma innadh dhuhaa dhuhaau-ka wal bahaau bahaau-ka wal jamaala jamaaluk',
            meaning: 'Ya Allah, sesungguhnya waktu Dhuha adalah waktu Dhuha-Mu, cahaya adalah cahaya-Mu, dan keindahan adalah keindahan-Mu'
        },
        keutamaan: [
            'Sholat Dhuha mendatangkan rezeki dan kemudahan',
            'Dua rakaat Dhuha cukup untuk sedekah seluruh persendian tubuh',
            'Sholat Dhuha menambah kekuatan dan kesehatan',
            'Orang yang rutin Dhuha akan dimudahkan urusannya'
        ],
        teguran: [
            'Meninggalkan Dhuha menyebabkan rezeki menjadi sulit',
            'Orang yang lalai Dhuha akan merasa lemah di siang hari',
            'Dhuha yang ditinggalkan membuat pagi tidak berkah'
        ]
    },
    witir: {
        name: 'Sholat Witir',
        icon: '🌙',
        desc: 'Sholat sunnah setelah Isya hingga Subuh',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya sunnatal witri tsalaatsa raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat sunnah Witir tiga rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ',
            latin: 'Allaahummahdini fiiman hadaita wa \'aafini fiiman \'aafait',
            meaning: 'Ya Allah, berilah aku petunjuk sebagaimana Engkau beri petunjuk kepada orang-orang, dan berilah aku kesehatan sebagaimana Engkau beri kesehatan kepada orang-orang'
        },
        keutamaan: [
            'Witir adalah penutup sholat malam yang utama',
            'Sholat Witir menyempurnakan sholat sunnah lainnya',
            'Witir adalah sunnah muakkad yang sangat dianjurkan',
            'Orang yang rutin Witir akan mendapat syafaat di akhirat'
        ],
        teguran: [
            'Meninggalkan Witir membuat malam tidak sempurna',
            'Orang yang lalai Witir akan kehilangan berkah malam',
            'Witir yang ditinggalkan menyebabkan tidur tidak nyenyak'
        ]
    },
    'qabliyah-subuh': {
        name: 'Sholat Qabliyah Subuh',
        icon: '🌅',
        desc: 'Sholat sunnah sebelum Subuh',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ قَبْلَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya sunnata qablash shubhi rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat sunnah sebelum Subuh dua rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا',
            latin: 'Allaahumma baarik lanaa fiimaa razaqtanaa',
            meaning: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami'
        },
        keutamaan: [
            'Sunnah Qabliyah Subuh lebih utama dari dunia dan seisinya',
            'Dua rakaat sebelum Subuh menyiapkan hati untuk sholat fardhu',
            'Sunnah Subuh mendatangkan keberkahan di pagi hari',
            'Orang yang rutin sunnah Subuh akan dimudahkan rizkinya'
        ],
        teguran: [
            'Meninggalkan sunnah Subuh menyebabkan pagi tidak berkah',
            'Orang yang lalai sunnah Subuh akan merasa berat menjalani hari',
            'Sunnah Subuh yang ditinggalkan membuat hati kurang khusyuk'
        ]
    },
    'qabliyah-dzuhur': {
        name: 'Sholat Qabliyah Dzuhur',
        icon: '☀️',
        desc: 'Sholat sunnah sebelum Dzuhur',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ قَبْلَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya sunnata qablazh zhuhri arba\'a raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat sunnah sebelum Dzuhur empat rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
            latin: 'Allaahumma a\'innii \'alaa dzikrika wa syukrika wa husni \'ibaadatik',
            meaning: 'Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan baik kepada-Mu'
        },
        keutamaan: [
            'Empat rakaat sebelum Dzuhur dibangun rumah di surga',
            'Sunnah Qabliyah Dzuhur menyiapkan hati untuk sholat fardhu',
            'Sholat ini mendatangkan ketenangan di siang hari',
            'Orang yang rutin akan dimudahkan dalam bekerja'
        ],
        teguran: [
            'Meninggalkan sunnah Dzuhur menyebabkan siang hari tidak berkah',
            'Orang yang lalai akan merasa gelisah di siang hari',
            'Sunnah Dzuhur yang ditinggalkan membuat kerja tidak lancar'
        ]
    },
    'badiyah-dzuhur': {
        name: 'Sholat Ba\'diyah Dzuhur',
        icon: '☀️',
        desc: 'Sholat sunnah setelah Dzuhur',
        niat: {
            arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ بَعْدَ الظُّهْرِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
            latin: 'Nawaitu an ushalliya sunnata ba\'dazh zhuhri rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aala',
            meaning: 'Aku berniat mengerjakan sholat sunnah setelah Dzuhur dua rakaat menghadap kiblat karena Allah Ta\'ala'
        },
        doaSetelah: {
            arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي يَوْمِنَا هَذَا',
            latin: 'Allaahumma baarik lanaa fii yawminaa haadzaa',
            meaning: 'Ya Allah, berkahilah kami di hari ini'
        },
        keutamaan: [
            'Sunnah Ba\'diyah Dzuhur menyempurnakan sholat fardhu',
            'Dua rakaat setelah Dzuhur menambah pahala sholat',
            'Sholat ini mendatangkan keberkahan sore hari',
            'Orang yang rutin akan dimudahkan rizkinya'
        ],
        teguran: [
            'Meninggalkan sunnah setelah Dzuhur mengurangi pahala',
            'Orang yang lalai akan merasa kurang dalam beribadah',
            'Sunnah yang ditinggalkan membuat sore kurang berkah'
        ]
    }
};

// Prayer Detail Functions
window.showPrayerDetail = function(prayerType) {
    const modal = document.getElementById('prayerDetailModal');
    const data = prayerDetailData[prayerType];
    
    if (!data) return;
    
    // Get prayer time
    let prayerTime = '--:--';
    if (prayerType === 'fajr') prayerTime = prayerTimes?.Fajr || '--:--';
    else if (prayerType === 'dhuhr') prayerTime = prayerTimes?.Dhuhr || '--:--';
    else if (prayerType === 'asr') prayerTime = prayerTimes?.Asr || '--:--';
    else if (prayerType === 'maghrib') prayerTime = prayerTimes?.Maghrib || '--:--';
    else if (prayerType === 'isha') prayerTime = prayerTimes?.Isha || '--:--';
    else {
        // For sunnah prayers, get from UI
        const timeElement = document.getElementById(prayerType.replace('-', '') + 'Time');
        if (timeElement) prayerTime = timeElement.textContent;
    }
    
    // Update modal content
    document.getElementById('prayerDetailTitle').textContent = data.name;
    document.getElementById('prayerDetailIcon').textContent = data.icon;
    document.getElementById('prayerDetailName').textContent = data.name;
    document.getElementById('prayerDetailTime').textContent = prayerTime;
    document.getElementById('prayerDetailDesc').textContent = data.desc;
    
    // Update niat
    document.getElementById('niatArabic').textContent = data.niat.arabic;
    document.getElementById('niatLatin').textContent = data.niat.latin;
    document.getElementById('niatMeaning').textContent = data.niat.meaning;
    
    // Update doa setelah
    document.getElementById('doaSetelahArabic').textContent = data.doaSetelah.arabic;
    document.getElementById('doaSetelahLatin').textContent = data.doaSetelah.latin;
    document.getElementById('doaSetelahMeaning').textContent = data.doaSetelah.meaning;
    
    // Update keutamaan
    const keutamaanList = document.getElementById('keutamaanList');
    keutamaanList.innerHTML = data.keutamaan.map(item => `
        <div class="keutamaan-item">
            <div class="keutamaan-icon">⭐</div>
            <div class="keutamaan-text">${item}</div>
        </div>
    `).join('');
    
    // Update teguran
    const teguranList = document.getElementById('teguranList');
    teguranList.innerHTML = data.teguran.map(item => `
        <div class="teguran-item">
            <div class="teguran-icon">⚠️</div>
            <div class="teguran-text">${item}</div>
        </div>
    `).join('');
    
    // Store current prayer type for copy/share
    modal.dataset.prayerType = prayerType;
    
    // Show modal
    modal.classList.remove('hidden');
}

// Initialize Prayer Detail Modal
function initPrayerDetailModal() {
    const modal = document.getElementById('prayerDetailModal');
    const closeBtn = document.getElementById('closePrayerDetail');
    const overlay = modal.querySelector('.modal-overlay');
    const tabs = modal.querySelectorAll('.prayer-detail-tab');
    const tabContents = modal.querySelectorAll('.prayer-tab-content');
    const copyBtn = document.getElementById('copyPrayerDetail');
    const shareBtn = document.getElementById('sharePrayerDetail');
    
    // Close modal
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    overlay.addEventListener('click', () => modal.classList.add('hidden'));
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab + 'Content') {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Copy functionality
    copyBtn.addEventListener('click', () => {
        const prayerType = modal.dataset.prayerType;
        const data = prayerDetailData[prayerType];
        if (!data) return;
        
        const activeTab = modal.querySelector('.prayer-detail-tab.active').dataset.tab;
        let textToCopy = `${data.name}\n\n`;
        
        if (activeTab === 'niat') {
            textToCopy += `NIAT:\n${data.niat.arabic}\n${data.niat.latin}\n${data.niat.meaning}`;
        } else if (activeTab === 'doa') {
            textToCopy += `DOA SETELAH SHOLAT:\n${data.doaSetelah.arabic}\n${data.doaSetelah.latin}\n${data.doaSetelah.meaning}`;
        } else if (activeTab === 'keutamaan') {
            textToCopy += `KEUTAMAAN:\n${data.keutamaan.map((item, i) => `${i+1}. ${item}`).join('\n')}`;
        } else if (activeTab === 'teguran') {
            textToCopy += `PERINGATAN:\n${data.teguran.map((item, i) => `${i+1}. ${item}`).join('\n')}`;
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Detail sholat berhasil disalin');
        });
    });
    
    // Share functionality
    shareBtn.addEventListener('click', () => {
        const prayerType = modal.dataset.prayerType;
        const data = prayerDetailData[prayerType];
        if (!data) return;
        
        const activeTab = modal.querySelector('.prayer-detail-tab.active').dataset.tab;
        let textToShare = `${data.name}\n\n`;
        
        if (activeTab === 'niat') {
            textToShare += `NIAT:\n${data.niat.arabic}\n${data.niat.latin}\n${data.niat.meaning}`;
        } else if (activeTab === 'doa') {
            textToShare += `DOA SETELAH SHOLAT:\n${data.doaSetelah.arabic}\n${data.doaSetelah.latin}\n${data.doaSetelah.meaning}`;
        } else if (activeTab === 'keutamaan') {
            textToShare += `KEUTAMAAN:\n${data.keutamaan.map((item, i) => `${i+1}. ${item}`).join('\n')}`;
        } else if (activeTab === 'teguran') {
            textToShare += `PERINGATAN:\n${data.teguran.map((item, i) => `${i+1}. ${item}`).join('\n')}`;
        }
        
        if (navigator.share) {
            navigator.share({
                title: data.name,
                text: textToShare
            });
        } else {
            // Fallback to WhatsApp
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
            window.open(whatsappUrl, '_blank');
        }
    });
}

// Doa & Dzikir Functions
async function loadDoaData() {
    try {
        // Try multiple API sources
        let data = null;
        
        // Try API 1: Islamic API Indonesia
        try {
            const response1 = await fetch('https://islamic-api-indonesia.herokuapp.com/api/doa');
            if (response1.ok) {
                const result1 = await response1.json();
                if (result1 && result1.data) {
                    data = result1.data;
                }
            }
        } catch (e) {
            console.log('API 1 failed, trying alternative...');
        }
        
        // Try API 2: Alternative API
        if (!data) {
            try {
                const response2 = await fetch('https://doa-api.vercel.app/api/doa');
                if (response2.ok) {
                    const result2 = await response2.json();
                    if (result2 && result2.data) {
                        data = result2.data;
                    }
                }
            } catch (e) {
                console.log('API 2 failed, using static data...');
            }
        }
        
        if (data && data.length > 0) {
            doaData = data;
            displayDoaCategories();
        } else {
            // Fallback to static data if all APIs fail
            loadStaticDoaData();
        }
    } catch (error) {
        console.error('Error loading doa data:', error);
        loadStaticDoaData();
    }
}

function loadStaticDoaData() {
    // Extended static fallback data
    doaData = [
        {
            id: 1,
            doa: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
            ayat: "Allahumma bika ashbahnaa wa bika amsaynaa wa bika nahyaa wa bika namuutu wa ilaykan nusyuur",
            latin: "Ya Allah, dengan-Mu kami memasuki waktu pagi, dengan-Mu kami memasuki waktu sore, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu kebangkitan.",
            artinya: "Doa Pagi",
            tentang: "doa ketika memasuki waktu pagi"
        },
        {
            id: 2,
            doa: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
            ayat: "Allahumma bika amsaynaa wa bika ashbahnaa wa bika nahyaa wa bika namuutu wa ilaykal mashiir",
            latin: "Ya Allah, dengan-Mu kami memasuki waktu sore, dengan-Mu kami memasuki waktu pagi, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu tempat kembali.",
            artinya: "Doa Sore",
            tentang: "doa ketika memasuki waktu sore"
        },
        {
            id: 3,
            doa: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
            ayat: "Bismillahil ladzi laa yadhurru ma'asmihi syai'un fil ardhi wa laa fis samaa'i wa huwas samii'ul 'aliim",
            latin: "Dengan nama Allah yang tidak ada sesuatu yang dapat membahayakan bersama nama-Nya, baik di bumi maupun di langit, dan Dia Maha Mendengar lagi Maha Mengetahui.",
            artinya: "Doa Perlindungan",
            tentang: "doa memohon perlindungan Allah"
        },
        {
            id: 4,
            doa: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
            ayat: "Bismillahir rahmanir rahiim, Allahumma barik lana fiima razaqtana wa qina 'adzaban naar",
            latin: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.",
            artinya: "Doa Sebelum Makan",
            tentang: "doa sebelum makan"
        },
        {
            id: 5,
            doa: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
            ayat: "Alhamdulillahil ladzi ath'amana wa saqana wa ja'alana muslimiin",
            latin: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang yang berserah diri (muslim).",
            artinya: "Doa Sesudah Makan",
            tentang: "doa sesudah makan"
        },
        {
            id: 6,
            doa: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى",
            ayat: "Allahumma inna nas'aluka fi safarinaa hadzal birra wat taqwa wa minal 'amali ma tardha",
            latin: "Ya Allah, sesungguhnya kami memohon kepada-Mu dalam perjalanan kami ini kebaikan dan ketakwaan, dan amalan yang Engkau ridhai.",
            artinya: "Doa Perjalanan",
            tentang: "doa ketika memulai perjalanan"
        },
        {
            id: 7,
            doa: "بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
            ayat: "Bismika Allahumma amuutu wa ahya",
            latin: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
            artinya: "Doa Sebelum Tidur",
            tentang: "doa sebelum tidur"
        },
        {
            id: 8,
            doa: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
            ayat: "Alhamdulillahil ladzi ahyana ba'da ma amatana wa ilaihin nusyuur",
            latin: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kebangkitan.",
            artinya: "Doa Bangun Tidur",
            tentang: "doa ketika bangun tidur"
        }
    ];
    displayDoaCategories();
}

function displayDoaCategories() {
    const container = document.getElementById('doaCategories');
    if (!container) {
        console.error('doaCategories container not found');
        return;
    }
    
    // Group doa by category with better filtering
    const categories = {
        'Doa Harian': doaData.filter(d => d.tentang && (
            d.tentang.toLowerCase().includes('pagi') || 
            d.tentang.toLowerCase().includes('sore') || 
            d.tentang.toLowerCase().includes('tidur') ||
            d.tentang.toLowerCase().includes('bangun')
        )),
        'Doa Perlindungan': doaData.filter(d => d.tentang && 
            d.tentang.toLowerCase().includes('perlindungan')
        ),
        'Doa Makan': doaData.filter(d => d.tentang && 
            d.tentang.toLowerCase().includes('makan')
        ),
        'Doa Perjalanan': doaData.filter(d => d.tentang && 
            d.tentang.toLowerCase().includes('perjalanan')
        ),
        'Doa Lainnya': doaData.filter(d => !d.tentang || (
            !d.tentang.toLowerCase().includes('pagi') && 
            !d.tentang.toLowerCase().includes('sore') && 
            !d.tentang.toLowerCase().includes('tidur') && 
            !d.tentang.toLowerCase().includes('bangun') &&
            !d.tentang.toLowerCase().includes('perlindungan') && 
            !d.tentang.toLowerCase().includes('makan') && 
            !d.tentang.toLowerCase().includes('perjalanan')
        ))
    };

    const categoryIcons = {
        'Doa Harian': '🌅',
        'Doa Perlindungan': '🛡️',
        'Doa Makan': '🍽️',
        'Doa Perjalanan': '🚗',
        'Doa Lainnya': '📿'
    };

    let html = '';
    Object.entries(categories).forEach(([categoryName, categoryDoas]) => {
        if (categoryDoas.length > 0) {
            html += `
                <div class="doa-category-card" onclick="showDoaCategory('${categoryName}')">
                    <div class="doa-category-icon">${categoryIcons[categoryName]}</div>
                    <div class="doa-category-title">${categoryName}</div>
                    <div class="doa-category-count">${categoryDoas.length} doa</div>
                </div>
            `;
        }
    });

    if (html === '') {
        html = '<div class="loading-state">Tidak ada doa tersedia</div>';
    }

    container.innerHTML = html;
}

window.showDoaCategory = function(categoryName) {
    try {
        currentDoaCategory = categoryName;
        
        // Group doa by category with better filtering
        const categories = {
            'Doa Harian': doaData.filter(d => d.tentang && (
                d.tentang.toLowerCase().includes('pagi') || 
                d.tentang.toLowerCase().includes('sore') || 
                d.tentang.toLowerCase().includes('tidur') ||
                d.tentang.toLowerCase().includes('bangun')
            )),
            'Doa Perlindungan': doaData.filter(d => d.tentang && 
                d.tentang.toLowerCase().includes('perlindungan')
            ),
            'Doa Makan': doaData.filter(d => d.tentang && 
                d.tentang.toLowerCase().includes('makan')
            ),
            'Doa Perjalanan': doaData.filter(d => d.tentang && 
                d.tentang.toLowerCase().includes('perjalanan')
            ),
            'Doa Lainnya': doaData.filter(d => !d.tentang || (
                !d.tentang.toLowerCase().includes('pagi') && 
                !d.tentang.toLowerCase().includes('sore') && 
                !d.tentang.toLowerCase().includes('tidur') && 
                !d.tentang.toLowerCase().includes('bangun') &&
                !d.tentang.toLowerCase().includes('perlindungan') && 
                !d.tentang.toLowerCase().includes('makan') && 
                !d.tentang.toLowerCase().includes('perjalanan')
            ))
        };

        const categoryDoas = categories[categoryName] || doaData;
        displayDoaList(categoryDoas);
    } catch (error) {
        console.error('Error showing doa category:', error);
        showNotification('Terjadi kesalahan saat memuat kategori doa');
    }
}

function displayDoaList(doas) {
    const container = document.getElementById('doaCategories');
    if (!container) {
        console.error('doaCategories container not found');
        return;
    }
    
    let html = `<h3 style="margin-bottom: var(--space-lg); text-align: center;">${currentDoaCategory}</h3>`;
    
    if (doas && doas.length > 0) {
        doas.forEach(doa => {
            html += `
                <div class="doa-category-card" onclick="showDoaDetail(${doa.id})">
                    <div class="doa-category-title">${doa.artinya || doa.tentang}</div>
                    <div class="doa-category-count">Klik untuk baca</div>
                </div>
            `;
        });
    } else {
        html += '<div class="loading-state">Tidak ada doa dalam kategori ini</div>';
    }

    container.innerHTML = html;
}

window.showDoaDetail = function(doaId) {
    try {
        const doa = doaData.find(d => d.id === doaId);
        if (!doa) {
            showNotification('Doa tidak ditemukan');
            return;
        }

        const doaCategories = document.getElementById('doaCategories');
        const doaDetail = document.getElementById('doaDetail');
        const doaItemDetail = document.getElementById('doaItemDetail');
        
        if (!doaCategories || !doaDetail || !doaItemDetail) {
            console.error('Required elements not found');
            return;
        }

        doaCategories.classList.add('hidden');
        doaDetail.classList.remove('hidden');

        doaItemDetail.innerHTML = `
            <div class="doa-title">${doa.artinya || doa.tentang}</div>
            <div class="doa-arabic">${doa.doa}</div>
            <div class="doa-latin">${doa.ayat}</div>
            <div class="doa-translation">${doa.latin}</div>
            <div class="doa-actions">
                <button class="btn-copy" onclick="copyDoa(${doaId})" title="Copy doa">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                <button class="btn-share" onclick="shareDoa(${doaId})" title="Share doa">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Error showing doa detail:', error);
        showNotification('Terjadi kesalahan saat memuat detail doa');
    }
}

function showDoaCategories() {
    document.getElementById('doaDetail').classList.add('hidden');
    document.getElementById('doaCategories').classList.remove('hidden');
    displayDoaCategories();
}

window.copyDoa = function(doaId) {
    const doa = doaData.find(d => d.id === doaId);
    if (!doa) return;

    const text = `${doa.artinya || doa.tentang}\n\n${doa.doa}\n\n${doa.ayat}\n\n${doa.latin}\n\nVia Al-Quran Digital`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Doa berhasil dicopy!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('✅ Doa berhasil dicopy!');
    });
}

window.shareDoa = function(doaId) {
    const doa = doaData.find(d => d.id === doaId);
    if (!doa) return;

    const text = `${doa.artinya || doa.tentang}\n\n${doa.doa}\n\n${doa.ayat}\n\n${doa.latin}\n\nVia Al-Quran Digital`;
    
    if (navigator.share) {
        navigator.share({
            title: doa.artinya || doa.tentang,
            text: text
        }).catch(() => {});
    } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }
}

function switchDoaTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.doa-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Content`).classList.add('active');

    // Initialize dzikir if switching to dzikir tab
    if (tabName === 'dzikir') {
        updateDzikirDisplay();
    }
}

function updateDzikirDisplay() {
    try {
        const dzikir = dzikirData[currentDzikir];
        if (!dzikir) {
            console.error('Dzikir data not found for:', currentDzikir);
            return;
        }
        
        const arabicEl = document.getElementById('dzikirArabic');
        const latinEl = document.getElementById('dzikirLatin');
        const meaningEl = document.getElementById('dzikirMeaning');
        
        if (arabicEl) arabicEl.textContent = dzikir.arabic;
        if (latinEl) latinEl.textContent = dzikir.latin;
        if (meaningEl) meaningEl.textContent = dzikir.meaning;
    } catch (error) {
        console.error('Error updating dzikir display:', error);
    }
}

function incrementDzikirCounter() {
    try {
        dzikirCounter++;
        const counterEl = document.getElementById('counterNumber');
        if (counterEl) {
            counterEl.textContent = dzikirCounter;
        }
        
        // Haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Check if target reached
        if (dzikirCounter >= dzikirTarget) {
            showNotification(`🎉 Alhamdulillah! Target ${dzikirTarget}x tercapai!`);
            
            // Optional: Auto reset or celebrate
            setTimeout(() => {
                if (confirm('Target tercapai! Reset counter?')) {
                    resetDzikirCounter();
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error incrementing dzikir counter:', error);
    }
}

function resetDzikirCounter() {
    try {
        dzikirCounter = 0;
        const counterEl = document.getElementById('counterNumber');
        if (counterEl) {
            counterEl.textContent = dzikirCounter;
        }
        showNotification('Counter direset');
    } catch (error) {
        console.error('Error resetting dzikir counter:', error);
    }
}

function setDzikirTarget(target) {
    try {
        dzikirTarget = target;
        const targetEl = document.getElementById('counterTarget');
        if (targetEl) {
            targetEl.textContent = target;
        }
        
        // Update active button
        document.querySelectorAll('.target-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-target="${target}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    } catch (error) {
        console.error('Error setting dzikir target:', error);
    }
}
// Islamic Calendar Functions
async function loadIslamicCalendar() {
    try {
        await loadHijriDate();
        await loadDynamicRamadanData(); // Updated function
        await loadIslamicEvents();
        updateCalendarDisplay();
        startRamadanCountdownTimer();
    } catch (error) {
        console.error('Error loading Islamic calendar:', error);
        showNotification('Gagal memuat kalender Islam');
    }
}

async function loadHijriDate() {
    try {
        const today = new Date();
        const response = await fetch(`https://api.aladhan.com/v1/gToH/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`);
        const data = await response.json();
        
        if (data.code === 200) {
            currentHijriDate = data.data.hijri;
            updateDateDisplay();
        } else {
            // Fallback calculation
            currentHijriDate = calculateHijriDate(today);
            updateDateDisplay();
        }
    } catch (error) {
        console.error('Error loading Hijri date:', error);
        // Fallback calculation
        const today = new Date();
        currentHijriDate = calculateHijriDate(today);
        updateDateDisplay();
    }
}

function calculateHijriDate(gregorianDate) {
    // Simple Hijri calculation (approximate)
    const hijriEpoch = new Date('622-07-16'); // Approximate start of Hijri calendar
    const daysDiff = Math.floor((gregorianDate - hijriEpoch) / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / 354.37) + 1; // Average Hijri year length
    const dayOfYear = daysDiff % 354;
    const hijriMonth = Math.floor(dayOfYear / 29.5) + 1;
    const hijriDay = Math.floor(dayOfYear % 29.5) + 1;
    
    return {
        day: hijriDay.toString(),
        month: {
            number: hijriMonth,
            ar: hijriMonths[hijriMonth - 1]?.arabic || 'Unknown',
            en: hijriMonths[hijriMonth - 1]?.indonesian || 'Unknown'
        },
        year: hijriYear.toString()
    };
}

function updateDateDisplay() {
    const hijriDateEl = document.getElementById('hijriDate');
    const gregorianDateEl = document.getElementById('gregorianDate');
    const currentMonthEl = document.getElementById('currentHijriMonth');
    
    if (currentHijriDate && hijriDateEl) {
        hijriDateEl.textContent = `${currentHijriDate.day} ${currentHijriDate.month.en} ${currentHijriDate.year} H`;
    }
    
    if (gregorianDateEl) {
        const today = new Date();
        gregorianDateEl.textContent = today.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (currentHijriDate && currentMonthEl) {
        currentMonthEl.textContent = `${currentHijriDate.month.en} ${currentHijriDate.year}`;
    }
}

async function loadIslamicEvents() {
    try {
        // Get dynamic Islamic events based on current year
        const currentYear = new Date().getFullYear();
        islamicEvents = await generateDynamicIslamicEvents(currentYear);
        displayIslamicEvents();
    } catch (error) {
        console.error('Error loading Islamic events:', error);
        // Fallback to static events
        loadStaticIslamicEvents();
        displayIslamicEvents();
    }
}

async function generateDynamicIslamicEvents(year) {
    const events = [];
    
    try {
        // Get Islamic calendar data for current and next year
        for (let targetYear = year; targetYear <= year + 1; targetYear++) {
            const yearEvents = await getIslamicEventsForYear(targetYear);
            events.push(...yearEvents);
        }
        
        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return events;
    } catch (error) {
        console.error('Error generating dynamic events:', error);
        return getStaticIslamicEvents();
    }
}

async function getIslamicEventsForYear(gregorianYear) {
    const events = [];
    
    // Calculate dates based on official data when available
    const islamicEventDates = calculateIslamicEventDates(gregorianYear);
    
    // Add major Islamic events with official Muhammadiyah data for 2026
    if (gregorianYear === 2026) {
        // Official Muhammadiyah 2026 dates
        events.push({
            name: `Ramadan ${islamicEventDates.ramadan.hijriYear} H`,
            description: 'Bulan suci puasa umat Islam',
            date: '2026-02-18', // Official: 18 Feb 2026
            hijriDate: `1 Ramadan ${islamicEventDates.ramadan.hijriYear}`,
            type: 'major',
            upcoming: true,
            source: 'Muhammadiyah Official'
        });
        
        // Lailatul Qadr (27th night of Ramadan)
        events.push({
            name: 'Lailatul Qadr',
            description: 'Malam seribu bulan',
            date: '2026-03-15', // 27th night of Ramadan
            hijriDate: `27 Ramadan ${islamicEventDates.ramadan.hijriYear}`,
            type: 'special',
            source: 'Calculated from Muhammadiyah'
        });
        
        // Eid al-Fitr - Official Muhammadiyah
        events.push({
            name: 'Eid al-Fitr',
            description: 'Hari raya Idul Fitri',
            date: '2026-03-20', // Official: 20 Mar 2026
            hijriDate: `1 Syawal ${islamicEventDates.ramadan.hijriYear}`,
            type: 'major',
            upcoming: true,
            source: 'Muhammadiyah Official'
        });
        
        // Eid al-Adha - Official Muhammadiyah
        events.push({
            name: 'Eid al-Adha',
            description: 'Hari raya Idul Adha',
            date: '2026-05-27', // Official: 27 May 2026
            hijriDate: `10 Dzulhijjah ${islamicEventDates.ramadan.hijriYear}`,
            type: 'major',
            upcoming: true,
            source: 'Muhammadiyah Official'
        });
        
        // Hari Arafah - Official Muhammadiyah
        events.push({
            name: 'Hari Arafah',
            description: 'Hari wukuf di Arafah',
            date: '2026-05-26', // Official: 26 May 2026
            hijriDate: `9 Dzulhijjah ${islamicEventDates.ramadan.hijriYear}`,
            type: 'special',
            upcoming: true,
            source: 'Muhammadiyah Official'
        });
        
        // 1 Dzulhijjah - Official Muhammadiyah
        events.push({
            name: 'Awal Dzulhijjah',
            description: 'Bulan haji dimulai',
            date: '2026-05-18', // Official: 18 May 2026
            hijriDate: `1 Dzulhijjah ${islamicEventDates.ramadan.hijriYear}`,
            type: 'special',
            source: 'Muhammadiyah Official'
        });
        
    } else {
        // For other years, use calculation
        events.push({
            name: `Ramadan ${islamicEventDates.ramadan.hijriYear} H`,
            description: 'Bulan suci puasa umat Islam',
            date: islamicEventDates.ramadan.date,
            hijriDate: `1 Ramadan ${islamicEventDates.ramadan.hijriYear}`,
            type: 'major',
            upcoming: true,
            source: 'Calculated'
        });
        
        // Lailatul Qadr (27th night of Ramadan)
        const lailatul = new Date(islamicEventDates.ramadan.date);
        lailatul.setDate(lailatul.getDate() + 26);
        events.push({
            name: 'Lailatul Qadr',
            description: 'Malam seribu bulan',
            date: lailatul.toISOString().split('T')[0],
            hijriDate: `27 Ramadan ${islamicEventDates.ramadan.hijriYear}`,
            type: 'special',
            source: 'Calculated'
        });
        
        // Eid al-Fitr (1st of Shawwal)
        const eidFitr = new Date(islamicEventDates.ramadan.date);
        eidFitr.setDate(eidFitr.getDate() + 30);
        events.push({
            name: 'Eid al-Fitr',
            description: 'Hari raya Idul Fitri',
            date: eidFitr.toISOString().split('T')[0],
            hijriDate: `1 Syawal ${islamicEventDates.ramadan.hijriYear}`,
            type: 'major',
            upcoming: true,
            source: 'Calculated'
        });
        
        // Eid al-Adha (10th of Dhul Hijjah)
        const eidAdha = new Date(eidFitr);
        eidAdha.setDate(eidAdha.getDate() + 70);
        events.push({
            name: 'Eid al-Adha',
            description: 'Hari raya Idul Adha',
            date: eidAdha.toISOString().split('T')[0],
            hijriDate: `10 Dzulhijjah ${islamicEventDates.ramadan.hijriYear}`,
            type: 'major',
            upcoming: true,
            source: 'Calculated'
        });
    }
    
    // Add other common events (calculated for all years)
    const ramadanStart = new Date(islamicEventDates.ramadan.date);
    
    // Islamic New Year (approximate)
    const newYear = new Date(ramadanStart);
    newYear.setDate(newYear.getDate() + 100); // Approximate
    const newHijriYear = islamicEventDates.ramadan.hijriYear + 1;
    events.push({
        name: `Muharram ${newHijriYear} H`,
        description: 'Tahun baru Hijriah',
        date: newYear.toISOString().split('T')[0],
        hijriDate: `1 Muharram ${newHijriYear}`,
        type: 'major',
        source: 'Calculated'
    });
    
    // Ashura (10th of Muharram)
    const ashura = new Date(newYear);
    ashura.setDate(ashura.getDate() + 9);
    events.push({
        name: 'Ashura',
        description: 'Hari Asyura',
        date: ashura.toISOString().split('T')[0],
        hijriDate: `10 Muharram ${newHijriYear}`,
        type: 'special',
        source: 'Calculated'
    });
    
    // Maulid Nabi (12th of Rabi' al-Awwal)
    const maulid = new Date(newYear);
    maulid.setDate(maulid.getDate() + 70);
    events.push({
        name: 'Maulid Nabi',
        description: 'Hari kelahiran Nabi Muhammad SAW',
        date: maulid.toISOString().split('T')[0],
        hijriDate: `12 Rabiul Awwal ${newHijriYear}`,
        type: 'major',
        source: 'Calculated'
    });
    
    // Isra Miraj (27th of Rajab)
    const israMiraj = new Date(ramadanStart);
    israMiraj.setDate(israMiraj.getDate() - 60); // Before Ramadan
    events.push({
        name: 'Isra Miraj',
        description: 'Perjalanan malam Nabi Muhammad SAW',
        date: israMiraj.toISOString().split('T')[0],
        hijriDate: `27 Rajab ${islamicEventDates.ramadan.hijriYear}`,
        type: 'special',
        source: 'Calculated'
    });
    
    return events;
}

function calculateIslamicEventDates(gregorianYear) {
    // Use the same calculation as in calculateRamadanDate
    const ramadanData = calculateRamadanDate(gregorianYear);
    
    return {
        ramadan: {
            date: ramadanData.gregorianDate,
            hijriYear: ramadanData.hijriYear
        }
    };
}

function getStaticIslamicEvents() {
    // Fallback static events (current implementation)
    return [
        {
            name: 'Ramadan 1446 H',
            description: 'Bulan suci puasa umat Islam',
            date: '2025-02-28',
            hijriDate: '1 Ramadan 1446',
            type: 'major',
            upcoming: true
        },
        {
            name: 'Lailatul Qadr',
            description: 'Malam seribu bulan',
            date: '2025-03-25',
            hijriDate: '27 Ramadan 1446',
            type: 'special'
        },
        {
            name: 'Eid al-Fitr',
            description: 'Hari raya Idul Fitri',
            date: '2025-03-30',
            hijriDate: '1 Syawal 1446',
            type: 'major',
            upcoming: true
        },
        {
            name: 'Eid al-Adha',
            description: 'Hari raya Idul Adha',
            date: '2025-06-06',
            hijriDate: '10 Dzulhijjah 1446',
            type: 'major',
            upcoming: true
        },
        {
            name: 'Muharram 1447 H',
            description: 'Tahun baru Hijriah',
            date: '2025-06-26',
            hijriDate: '1 Muharram 1447',
            type: 'major'
        },
        {
            name: 'Ashura',
            description: 'Hari Asyura',
            date: '2025-07-05',
            hijriDate: '10 Muharram 1447',
            type: 'special'
        },
        {
            name: 'Maulid Nabi',
            description: 'Hari kelahiran Nabi Muhammad SAW',
            date: '2025-09-04',
            hijriDate: '12 Rabiul Awwal 1447',
            type: 'major'
        },
        {
            name: 'Isra Miraj',
            description: 'Perjalanan malam Nabi Muhammad SAW',
            date: '2025-01-27',
            hijriDate: '27 Rajab 1446',
            type: 'special'
        }
    ];
}

function loadStaticIslamicEvents() {
    islamicEvents = getStaticIslamicEvents();
}

function displayIslamicEvents() {
    const container = document.getElementById('islamicEventsList');
    if (!container) return;
    
    const today = new Date();
    const upcomingEvents = islamicEvents
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6); // Show more events
    
    if (upcomingEvents.length === 0) {
        container.innerHTML = '<div class="loading-state">Tidak ada event mendatang</div>';
        return;
    }
    
    let html = '';
    upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        
        // Add source indicator for official data
        const sourceIndicator = event.source === 'Muhammadiyah Official' ? 
            '<span class="official-badge">📋 Resmi</span>' : '';
        
        html += `
            <div class="event-item ${event.upcoming ? 'upcoming' : ''} ${event.source === 'Muhammadiyah Official' ? 'official' : ''}">
                <div class="event-info">
                    <div class="event-name">
                        ${event.name} 
                        ${sourceIndicator}
                    </div>
                    <div class="event-description">${event.description}</div>
                    ${event.source ? `<div class="event-source">Sumber: ${event.source}</div>` : ''}
                </div>
                <div class="event-date">
                    <div>${event.hijriDate}</div>
                    <div>${daysUntil > 0 ? `${daysUntil} hari lagi` : 'Hari ini'}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Dynamic Ramadan Detection and Countdown
async function loadDynamicRamadanData() {
    try {
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        
        // Try to get current and next year's Ramadan dates from API
        const ramadanDates = await getRamadanDatesFromAPI(currentYear);
        
        // Determine which Ramadan to countdown to
        const nextRamadan = determineNextRamadan(ramadanDates, currentDate);
        
        if (nextRamadan) {
            ramadanDate = new Date(nextRamadan.gregorianDate);
            
            // Update UI with dynamic data
            updateRamadanInfo(nextRamadan);
            
            console.log(`Next Ramadan: ${nextRamadan.hijriYear} H - ${nextRamadan.gregorianDate}`);
        } else {
            // Fallback to static calculation
            calculateRamadanCountdown();
        }
        
    } catch (error) {
        console.error('Error loading dynamic Ramadan data:', error);
        // Fallback to static calculation
        calculateRamadanCountdown();
    }
}

async function getRamadanDatesFromAPI(year) {
    const ramadanDates = [];
    
    try {
        // Get Ramadan dates for current and next year
        for (let targetYear = year; targetYear <= year + 1; targetYear++) {
            // Try to get Ramadan 1st date for the year
            const response = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${targetYear}/1`);
            const data = await response.json();
            
            if (data.code === 200) {
                // Find Ramadan month (month 9 in Hijri calendar)
                const ramadanMonth = data.data.find(month => 
                    month.hijri.month.number === 9
                );
                
                if (ramadanMonth) {
                    // Get the first day of Ramadan
                    const firstDay = ramadanMonth.hijri.day === "1" ? ramadanMonth : 
                        data.data.find(day => day.hijri.month.number === 9 && day.hijri.day === "1");
                    
                    if (firstDay) {
                        ramadanDates.push({
                            hijriYear: firstDay.hijri.year,
                            hijriMonth: firstDay.hijri.month.en,
                            gregorianDate: `${targetYear}-${String(firstDay.gregorian.month.number).padStart(2, '0')}-${String(firstDay.gregorian.day).padStart(2, '0')}`,
                            gregorianYear: targetYear
                        });
                    }
                }
            }
        }
        
        // If API fails, use calculation method
        if (ramadanDates.length === 0) {
            ramadanDates.push(
                calculateRamadanDate(year),
                calculateRamadanDate(year + 1)
            );
        }
        
    } catch (error) {
        console.error('API call failed, using calculation:', error);
        // Fallback calculation
        ramadanDates.push(
            calculateRamadanDate(year),
            calculateRamadanDate(year + 1)
        );
    }
    
    return ramadanDates;
}

function calculateRamadanDate(gregorianYear) {
    // Updated with official Muhammadiyah data and more accurate calculations
    
    const ramadanDates = {
        2025: { month: 2, day: 28, hijriYear: 1446 }, // Feb 28, 2025 (estimated)
        2026: { month: 2, day: 18, hijriYear: 1447 }, // Feb 18, 2026 (Muhammadiyah official)
        2027: { month: 2, day: 7, hijriYear: 1448 },  // Feb 7, 2027 (calculated)
        2028: { month: 1, day: 27, hijriYear: 1449 }, // Jan 27, 2028 (calculated)
        2029: { month: 1, day: 16, hijriYear: 1450 }, // Jan 16, 2029 (calculated)
        2030: { month: 1, day: 5, hijriYear: 1451 }   // Jan 5, 2030 (calculated)
    };
    
    const ramadanInfo = ramadanDates[gregorianYear];
    if (ramadanInfo) {
        return {
            hijriYear: ramadanInfo.hijriYear,
            hijriMonth: 'Ramadan',
            gregorianDate: `${gregorianYear}-${String(ramadanInfo.month).padStart(2, '0')}-${String(ramadanInfo.day).padStart(2, '0')}`,
            gregorianYear: gregorianYear
        };
    }
    
    // If year not in table, use more accurate calculation based on 2026 official date
    const baseYear = 2026;
    const baseDate = new Date('2026-02-18'); // Official Muhammadiyah date
    const yearDiff = gregorianYear - baseYear;
    
    // Islamic year is approximately 354.37 days (11 days shorter than Gregorian)
    const dayShift = Math.round(yearDiff * -10.875); // More accurate shift
    
    const calculatedDate = new Date(baseDate);
    calculatedDate.setDate(calculatedDate.getDate() + dayShift);
    
    return {
        hijriYear: 1447 + yearDiff,
        hijriMonth: 'Ramadan',
        gregorianDate: calculatedDate.toISOString().split('T')[0],
        gregorianYear: calculatedDate.getFullYear()
    };
}

function determineNextRamadan(ramadanDates, currentDate) {
    // Sort dates chronologically
    ramadanDates.sort((a, b) => new Date(a.gregorianDate) - new Date(b.gregorianDate));
    
    // Find the next Ramadan that hasn't started yet
    for (const ramadan of ramadanDates) {
        const ramadanStart = new Date(ramadan.gregorianDate);
        const ramadanEnd = new Date(ramadanStart);
        ramadanEnd.setDate(ramadanEnd.getDate() + 30); // Ramadan is ~30 days
        
        // If we're before Ramadan starts, this is our target
        if (currentDate < ramadanStart) {
            return ramadan;
        }
        
        // If we're during Ramadan, show "Ramadan Mubarak" and prepare for next year
        if (currentDate >= ramadanStart && currentDate <= ramadanEnd) {
            // During Ramadan - find next year's Ramadan
            const nextYearRamadan = ramadanDates.find(r => 
                new Date(r.gregorianDate) > ramadanEnd
            );
            return nextYearRamadan || ramadan;
        }
    }
    
    // If all Ramadans have passed, return the last one (shouldn't happen with current+next year)
    return ramadanDates[ramadanDates.length - 1];
}

function updateRamadanInfo(ramadanInfo) {
    // Update the Ramadan card title
    const ramadanTitle = document.querySelector('.countdown-title');
    if (ramadanTitle) {
        ramadanTitle.textContent = `Ramadan ${ramadanInfo.hijriYear} H`;
    }
    
    // Update message based on how far away it is
    const now = new Date();
    const ramadanStart = new Date(ramadanInfo.gregorianDate);
    const daysUntil = Math.ceil((ramadanStart - now) / (1000 * 60 * 60 * 24));
    
    let message = 'Persiapkan diri untuk bulan suci Ramadan';
    if (daysUntil <= 0) {
        message = 'Ramadan Mubarak! 🌙✨';
    } else if (daysUntil <= 7) {
        message = 'Bersiaplah, Ramadan tinggal beberapa hari lagi! 🌙';
    } else if (daysUntil <= 30) {
        message = 'Ramadan semakin dekat, tingkatkan ibadah 📿';
    } else if (daysUntil <= 60) {
        message = 'Mulai persiapkan diri untuk menyambut Ramadan 🕌';
    }
    
    const messageEl = document.getElementById('ramadanMessage');
    if (messageEl) {
        messageEl.textContent = message;
    }
}

function updateRamadanCountdown() {
    if (!ramadanDate) return;
    
    const now = new Date();
    const timeDiff = ramadanDate - now;
    
    if (timeDiff <= 0) {
        // Check if we're during Ramadan (30 days after start)
        const ramadanEnd = new Date(ramadanDate);
        ramadanEnd.setDate(ramadanEnd.getDate() + 30);
        
        if (now <= ramadanEnd) {
            // During Ramadan
            document.getElementById('ramadanMessage').textContent = 'Ramadan Mubarak! 🌙✨';
            document.getElementById('ramadanDays').textContent = '🌙';
            document.getElementById('ramadanHours').textContent = 'Sedang';
            document.getElementById('ramadanMinutes').textContent = 'Berlangsung';
        } else {
            // Ramadan has ended, load next year's data
            loadDynamicRamadanData();
        }
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    const daysEl = document.getElementById('ramadanDays');
    const hoursEl = document.getElementById('ramadanHours');
    const minutesEl = document.getElementById('ramadanMinutes');
    
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    
    // Update message based on time remaining
    const messageEl = document.getElementById('ramadanMessage');
    if (messageEl && days > 0) {
        let message = 'Persiapkan diri untuk bulan suci Ramadan';
        if (days <= 7) {
            message = 'Bersiaplah, Ramadan tinggal beberapa hari lagi! 🌙';
        } else if (days <= 30) {
            message = 'Ramadan semakin dekat, tingkatkan ibadah 📿';
        } else if (days <= 60) {
            message = 'Mulai persiapkan diri untuk menyambut Ramadan 🕌';
        }
        messageEl.textContent = message;
    }
}

function startRamadanCountdownTimer() {
    updateRamadanCountdown();
    
    // Update every minute
    setInterval(updateRamadanCountdown, 60000);
    
    // Check for date changes every hour (to refresh data if needed)
    setInterval(() => {
        const now = new Date();
        const lastCheck = localStorage.getItem('lastRamadanCheck');
        const today = now.toDateString();
        
        if (lastCheck !== today) {
            console.log('Date changed, refreshing Ramadan data...');
            loadDynamicRamadanData();
            localStorage.setItem('lastRamadanCheck', today);
        }
    }, 3600000); // Check every hour
    
    // Set initial check date
    localStorage.setItem('lastRamadanCheck', new Date().toDateString());
}

function updateCalendarDisplay() {
    // This function can be expanded to show a full calendar view
    // For now, it updates the current display
    updateDateDisplay();
}

// Month navigation functions
document.getElementById('prevMonth')?.addEventListener('click', () => {
    // Navigate to previous Hijri month
    showNotification('Navigasi bulan akan segera tersedia');
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
    // Navigate to next Hijri month
    showNotification('Navigasi bulan akan segera tersedia');
});


// ===== FLOATING AUDIO BUTTON =====
let audioPlayerContent = '';

// Initialize floating audio button
function initFloatingAudioButton() {
    const floatingBtn = document.getElementById('floatingAudioBtn');
    const audioModal = document.getElementById('audioPlayerModal');
    const closeModal = document.getElementById('closeAudioModal');
    const modalContent = document.getElementById('modalAudioPlayerContent');
    
    if (!floatingBtn || !audioModal) return;
    
    // Show floating button when surah is opened
    floatingBtn.addEventListener('click', () => {
        audioModal.classList.remove('hidden');
        // Copy audio player content to modal
        const audioContainer = document.getElementById('audioPlayerContainer');
        if (audioContainer && modalContent) {
            modalContent.innerHTML = audioContainer.innerHTML;
            // Re-attach event listeners for modal player
            reattachAudioPlayerEvents();
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        audioModal.classList.add('hidden');
    });
    
    // Close on overlay click
    audioModal.querySelector('.modal-overlay').addEventListener('click', () => {
        audioModal.classList.add('hidden');
    });
}

// Show/hide floating button
function toggleFloatingAudioButton(show) {
    const floatingBtn = document.getElementById('floatingAudioBtn');
    if (!floatingBtn) return;
    
    if (show) {
        floatingBtn.classList.remove('hidden');
        setTimeout(() => floatingBtn.classList.add('visible'), 10);
    } else {
        floatingBtn.classList.remove('visible');
        setTimeout(() => floatingBtn.classList.add('hidden'), 300);
    }
}

// Update floating button playing state
function updateFloatingButtonState(isPlaying) {
    const floatingBtn = document.getElementById('floatingAudioBtn');
    if (!floatingBtn) return;
    
    if (isPlaying) {
        floatingBtn.classList.add('playing');
    } else {
        floatingBtn.classList.remove('playing');
    }
}

// Re-attach audio player event listeners in modal
function reattachAudioPlayerEvents() {
    const playPauseBtn = document.querySelector('#modalAudioPlayerContent #playPauseBtn');
    const prevBtn = document.querySelector('#modalAudioPlayerContent #prevAyahBtn');
    const nextBtn = document.querySelector('#modalAudioPlayerContent #nextAyahBtn');
    const loopBtn = document.querySelector('#modalAudioPlayerContent #loopBtn');
    const autoScrollBtn = document.querySelector('#modalAudioPlayerContent #autoScrollBtn');
    const speedBtn = document.querySelector('#modalAudioPlayerContent #speedBtn');
    const qariSelect = document.querySelector('#modalAudioPlayerContent #qariSelect');
    const progressBar = document.querySelector('#modalAudioPlayerContent #audioProgressBar');
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
            } else if (currentAudio) {
                currentAudio.play();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentAyahIndex > 0) {
                playAyah(currentAyahIndex - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSurahData && currentAyahIndex < currentSurahData.ayahs.length - 1) {
                playAyah(currentAyahIndex + 1);
            }
        });
    }
    
    if (loopBtn) {
        loopBtn.addEventListener('click', () => {
            isLooping = !isLooping;
            loopBtn.classList.toggle('active');
            localStorage.setItem('audioLoop', isLooping);
        });
    }
    
    if (autoScrollBtn) {
        autoScrollBtn.addEventListener('click', () => {
            autoScroll = !autoScroll;
            autoScrollBtn.classList.toggle('active');
            localStorage.setItem('autoScroll', autoScroll);
        });
    }
    
    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
            const currentIndex = speeds.indexOf(playbackSpeed);
            playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
            speedBtn.textContent = `${playbackSpeed}x`;
            if (currentAudio) {
                currentAudio.playbackRate = playbackSpeed;
            }
            localStorage.setItem('playbackSpeed', playbackSpeed);
        });
    }
    
    if (qariSelect) {
        qariSelect.addEventListener('change', (e) => {
            currentQari = e.target.value;
            localStorage.setItem('currentQari', currentQari);
            if (currentAudio && !currentAudio.paused) {
                const wasPlaying = true;
                const currentTime = currentAudio.currentTime;
                playAyah(currentAyahIndex);
            }
        });
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (!currentAudio) return;
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = percent * currentAudio.duration;
        });
    }
}

// Call init on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingAudioButton);
} else {
    initFloatingAudioButton();
}


// ===== NOTIFICATION SYSTEM =====
const ADZAN_URLS = {
    makkah: 'https://server11.mp3quran.net/a_jbr/Adhan/Makkah.mp3',
    madinah: 'https://server11.mp3quran.net/a_jbr/Adhan/Madinah.mp3',
    egypt: 'https://server11.mp3quran.net/a_jbr/Adhan/Egypt.mp3',
    turkey: 'https://server11.mp3quran.net/a_jbr/Adhan/Turkey.mp3'
};

let notificationSettings = {
    enabled: true,
    reminderMinutes: 5,
    prayers: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true
    },
    adhanSound: 'makkah',
    volume: 80,
    vibration: true
};

let adhanAudio = null;
let scheduledNotifications = [];

// Load notification settings from localStorage
function loadNotificationSettings() {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
        notificationSettings = JSON.parse(saved);
    }
    updateNotificationUI();
}

// Save notification settings to localStorage
function saveNotificationSettings() {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
}

// Update UI with current settings
function updateNotificationUI() {
    const enableToggle = document.getElementById('enableNotifications');
    const reminderSelect = document.getElementById('reminderMinutes');
    const adhanSelect = document.getElementById('adhanSound');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const vibrationToggle = document.getElementById('vibrationToggle');
    
    if (enableToggle) enableToggle.checked = notificationSettings.enabled;
    if (reminderSelect) reminderSelect.value = notificationSettings.reminderMinutes;
    if (adhanSelect) adhanSelect.value = notificationSettings.adhanSound;
    if (volumeSlider) {
        volumeSlider.value = notificationSettings.volume;
        if (volumeValue) volumeValue.textContent = `${notificationSettings.volume}%`;
    }
    if (vibrationToggle) vibrationToggle.checked = notificationSettings.vibration;
    
    // Update prayer toggles
    document.querySelectorAll('.prayer-toggle').forEach(toggle => {
        const prayer = toggle.dataset.prayer;
        if (prayer && notificationSettings.prayers[prayer] !== undefined) {
            toggle.checked = notificationSettings.prayers[prayer];
        }
    });
}

// Initialize notification modal
function initNotificationModal() {
    const modal = document.getElementById('notificationModal');
    const openBtn = document.getElementById('dockOpenNotification');
    const closeBtn = document.getElementById('closeNotificationModal');
    const saveBtn = document.getElementById('saveNotificationSettings');
    const testNotifBtn = document.getElementById('testNotification');
    const testAdhanBtn = document.getElementById('testAdhan');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    if (!modal) return;
    
    // Load settings
    loadNotificationSettings();
    
    // Open modal
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            // Close profile dropdown
            const dropdown = document.getElementById('dockProfileDropdown');
            if (dropdown) dropdown.classList.add('hidden');
        });
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    // Volume slider
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', (e) => {
            volumeValue.textContent = `${e.target.value}%`;
        });
    }
    
    // Save settings
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Get all settings
            const enableToggle = document.getElementById('enableNotifications');
            const reminderSelect = document.getElementById('reminderMinutes');
            const adhanSelect = document.getElementById('adhanSound');
            const vibrationToggle = document.getElementById('vibrationToggle');
            
            notificationSettings.enabled = enableToggle ? enableToggle.checked : true;
            notificationSettings.reminderMinutes = reminderSelect ? parseInt(reminderSelect.value) : 5;
            notificationSettings.adhanSound = adhanSelect ? adhanSelect.value : 'makkah';
            notificationSettings.volume = volumeSlider ? parseInt(volumeSlider.value) : 80;
            notificationSettings.vibration = vibrationToggle ? vibrationToggle.checked : true;
            
            // Get prayer toggles
            document.querySelectorAll('.prayer-toggle').forEach(toggle => {
                const prayer = toggle.dataset.prayer;
                if (prayer) {
                    notificationSettings.prayers[prayer] = toggle.checked;
                }
            });
            
            saveNotificationSettings();
            
            // Schedule notifications
            scheduleAllNotifications();
            
            alert('Pengaturan notifikasi berhasil disimpan!');
            modal.classList.add('hidden');
        });
    }
    
    // Test notification
    if (testNotifBtn) {
        testNotifBtn.addEventListener('click', () => {
            testNotification();
        });
    }
    
    // Test adhan
    if (testAdhanBtn) {
        testAdhanBtn.addEventListener('click', () => {
            testAdhan();
        });
    }
}

// Test notification
function testNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Waktu Dzuhur Telah Tiba', {
                body: 'Mari segera menunaikan sholat 🕌',
                icon: '/icon.png',
                badge: '/badge.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Waktu Dzuhur Telah Tiba', {
                        body: 'Mari segera menunaikan sholat 🕌',
                        icon: '/icon.png',
                        badge: '/badge.png'
                    });
                }
            });
        } else {
            alert('Notifikasi diblokir. Aktifkan di pengaturan browser.');
        }
    } else {
        alert('Browser tidak support notifikasi.');
    }
}

// Test adhan sound
function testAdhan() {
    const sound = notificationSettings.adhanSound;
    
    if (sound === 'silent') {
        alert('Mode silent aktif, tidak ada suara adzan.');
        return;
    }
    
    // Stop previous audio if playing
    if (adhanAudio) {
        adhanAudio.pause();
        adhanAudio = null;
    }
    
    // Show loading message
    const testBtn = document.getElementById('testAdhan');
    const originalText = testBtn ? testBtn.innerHTML : '';
    if (testBtn) testBtn.innerHTML = '<span>Loading...</span>';
    
    // Play adzan
    adhanAudio = new Audio(ADZAN_URLS[sound]);
    adhanAudio.volume = notificationSettings.volume / 100;
    
    // Add event listeners
    adhanAudio.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully');
        if (testBtn) testBtn.innerHTML = originalText;
    });
    
    adhanAudio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        if (testBtn) testBtn.innerHTML = originalText;
        
        // More specific error message
        let errorMsg = 'Gagal memutar adzan.\n\n';
        if (e.target.error) {
            switch(e.target.error.code) {
                case 1:
                    errorMsg += 'Error: Proses dibatalkan';
                    break;
                case 2:
                    errorMsg += 'Error: Koneksi internet bermasalah';
                    break;
                case 3:
                    errorMsg += 'Error: File audio corrupt';
                    break;
                case 4:
                    errorMsg += 'Error: Format audio tidak didukung';
                    break;
                default:
                    errorMsg += 'Error: Unknown error';
            }
        }
        errorMsg += '\n\nCoba pilih adzan lain atau cek koneksi internet.';
        alert(errorMsg);
    });
    
    adhanAudio.play().then(() => {
        console.log('Playing adzan:', sound);
        alert('Adzan sedang diputar (30 detik). Volume: ' + notificationSettings.volume + '%');
    }).catch(error => {
        console.error('Play error:', error);
        if (testBtn) testBtn.innerHTML = originalText;
        
        // Check if it's autoplay policy
        if (error.name === 'NotAllowedError') {
            alert('Browser memblokir autoplay audio.\n\nSolusi: Klik tombol "Test Suara Adzan" lagi.');
        } else {
            alert('Gagal memutar adzan.\n\nError: ' + error.message + '\n\nCoba pilih adzan lain.');
        }
    });
    
    // Stop after 30 seconds (for testing)
    setTimeout(() => {
        if (adhanAudio) {
            adhanAudio.pause();
            adhanAudio = null;
            console.log('Adzan test stopped after 30 seconds');
        }
    }, 30000);
}

// Schedule all notifications
async function scheduleAllNotifications() {
    if (!notificationSettings.enabled) {
        console.log('Notifications disabled');
        return;
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    
    // Get prayer times for today
    try {
        const times = await getPrayerTimesForToday();
        if (!times) return;
        
        // Clear existing scheduled notifications
        clearScheduledNotifications();
        
        // Schedule notifications for each prayer
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const prayerNames = {
            fajr: 'Subuh',
            dhuhr: 'Dzuhur',
            asr: 'Ashar',
            maghrib: 'Maghrib',
            isha: 'Isya'
        };
        
        prayers.forEach(prayer => {
            if (!notificationSettings.prayers[prayer]) return;
            
            const time = times[prayer];
            if (!time) return;
            
            const [hours, minutes] = time.split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(hours, minutes, 0, 0);
            
            // Skip if time has passed
            if (prayerTime < new Date()) return;
            
            // Schedule reminder before prayer
            if (notificationSettings.reminderMinutes > 0) {
                const reminderTime = new Date(prayerTime.getTime() - notificationSettings.reminderMinutes * 60000);
                if (reminderTime > new Date()) {
                    scheduleNotification(reminderTime, {
                        title: `Waktu ${prayerNames[prayer]} Sebentar Lagi`,
                        body: `Bersiap untuk sholat dalam ${notificationSettings.reminderMinutes} menit 🕌`,
                        playAdhan: false
                    });
                }
            }
            
            // Schedule notification at prayer time
            scheduleNotification(prayerTime, {
                title: `Waktu ${prayerNames[prayer]} Telah Tiba`,
                body: 'Mari segera menunaikan sholat 🕌',
                playAdhan: true
            });
        });
        
        console.log('Notifications scheduled successfully');
    } catch (error) {
        console.error('Error scheduling notifications:', error);
    }
}

// Schedule a single notification
function scheduleNotification(time, options) {
    const timeout = time.getTime() - Date.now();
    
    if (timeout <= 0) return;
    
    const timeoutId = setTimeout(() => {
        showNotification(options);
    }, timeout);
    
    scheduledNotifications.push(timeoutId);
}

// Show notification
function showNotification(options) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(options.title, {
            body: options.body,
            icon: '/icon.png',
            badge: '/badge.png',
            vibrate: notificationSettings.vibration ? [200, 100, 200] : undefined
        });
        
        // Play adzan if needed
        if (options.playAdhan && notificationSettings.adhanSound !== 'silent') {
            playAdhan();
        }
        
        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
    }
}

// Play adzan
function playAdhan() {
    const sound = notificationSettings.adhanSound;
    
    if (sound === 'silent') return;
    
    // Stop previous audio if playing
    if (adhanAudio) {
        adhanAudio.pause();
        adhanAudio = null;
    }
    
    // Play adzan
    adhanAudio = new Audio(ADZAN_URLS[sound]);
    adhanAudio.volume = notificationSettings.volume / 100;
    
    adhanAudio.play().catch(error => {
        console.error('Error playing adzan:', error);
    });
}

// Get prayer times for today
async function getPrayerTimesForToday() {
    try {
        // Get user location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        const today = new Date();
        const timestamp = Math.floor(today.getTime() / 1000);
        
        const response = await fetch(
            `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        
        const data = await response.json();
        
        if (data.code === 200) {
            return {
                fajr: data.data.timings.Fajr,
                dhuhr: data.data.timings.Dhuhr,
                asr: data.data.timings.Asr,
                maghrib: data.data.timings.Maghrib,
                isha: data.data.timings.Isha
            };
        }
    } catch (error) {
        console.error('Error getting prayer times:', error);
    }
    
    return null;
}

// Clear scheduled notifications
function clearScheduledNotifications() {
    scheduledNotifications.forEach(timeoutId => clearTimeout(timeoutId));
    scheduledNotifications = [];
}


// ===== FONT SETTINGS =====
function initFontSettings() {
    const modal = document.getElementById('fontSettingsModal');
    const openBtn = document.getElementById('dockOpenFontSettings');
    const closeBtn = document.getElementById('closeFontSettingsModal');
    
    const arabicFontFamily = document.getElementById('arabicFontFamily');
    const arabicFontSize = document.getElementById('arabicFontSize');
    const translationFontSize = document.getElementById('translationFontSize');
    const resetBtn = document.getElementById('resetFontBtn');
    
    const arabicFontSizeValue = document.getElementById('arabicFontSizeValue');
    const translationFontSizeValue = document.getElementById('translationFontSizeValue');
    const previewArabic = document.getElementById('previewArabic');
    
    // Load saved settings
    function loadFontSettings() {
        const savedArabicFont = localStorage.getItem('arabicFontFamily') || "'Amiri', serif";
        const savedArabicSize = localStorage.getItem('arabicFontSize') || '1.5';
        const savedTranslationSize = localStorage.getItem('translationFontSize') || '1';
        
        arabicFontFamily.value = savedArabicFont;
        arabicFontSize.value = savedArabicSize;
        translationFontSize.value = savedTranslationSize;
        
        applyFontSettings(savedArabicFont, savedArabicSize, savedTranslationSize);
    }
    
    // Apply font settings to CSS variables
    function applyFontSettings(fontFamily, arabicSize, translationSize) {
        document.documentElement.style.setProperty('--arabic-font-family', fontFamily);
        document.documentElement.style.setProperty('--arabic-font-size', `${arabicSize}rem`);
        document.documentElement.style.setProperty('--translation-font-size', `${translationSize}rem`);
        
        // Update preview
        previewArabic.style.fontFamily = fontFamily;
        previewArabic.style.fontSize = `${arabicSize}rem`;
        
        // Update value displays
        arabicFontSizeValue.textContent = `${arabicSize}rem`;
        translationFontSizeValue.textContent = `${translationSize}rem`;
    }
    
    // Save settings to localStorage
    function saveFontSettings() {
        localStorage.setItem('arabicFontFamily', arabicFontFamily.value);
        localStorage.setItem('arabicFontSize', arabicFontSize.value);
        localStorage.setItem('translationFontSize', translationFontSize.value);
    }
    
    // Event listeners
    openBtn?.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.getElementById('dockProfileDropdown').classList.add('hidden');
    });
    
    closeBtn?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal?.querySelector('.modal-overlay')?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // Font family change
    arabicFontFamily?.addEventListener('change', () => {
        applyFontSettings(arabicFontFamily.value, arabicFontSize.value, translationFontSize.value);
        saveFontSettings();
        showToast('Font Arab berhasil diubah', 'success');
    });
    
    // Arabic font size change
    arabicFontSize?.addEventListener('input', () => {
        applyFontSettings(arabicFontFamily.value, arabicFontSize.value, translationFontSize.value);
    });
    
    arabicFontSize?.addEventListener('change', () => {
        saveFontSettings();
        showToast('Ukuran font Arab berhasil diubah', 'success');
    });
    
    // Translation font size change
    translationFontSize?.addEventListener('input', () => {
        applyFontSettings(arabicFontFamily.value, arabicFontSize.value, translationFontSize.value);
    });
    
    translationFontSize?.addEventListener('change', () => {
        saveFontSettings();
        showToast('Ukuran font terjemahan berhasil diubah', 'success');
    });
    
    // Reset to default
    resetBtn?.addEventListener('click', () => {
        arabicFontFamily.value = "'Amiri', serif";
        arabicFontSize.value = '1.5';
        translationFontSize.value = '1';
        
        applyFontSettings("'Amiri', serif", '1.5', '1');
        saveFontSettings();
        showToast('Pengaturan font direset ke default', 'info');
    });
    
    // Load settings on init
    loadFontSettings();
}


// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initNotificationModal();
        initFontSettings();
        // Schedule notifications on app start
        scheduleAllNotifications();
    });
} else {
    initNotificationModal();
    initFontSettings();
    scheduleAllNotifications();
}

// Re-schedule notifications every day at midnight
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        scheduleAllNotifications();
    }
}, 60000); // Check every minute


// ===== NETWORK STATUS MONITORING =====
let isOnline = navigator.onLine;
let hasShownInitialStatus = false;

function checkNetworkStatus() {
    const currentStatus = navigator.onLine;
    
    // Only show toast after initial load and when status changes
    if (hasShownInitialStatus && currentStatus !== isOnline) {
        if (currentStatus) {
            showToast('Koneksi internet tersambung', 'success');
        } else {
            showToast('Koneksi internet terputus. Beberapa fitur mungkin tidak tersedia.', 'error', 5000);
        }
    }
    
    isOnline = currentStatus;
    
    // Mark that we've checked initial status
    if (!hasShownInitialStatus) {
        hasShownInitialStatus = true;
    }
}

// Listen for online/offline events
window.addEventListener('online', checkNetworkStatus);
window.addEventListener('offline', checkNetworkStatus);

// Check initial status after a short delay (to avoid showing toast on first load)
setTimeout(() => {
    hasShownInitialStatus = true;
}, 2000);


// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, duration);
}

// Helper functions
function showSuccess(message, duration) {
    showToast(message, 'success', duration);
}

function showError(message, duration) {
    showToast(message, 'error', duration);
}

function showInfo(message, duration) {
    showToast(message, 'info', duration);
}
