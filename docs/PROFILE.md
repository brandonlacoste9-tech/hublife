# North Network · thin shared profile

## Goal
A lightweight handoff between HubLife and spokes — not a full IdP.

## Storage (today)
- Browser `localStorage` key: `north_network_profile_v1`
- Bound to **Clerk user id** when signed in on HubLife
- Guest mode until first sign-in

## Shape

```json
{
  "network": "north_network",
  "profile": {
    "userId": "user_xxx | null",
    "displayName": "Brandon | null",
    "preferredAppId": "grok",
    "lastIntent": "brief",
    "lastApps": ["grok", "chatsnap", "wacke"],
    "updatedAt": 1710000000000
  }
}
```

## Intent API (contract, client-side now)

| Action | HubLife | Spoke |
|--------|---------|-------|
| Open app | `from=network&via=hublife&intent=…` | Read + act (Grok brief, ChatSnap snap) |
| Return home | Spoke footer → `hublife.ca?from=network&via={app}` | Hub shows resume |
| Identity | Clerk on HubLife (+ Grok) | Optional later per spoke |

### Future server endpoint (not required yet)

```
GET  /api/network/profile   Authorization: Bearer <clerk jwt>
PATCH /api/network/profile  { displayName?, preferredAppId? }
POST /api/network/intent    { appId, intent, campaign }
```

Implement when two or more spokes need server-synced prefs.

## Code
- HubLife: `src/lib/profile.ts`, `src/components/ProfileSync.tsx`
- Handoff helper: `profileToHandoff()`
