# App Feature Audit – Implementation Status

This document lists every major feature, button, and function across the **mobile app** (`src/`), **admin dashboard** (`admin/`), and **API** (`api/`), and whether each is **fully implemented**, **partially implemented**, or **not implemented**.

---

## 1. Mobile app (src/) – User-facing

### 1.1 Authentication
| Feature | Status | Notes |
|--------|--------|-------|
| Login | ✅ Full | Uses `api.login`, JWT, `getMe` |
| Signup / Register | ✅ Full | Uses `api.signup` |
| Logout | ✅ Full | Clears token and state |
| Get current user (me) | ✅ Full | `api.getMe()` on init |
| **Password reset** | ✅ Full | `AuthContext.resetPassword` calls `POST /auth/forgot-password`; API returns success message (email sending optional) |
| **Profile update (name, bio, avatar)** | ✅ Full | `AuthContext.updateProfile` calls `PATCH /auth/me`; API updates name, avatarUrl; state updated from response |
| Guest mode | ✅ Full | Local state only |
| Demo login | ✅ Full | Re-auth with demo credentials |

### 1.2 Home
| Feature | Status | Notes |
|--------|--------|-------|
| Prayer times | ✅ Full | API + location; fallback Makkah |
| Islamic date / calendar | ✅ Full | IslamicCalendarContext |
| Upcoming events (list) | ✅ Full | `api.getEvents()`, fallback empty |
| Upcoming events (tap → detail) | ✅ Full | Navigate to EventDetail |
| News feed (list) | ✅ Full | `api.getNews()` |
| News (tap → full article) | ✅ Full | Navigate to NewsDetail |
| Quick actions grid | ✅ Full | Uses `mockQuickActions` for labels/icons only; navigation is real |
| Daily reminder | ✅ Full | From mockData service |
| Pull to refresh | ✅ Full | Refetches events, news, prayers |

### 1.3 Events
| Feature | Status | Notes |
|--------|--------|-------|
| Events list (upcoming / past) | ✅ Full | `api.getEvents()` |
| Event detail (full view) | ✅ Full | `EventDetailScreen`, `api.getEvent(id)` |
| Pull to refresh | ✅ Full | Refetches events |

### 1.4 News
| Feature | Status | Notes |
|--------|--------|-------|
| News list on Home | ✅ Full | `api.getNews()` |
| News detail (full article) | ✅ Full | `NewsDetailScreen`, `api.getNewsItem(id)` |

### 1.5 Community (posts, comments, likes)
| Feature | Status | Notes |
|--------|--------|-------|
| List posts | ✅ Full | `api.listPosts()` |
| Create post | ✅ Full | `api.createPost()` |
| Like / unlike | ✅ Full | `api.likePost`, `api.unlikePost` |
| Add comment | ✅ Full | `api.addComment()` |
| **Edit post** | ✅ Full | api.updatePost(id, { content }); API PATCH /posts/:id; CommunityScreen saveEditPost calls API |
| **Delete post** | ✅ Full | api.deletePost(id); API DELETE /posts/:id; CommunityScreen delete calls API and removes from list |

### 1.6 Chat / messages
| Feature | Status | Notes |
|--------|--------|-------|
| List conversations | ✅ Full | `api.getConversations()` |
| Open or create conversation | ✅ Full | `api.getOrCreateConversation()` |
| List messages | ✅ Full | `api.getMessages()` |
| Send message | ✅ Full | `api.sendMessage()` |
| Mark as read | ✅ Full | `api.markAsRead()` |
| Unread badge | ✅ Full | `api.getUnreadMessageCount()` |

### 1.7 Notifications
| Feature | Status | Notes |
|--------|--------|-------|
| Register device for push | ✅ Full | `api.registerDevice()`; re-register on app focus |
| In-app notification list | ✅ Full | `api.getNotifications()` |
| Mark read / read all / archive | ✅ Full | API used |
| Preferences (backend) | ✅ Full | Get/update via API |
| Notification toasts (in-app) | ✅ Full | NotificationContext |

### 1.8 Journal
| Feature | Status | Notes |
|--------|--------|-------|
| List entries | ✅ Full | `api.listJournal()` |
| Create entry | ✅ Full | `api.createJournal()` |
| Delete entry | ✅ Full | `api.deleteJournal()` |
| Update entry | ✅ Full | `api.updateJournal()` (UI: edit flow exists) |

### 1.9 Scholars
| Feature | Status | Notes |
|--------|--------|-------|
| List scholars | ✅ Full | `api.getScholars()` |
| Scholar detail | ✅ Full | ScholarDetailScreen; data from list (no single `getScholar` call in flow but API exists) |

### 1.10 Duas
| Feature | Status | Notes |
|--------|--------|-------|
| Duas list & categories | ⚠️ Mock only | `DuasScreen` uses local `mockDuas`; **no Duas API** in backend |
| Search / filter | ✅ UI | Filters mock data |

### 1.11 Content (Wazifa, Lazim, lessons, etc.)
| Feature | Status | Notes |
|--------|--------|-------|
| Lessons list | ⚠️ Mock / static | LessonsScreen; content appears static/local |
| Lesson detail | ⚠️ Static | LessonDetailScreen uses local lesson data |
| Lazim screen | ⚠️ Mock | `LazimScreen` uses `mockLazimItems` and mock streak |
| Duas Tijaniya / Dua screens | ⚠️ Static | Static or mock content; no backend content API |
| Wazifa, Tasbih, Zikr Jumma, etc. | ⚠️ Static / UI | Content is static or local |

### 1.12 Quran
| Feature | Status | Notes |
|--------|--------|-------|
| Surah list / reader | ✅ Full | Uses external Quran API (e.g. api.quran.com / alquran.cloud) |
| Bookmarks (if any) | ⚠️ Check | Quran module in API exists; confirm mobile uses it |

### 1.13 Prayer & Qibla
| Feature | Status | Notes |
|--------|--------|-------|
| Prayer times | ✅ Full | Location + calculation / API |
| Qibla direction | ✅ Full | Location-based |
| Azan / adhan audio | ✅ Full | Local assets (e.g. Makkah/Istanbul as placeholder names) |

### 1.14 Donate
| Feature | Status | Notes |
|--------|--------|-------|
| Donate screen (form + instructions) | ⚠️ UI only | Shows Mobile Money details; “Submit receipt” only shows Alert; **no donation API**; no server-side donation recording |

### 1.15 Zakat calculator
| Feature | Status | Notes |
|--------|--------|-------|
| Calculate zakat | ✅ Full | Local calculation only (no backend needed) |

### 1.16 Hajj / Umrah
| Feature | Status | Notes |
|--------|--------|-------|
| Hajj / Umrah / Journey screens | ⚠️ Content | Likely static or local content; no backend verified |

### 1.17 Makkah Live
| Feature | Status | Notes |
|--------|--------|-------|
| List channels | ✅ Full | `api.getMakkahLiveChannels()` |
| Play / embed | ✅ UI | Depends on channel URLs/embed |

### 1.18 AI Noor (chat)
| Feature | Status | Notes |
|--------|--------|-------|
| Send message / get reply | ✅ Full | `api.aiChat()` |

### 1.19 Profile & settings
| Feature | Status | Notes |
|--------|--------|-------|
| View profile | ✅ Full | From auth state / getMe |
| Edit name, bio, avatar (UI) | ✅ Full | ProfileScreen form |
| Save profile | ✅ Full | `updateProfile` calls `PATCH /auth/me`; API persists name, avatarUrl; AuthContext updates from response |
| Notification settings (in-app) | ✅ Full | Backend preferences + local scheduling |
| Language / theme | ✅ Full | Local state / context |

### 1.20 Mosque locator
| Feature | Status | Notes |
|--------|--------|-------|
| Mosque screen | ⚠️ Unverified | Likely map/places; backend not checked |

---

## 2. Mobile app – In-app Admin screens (src/screens/Admin*)

These live inside the **mobile** app (e.g. for admin users).

| Screen | Status | Notes |
|--------|--------|-------|
| AdminMainScreen / Dashboard | ✅ Navigation | Entry to admin |
| AdminLoginScreen | ✅ Full | Admin auth |
| AdminEventsScreen | ✅ Full | Uses `api.getEventsAdmin`, create, update, delete |
| AdminNewsScreen | ✅ Full | Uses `api.getNewsAdmin`, create, update, delete |
| AdminScholarsScreen | ✅ Full | Uses `api.getScholarsAdmin`, CRUD |
| **AdminUsersScreen** | ⚠️ Mock | Uses **mock users**; API has `GET/PATCH /users` (admin) but mobile admin uses mock |
| **AdminUploadsScreen** | ⚠️ Mock | **TODO / mock** file list and upload; no real upload API wired |
| **AdminSettingsScreen** | ⚠️ Mock | **TODO / mock** settings and admin users |
| **AdminLessonsScreen** | ⚠️ Mock | **TODO / mock** lessons; no lessons API in backend |
| AdminDonationsScreen | ⚠️ Unverified | Likely mock; no donations API |
| AdminAnalyticsScreen | ⚠️ Unverified | May use analytics API or mock |
| AdminDashboard | ⚠️ Mock | “TODO: Replace with actual API calls”; mock stats |

---

## 3. Admin dashboard (admin/ – Web)

| Feature | Status | Notes |
|--------|--------|-------|
| Login | ✅ Full | JWT auth |
| Dashboard overview | ⚠️ Fallback | useDashboardData can fall back to mockOverviewData if API fails |
| Users list / search / filters | ✅ Full | API + mock fallback when API unavailable |
| Scholars CRUD | ✅ Full | API |
| Events CRUD | ✅ Full | API |
| News CRUD | ✅ Full | API |
| Posts moderation | ✅ Full | API (list, pin, hide, lock, delete, etc.) |
| Reports | ✅ Full | API (list, resolve, dismiss) |
| Notifications / campaigns | ✅ Full | Create, send, list campaigns; push via backend |
| Settings / audit logs | ⚠️ Mock | SettingsPage uses mockAuditLogs; no audit API |
| Donations (if any) | ⚠️ Mock / zero | Analytics has TODO for donations table |

---

## 4. API (api/src)

| Area | Status | Notes |
|------|--------|-------|
| Auth (login, signup, me) | ✅ Full | No password reset endpoint |
| Users (admin) | ✅ Full | List, get one, update, role, activate, deactivate, delete |
| **Current user profile update** | ✅ Full | `PATCH /auth/me` with name, avatarUrl |
| Community posts | ✅ Full | List, get, create, update, delete, like, unlike, comments |
| **Post update (edit)** | ✅ Full | `PATCH /posts/:id` with content, mediaUrls |
| Journal | ✅ Full | CRUD |
| Chat | ✅ Full | Conversations, messages, read |
| Notifications & devices | ✅ Full | Register, preferences, list, read, archive; campaigns & push |
| Events | ✅ Full | Public + admin CRUD |
| News | ✅ Full | Public + admin CRUD |
| Scholars | ✅ Full | Public + admin CRUD |
| AI chat | ✅ Full | /ai/chat |
| Makkah Live | ✅ Full | Channels |
| Analytics | ⚠️ Partial | Donations stats are TODO / zero (no donations table) |
| **Donations** | ❌ Missing | No donations table or endpoints |
| **Duas / content (CMS)** | ❌ Missing | No Duas or generic content API |
| **Password reset** | ✅ Full | `POST /auth/forgot-password` (email); returns success message (email sending optional) |
| Health / auth test | ✅ Full | /health, auth check |

---

## 5. Summary: What can be implemented next

### 5.1 Quick wins (backend exists or small change) — DONE

1. **Community: delete post** — Implemented: `api.deletePost(id)`, CommunityScreen calls it and removes from state.
2. **Community: edit post** — Implemented: `PATCH /posts/:id`, `api.updatePost(id, body)`, CommunityScreen saveEditPost calls API.

### 5.2 Backend + mobile — DONE where listed

3. **Profile update** — Implemented: `PATCH /auth/me` (name, avatarUrl), `api.updateMe(updates)`, AuthContext.updateProfile calls API and updates state.
4. **Password reset** — Implemented: `POST /auth/forgot-password`, `api.forgotPassword(email)`, AuthContext.resetPassword calls it.
5. **Donations**
   - Add Donation model and table, and endpoints (e.g. create donation record, list for admin).
   - In DonateScreen, optionally “Submit receipt” → call API to store a record; admin dashboard can show list/analytics.

### 5.3 Admin / content

6. **In-app admin: users, uploads, settings, lessons**
   - Wire AdminUsersScreen to real `GET/PATCH /users` (and role/activate/deactivate) instead of mock.
   - Add uploads API (or use existing Cloudinary) and wire AdminUploadsScreen.
   - Add settings/audit API if needed and replace mock in AdminSettingsScreen and web Settings.
   - Add lessons/content API and wire AdminLessonsScreen (and optionally DuasScreen) to it.

7. **Duas (and similar content)**
   - Add Duas (or generic “content”) model and API.
   - Replace DuasScreen mock data with API fetch.

8. **Analytics donations**
   - Once donations table exists, implement real donationsToday/Week/Month in analytics service and use in dashboard.

---

## 6. Button / action checklist (high level)

- **Home**: Refresh, navigate to events/news detail, quick actions → all implemented.
- **Events**: List, open detail, refresh → implemented.
- **News**: List, open detail → implemented.
- **Community**: Create post, like, comment, **Edit post**, **Delete post** → all implemented.
- **Chat**: Conversations, send message, mark read → implemented.
- **Notifications**: Register device, list, mark read, preferences → implemented.
- **Journal**: Create, edit, delete → implemented.
- **Scholars**: List, detail → implemented.
- **Donate**: Submit receipt → local Alert only; no API.
- **Profile**: Save → local only; no profile API.
- **Login**: Forgot password → TODO; no API.
- **Admin (web)**: Scholars, events, news, posts, reports, campaigns → implemented; settings/audit → mock.
- **Admin (mobile)**: Events, news, scholars → implemented; users, uploads, settings, lessons, dashboard → mock or partial.

Use this audit to decide which of the “implement next” items to do first; the quick wins (delete + edit post, then profile and password reset) will make the app feel complete for core flows.
