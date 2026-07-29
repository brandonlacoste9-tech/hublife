# North Network · production health

Last smoke pass: **2026-07-29** (automated from HubLife workspace).  
ChatSnap Supabase Auth settings: **200** (project `cicyejwkmvsoodivqbcp`).

## Hub

| Check | Result |
|-------|--------|
| DNS `hublife.ca` | A → 75.2.60.5 (Netlify) |
| HTTPS `https://hublife.ca` | 200 |
| PWA manifest | `/manifest.webmanifest` |
| Deep-link builder | `src/lib/network.ts` |

## Spokes (HTTP 200)

| App | URL | Sample deep link |
|-----|-----|------------------|
| Wacké | https://wacke.live | `?from=network&via=hublife&intent=watch` |
| Zyeuté | https://zyeute.com → www | `intent=create` |
| Grok Assistant | https://grok-assistant.com | `intent=brief` (auto morning briefing) |
| FloGuru | https://floguru.com | `intent=plan` |
| Hell Yeah Games | https://www.hellyeah-games.com | `intent=play` |
| ChatSnap | https://chatsnap-app.netlify.app | `intent=snap` |

## Contract

```
?from=network
&via=hublife
&intent=watch|create|plan|play|ask|brief|snap
&utm_source=north_network
&utm_medium=cross_app
&utm_campaign=hublife_v1
```

## Re-run

```powershell
# From hublife/
powershell -File scripts/smoke-network.ps1
```

## Spoke intake status

| App | Reads network params |
|-----|----------------------|
| Grok | Yes — banner + auto brief |
| ChatSnap | Yes — banner + snap → camera when signed in |
| Others | Params preserved on URL (landing may ignore) |
