(() => {
  "use strict";

  const chapters = window.COURSE_CHAPTERS;
  const units = [
    { title: "认识钱与自己", from: 1, to: 3 },
    { title: "搭建财务底座", from: 4, to: 7 },
    { title: "守住安全边界", from: 8, to: 10 },
    { title: "理解增长与风险", from: 11, to: 13 },
    { title: "看懂投资工具", from: 14, to: 17 },
    { title: "组成可执行的投资计划", from: 18, to: 19 },
    { title: "建立个人财富系统", from: 20, to: 20 },
  ];
  const storageKey = "personal-wealth-course-progress-v1";
  const $ = (id) => document.getElementById(id);
  const nav = $("chapterNav");
  const frame = $("chapterFrame");
  const sectionSelect = $("sectionSelect");
  let completed = new Set();
  let current = 1;
  let last = 1;
  let fontSize = 17;
  let frameObserver;
  let pendingSection = "";
  let pendingStartScroll = false;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    completed = new Set((saved.completed || []).filter((n) => Number.isInteger(n) && n >= 1 && n <= 20));
    if (Number.isInteger(saved.last) && saved.last >= 1 && saved.last <= 20) last = saved.last;
    if (Number.isInteger(saved.fontSize) && saved.fontSize >= 15 && saved.fontSize <= 21) fontSize = saved.fontSize;
  } catch (_) {
    // The reader remains usable when storage is blocked or old data is invalid.
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ completed: [...completed].sort((a, b) => a - b), last, fontSize })); }
    catch (_) { /* Private browsing can block storage; navigation still works. */ }
  }

  function urlState() {
    const params = new URLSearchParams(location.hash.slice(1));
    const number = Number(params.get("chapter"));
    return {
      number: Number.isInteger(number) && number >= 1 && number <= 20 ? number : null,
      section: params.get("section") || "",
    };
  }

  function setUrl(number, section = "", replace = false) {
    const params = new URLSearchParams({ chapter: String(number) });
    if (section) params.set("section", section);
    const target = `#${params.toString()}`;
    if (location.hash !== target) history[replace ? "replaceState" : "pushState"](null, "", target);
  }

  function updateProgress() {
    const count = completed.size;
    const pct = Math.round(count / 20 * 100);
    $("completedCount").textContent = count;
    $("progressNumber").textContent = `${pct}%`;
    $("progressRing").style.background = `conic-gradient(var(--accent) ${pct}%, #e7dcc5 ${pct}%)`;
    const done = completed.has(current);
    $("lessonStatus").textContent = done ? "已完成" : "未完成";
    $("lessonStatus").classList.toggle("done", done);
    $("completeButton").textContent = done ? "✓ 已完成 · 点击取消" : "标记本章已完成";
    $("completeButton").classList.toggle("done", done);
    $("completeButton").setAttribute("aria-pressed", String(done));
  }

  function findMatch(chapter, query) {
    if (!query) return { found: true, section: "" };
    const norm = (s) => s.toLocaleLowerCase("zh-CN");
    if (norm(`${chapter.title} ${chapter.subtitle} 第${chapter.number}章`).includes(query)) return { found: true, section: "" };
    const section = chapter.sections.find((item) => norm(item.title).includes(query));
    return section ? { found: true, section: section.id } : { found: false, section: "" };
  }

  function renderNav() {
    const query = $("searchInput").value.trim().toLocaleLowerCase("zh-CN");
    nav.classList.toggle("searching", Boolean(query));
    nav.replaceChildren();
    let total = 0;
    for (const unit of units) {
      const matches = chapters.slice(unit.from - 1, unit.to).map((chapter) => ({ chapter, match: findMatch(chapter, query) })).filter((entry) => entry.match.found);
      if (!matches.length) continue;
      const label = document.createElement("div");
      label.className = "unit-label";
      label.textContent = unit.title;
      nav.append(label);
      for (const { chapter, match } of matches) {
        total++;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "nav-item" + (chapter.number === current ? " active" : "");
        button.setAttribute("aria-current", chapter.number === current ? "page" : "false");
        const number = document.createElement("span");
        number.className = "nav-number";
        number.textContent = String(chapter.number).padStart(2, "0");
        const title = document.createElement("span");
        title.className = "nav-title";
        title.textContent = chapter.title;
        const summary = document.createElement("span");
        summary.className = "nav-summary";
        summary.textContent = match.section ? chapter.sections.find((s) => s.id === match.section)?.title || chapter.subtitle : chapter.subtitle;
        title.append(summary);
        const check = document.createElement("span");
        check.className = "nav-check";
        check.textContent = completed.has(chapter.number) ? "✓" : "";
        button.append(number, title, check);
        button.addEventListener("click", () => selectChapter(chapter.number, match.section));
        nav.append(button);
      }
    }
    $("searchFeedback").textContent = query ? `找到 ${total} 章${total ? "；点击结果可直接阅读" : "；请试试别的关键词"}` : "";
  }

  function closeMenu() {
    $("sidebar").classList.remove("open");
    $("menuButton").setAttribute("aria-expanded", "false");
    $("scrim").hidden = true;
  }

  function fitChapter() {
    try {
      const wrap = frame.contentDocument?.querySelector(".wrap");
      if (!wrap) return;
      const height = Math.ceil(Math.max(wrap.scrollHeight, wrap.getBoundingClientRect().height)) + 4;
      if (Math.abs(frame.offsetHeight - height) > 1) frame.style.height = `${height}px`;
    } catch (_) {
      // The original chapter can still be opened directly if its frame is unavailable.
    }
  }

  function scrollToSection(section) {
    if (!section) return;
    try {
      const target = frame.contentDocument?.getElementById(section);
      if (!target) return;
      const top = window.scrollY + frame.getBoundingClientRect().top + target.getBoundingClientRect().top - 75;
      window.scrollTo({ top, behavior: "smooth" });
    } catch (_) { /* Direct chapter link remains available. */ }
  }

  function scrollToChapterStart() {
    const top = window.scrollY + $("lesson").getBoundingClientRect().top - 70;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }

  frame.addEventListener("load", () => {
    if (frameObserver) frameObserver.disconnect();
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("reader-mode.css", document.baseURI).href;
      link.addEventListener("load", () => {
        doc.documentElement.style.setProperty("--book-font-size", `${fontSize}px`);
        fitChapter();
        const wrap = doc.querySelector(".wrap");
        if (wrap) {
          frameObserver = new ResizeObserver(fitChapter);
          frameObserver.observe(wrap);
        }
        if (pendingSection) requestAnimationFrame(() => scrollToSection(pendingSection));
        else if (pendingStartScroll) {
          requestAnimationFrame(() => {
            scrollToChapterStart();
            pendingStartScroll = false;
          });
        }
      }, { once: true });
      doc.head.append(link);
    } catch (_) { /* A chapter remains readable even without the book styling. */ }
  });

  function selectChapter(number, section = "", options = {}) {
    if (!Number.isInteger(number) || number < 1 || number > 20) return;
    const chapter = chapters[number - 1];
    if (section && !chapter.sections.some((item) => item.id === section)) section = "";
    const changed = current !== number;
    current = number;
    last = number;
    save();
    $("chapterMeta").textContent = `第 ${String(number).padStart(2, "0")} 章 · 全 20 章`;
    $("chapterTitle").textContent = chapter.title;
    $("chapterSubtitle").textContent = chapter.subtitle;
    $("openOriginal").href = chapter.file;
    sectionSelect.replaceChildren(new Option("章节开头", ""));
    for (const item of chapter.sections) sectionSelect.add(new Option(item.title, item.id));
    sectionSelect.value = section;
    pendingSection = section;
    pendingStartScroll = !options.noScroll && !section && changed;
    if (changed || frame.getAttribute("src") !== chapter.file) frame.src = chapter.file;
    else if (section) scrollToSection(section);
    $("prevButton").disabled = number === 1;
    $("nextButton").disabled = number === 20;
    updateProgress();
    renderNav();
    if (!options.fromHistory) setUrl(number, section, options.replaceUrl);
    if (!options.noScroll && !section) scrollToChapterStart();
    closeMenu();
  }

  sectionSelect.addEventListener("change", () => selectChapter(current, sectionSelect.value, { noScroll: true }));
  $("searchInput").addEventListener("input", renderNav);
  for (const [id, delta] of [["fontDecrease", -1], ["fontIncrease", 1]]) {
    $(id).addEventListener("click", () => {
      fontSize = Math.max(15, Math.min(21, fontSize + delta));
      save();
      try { frame.contentDocument?.documentElement.style.setProperty("--book-font-size", `${fontSize}px`); }
      catch (_) { /* The next chapter will use the saved size. */ }
      requestAnimationFrame(fitChapter);
    });
  }
  $("completeButton").addEventListener("click", () => {
    if (completed.has(current)) completed.delete(current); else completed.add(current);
    save();
    updateProgress();
    renderNav();
  });
  $("startButton").addEventListener("click", () => selectChapter(1));
  $("continueButton").addEventListener("click", () => selectChapter(completed.has(last) ? (chapters.find((c) => !completed.has(c.number))?.number || 20) : last));
  $("prevButton").addEventListener("click", () => selectChapter(current - 1));
  $("nextButton").addEventListener("click", () => selectChapter(current + 1));
  $("menuButton").addEventListener("click", () => {
    const open = !$("sidebar").classList.contains("open");
    $("sidebar").classList.toggle("open", open);
    $("menuButton").setAttribute("aria-expanded", String(open));
    $("scrim").hidden = !open;
    if (open) $("searchInput").focus();
  });
  $("scrim").addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("popstate", () => {
    const state = urlState();
    selectChapter(state.number || 1, state.section, { fromHistory: true });
  });

  const initial = urlState();
  selectChapter(initial.number || last, initial.section, { replaceUrl: true, noScroll: true });
})();
