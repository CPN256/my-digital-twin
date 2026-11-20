# Architecture

- Installability uses a static manifest and platform installation help, without offline app-shell caching, to keep live content fresh and previews safe.
- Keep the retiring Workbox worker at `/sw.js` for one release cycle so previous installations can discard app-owned caches.
- The About identity page and its form share a validated content schema in the existing site-content CMS, so edits remain safe and legacy content cannot break rendering.
- Scope the personal About palette to its page; keep shared navigation, authentication, projects, and global theme behavior unchanged.