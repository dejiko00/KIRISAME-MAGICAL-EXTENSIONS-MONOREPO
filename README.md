# KIRISAME MAGICAL EXTENSIONS MONOREPO

QoL extensions to make 2025 internet browsing a saner experience.

## 🧹 What does this (currently) do?

Automagically does the _Not Interested_ flow for terrible videos and channels, then hides them so you don't have to see them ever again.

As a bonus it also removes shorts and ad suggestions (if you're not using an adblocker).

### Filter Categories

1. Channels
2. Individuals
3. Current Events
4. Scam
5. Clickbait
6. Custom regex patterns

### Channel Quality Scoring Database (future)

## 🧹 Why should I use it?

- User: You can blacklist several youtube video patterns
- Developer: As an extension template, so you don't have to use the **HORRIBLE** bloat that certain extension ""frameworks"" give.

## 🧹 TODO

- Fix an annoying bug with cache
  - Currently using a silly hack with mutations and intervals to keep track of _when_ the dropdown menu microfrontend is fully loaded.
  - Breaks when going back in history or not using the site from scratch, maybe because of virtual list recycling
    - Confirmed use of a virtual list, same address for video item elements
- Will probably pass everything to TS and turn it into an extension (doing this currently).
  - Point and click quick GUI like Ublock?
    - Channel quick filtering GUI
  - Single click _Not Interested_?
  - Whitelist
  - Notifications (w/toggle)
- Favorites video list filtering
- Video detail side menu filtering
- Components to remove from Youtube
  - Header
    - Search with voice
    - Create
  - Sidemenu
    - Shorts
    - Explore
    - More from Youtube
