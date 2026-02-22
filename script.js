/* ====================================================
   ZIN(CIR)DE — Application Logic
   Postür & Pelvik Taban Sağlığı
   ==================================================== */

/* --- Google Drive Configuration (Same as Ta-Ta) --- */
const CLIENT_ID = '731532590604-trqj7h9uuic49qncq4rmkns25cblpt5r.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCpJYanlDG88gVG3XPaDgDQHkKJvgzlk00';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
const DRIVE_FILENAME = 'zincirde_data.json';

/* --- Exercise Database (9 adım) --- */
const EXERCISES = [
    {
        id: 1,
        name: 'Doorway Stretch',
        duration: '45 sn (her kol)',
        durationSeconds: 90,
        perSideSeconds: 45,
        bilateral: true,
        type: 'timed',
        reps: null,
        frequency: 'Günde 3 Kez',
        dailyTarget: 3,
        description: 'Omuzları öne çeken göğüs kaslarını açar; trapezlerdeki "gerilme" ağrısını bitirir.',
        instructions: 'Kapı eşiğine geç. Kollarını "L" harfi gibi kapıya daya. Bir adım öne at ve göğsündeki o gerilmeyi hisset. Bekle.'
    },
    {
        id: 2,
        name: 'Couch Stretch',
        duration: '1 dk (her bacak)',
        durationSeconds: 120,
        perSideSeconds: 60,
        bilateral: true,
        type: 'timed',
        reps: null,
        frequency: 'Günde 2 Kez',
        dailyTarget: 2,
        description: 'Bel çukurunu (APT) derinleştiren kalça kaslarını uzatır; bel ağrısını kökten çözer.',
        instructions: 'Bir dizini koltuğun üzerine koy, diğer ayağın yerde olsun. Gövdeni dik tut ve kalçanı öne doğru it. Acı tatlıdır, dayan.'
    },
    {
        id: 3,
        name: 'Deep Squat',
        duration: '2 Dakika',
        durationSeconds: 120,
        bilateral: false,
        type: 'timed',
        reps: null,
        frequency: 'Günde 3 Kez',
        dailyTarget: 3,
        description: 'Pelvik tabanı gevşetir, idrar zorluğu ve alt bel baskısı için en etkili ilaçtır.',
        instructions: 'Ayaklarını geniş aç. Topuklarını yerden kaldırmadan en dibe kadar çök. Dirseklerinle dizlerini dışa doğru it.'
    },
    {
        id: 4,
        name: 'Diyafram Nefesi',
        duration: '5 Dakika',
        durationSeconds: 300,
        bilateral: false,
        type: 'timed',
        reps: null,
        frequency: 'Günde 3 Kez',
        dailyTarget: 3,
        description: 'Pelvik tabandaki kronik kasılmayı durdurur; sinir sistemini "gevşe" moduna sokar.',
        instructions: 'Sırt üstü yat, bir elini göbeğine koy. Burnundan nefes alırken göbeğin şişsin, verirken sönsün. Göğsün hareket etmesin.'
    },
    {
        id: 5,
        name: 'Happy Baby Pose',
        duration: '1 Dakika',
        durationSeconds: 60,
        bilateral: false,
        type: 'timed',
        reps: null,
        frequency: 'Günde 2 Kez',
        dailyTarget: 2,
        description: 'Kalça ve pelvik tabanı en güvenli açıda esneterek rahatlanma sağlar.',
        instructions: 'Sırt üstü yat, dizlerini göğsüne çek. Ayaklarını dıştan yakala ve yanlara doğru aç. Bebek gibi sağa sola sallanabilirsin.'
    },
    {
        id: 6,
        name: 'Cat-Cow',
        duration: '12 Tekrar',
        durationSeconds: null,
        bilateral: false,
        type: 'reps',
        reps: 12,
        frequency: 'Günde 2 Kez',
        dailyTarget: 2,
        description: 'Omurgayı mobilize eder; sertleşmiş sırt ve bel dokularını yumuşatır.',
        instructions: 'Ellerinin ve dizlerinin üzerinde dur. Nefes alırken belini çukurlaştırıp karşıya bak (İnek), verirken sırtını kamburlaştır (Kedi).'
    },
    {
        id: 7,
        name: 'Chin Tucks',
        duration: '15 Tekrar',
        durationSeconds: null,
        bilateral: false,
        type: 'reps',
        reps: 15,
        frequency: 'Günde 3 Kez',
        dailyTarget: 3,
        description: 'Başın önde durmasını engeller; boyun omurlarına binen 15-20 kglık yükü kaldırır.',
        instructions: 'Karşıya bak. Çeneni parmağınla geriye doğru it, sanki "çift çene" yapmaya çalışıyormuşsun gibi. Kaplumbağa gibi ol.'
    },
    {
        id: 8,
        name: 'Wall Slides',
        duration: '12 Tekrar',
        durationSeconds: null,
        bilateral: false,
        type: 'reps',
        reps: 12,
        frequency: 'Günde 2 Kez',
        dailyTarget: 2,
        description: 'Kürek kemiği kaslarını aktive eder; omuzların kendiliğinden dik durmasını sağlar.',
        instructions: 'Sırtını duvara yasla. Kollarını "W" yapıp duvara yapıştır. Duvarla temasını kesmeden kollarını yukarı "Y" yapacak kaydır.'
    },
    {
        id: 9,
        name: 'Bird-Dog',
        duration: '12 Tekrar',
        durationSeconds: null,
        bilateral: false,
        type: 'reps',
        reps: 12,
        frequency: 'Günde 1 Kez',
        dailyTarget: 1,
        description: 'Core bölgesini "korse" gibi güçlendirir; ayaktayken oluşan bel ağrısını keser.',
        instructions: 'Eller ve dizler üzerindeyken; sağ kolunu ileri, sol bacağını geri uzat. Dengenizi bozma, dümdüz bir çizgi ol. Sonra taraf değiştir.'
    }
];

/* --- Global State --- */
let tokenClient;
let gapiInited = false;
let gisInited = false;
let autoPopupAttempted = false;
let isAuthCheckPending = false;
let silentAuthTimer = null;
let currentDriveFileId = null;

// App data (synced with Google Drive)
let appData = {
    streak: { current: 0, longest: 0, lastCompleted: null },
    dailyLog: {},
    ringLevels: {}, // { "2026-02-22": 3, "2026-02-21": 2, ... } 0=gray, 1=bronze, 2=silver, 3=gold
    lastUpdated: 0
};

// UI references
let ui = {};

// Timer state
let timerInterval = null;
let timerSeconds = 0;
let timerTotalSeconds = 0;
let timerRunning = false;
let currentExerciseId = null;
let currentReps = 0;

/* ====================================================
   GOOGLE AUTH (Same pattern as Ta-Ta)
   ==================================================== */

window.gapiLoaded = async function () {
    try {
        await gapi.load('client', async () => {
            await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
            gapiInited = true;
            checkAuthReady();
        });
    } catch (err) {
        console.error("GAPI Load Error:", err);
        forceShowAuth();
    }
};

window.gisLoaded = function () {
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: handleAuthResponse,
        });
        gisInited = true;
        checkAuthReady();
    } catch (err) {
        console.error("GIS Load Error:", err);
        forceShowAuth();
    }
};

const handleAuthResponse = async (resp) => {
    if (silentAuthTimer) clearTimeout(silentAuthTimer);

    try {
        if (resp.error) {
            console.warn("Auth Error:", resp);

            if (resp.error === 'interaction_required' || resp.error === 'login_required') {
                if (!autoPopupAttempted) {
                    console.log("Silent auth failed. Forcing popup...");
                    autoPopupAttempted = true;
                    if (ui.syncStatus) {
                        ui.syncStatus.textContent = "Oturum Yenileniyor...";
                        ui.syncStatus.className = "sync-status syncing";
                    }
                    setTimeout(() => {
                        tokenClient.requestAccessToken({ prompt: 'consent' });
                    }, 500);
                    return;
                }
                if (ui.syncStatus) {
                    ui.syncStatus.textContent = "Giriş Yapın";
                    ui.syncStatus.className = "sync-status";
                }
                updateSigninStatus(false);
                return;
            }

            if (ui.syncStatus) {
                ui.syncStatus.textContent = "Hata: " + (resp.error.message || resp.error);
                ui.syncStatus.className = "sync-status offline";
            }
            setTimeout(() => { updateSigninStatus(false); }, 2000);
            return;
        }

        if (resp.access_token) {
            gapi.client.setToken(resp);
        }

        updateSigninStatus(true);
        await loadFromDrive();

    } catch (err) {
        console.error("Auth Processing Error:", err);
        updateSigninStatus(false);
    }
};

// Fail-safe timeouts
setTimeout(() => {
    if ((!ui.mainApp || ui.mainApp.style.display === 'none') &&
        (!ui.landingScreen || ui.landingScreen.style.display === 'none')) {
        console.warn("Void State Detected");
        forceShowAuth();
    }
}, 1000);

setTimeout(() => {
    if (!sessionStorage.getItem('wasZincirdeConnected') || sessionStorage.getItem('wasZincirdeConnected') === 'false') {
        if (!gapiInited || !gisInited) {
            console.warn("Auth timeout");
            forceShowAuth();
        }
    }
}, 3000);

function forceShowAuth() {
    if (ui.authBtn) ui.authBtn.style.display = 'inline-flex';
    if (ui.landingScreen) ui.landingScreen.style.display = 'flex';
    if (ui.mainApp) ui.mainApp.style.display = 'none';
    if (ui.syncStatus) ui.syncStatus.textContent = "Bağlantı Bekleniyor...";
}

function checkAuthReady() {
    if (window.location.protocol === 'file:') {
        alert("UYARI: Google Girişi 'file://' protokolü ile çalışmaz. Lütfen 'http://localhost' veya Vercel kullanın.");
    }

    if (gapiInited && gisInited && !isAuthCheckPending) {
        const wasConnected = sessionStorage.getItem('wasZincirdeConnected') === 'true';
        if (wasConnected) {
            isAuthCheckPending = true;
            console.log("Session detected. Attempting silent auth...");

            if (ui.syncStatus) {
                ui.syncStatus.textContent = "Doğrulanıyor...";
                ui.syncStatus.className = "sync-status syncing";
            }

            if (ui.authBtn) ui.authBtn.style.display = 'none';

            silentAuthTimer = setTimeout(() => {
                console.warn("Silent Auth Timed Out");
                if (ui.syncStatus) ui.syncStatus.textContent = "Manuel Giriş Gerekli";
                updateSigninStatus(false);
            }, 5000);

            try {
                tokenClient.requestAccessToken({ prompt: 'none' });
            } catch (e) {
                console.error("Auth Request Exception:", e);
                clearTimeout(silentAuthTimer);
                updateSigninStatus(false);
            }
        } else {
            updateSigninStatus(false);
        }
    }
}

function updateSigninStatus(isSignedIn) {
    if (!ui.authBtn) return;

    if (isSignedIn) {
        ui.authBtn.style.display = 'none';
        ui.landingScreen.style.display = 'none';
        ui.mainApp.style.display = 'block';
        if (ui.userProfile) ui.userProfile.style.display = 'flex';
        if (ui.syncStatus) ui.syncStatus.textContent = "Bağlandı";
        sessionStorage.setItem('wasZincirdeConnected', 'true');
    } else {
        ui.authBtn.style.display = 'inline-flex';
        ui.landingScreen.style.display = 'flex';
        ui.mainApp.style.display = 'none';
        if (ui.userProfile) ui.userProfile.style.display = 'none';
        currentDriveFileId = null;
        appData = { streak: { current: 0, longest: 0, lastCompleted: null }, dailyLog: {}, lastUpdated: 0 };
        if (ui.syncStatus) ui.syncStatus.className = "sync-status";
        sessionStorage.setItem('wasZincirdeConnected', 'false');
    }
}

/* ====================================================
   GOOGLE DRIVE SYNC
   ==================================================== */

async function loadFromDrive() {
    if (ui.syncStatus) {
        ui.syncStatus.textContent = "Veri Aranıyor...";
        ui.syncStatus.className = "sync-status syncing";
    }

    try {
        const listResp = await gapi.client.drive.files.list({
            q: `name = '${DRIVE_FILENAME}' and 'appDataFolder' in parents and trashed = false`,
            fields: 'files(id, name)',
            spaces: 'appDataFolder'
        });

        const files = listResp.result.files;
        if (files && files.length > 0) {
            currentDriveFileId = files[0].id;
            if (ui.syncStatus) ui.syncStatus.textContent = "İndiriliyor...";

            const fileResp = await gapi.client.drive.files.get({
                fileId: currentDriveFileId,
                alt: 'media'
            });

            const cloudData = fileResp.result;
            if (cloudData) {
                appData = cloudData;
                // Ensure data structure
                if (!appData.streak) appData.streak = { current: 0, longest: 0, lastCompleted: null };
                if (!appData.dailyLog) appData.dailyLog = {};

                // MIGRATION: Backfill ringLevels if it's missing but user has a streak
                if (!appData.ringLevels) {
                    appData.ringLevels = {};
                    const streakCount = appData.streak.current || 0;
                    const lastComp = appData.streak.lastCompleted;
                    if (streakCount > 0 && lastComp) {
                        try {
                            const lastDate = new Date(lastComp + 'T00:00:00');
                            for (let i = 0; i < streakCount; i++) {
                                const d = new Date(lastDate);
                                d.setDate(d.getDate() - i);
                                const dateStr = d.toISOString().split('T')[0];
                                appData.ringLevels[dateStr] = 3; // Mark historical streak as Gold
                            }
                        } catch (e) { console.error("Migration backfill failed", e); }
                    }
                }

                if (ui.syncStatus) ui.syncStatus.textContent = "Senkronize";
            }
        } else {
            console.log("No Drive file found. Starting fresh.");
            if (ui.syncStatus) ui.syncStatus.textContent = "Yeni Başlangıç";
            appData = { streak: { current: 0, longest: 0, lastCompleted: null }, dailyLog: {}, ringLevels: {}, lastUpdated: 0 };
        }

        if (ui.syncStatus) ui.syncStatus.className = "sync-status";

        // Check streak break BEFORE rendering
        checkStreakBreak();
        syncTodayRingLevel(); // Ensure today's ring is accurate
        renderApp();

    } catch (err) {
        console.error("Drive Load Error:", err);
        if (ui.syncStatus) {
            ui.syncStatus.textContent = "Bağlantı Hatası";
            ui.syncStatus.className = "sync-status offline";
        }
        renderApp();
    }
}

async function syncToDrive() {
    if (!gapi.client.getToken()) return;

    const appSyncStatus = document.getElementById('app-sync-status');
    if (appSyncStatus) {
        appSyncStatus.style.color = 'var(--gold)';
        appSyncStatus.style.animation = 'syncPulse 0.5s ease-in-out infinite';
    }

    const fileContent = JSON.stringify(appData);

    try {
        if (currentDriveFileId) {
            await fetch(`https://www.googleapis.com/upload/drive/v3/files/${currentDriveFileId}?uploadType=media`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + gapi.client.getToken().access_token,
                    'Content-Type': 'application/json'
                },
                body: fileContent
            });
        } else {
            const metadata = { name: DRIVE_FILENAME, parents: ['appDataFolder'] };
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([fileContent], { type: 'application/json' }));

            const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + gapi.client.getToken().access_token }),
                body: form
            });
            const data = await resp.json();
            currentDriveFileId = data.id;
        }

        if (appSyncStatus) {
            appSyncStatus.style.color = 'var(--success)';
            appSyncStatus.style.animation = 'syncPulse 2s ease-in-out infinite';
        }
    } catch (err) {
        console.error("Sync Error:", err);
        if (appSyncStatus) {
            appSyncStatus.style.color = 'var(--danger)';
            appSyncStatus.style.animation = 'none';
        }
    }
}

function saveData() {
    appData.lastUpdated = Date.now();
    renderApp();
    syncToDrive();
}

/* ====================================================
   STREAK LOGIC
   ==================================================== */

function getLocalDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getYesterdayDateString() {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function daysBetween(dateStr1, dateStr2) {
    if (!dateStr1 || !dateStr2) return Infinity;
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    return Math.abs(Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)));
}

function checkStreakBreak() {
    const today = getLocalDateString();
    const yesterday = getYesterdayDateString();

    // Check if yesterday was completed at least to Bronze level
    const yesterdayLevel = appData.ringLevels[yesterday] || 0;

    if (yesterdayLevel === 0 && appData.streak.current > 0) {
        // STREAK BROKEN!
        console.log(`Streak broken! Yesterday (${yesterday}) was not completed.`);
        appData.streak.current = 0;
        saveData();
        showChainBreak();
    }
}

function showChainBreak() {
    const overlay = document.getElementById('chain-break-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');

        // Haptic feedback (Vibration API)
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 400]);
        }
    }
}

function hideChainBreak() {
    const overlay = document.getElementById('chain-break-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function getTodayLog() {
    const today = getLocalDateString();
    if (!appData.dailyLog[today]) {
        appData.dailyLog[today] = {
            completedExercises: {},
            completionTimestamps: {},
            lastCompletedExerciseId: null,
            allCompleted: false
        };
    }
    // Migration: ensure new fields exist for old logs
    const log = appData.dailyLog[today];
    if (!log.completionTimestamps) log.completionTimestamps = {};
    if (!log.hasOwnProperty('lastCompletedExerciseId')) log.lastCompletedExerciseId = null;
    return log;
}

function getExerciseTodayCount(exerciseId) {
    const log = getTodayLog();
    return log.completedExercises[exerciseId] || 0;
}

function isExerciseDoneToday(exerciseId) {
    const exercise = EXERCISES.find(e => e.id === exerciseId);
    if (!exercise) return false;
    return getExerciseTodayCount(exerciseId) >= exercise.dailyTarget;
}

/* --- Current round: which "pass" (1-based) the user is on --- */
function getCurrentRound() {
    const log = getTodayLog();
    // Round = minimum completion count across ALL exercises + 1
    let minCount = Infinity;
    EXERCISES.forEach(ex => {
        const count = log.completedExercises[ex.id] || 0;
        if (count < minCount) minCount = count;
    });
    return (minCount === Infinity ? 0 : minCount) + 1;
}

/* --- Check if all exercises have been completed at least N times --- */
function allExercisesCompletedNTimes(n) {
    const log = getTodayLog();
    return EXERCISES.every(ex => (log.completedExercises[ex.id] || 0) >= n);
}

/* --- Lock status for an exercise --- */
function getExerciseLockStatus(exerciseId) {
    const log = getTodayLog();
    const exercise = EXERCISES.find(e => e.id === exerciseId);
    if (!exercise) return { locked: true, reason: 'Egzersiz bulunamadı' };

    const count = log.completedExercises[exerciseId] || 0;

    // Already fully done for the day
    if (count >= exercise.dailyTarget) {
        return { locked: true, reason: 'Bugünlük tamamlandı ✓', done: true };
    }

    // Round lock: can't do 2nd time until all 9 are done 1x
    if (count >= 1 && !allExercisesCompletedNTimes(count)) {
        const remaining = EXERCISES.filter(ex => (log.completedExercises[ex.id] || 0) < count);
        return { locked: true, reason: `Önce diğer ${remaining.length} hareketi bitir`, type: 'round' };
    }

    // Consecutive lock: can't repeat the last completed exercise
    if (log.lastCompletedExerciseId === exerciseId && EXERCISES.length > 1) {
        return { locked: true, reason: 'Önce başka bir hareket yap', type: 'consecutive' };
    }

    // Time lock: 120 min cooldown
    const timestamps = log.completionTimestamps[exerciseId] || [];
    if (timestamps.length > 0) {
        const lastTs = timestamps[timestamps.length - 1];
        const elapsed = (Date.now() - lastTs) / (1000 * 60); // minutes
        if (elapsed < 120) {
            const remaining = Math.ceil(120 - elapsed);
            return { locked: true, reason: `${remaining} dk sonra tekrar yapabilirsin`, type: 'cooldown', remainingMin: remaining };
        }
    }

    return { locked: false };
}

/* --- Sync today's ring level based on actual completions --- */
function syncTodayRingLevel() {
    const today = getLocalDateString();
    const currentLevel = getRingLevel();
    const oldLevel = appData.ringLevels[today] || 0;

    if (currentLevel > oldLevel) {
        appData.ringLevels[today] = currentLevel;

        // Ensure streak is updated if they reached Bronze (level 1+)
        if (currentLevel >= 1 && appData.streak.lastCompleted !== today) {
            const yesterday = getYesterdayDateString();
            if (appData.streak.lastCompleted === yesterday) {
                appData.streak.current += 1;
            } else {
                appData.streak.current = 1;
            }
            appData.streak.lastCompleted = today;
            if (appData.streak.current > appData.streak.longest) {
                appData.streak.longest = appData.streak.current;
            }
        }
        // saveData() will be called by the caller if needed, or we call it here
        syncToDrive(); // Use syncToDrive directly to avoid renderApp loop if called from renderApp
    }
}

/* --- Tiered ring level (0-3) --- */
function getRingLevel() {
    const tier = getCurrentRingTier();
    if (tier === 'gold') return 3;
    if (tier === 'silver') return 2;
    if (tier === 'bronze') return 1;
    return 0;
}

/* --- Tiered ring system --- */
function getCurrentRingTier() {
    const log = getTodayLog();
    // Gold: all exercises with dailyTarget>=3 completed 3x
    const goldExercises = EXERCISES.filter(ex => ex.dailyTarget >= 3);
    const goldDone = goldExercises.every(ex => (log.completedExercises[ex.id] || 0) >= 3);
    // Silver: all exercises with dailyTarget>=2 completed 2x
    const silverExercises = EXERCISES.filter(ex => ex.dailyTarget >= 2);
    const silverDone = silverExercises.every(ex => (log.completedExercises[ex.id] || 0) >= 2);
    // Bronze: all 9 completed at least 1x
    const bronzeDone = allExercisesCompletedNTimes(1);

    if (bronzeDone && silverDone && goldDone) return 'gold';
    if (bronzeDone && silverDone) return 'silver';
    if (bronzeDone) return 'bronze';
    return null;
}

function completeExercise(exerciseId) {
    const log = getTodayLog();
    const exercise = EXERCISES.find(e => e.id === exerciseId);
    if (!exercise) return;

    // Increment count
    log.completedExercises[exerciseId] = (log.completedExercises[exerciseId] || 0) + 1;

    // Record timestamp
    if (!log.completionTimestamps[exerciseId]) log.completionTimestamps[exerciseId] = [];
    log.completionTimestamps[exerciseId].push(Date.now());

    // Track last completed exercise (for consecutive lock)
    log.lastCompletedExerciseId = exerciseId;

    // Check if ALL exercises are done (at least Bronze tier)
    const currentLevel = getRingLevel();
    const today = getLocalDateString();
    const oldLevel = appData.ringLevels[today] || 0;

    if (currentLevel > oldLevel) {
        appData.ringLevels[today] = currentLevel;

        // Streak increase ONLY on reaching Bronze (level 1)
        if (currentLevel === 1) {
            const yesterday = getYesterdayDateString();

            if (appData.streak.lastCompleted === yesterday) {
                appData.streak.current += 1;
            } else if (appData.streak.lastCompleted !== today) {
                appData.streak.current = 1;
            }

            appData.streak.lastCompleted = today;

            if (appData.streak.current > appData.streak.longest) {
                appData.streak.longest = appData.streak.current;
            }
        }

        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50, 50, 200]);
        }
    }

    if (allDone && !log.allCompleted) {
        log.allCompleted = true;
    }

    saveData();
    renderApp();
}

/* --- Auto-advance to next unlocked exercise --- */
function advanceToNextExercise(currentId) {
    const currentIndex = EXERCISES.findIndex(e => e.id === currentId);
    // Search forward from current position, wrapping around
    for (let i = 1; i <= EXERCISES.length; i++) {
        const nextIndex = (currentIndex + i) % EXERCISES.length;
        const nextEx = EXERCISES[nextIndex];
        const lock = getExerciseLockStatus(nextEx.id);
        if (!lock.locked) {
            // Small delay for UX
            setTimeout(() => openExerciseModal(nextEx.id), 600);
            return;
        }
    }
    // All locked — close modal
    closeExerciseModal();

    // Show tier achievement if applicable
    const tier = getCurrentRingTier();
    if (tier) {
        showTierAchievement(tier);
    }
}

function showTierAchievement(tier) {
    const tierNames = { bronze: 'Bronz', silver: 'Gümüş', gold: 'Altın' };
    const tierEmojis = { bronze: '🥉', silver: '🥈', gold: '🥇' };
    let alertEl = document.getElementById('tier-alert');
    if (!alertEl) {
        alertEl = document.createElement('div');
        alertEl.id = 'tier-alert';
        alertEl.className = 'tier-alert';
        document.body.appendChild(alertEl);
    }
    alertEl.innerHTML = `<div class="tier-emoji">${tierEmojis[tier]}</div><div class="tier-text">${tierNames[tier]} Halka Kazanıldı!</div>`;
    alertEl.className = `tier-alert ${tier} visible`;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setTimeout(() => { alertEl.classList.remove('visible'); }, 3000);
}

/* ====================================================
   RENDERING
   ==================================================== */

function renderApp() {
    renderChain();
    renderProgress();
    renderExerciseList();
}

function renderChain() {
    const container = document.getElementById('chain-container');
    const streakCount = document.getElementById('streak-count');
    const streakBest = document.getElementById('streak-best');

    if (!container) return;

    const streak = appData.streak.current || 0;
    const longest = appData.streak.longest || 0;

    if (streakCount) streakCount.textContent = streak;
    if (streakBest) streakBest.textContent = longest;

    container.innerHTML = '';

    // Get all dates from ringLevels and sort them
    const historicalDates = Object.keys(appData.ringLevels).sort();
    const today = getLocalDateString();

    // If today is not in historicalDates, add it with level 0
    if (!appData.ringLevels[today]) {
        if (!historicalDates.includes(today)) {
            historicalDates.push(today);
        }
    }

    const levelClasses = ['empty', 'bronze', 'silver', 'gold'];

    historicalDates.forEach((date, index) => {
        let level = appData.ringLevels[date] || 0;

        // Live update for today
        if (date === today) {
            const liveLevel = getRingLevel();
            if (liveLevel > level) level = liveLevel;
        }

        const ring = document.createElement('div');
        ring.className = `chain-ring ${levelClasses[level]}`;

        // Add shine to today's ring if it has any level, or if it's the last ring
        if (date === today) {
            ring.classList.add('today');
            if (level > 0) ring.classList.add('shine');
        } else if (level > 0) {
            // Historical rings that were completed
            ring.classList.add('completed-historical');
        }

        // Add date tooltip
        ring.title = date;

        container.appendChild(ring);
    });

    // Auto-scroll to the end (today's ring)
    setTimeout(() => {
        container.scrollLeft = container.scrollWidth;
    }, 100);
}

function renderProgress() {
    const log = getTodayLog();
    const tier = getCurrentRingTier();
    let completedCount = 0;

    EXERCISES.forEach(ex => {
        if (isExerciseDoneToday(ex.id)) completedCount++;
    });

    const total = EXERCISES.length;
    const pct = (completedCount / total) * 100;

    const progressBar = document.getElementById('progress-bar');
    const progressCount = document.getElementById('progress-count');

    if (progressBar) {
        progressBar.style.width = pct + '%';
        // Color bar by tier
        if (tier === 'gold') progressBar.style.background = 'linear-gradient(90deg, #D4A853, #F5D98C)';
        else if (tier === 'silver') progressBar.style.background = 'linear-gradient(90deg, #A8A8A8, #D4D4D4)';
        else if (tier === 'bronze') progressBar.style.background = 'linear-gradient(90deg, #CD7F32, #E8A862)';
        else progressBar.style.background = '';
    }
    if (progressCount) {
        let tierInfo = '';
        if (tier === 'gold') tierInfo = ' • 🏆 Altın Halka!';
        else if (tier === 'silver') tierInfo = ' • 🥈 Gümüş Halka';
        else if (tier === 'bronze') tierInfo = ' • 🥉 Bronz Halka';

        progressCount.textContent = `${completedCount}/${total}${tierInfo}`;
    }
}

function renderExerciseList() {
    const list = document.getElementById('exercise-list');
    if (!list) return;

    list.innerHTML = '';

    EXERCISES.forEach(exercise => {
        const done = isExerciseDoneToday(exercise.id);
        const todayCount = getExerciseTodayCount(exercise.id);
        const lockStatus = getExerciseLockStatus(exercise.id);

        const card = document.createElement('div');
        card.className = 'exercise-card';
        if (done) card.classList.add('completed');
        if (lockStatus.locked && !lockStatus.done) card.classList.add('locked');
        card.id = `exercise-card-${exercise.id}`;

        // Lock icon or check
        let checkContent;
        if (done) {
            checkContent = '✓';
        } else if (lockStatus.locked) {
            checkContent = '🔒';
        } else {
            checkContent = exercise.id;
        }

        // Lock reason as subtitle
        const lockHint = (lockStatus.locked && !lockStatus.done)
            ? `<div class="exercise-lock-hint">${lockStatus.reason}</div>`
            : '';

        card.innerHTML = `
            <div class="exercise-check">${checkContent}</div>
            <div class="exercise-card-body">
                <div class="exercise-name">${exercise.name}</div>
                <div class="exercise-meta">${exercise.duration} · ${exercise.frequency} (${todayCount}/${exercise.dailyTarget})</div>
                ${lockHint}
            </div>
            <div class="exercise-arrow">${lockStatus.locked && !lockStatus.done ? '' : '→'}</div>
        `;

        card.addEventListener('click', () => {
            if (lockStatus.locked && !lockStatus.done) {
                // Show brief lock message
                if (navigator.vibrate) navigator.vibrate(50);
                return;
            }
            openExerciseModal(exercise.id);
        });
        list.appendChild(card);
    });
}

/* ====================================================
   EXERCISE MODAL
   ==================================================== */

function openExerciseModal(exerciseId) {
    const exercise = EXERCISES.find(e => e.id === exerciseId);
    if (!exercise) return;

    // Check lock status
    const lockStatus = getExerciseLockStatus(exerciseId);
    if (lockStatus.locked) return;

    currentExerciseId = exerciseId;
    currentReps = 0;

    const modal = document.getElementById('exercise-modal');

    // Fill data
    document.getElementById('modal-exercise-number').textContent = exercise.id;
    document.getElementById('modal-exercise-name').textContent = exercise.name;
    document.getElementById('modal-duration').textContent = exercise.duration;
    document.getElementById('modal-frequency').textContent = exercise.frequency;
    document.getElementById('modal-description').textContent = exercise.description;

    const todayCount = getExerciseTodayCount(exerciseId);
    document.getElementById('modal-today-count').textContent = `${todayCount} / ${exercise.dailyTarget}`;

    // Render instructions guide card
    const guideContainer = document.getElementById('modal-guide');
    if (guideContainer) {
        guideContainer.textContent = exercise.instructions || '';
    }

    // Timer vs Reps mode
    const timerSection = document.getElementById('timer-section');
    const repsSection = document.getElementById('reps-section');

    if (exercise.type === 'timed') {
        timerSection.style.display = 'flex';
        repsSection.classList.add('hidden');
        resetTimer(exercise.durationSeconds, exercise.bilateral ? exercise.perSideSeconds : null);
    } else {
        // Rep exercises: hide timer, show just the complete button
        timerSection.style.display = 'none';
        repsSection.classList.remove('hidden');
    }

    // Complete button — always available for reps, hidden for timed (auto-completes)
    const btnComplete = document.getElementById('btn-complete-exercise');
    if (exercise.type === 'timed') {
        btnComplete.style.display = 'none'; // Timer auto-completes
    } else {
        btnComplete.style.display = '';
        btnComplete.classList.remove('completed');
        btnComplete.querySelector('.btn-complete-text').textContent = 'Tamamla ✓';
    }

    modal.classList.remove('hidden');

    if (navigator.vibrate) navigator.vibrate(10);
}

function closeExerciseModal() {
    const modal = document.getElementById('exercise-modal');
    modal.classList.add('hidden');
    stopTimer();
    currentExerciseId = null;
}

/* ====================================================
   TIMER
   ==================================================== */

let timerSwitchAt = null; // seconds remaining when user should switch sides
let switchAlertShown = false;

function resetTimer(totalSeconds, perSideSeconds) {
    stopTimer();
    timerTotalSeconds = totalSeconds || 60;
    timerSeconds = timerTotalSeconds;
    timerRunning = false;
    switchAlertShown = false;

    // If bilateral, trigger switch alert when first side finishes
    timerSwitchAt = perSideSeconds ? (totalSeconds - perSideSeconds) : null;

    updateTimerDisplay();
    updateTimerProgress(0);

    // Show bilateral label
    const switchLabel = document.getElementById('timer-switch-label');
    if (switchLabel) {
        switchLabel.style.display = perSideSeconds ? 'block' : 'none';
        switchLabel.textContent = perSideSeconds ? '1. Taraf' : '';
    }

    const btn = document.getElementById('btn-timer-start');
    if (btn) {
        btn.textContent = '▶ Başlat';
        btn.classList.remove('paused');
    }
}

function startTimer() {
    if (timerRunning) {
        pauseTimer();
        return;
    }

    timerRunning = true;
    const btn = document.getElementById('btn-timer-start');
    if (btn) {
        btn.textContent = '⏸ Duraklat';
        btn.classList.add('paused');
    }

    timerInterval = setInterval(() => {
        timerSeconds--;

        // Side switch alert at halfway
        if (timerSwitchAt !== null && timerSeconds === timerSwitchAt && !switchAlertShown) {
            switchAlertShown = true;
            showSwitchAlert();
        }

        if (timerSeconds <= 0) {
            timerSeconds = 0;
            stopTimer();

            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            const btn = document.getElementById('btn-timer-start');
            if (btn) {
                btn.textContent = '✓ Bitti!';
                btn.classList.remove('paused');
            }

            // Auto-complete and advance
            if (currentExerciseId) {
                completeExercise(currentExerciseId);
                advanceToNextExercise(currentExerciseId);
            }
        }

        updateTimerDisplay();
        const progressPct = 1 - (timerSeconds / timerTotalSeconds);
        updateTimerProgress(progressPct);
    }, 1000);
}

function showSwitchAlert() {
    // Haptic
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    // Audio beep
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) { /* audio not available */ }

    // Visual overlay
    const switchLabel = document.getElementById('timer-switch-label');
    if (switchLabel) {
        switchLabel.textContent = '2. Taraf';
    }

    // Show a floating alert
    let alertEl = document.getElementById('switch-alert');
    if (!alertEl) {
        alertEl = document.createElement('div');
        alertEl.id = 'switch-alert';
        alertEl.className = 'switch-alert';
        document.querySelector('.modal-sheet')?.appendChild(alertEl);
    }
    alertEl.textContent = '🔄 Taraf Değiştir!';
    alertEl.classList.add('visible');

    setTimeout(() => {
        alertEl.classList.remove('visible');
    }, 2500);
}

function pauseTimer() {
    timerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;

    const btn = document.getElementById('btn-timer-start');
    if (btn) {
        btn.textContent = '▶ Devam';
        btn.classList.remove('paused');
    }
}

function stopTimer() {
    timerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;

    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerProgress(pct) {
    const circle = document.getElementById('timer-progress');
    if (!circle) return;

    const circumference = 2 * Math.PI * 90; // r=90
    const offset = circumference * (1 - pct);
    circle.style.strokeDashoffset = offset;
}

/* ====================================================
   REPS COUNTER (REMOVED - single Tamamla button only)
   ==================================================== */

/* ====================================================
   INITIALIZATION
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache UI references
    ui = {
        authBtn: document.getElementById('authorize_button'),
        syncStatus: document.getElementById('sync-status'),
        landingScreen: document.getElementById('landing-screen'),
        mainApp: document.getElementById('main-app'),
        userProfile: document.getElementById('user-profile'),
    };

    // 2. Initial state (prevent flicker)
    const storedAuth = sessionStorage.getItem('wasZincirdeConnected');

    if (storedAuth === 'true') {
        if (ui.authBtn) ui.authBtn.style.display = 'none';
        if (ui.syncStatus) {
            ui.syncStatus.textContent = "Kullanıcı Doğrulanıyor...";
            ui.syncStatus.className = "sync-status syncing";
        }
    } else {
        if (ui.authBtn) ui.authBtn.style.display = 'inline-flex';
        if (ui.landingScreen) ui.landingScreen.style.display = 'flex';
        if (ui.mainApp) ui.mainApp.style.display = 'none';
    }

    // 3. Event Listeners

    // Auth
    if (ui.authBtn) {
        ui.authBtn.onclick = () => {
            autoPopupAttempted = false;
            if (tokenClient) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                alert("Google bağlantısı hazırlanıyor... Lütfen 2-3 saniye sonra tekrar deneyin.");
            }
        };
    }

    // Sign out
    const signoutBtn = document.getElementById('signout_button');
    if (signoutBtn) {
        signoutBtn.onclick = () => {
            const token = gapi.client.getToken();
            if (token) {
                google.accounts.oauth2.revoke(token.access_token);
                gapi.client.setToken('');
                updateSigninStatus(false);
            }
        };
    }

    // Chain break restart
    const btnRestart = document.getElementById('btn-restart-chain');
    if (btnRestart) {
        btnRestart.onclick = () => hideChainBreak();
    }

    // Exercise modal close
    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) btnCloseModal.onclick = () => closeExerciseModal();

    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) modalBackdrop.onclick = () => closeExerciseModal();

    // Timer controls
    const btnTimerStart = document.getElementById('btn-timer-start');
    if (btnTimerStart) btnTimerStart.onclick = () => startTimer();

    const btnTimerReset = document.getElementById('btn-timer-reset');
    if (btnTimerReset) btnTimerReset.onclick = () => {
        const exercise = EXERCISES.find(e => e.id === currentExerciseId);
        if (exercise) resetTimer(exercise.durationSeconds);
    };

    // Complete exercise (for rep-based exercises)
    const btnComplete = document.getElementById('btn-complete-exercise');
    if (btnComplete) {
        btnComplete.onclick = () => {
            if (currentExerciseId) {
                completeExercise(currentExerciseId);
                if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
                advanceToNextExercise(currentExerciseId);
            }
        };
    }

    // Keyboard: Escape closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeExerciseModal();
            hideChainBreak();
        }
    });
});
