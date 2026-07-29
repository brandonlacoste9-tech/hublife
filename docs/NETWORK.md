# North Network · HubLife

## Vision
**HubLife** is the home OS for North Network:

| App | Job | URL |
|-----|-----|-----|
| HubLife | Launcher / “what do I need?” | https://hublife.ca |
| Wacké | Live | https://wacke.live |
| Zyeuté | Create / short video | https://zyeute.com |
| Grok Assistant | Decide / brain | https://grok-assistant.com |
| FloGuru | Plan | https://floguru.com |
| Hell Yeah Games | Play | https://www.hellyeah-games.com |
| ChatSnap | Snap / chat | https://chatsnap-app.netlify.app |

Tagline: **Live · Create · Decide · Plan · Play · Snap**

## Deep links
```
?from=network
&via=hublife
&intent=watch|create|plan|play|ask|brief|snap
&utm_source=north_network
&utm_medium=cross_app
&utm_campaign=hublife_v1
```

### Spoke intake
| App | Behaviour |
|-----|-----------|
| **Grok** | Banner + `intent=brief` auto-runs morning briefing + HubLife link |
| **ChatSnap** | Banner + `intent=snap` stashed for post-auth |
| **Wacké** | Header chip → HubLife |
| **Zyeuté** | Desktop header chip → HubLife |
| **FloGuru** | Footer link → HubLife |
| **Hell Yeah** | Nav + mobile → HubLife |

## Hub product surface
- Morning briefing → Grok `intent=brief`
- Resume last app + intent
- Free-text intent router
- Shortcut chips + PWA shortcuts (`/?shortcut=brief|live|snap`)
- Clerk sign-in (optional, when `VITE_CLERK_PUBLISHABLE_KEY` set)
- Thin local network profile — see [PROFILE.md](./PROFILE.md)
- Cognac v1 only (alt skin at `?v=2`)
- OG share image: `/og.jpg`

## Ops
- Health log: [HEALTH.md](./HEALTH.md)
- Brand prompts: [PROMPTS.md](./PROMPTS.md)
- Profile: [PROFILE.md](./PROFILE.md)
- Smoke: `powershell -File scripts/smoke-network.ps1`

## Clerk setup notes
1. Reuse Grok’s Clerk application or create “North Network”
2. Allow origins: `https://hublife.ca`, `http://localhost:5173`
3. Set Netlify env `VITE_CLERK_PUBLISHABLE_KEY` on **hublife-192**

## Next waves
1. Server Intent API when spokes need shared prefs  
2. Spoke footers on remaining surfaces (mobile Zyeuté, Wacké stream overlay)  
3. Cross-app “return to HubLife” toast after deep-link sessions  
