(() => {
  "use strict";

  // These entries had a named source but no clickable destination in the course.
  // Only exact, verified source pages are added; course-specific caveats stay as text.
  const supplementalSources = {
    9: [
      ["《中华人民共和国保险法》", "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_4c715a53f3d4402c89f62ae77809f638.html"],
      ["《健康保险管理办法》", "https://jrj.sh.gov.cn/YWTBZCCX166/20191113/0031-157191.html"],
      ["国家医疗保障局", "https://www.nhsa.gov.cn/art/2026/1/6/art_110_19259.html"],
      ["CFP Board — Risk Management and Insurance Planning", "https://www.cfp.net/certification-process/education-requirement/certification-coursework-requirement/what-youll-learn"],
      ["NAIC Consumer Insurance Education", "https://content.naic.org/consumer/health-insurance.htm"],
    ],
    10: [
      ["中国金融消费者权益保护制度", "https://dfjrjgj.hunan.gov.cn/dfjrjgj/jrbk/jrzs/202310/t20231007_31537934.html"],
      ["中国证监会及派出机构投资者保护", "https://www.csrc.gov.cn/shenzhen/c105614/c7602091/content.shtml"],
      ["SEC — Conflicts of Interest", "https://www.sec.gov/about/divisions-offices/division-trading-markets/broker-dealers/staff-bulletin-standards-conduct-broker-dealers-investment-advisers-conflicts-interest"],
    ],
    12: [
      ["中华人民共和国个人所得税法", "https://jiangsu.chinatax.gov.cn/art/2018/8/31/art_23636_1794.html"],
      ["储蓄存款利息所得政策", "https://fgk.chinatax.gov.cn/zcfgk/c102416/c5203286/content.html"],
    ],
    13: [
      ["CFA Institute — 2026 Level I Topic Outlines", "https://www.cfainstitute.org/sites/default/files/docs/programs/cfa-program/2026-l1-topics-combined.pdf"],
    ],
    15: [
      ["CFA Institute — Yield-Based Bond Duration", "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/yield-based-bond-duration-measures-and-properties"],
      ["CFA Institute — Yield-Based Bond Duration", "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/overview-fixed-income-portfolio-management", "固定收益组合管理"],
    ],
    17: [
      ["Investor.gov — Smart Beta", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-25"],
    ],
    18: [
      ["Ibbotson & Kaplan", "https://www.tandfonline.com/doi/abs/10.2469/faj.v56.n1.2327"],
    ],
    19: [
      ["Barber & Odean / Individual Investor Research", "https://faculty.haas.berkeley.edu/odean/papers/returns/returns.html"],
    ],
  };

  const chapter = Number(location.pathname.match(/wealth_chapter(\d+)_/)?.[1]);
  const refs = document.getElementById("refs");
  if (refs) {
    const items = [...refs.querySelectorAll("li")];
    for (const [name, href, label] of supplementalSources[chapter] || []) {
      const item = items.find((li) => li.textContent.includes(name));
      if (!item) continue;
      if ([...item.querySelectorAll("a[href]")].some((link) => link.href === href)) continue;
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label || "查看资料";
      item.append(" ", link);
    }

    for (const item of items) {
      const links = [...item.querySelectorAll("a[href]")];
      if (!links.length) {
        item.classList.add("source-note");
        continue;
      }
      const title = item.querySelector("b, strong")?.textContent.trim().replace(/[。.]$/, "")
        || links[0].textContent.trim();
      const primary = document.createElement("a");
      primary.href = links[0].href;
      primary.textContent = title;
      primary.className = "source-title";
      primary.setAttribute("aria-label", `${title}（在新标签页打开）`);
      const extra = links.slice(1).map((link) => {
        const secondary = document.createElement("a");
        secondary.href = link.href;
        secondary.textContent = link.textContent.trim();
        secondary.className = "source-extra";
        return secondary;
      });
      item.replaceChildren(primary, ...extra);
      item.classList.add("source-link");
    }
  }

  for (const link of document.querySelectorAll("a[href]")) {
    try {
      const destination = new URL(link.href, location.href);
      if (!["http:", "https:"].includes(destination.protocol) || destination.origin === location.origin) continue;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } catch (_) { /* Ignore malformed links; do not replace their destination. */ }
  }

  const style = document.createElement("style");
  style.textContent = `
    #refs .refs { padding-left: 0; list-style: none; }
    #refs .refs li.source-link { margin: 0; padding: 12px 0; border-bottom: 1px solid var(--line, #d6c199); }
    #refs .refs li.source-link a { display: inline-block; color: var(--green, #455f4c); text-decoration: none; }
    #refs .refs li.source-link a:hover { text-decoration: underline; }
    #refs .refs li.source-link a.source-title { font-weight: 700; }
    #refs .refs li.source-link a.source-title::after { content: " ↗"; font-size: .8em; }
    #refs .refs li.source-link a.source-extra { margin-left: 12px; font-size: .92em; }
    #refs .refs li.source-note { margin: 14px 0 0; color: var(--muted, #766858); }
  `;
  document.head.append(style);
})();
