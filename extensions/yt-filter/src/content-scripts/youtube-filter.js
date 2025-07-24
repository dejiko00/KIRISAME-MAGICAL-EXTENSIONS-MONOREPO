// ==UserScript==
// @name         YoutubeFilter
// @namespace    YoutubeFilter
// @version      0.1.0
// @description  .
// @include      https://www.youtube.com/*
// @run-at       document-start

// ==/UserScript==

(async () => {
  const code = () => {
    class _YoutubeFilters {
      #filtersRecord = {};
      wallOfShame;
      #keys = [];

      addToBlacklist({ regexes = [], key = "DEFAULT", flags = "" }) {
        if (this.#filtersRecord[key] === undefined) {
          this.#filtersRecord[key] = [];
        }
        this.#filtersRecord[key].push(new RegExp(regexes.join("|"), flags));
        return this;
      }

      addToWallOfShame({ regexes = [] }) {
        this.wallOfShame = new RegExp(regexes.join("|"), "i");
        return this;
      }

      build() {
        this.#keys = Object.keys(this.#filtersRecord);
        return this;
      }

      get filters() {
        return Object.values(this.#filtersRecord).flat();
      }

      test(title) {
        for (const key of this.#keys) {
          for (const regex of this.#filtersRecord[key]) {
            if (regex.test(title))
              return _YoutubeUtils.info("Test Match: ", key, title), true;
          }
        }
        return false;
      }

      testChannel(channel) {
        return !this.wallOfShame.test(channel);
      }
    }

    const _youtubeFilters = new _YoutubeFilters();
    _youtubeFilters
      .addToBlacklist({
        key: "LAZY_STARTERS",
        flags: "i",
        regexes: [
          "^How (to|I|not|was|we)\\s",
          "^Where I\\s",
          "^My\\s",
          "^I\\s",
          "^Don't",
          "^Why\\s",
          "^\\d (year|month|day)",
          "^Every[\\s\\w]+?problem",
          "^How was",
          "^Just (found|learned)",
        ],
      })
      .addToBlacklist({
        key: "SELF_CENTERED",
        flags: "i",
        regexes: [
          "My most",
          "What I learnt",
          "I (made|tried)",
          "Daily (work|life)",
          "(Day\\s)?in the life",
          "That help me",
          "Says about",
          "Trust me",
        ],
      })
      .addToBlacklist({
        key: "LAZY_BAIT",
        flags: "i",
        regexes: [
          "Learn this",
          "(Must|Should|Need to) know",
          "Think like",
          "Iconic",
          "The genius",
          "Don't be\\s",
          "This guy",
          "As you think",
          "Hot take",
          "The most",
          "Killer\\s",
          "Wait,",
          "Actually good",
          "Burn[\\s-]?out",
          "Explain",
          "For people (who|that)",
          "The best way",
          "The only[\\s\\w]+?you need",
          "This is why",
          "\\d reasons why",
          "Went from[\\s\\w]+?to",
          "Where[\\s\\w]+?meets[\\s\\w]+?",
          "Fun way to",
          "Next level",
          "Says about you",
          "Most addictive",
        ],
      })
      .addToBlacklist({
        key: "TECH_BAIT",
        flags: "i",
        regexes: [
          "Learn (programming|coding)",
          "Tech compan(ies|y)",
          "Hack",
          "Bug bounty",
          "Interview",
          "Portfolio",
          "Self[\\s-]?taught",
          "(Junior|Senior) dev",
          "Freelance",
          "React (code|hook|pattern)",
          "(\\s|^)job[s]?(\\s|$)",
          "Tips",
          "Tricks",
          "Ricing",
          "Vibe coding",
          "Clean code",
          "Readable code",
          "Source code",
          "Programming language",
          "Productivity",
          "Linux user",
          "Linus\\s",
          "Distro",
        ],
      })
      .addToBlacklist({
        key: "CURRENT_EVENTS_BAIT",
        regexes: ["NATO", "Russia", "Trump\\s"],
      })
      .addToBlacklist({
        key: "TECH_UNWELCOME_TERMS",
        flags: "i",
        regexes: [
          "(\\s|^)(AI|IA|GPT|Claude|Anthropic|Grok|OpenAI|Tor|TempleOS|Arch|v0|Wordpress|PHP|Kali|Netflix)(\\s|$)",
        ],
      })
      .addToBlacklist({
        key: "UNWELCOME_INDIVIDUALS",
        flags: "i",
        regexes: ["Steve Jobs", "(\\s|^)(Elon|Musk)(\\s|^)", "Pewdiepie"],
      })
      .addToWallOfShame({
        regexes: [
          "Joma Tech",
          "ThePrimeagen",
          "Mental Outlaw",
          "Explains",
          "midudev",
          "Farid Dieck",
        ],
      })
      .build();

    //yt-lockup-view-model.ytd-item-section-renderer

    const _YoutubeUtils = {
      pause: (duration = 100) =>
        new Promise((resolve) => {
          setTimeout(resolve, duration);
        }),
      log: (...args) => {},
      //   log: (...args) => {
      //     console.debug(...args);
      //   },
      info: (...args) => {
        console.info(...args);
      },
    };

    _YoutubeUtils.info("Filters", _youtubeFilters.filters);
    _YoutubeUtils.info("Wall of Shame", _youtubeFilters.wallOfShame);

    class _YoutubeCallbackStack {
      #stack;
      constructor() {
        this.#stack = [];
      }

      push(fn) {
        this.#stack.push(fn);
      }

      async emit() {
        setTimeout(async () => {
          _YoutubeUtils.log("CallbackStack | Flushing", this.#stack.length);
          while (this.#stack.length > 0) {
            await this.#stack.pop()();
          }
        }, 50);
      }
    }
    const _ytCallbackStack = new _YoutubeCallbackStack();

    class _YoutubeItemRegister extends Map {
      constructor() {
        super();
        this.nodeSet = new Set();
      }

      add(key, value) {
        if (this.nodeSet.has(key)) return false;

        _YoutubeUtils.log("Register | Adding item", value);
        this.nodeSet.add(key);
        super.set(key, value);
        return true;
      }

      hasSeen(key) {
        _YoutubeUtils.log("Register | Has seen?", key, this.nodeSet.has(key));
        return this.nodeSet.has(key) || (this.nodeSet.add(key), false);
      }
    }

    class _YoutubeContext {
      #routesVideoPagination = [
        "guide", // page 1
        "browse", // page 2+
      ];

      #contextInitState = {
        guide: false,
        player: false,
      };

      #_isContextInit = false;
      get isContextInit() {
        if (
          !this.#_isContextInit &&
          !Object.values(this.#contextInitState).includes(false)
        ) {
          this.#_isContextInit = true;
          _YoutubeUtils.log("Context | Init!");
        }
        return this.#_isContextInit;
      }

      status = {
        isMenuInit: false,
        pendingItems: 0,
        scrollY: 0,
        index: 0,
      };

      #parseRoute = (route) => `\/v1\/(${route})`;

      #regex = {
        routesInit: new RegExp(
          this.#parseRoute(Object.keys(this.#contextInitState).join("|")),
          "i"
        ),
        routesVideo: new RegExp(
          this.#parseRoute(this.#routesVideoPagination.join("|")),
          "i"
        ),
      };

      itemsRegister = new _YoutubeItemRegister();

      preventScroll(ev) {
        ev.preventDefault();
      }
      #lockScroll() {
        this.status.scrollY = window.scrollY;
        window.addEventListener("wheel", this.preventScroll, {
          passive: false,
        });
      }
      #unlockScroll() {
        _YoutubeUtils.info("Unlocking scroll");
        setTimeout(() => {
          window.removeEventListener("wheel", this.preventScroll, {
            passive: false,
          });
          window.scrollTo({ top: this.status.scrollY });
        }, 100); // TODO start using events/subscribers WHENVEER I MOVE AWAY FROM TAMPERMONKEY
      }

      async hook(url) {
        if (this.#regex.routesInit.test(url) && !this.isContextInit) {
          const type = this.#regex.routesInit.exec(url)[1];
          _YoutubeUtils.log(`Fetch | Init ${type}`, type);
          this.#contextInitState[type] = true;
        }

        if (this.isContextInit && this.#regex.routesVideo.test(url)) {
          _YoutubeUtils.log("Hook | New Videos", url);

          const items = document.querySelectorAll(
            "#contents>ytd-rich-item-renderer, #contents>ytd-rich-section-renderer"
          );

          this.#lockScroll();
          let registeredCount = 0;
          for (const [index, item] of items.entries()) {
            const ytItem = new _YoutubeItem(item);
            if (
              ytItem.type === "video" &&
              !this.itemsRegister.hasSeen(ytItem.id) &&
              _youtubeFilters.testChannel(ytItem.body.channel) &&
              _youtubeFilters.test(ytItem.body.title)
            ) {
              registeredCount++;
              this.itemsRegister.add(item, ytItem);

              ytItem.notInterested(this.status, async () => {
                this.status.isMenuInit = true;
                this.status.pendingItems--;

                _YoutubeUtils.log("Pending Items", this.status.pendingItems);
                if (this.status.pendingItems === 0) {
                  await _ytCallbackStack.emit();
                  this.#unlockScroll();
                }
              });

              _YoutubeUtils.log("Register | Succesfully registered", ytItem);
              this.status.index = index;
            }
          }
          _ytCallbackStack.emit();
          if (registeredCount === 0) {
            this.#unlockScroll();
          }
        }
      }
    }

    class _YoutubeItemError extends Error {
      constructor(...args) {
        super(args);
      }
    }

    class _YoutubeItem {
      registered = false;

      constructor(item) {
        if (!item instanceof HTMLElement)
          throw new _YoutubeItemError("Not an HTMLElement", item);
        try {
          _YoutubeUtils.log("Item | Data", item.data);
          this.node = item;
          this.id = item.data.trackingParams;
          this.row = item.data.rowIndex;

          const content = item.data.content;
          _YoutubeUtils.log("Item | Content", content);
          if (
            content.videoWithContextRenderer !== undefined ||
            content.videoRenderer !== undefined
          ) {
            this.type = "video";
            const body =
              content.videoRenderer ?? content.videoWithContextRenderer;

            this.body = {
              title: body.title?.runs[0].text || body.headline?.runs[0].text, // "Dan Lidral Porter - Generating Art In Many Worlds"
              views:
                body.shortViewCountText?.simpleText ||
                body.shortViewCountText?.runs[0].text, // 21K || 21K views
              channel: body.shortBylineText?.runs[0].text, // ClojureTV
              date:
                body.publishedTimeText?.simpleText ||
                body.publishedTimeText?.runs[0].text ||
                "live", // 10 years ago
              length:
                body.lengthText?.simpleText ||
                body.lengthText?.runs[0].text ||
                "live", // 16:36
              isWatched: body.isWatched || false, // bool
            };
            _YoutubeUtils.log("Item | Body", body);
          } else if (content.adslotRenderer !== undefined) {
            this.type = "ads";
          } else if (content.richShelfRenderer !== undefined) {
            this.type = "shorts";
            this.#hide();
          }
        } catch (error) {
          throw new _YoutubeItemError("Error during object mapping", error);
        }
      }

      #hide() {
        _YoutubeUtils.log("Hiding", this.body?.title);
        this.node.hidden = true;
      }

      async #clickNotInterested() {
        const menuBtn = this.node.querySelector(
          "ytd-menu-renderer:nth-child(1) > yt-icon-button:nth-child(3) > button:nth-child(1)"
        );
        menuBtn.click();
        _YoutubeUtils.log("Menu Clicked | Open");

        await _YoutubeUtils.pause();

        const blockBtn = document.querySelector(
          "ytd-menu-service-item-renderer.style-scope:nth-child(6) > tp-yt-paper-item:nth-child(1)"
        );

        blockBtn.click();
        _YoutubeUtils.info("Menu Clicked | Not Interested", this.body.title);
        this.#hide();
        await _YoutubeUtils.pause();
      }

      #addtoStack() {
        _ytCallbackStack.push(() => this.#clickNotInterested());
      }

      // Microfrontend delay observer
      // 8 total mutations on load, at index 4 the item is clickable
      // TODO Find out what url these mutations are
      async notInterested(status, cb) {
        const observer = new MutationObserver(async (mutations, observer) => {
          let index = 0;
          for (const _mutation of mutations) {
            _YoutubeUtils.log(
              "Mutations Length: ",
              this.body.title,
              mutations.length
            );

            if (index > 4) {
              observer.disconnect();

              cb();

              this.#addtoStack();
              return;
            }
            index++;
          }
        });

        status.pendingItems++;
        observer.observe(this.node.querySelector("#details"), {
          childList: true,
          subtree: true,
        });
      }
    }

    const ytContext = new _YoutubeContext();

    // Patch fetch
    const realFetch = window.fetch;
    window.fetch = new Proxy(realFetch, {
      async apply(target, self, args) {
        const res = await Reflect.apply(target, self, args);

        setTimeout(() => {
          const [req, init = {}] = args;
          const url = typeof req === "string" ? req : req.url;
          const method = (init.method || (req.method ?? "GET")).toUpperCase();

          if (method === "POST") {
            _YoutubeUtils.log("Fetch | Initiating hook", url);
            ytContext.hook(url);
          }
        }, 100);

        return res;
      },
    });
  };

  const s = document.createElement("script");
  s.textContent = `(${code})();`;
  document.documentElement.appendChild(s);
  s.remove();
})();
