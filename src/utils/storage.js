// IndexedDB-backed storage for large documents (images, PDFs, 200+ pages)
// Falls back to localStorage for small data

const DB_NAME = 'DocMakerDB';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveData(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, trying localStorage:', err);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn('localStorage also failed. Data not saved.');
    }
  }
}

export async function loadData(key, defaultValue) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result !== undefined) {
          resolve(request.result);
        } else {
          // Try migrating from localStorage
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              resolve(parsed);
              // Migrate to IndexedDB and clean localStorage
              saveData(key, parsed).then(() => {
                try { localStorage.removeItem(key); } catch {}
              });
              return;
            }
          } catch {}
          resolve(defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  } catch {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

export async function clearData(key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}
