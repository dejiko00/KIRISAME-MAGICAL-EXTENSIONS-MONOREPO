# Google Quality of Life Scripts

For use with Tampermonkey currently. Soon to be a monorepo™.

## What does it do?

Filter low quality videos away from youtube and automatically does the _Not Interested_ flow for those videos.

## Next steps

- Fix an annoying bug with cache
  - Currently using a silly hack with mutations and intervals to keep track of _when_ the dropdown menu microfrontend is fully loaded.
  - Breaks when going back in history or not using the site from scratch, maybe because of virtual list recycling
    - Confirmed use of a virtual list, same address for video item elements
- Will probably pass everything to TS and turn it into an extension.
  - Point and click quick GUI like Ublock?
    - Channel quick filtering GUI
  - Single click _Not Interested_?
  - Whitelist
  - Notification (w/toggle)
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
