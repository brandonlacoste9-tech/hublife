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
| **Grok** | Banner + `intent=brief` auto-runs morning briefing |
| **ChatSnap** | Banner + `intent=snap` stashed for post-auth camera path |
| Others | Query params preserved for future handlers |

## Hub product surface
- Morning briefing → Grok `intent=brief`
- Resume last app + intent
- Free-text intent router
- Shortcut chips + PWA shortcuts (`/?shortcut=brief|live|snap`)
- Cognac v1 only (alt skin at `?v=2` for experiments)
- OG share image: `/og.jpg`

## Ops
- Health log: [HEALTH.md](./HEALTH.md)
- Brand prompts: [PROMPTS.md](./PROMPTS.md)
- Smoke: `powershell -File scripts/smoke-network.ps1`

## Next waves
1. Spoke footers / “Back to HubLife” on Wacké / Zyeuté / FloGuru / Hell Yeah  
2. Clerk sign-in on HubLife  
3. Intent API + thin shared profile  
