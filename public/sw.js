// ============================================================================
// TAMV MD-X4™ - Service Worker
// PWA with Offline-First Strategy
// ============================================================================

const CACHE_VERSION = 'tamv-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const DOCS_CACHE = `${CACHE_VERSION}-docs`;

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/assets/LOGOTAMV2.jpg',
  // Core JS and CSS will be added by Vite
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/courses/,
  /\/api\/membership/,
  /\/api\/dashboard/,
  /\/api\/nodes/,
];

// Documentation to cache for offline access
const DOCS_PATTERNS = [
  /\/docs\//,
  /\/wikitamv\//,
  /\.mdx?$/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !name.startsWith(CACHE_VERSION))
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different resource types
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE));
  } else if (isDocumentation(url)) {
    event.respondWith(cacheFirst(request, DOCS_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Cache strategies

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'This data is not available offline' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Start network fetch regardless of cache
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Return cached version immediately if available
  if (cached) {
    return cached;
  }

  // Otherwise wait for network
  const networkResponse = await networkPromise;
  
  if (networkResponse) {
    return networkResponse;
  }

  // Return offline page for navigation
  if (request.mode === 'navigate') {
    return caches.match('/offline.html');
  }

  return new Response('Offline', { status: 503 });
}

// Helper functions

function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|ico)$/);
}

function isAPIRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isDocumentation(url) {
  return DOCS_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncProgress() {
  try {
    const db = await openIndexedDB();
    const pending = await getPendingProgress(db);
    
    for (const item of pending) {
      try {
        const response = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        
        if (response.ok) {
          await clearPendingProgress(db, item.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync progress item:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync progress failed:', error);
  }
}

async function syncAnalytics() {
  try {
    const db = await openIndexedDB();
    const events = await getPendingAnalytics(db);
    
    if (events.length === 0) return;
    
    const response = await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events })
    });
    
    if (response.ok) {
      await clearPendingAnalytics(db);
    }
  } catch (error) {
    console.error('[SW] Sync analytics failed:', error);
  }
}

// IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tamv-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingProgress(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('progress', 'readonly');
    const store = transaction.objectStore('progress');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function clearPendingProgress(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('progress', 'readwrite');
    const store = transaction.objectStore('progress');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

function getPendingAnalytics(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('analytics', 'readonly');
    const store = transaction.objectStore('analytics');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function clearPendingAnalytics(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('analytics', 'readwrite');
    const store = transaction.objectStore('analytics');
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  console.log('[SW] Push notification received:', data);
  
  const options = {
    body: data.body || 'New notification from TAMV',
    icon: '/assets/LOGOTAMV2.jpg',
    badge: '/assets/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'TAMV MD-X4™', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        return clients.openWindow(url);
      })
  );
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_DOCS') {
    event.waitUntil(cacheDocumentation(event.data.urls));
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

async function cacheDocumentation(urls) {
  const cache = await caches.open(DOCS_CACHE);
  
  for (const url of urls) {
    try {
      await cache.add(url);
      console.log('[SW] Cached doc:', url);
    } catch (error) {
      console.error('[SW] Failed to cache doc:', url, error);
    }
  }
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

console.log('[SW] Service worker loaded');
