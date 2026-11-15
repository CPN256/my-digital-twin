# Architecture

- Installability uses a static manifest and platform installation help, without offline app-shell caching, to keep live content fresh and previews safe.
- Keep the retiring Workbox worker at `/sw.js` for one release cycle so previous installations can discard app-owned caches.