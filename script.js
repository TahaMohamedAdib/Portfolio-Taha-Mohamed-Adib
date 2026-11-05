"use strict";

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const narrowScreen = window.matchMedia("(max-width: 800px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".site-header");
const main = document.querySelector("main");

function setMenu(open, restoreFocus = false) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);
  main.inert = open;
  if (restoreFocus) menuButton.focus();
}
function adaptNavigation() {
  menuButton.hidden = !narrowScreen.matches;
  if (!narrowScreen.matches) setMenu(false);
}
adaptNavigation();
narrowScreen.addEventListener("change", adaptNavigation);
menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));
mobileMenu
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
header
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (mobileMenu.hidden) return;
  if (event.key === "Escape") setMenu(false, true);
  if (event.key === "Tab") {
    const items = [
      ...header.querySelectorAll("a, button:not([hidden])"),
      ...mobileMenu.querySelectorAll("a"),
    ];
    const visible = items.filter((item) => item.getClientRects().length);
    const first = visible[0];
    const last = visible[visible.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const reveals = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-pending");
          reveals.unobserve(entry.target);
        }
      }),
    { threshold: 0.05 },
  );
  document.querySelectorAll(".reveal").forEach((item) => {
    reveals.observe(item);
    item.classList.add("is-pending");
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      reveals.disconnect();
      document
        .querySelectorAll(".is-pending")
        .forEach((item) => item.classList.remove("is-pending"));
    }
  });
}
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const progress = document.querySelector(".reading-progress");
let scrollQueued = false;
function updateScroll() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
  const active = sections
    .filter((section) => section.getBoundingClientRect().top <= 180)
    .at(-1);
  navLinks.forEach((link) => {
    if (active && link.hash === `#${active.id}`)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scrollQueued = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateScroll);
updateScroll();
document.getElementById("year").textContent = new Date().getFullYear();
function updateClock() {
  document.getElementById("local-time").textContent = new Intl.DateTimeFormat(
    "en-GB",
    { timeZone: "Africa/Casablanca", hour: "2-digit", minute: "2-digit" },
  ).format(new Date());
}
updateClock();
setInterval(updateClock, 60000);

const projects = {
  orasight: {
    eyebrow: "01 / INDEPENDENT SAAS",
    title: "OraSight.",
    deck: "Making Oracle data approachable through natural-language interaction.",
    role: "Solo product engineer",
    context: "AI database copilot",
    stack: "Spring Boot · Angular · Oracle 23ai",
    sections: [
      [
        "01 / THE IDEA",
        "Turn complex database exploration into a conversation. OraSight brings Oracle Autonomous Database, Select AI, AI Vector Search, and OCI Generative AI together in a single SaaS product.",
      ],
      [
        "02 / MY CONTRIBUTION",
        "I independently designed and developed the application: a Spring Boot backend, an Angular frontend, and the Oracle AI integrations. I owned the architecture and deployment as well as the product work around user acquisition and monetization.",
      ],
      [
        "03 / THE ENGINEERING",
        "A modular application architecture connects the user-facing experience with database and AI capabilities. The work spans relational data, AI-powered retrieval, backend services, and the product interface.",
      ],
    ],
    flow: [
      ["Ask", "Natural-language question"],
      ["Find context", "Select AI + AI Vector Search"],
      ["Explore", "Insight in the web application"],
    ],
  },
  vvollet: {
    eyebrow: "02 / PUBLISHED MOBILE PRODUCT",
    title: "VVollet.",
    deck: "A clearer view of everyday spending—and the goals beyond it.",
    role: "End-to-end product builder",
    context: "Google Play · 2025",
    stack: "React Native · PostgreSQL · Supabase",
    sections: [
      [
        "01 / THE IDEA",
        "Bring budget tracking, expense categorization, and financial-goal management into one cross-platform mobile application.",
      ],
      [
        "02 / MY CONTRIBUTION",
        "I designed, developed, and published VVollet. My role covered the full lifecycle, from the interface and application logic to Google Play submission and post-release updates.",
      ],
      [
        "03 / THE ENGINEERING",
        "React Native powers the mobile experience. PostgreSQL and Supabase provide the backend, with secure authentication and per-user data isolation so that each person’s financial information belongs to their own account.",
      ],
    ],
    flow: [
      ["Track", "Expenses and categories"],
      ["Organize", "Budgets and personal goals"],
      ["Protect", "Authentication + isolated data"],
    ],
    gallery: [
      ["home-dark", "Home: total balance and balance over time"],
      ["actions-dark", "Quick actions: expense, income, withdraw, transfer"],
      ["budgets-dark", "Budgets: monthly limits by category"],
      ["wealth-dark", "Wealth: net worth, income, and debt"],
      ["onboarding-glance", "Onboarding: everything at a glance"],
      ["onboarding-budgets", "Onboarding: plan with budgets"],
      ["onboarding-wealth", "Onboarding: grow your wealth"],
      ["home-light", "Home in light mode"],
      ["budgets-light", "Budgets in light mode"],
      ["wealth-light", "Wealth in light mode"],
    ],
  },
  automation: {
    eyebrow: "03 / YOOL EDUCATION · FEB–JUL 2026",
    title: "An inbox that understands.",
    deck: "An AI-powered HR email workflow with human judgment built into the loop.",
    role: "AI Engineering Intern",
    context: "HR email classification & routing",
    stack: "Python · n8n · Docker · Gemma / Ollama",
    sections: [
      [
        "01 / THE PROBLEM",
        "HR emails were being triaged manually. The system needed to understand the intent and urgency of messages, route them appropriately, and recognize when a human should take over.",
      ],
      [
        "02 / MY CONTRIBUTION",
        "I built a self-hosted classification and routing system in Python, using n8n, Docker, and Gemma through Ollama. I designed structured LLM outputs for intent, confidence, and urgency, alongside SLA tracking and escalation to human agents.",
      ],
      [
        "03 / THE ENGINEERING",
        "The workflow integrates PDF parsing, Google APIs, audit logging, and multichannel notifications. A containerized deployment makes the environment reproducible; confidence scoring and human escalation support review of uncertain cases.",
      ],
    ],
    flow: [
      ["Read", "Email + document context"],
      ["Understand", "Intent, confidence & urgency"],
      ["Act", "Route, notify, or escalate"],
    ],
  },
  operations: {
    eyebrow: "04 / FREELANCE CLIENT DELIVERY",
    title: "Operations, connected.",
    deck: "One system joining inventory, reservations, deliveries, and collections.",
    role: "Freelance Software Engineer",
    context: "Retail operations platform",
    stack: "PostgreSQL · Supabase · Realtime",
    sections: [
      [
        "01 / THE PROBLEM",
        "A retail client needed stock, reservations, orders, deliveries, and collections to work together across the people managing the business and the drivers completing deliveries.",
      ],
      [
        "02 / MY CONTRIBUTION",
        "I designed and shipped the end-to-end platform with separate Admin and Driver workflows. I modeled the relational schema and built the backend on PostgreSQL and Supabase.",
      ],
      [
        "03 / THE ENGINEERING",
        "Authentication, file storage, and real-time synchronization connect concurrent users to a shared operational state. The platform follows the work from stock management through delivery and collection.",
      ],
    ],
    flow: [
      ["Manage", "Stock, reservations & orders"],
      ["Coordinate", "Shared state in real time"],
      ["Deliver", "Driver workflow & collections"],
    ],
  },
};
const dialog = document.getElementById("project-dialog");
const dialogContent = document.getElementById("dialog-content");
let opener = null;
document.querySelectorAll("[data-case]").forEach((trigger) =>
  trigger.addEventListener("click", () => {
    const project = projects[trigger.dataset.case];
    if (!project) return;
    // These values are static, authored content; no user input is interpolated.
    dialogContent.innerHTML = `<div class="dialog-body"><p class="eyebrow">${project.eyebrow}</p><h2 id="dialog-title">${project.title}</h2><p class="dialog-deck">${project.deck}</p><div class="dialog-meta"><div><span>MY ROLE</span><strong>${project.role}</strong></div><div><span>CONTEXT</span><strong>${project.context}</strong></div><div><span>CORE STACK</span><strong>${project.stack}</strong></div></div>${project.gallery ? `<div class="dialog-gallery" role="region" aria-label="App screenshots" tabindex="0">${project.gallery.map(([file, caption]) => `<figure><img src="./assets/vvollet/${file}.webp" alt="${caption}" width="540" height="1176" loading="lazy" decoding="async" /><figcaption>${caption}</figcaption></figure>`).join("")}</div>` : ""}${project.sections.map(([title, text]) => `<section class="dialog-section"><h3>${title}</h3><p>${text}</p></section>`).join("")}<div class="dialog-flow">${project.flow.map(([title, text], index) => `<div><span>0${index + 1}</span><strong>${title}</strong><small>${text}</small></div>`).join("")}</div><div class="dialog-footer"><p>Want to talk through the decisions behind it?</p><a href="mailto:tahamohamedadib@gmail.com?subject=${encodeURIComponent(`Let’s talk about ${project.title}`)}">Let’s discuss the project <span aria-hidden="true">↗</span></a></div></div>`;
    [...dialogContent.firstElementChild.children].forEach((child, index) =>
      child.style.setProperty("--i", index),
    );
    opener = trigger;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("modal-open");
  }),
);
dialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  opener?.focus();
});

// VVollet ships light and dark themes; the switch swaps the real screenshots.
const vvolletArt = document.querySelector(".vvollet-art");
const themeSwitch = vvolletArt.querySelector(".theme-switch");
const appShots = [...vvolletArt.querySelectorAll(".app-shot")];
const preloadLight = () =>
  appShots.forEach((shot) => (new Image().src = shot.dataset.light));
vvolletArt.addEventListener("pointerenter", preloadLight, { once: true });
themeSwitch.addEventListener("focus", preloadLight, { once: true });
themeSwitch.hidden = false;
themeSwitch.addEventListener("click", () => {
  const light = themeSwitch.getAttribute("aria-pressed") !== "true";
  themeSwitch.setAttribute("aria-pressed", String(light));
  vvolletArt.dataset.theme = light ? "light" : "dark";
  appShots.forEach((shot) => {
    shot.src = light ? shot.dataset.light : shot.dataset.dark;
  });
});

const copyButton = document.querySelector(".copy-email");
const copyStatus = document.getElementById("copy-status");
let copyTimeout;
if (navigator.clipboard?.writeText) copyButton.hidden = false;
copyButton.addEventListener("click", async () => {
  clearTimeout(copyTimeout);
  try {
    await navigator.clipboard.writeText("tahamohamedadib@gmail.com");
    copyStatus.textContent = "Email copied.";
  } catch {
    copyStatus.textContent = "Select the email above to copy it.";
  }
  copyTimeout = setTimeout(() => {
    copyStatus.textContent = "";
  }, 4000);
});

/* ------------------------------------------------------------------
   Motion layer. Everything below is progressive enhancement: the page is
   complete without it, and it never starts under prefers-reduced-motion.
   Switching to reduced motion mid-visit settles every effect in its final
   state; switching back takes effect on the next load.
------------------------------------------------------------------- */
const root = document.documentElement;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const lerp = (from, to, amount) => from + (to - from) * amount;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const settlers = [];

// One shared frame loop: each job returns true while it still needs frames.
const jobs = new Set();
let ticking = false;
function tick(now) {
  jobs.forEach((job) => job(now) || jobs.delete(job));
  ticking = jobs.size > 0;
  if (ticking) requestAnimationFrame(tick);
}
function schedule(job) {
  jobs.add(job);
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(tick);
  }
}

const glyphs = "abcdefghijklmnopqrstuvwxyz0123456789#%*+=/";
function scramble(element, duration) {
  const text = (element.dataset.text ??= element.textContent);
  const start = performance.now();
  // Characters resolve left to right; the authored text contains no markup.
  schedule(function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const fixed = Math.floor(progress * text.length);
    let tail = "";
    for (const char of text.slice(fixed))
      tail += /[\s@.]/.test(char)
        ? char
        : glyphs[(Math.random() * glyphs.length) | 0];
    element.innerHTML =
      text.slice(0, fixed) +
      (tail ? `<span class="scramble-glyphs">${tail}</span>` : "");
    if (progress < 1) return true;
    element.textContent = text;
    return false;
  });
}

function splitLines(heading) {
  let openEm = 0;
  const lines = heading.innerHTML.split(/<br\s*\/?>/i).map((part) => {
    let html = (openEm ? "<em>" : "") + part.trim();
    openEm +=
      (part.match(/<em\b/g) || []).length -
      (part.match(/<\/em>/g) || []).length;
    if (openEm) html += "</em>";
    return html;
  });
  heading.innerHTML = lines
    .map(
      (html, index) =>
        `<span class="split-line"><span class="line-inner" style="--line:${index}">${html}</span></span>`,
    )
    .join("");
  heading.classList.add("split");
}

function heroField() {
  const hero = document.querySelector(".hero");
  const canvas = hero.querySelector(".hero-field");
  const art = hero.querySelector(".system-art");
  const orbit = hero.querySelector(".orbit-svg");
  const context = canvas.getContext("2d");
  const reach = 190;
  const synapse = 125;
  const pointer = { x: null, y: null, targetX: 0, targetY: 0, live: false };
  const ripples = [];
  let nodes = [];
  let width = 0;
  let height = 0;
  let artBox = { x: 0, y: 0, size: 1 };
  let visible = true;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const heroRect = hero.getBoundingClientRect();
    const artRect = art.getBoundingClientRect();
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    artBox = {
      x: artRect.left - heroRect.left + artRect.width / 2,
      y: artRect.top - heroRect.top + artRect.height / 2,
      size: Math.max(artRect.width, 1),
    };
    nodes = Array.from({ length: Math.round((width * height) / 5200) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.5,
      size: Math.random() < 0.12 ? 1.8 : 1.1,
    }));
  }

  function frame(now) {
    if (!visible) return false;
    const seconds = now / 1000;
    // A slow "ghost" pointer keeps the field alive on touch screens and idle desktops.
    if (!pointer.live) {
      pointer.targetX =
        artBox.x + artBox.size * 0.38 * Math.sin(seconds * 0.37);
      pointer.targetY =
        artBox.y + artBox.size * 0.3 * Math.sin(seconds * 0.53 + 1);
    }
    pointer.x =
      pointer.x === null ? pointer.targetX : lerp(pointer.x, pointer.targetX, 0.1);
    pointer.y =
      pointer.y === null ? pointer.targetY : lerp(pointer.y, pointer.targetY, 0.1);

    ripples.forEach((ripple) => {
      ripple.radius += 7;
      ripple.strength *= 0.965;
    });
    while (ripples.length && ripples[0].strength < 0.03) ripples.shift();

    // Neurons drift in place; near the pointer (or a click ripple) they light up and wire together.
    context.clearRect(0, 0, width, height);
    const lit = [];
    for (const node of nodes) {
      let x = node.x + Math.sin(seconds * node.speed + node.phase) * 6;
      let y = node.y + Math.cos(seconds * node.speed * 0.8 + node.phase) * 6;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      let energy = 0;
      if (distance < reach) {
        energy = 1 - distance / reach;
        x -= (dx / distance) * energy * energy * 10;
        y -= (dy / distance) * energy * energy * 10;
      }
      for (const ripple of ripples) {
        const rx = node.x - ripple.x;
        const ry = node.y - ripple.y;
        const span = Math.hypot(rx, ry) || 1;
        const band = Math.abs(span - ripple.radius);
        if (band < 40) {
          const push = (1 - band / 40) * ripple.strength;
          x += (rx / span) * push * 12;
          y += (ry / span) * push * 12;
          energy += push;
        }
      }
      node.screenX = x;
      node.screenY = y;
      node.energy = Math.min(energy, 1);
      if (node.energy > 0.05) lit.push(node);
      context.globalAlpha = 0.2 + node.energy * 0.75;
      context.fillStyle = node.energy > 0.05 ? "#a9baff" : "#c8cfe0";
      context.beginPath();
      context.arc(x, y, node.size + node.energy * 1.8, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "#8aa2ff";
    context.lineWidth = 1;
    for (let a = 0; a < lit.length; a++)
      for (let b = a + 1; b < lit.length; b++) {
        const from = lit[a];
        const to = lit[b];
        const gap = Math.hypot(from.screenX - to.screenX, from.screenY - to.screenY);
        if (gap > synapse) continue;
        context.globalAlpha =
          (1 - gap / synapse) * Math.min(from.energy, to.energy) * 0.9;
        context.beginPath();
        context.moveTo(from.screenX, from.screenY);
        context.lineTo(to.screenX, to.screenY);
        context.stroke();
      }
    context.globalAlpha = 1;

    // The orb leans toward the (real or ghost) pointer, its tags at different depths.
    const nx = clamp((pointer.x - artBox.x) / artBox.size, -1, 1);
    const ny = clamp((pointer.y - artBox.y) / artBox.size, -1, 1);
    art.style.setProperty("--tilt-x", `${(-ny * 12).toFixed(2)}deg`);
    art.style.setProperty("--tilt-y", `${(nx * 16).toFixed(2)}deg`);
    art.style.setProperty("--px", nx.toFixed(3));
    art.style.setProperty("--py", ny.toFixed(3));
    art.classList.toggle("is-near", pointer.live && Math.hypot(nx, ny) < 0.45);
    return true;
  }

  function localPoint(event) {
    const rect = hero.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const point = localPoint(event);
    pointer.targetX = point.x;
    pointer.targetY = point.y;
    pointer.live = true;
  });
  hero.addEventListener("pointerleave", () => (pointer.live = false));
  hero.addEventListener("pointerdown", (event) => {
    const point = localPoint(event);
    ripples.push({ ...point, radius: 0, strength: 1 });
    if (ripples.length > 4) ripples.shift();
  });

  new ResizeObserver(resize).observe(hero);
  resize();
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
    art.classList.toggle("in-view", visible);
    if (visible) {
      orbit.unpauseAnimations();
      schedule(frame);
    } else orbit.pauseAnimations();
  }).observe(hero);
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden && hero.getBoundingClientRect().bottom > 0;
    if (visible) schedule(frame);
  });

  settlers.push(() => {
    visible = false;
    context.clearRect(0, 0, width, height);
    orbit.pauseAnimations();
  });
}

function oraDemo() {
  const area = document.querySelector(".ora-art");
  const app = area.querySelector(".ora-app");
  const query = app.querySelector(".query-text");
  const question = query.textContent;
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
  let timer;
  app.querySelectorAll(".chart > span").forEach((bar, index) => {
    bar.style.setProperty("--i", index);
    bar.dataset.v = `${months[index]} · ${bar.style.getPropertyValue("--h").trim()}`;
  });
  query.textContent = "";

  function play() {
    clearTimeout(timer);
    app.classList.remove("is-answered", "is-sending");
    query.textContent = "";
    let typed = 0;
    const type = () => {
      query.textContent = question.slice(0, ++typed);
      if (typed < question.length)
        timer = setTimeout(type, 34 + Math.random() * 46);
      else
        timer = setTimeout(() => {
          app.classList.add("is-sending");
          timer = setTimeout(() => {
            app.classList.remove("is-sending");
            app.classList.add("is-answered");
          }, 260);
        }, 320);
    };
    timer = setTimeout(type, 350);
  }
  new IntersectionObserver(
    ([entry]) => {
      area.classList.toggle("in-view", entry.isIntersecting);
      if (entry.isIntersecting) play();
    },
    { threshold: 0.45 },
  ).observe(area);

  settlers.push(() => {
    clearTimeout(timer);
    query.textContent = question;
    app.classList.add("is-answered");
  });
}

function observeOnce(elements, onEnter, options) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        onEnter?.(entry.target);
        observer.unobserve(entry.target);
      }),
    options,
  );
  elements.forEach((element) => observer.observe(element));
}

function pointerEffects() {
  // Pointer-relative parallax inside the product illustrations.
  document.querySelectorAll(".ora-art, .vvollet-art").forEach((area) => {
    area.addEventListener("pointermove", (event) => {
      const rect = area.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      area.style.setProperty("--px", nx.toFixed(3));
      area.style.setProperty("--py", ny.toFixed(3));
      area.style.setProperty("--ty", `${(nx * 7).toFixed(2)}deg`);
      area.style.setProperty("--tx", `${(-ny * 6).toFixed(2)}deg`);
    });
    area.addEventListener("pointerleave", () =>
      ["--px", "--py", "--tx", "--ty"].forEach((name) =>
        area.style.removeProperty(name),
      ),
    );
  });

  document
    .querySelectorAll(
      ".featured-project, .project-card, .operations-project, .toolkit-grid > article, .availability, .timeline-item",
    )
    .forEach((card) => {
      card.classList.add("spotlight");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--sy", `${event.clientY - rect.top}px`);
      });
    });

  // Magnetic calls to action drift toward the pointer, then spring back.
  document
    .querySelectorAll(".button, .header-contact, .case-trigger, .copy-email")
    .forEach((magnet) => {
      const state = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const settle = () => {
        state.x = lerp(state.x, state.targetX, 0.18);
        state.y = lerp(state.y, state.targetY, 0.18);
        const moving =
          Math.abs(state.x - state.targetX) > 0.05 ||
          Math.abs(state.y - state.targetY) > 0.05;
        magnet.style.translate = moving || state.targetX || state.targetY
          ? `${state.x.toFixed(2)}px ${state.y.toFixed(2)}px`
          : "";
        return moving;
      };
      magnet.addEventListener("pointermove", (event) => {
        const rect = magnet.getBoundingClientRect();
        state.targetX = clamp(
          (event.clientX - rect.left - rect.width / 2) * 0.25,
          -10,
          10,
        );
        state.targetY = clamp(
          (event.clientY - rect.top - rect.height / 2) * 0.35,
          -8,
          8,
        );
        schedule(settle);
      });
      magnet.addEventListener("pointerleave", () => {
        state.targetX = 0;
        state.targetY = 0;
        schedule(settle);
      });
    });

  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  const light = document.createElement("div");
  light.className = "cursor-glow";
  light.setAttribute("aria-hidden", "true");
  document.body.append(cursor, light);
  const ring = { x: 0, y: 0, targetX: 0, targetY: 0, placed: false };
  const glow = { x: 0, y: 0 };
  const follow = () => {
    ring.x = lerp(ring.x, ring.targetX, 0.22);
    ring.y = lerp(ring.y, ring.targetY, 0.22);
    glow.x = lerp(glow.x, ring.targetX, 0.08);
    glow.y = lerp(glow.y, ring.targetY, 0.08);
    cursor.style.transform = `translate3d(${ring.x.toFixed(1)}px, ${ring.y.toFixed(1)}px, 0)`;
    light.style.transform = `translate3d(${glow.x.toFixed(1)}px, ${glow.y.toFixed(1)}px, 0)`;
    return (
      Math.abs(glow.x - ring.targetX) > 0.1 ||
      Math.abs(glow.y - ring.targetY) > 0.1
    );
  };
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    ring.targetX = event.clientX;
    ring.targetY = event.clientY;
    if (!ring.placed) {
      ring.x = ring.targetX;
      ring.y = ring.targetY;
      glow.x = ring.targetX;
      glow.y = ring.targetY;
      ring.placed = true;
    }
    cursor.classList.add("is-visible");
    light.classList.add("is-visible");
    cursor.classList.toggle(
      "is-hovering",
      Boolean(event.target.closest("a, button, .chart > span")),
    );
    schedule(follow);
  });
  document.addEventListener("pointerdown", () =>
    cursor.classList.add("is-pressed"),
  );
  document.addEventListener("pointerup", () =>
    cursor.classList.remove("is-pressed"),
  );
  document.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      cursor.classList.remove("is-visible");
      light.classList.remove("is-visible");
    }
  });
  settlers.push(() => {
    cursor.remove();
    light.remove();
  });
}

if (!reducedMotion.matches) {
  root.classList.add("motion", "motion-ready");

  const headline = document.querySelector(".hero h1 [data-scramble]");
  setTimeout(() => scramble(headline, 1100), 250);

  document
    .querySelectorAll(
      ".section-heading h2, .about-copy h2, .contact h2, .ops-copy h3, .education-grid h3",
    )
    .forEach(splitLines);
  observeOnce(document.querySelectorAll(".split, .timeline-item"), null, {
    rootMargin: "0px 0px -12% 0px",
  });

  // Looping illustrations only animate while on screen.
  const loops = new IntersectionObserver((entries) =>
    entries.forEach((entry) =>
      entry.target.classList.toggle("in-view", entry.isIntersecting),
    ),
  );
  document
    .querySelectorAll(".automation-art, .ops-visual")
    .forEach((visual) => loops.observe(visual));

  heroField();
  oraDemo();
  if (finePointer.matches) pointerEffects();

  const email = document.querySelector(".contact-email");
  const emailText = email.querySelector(".scramble-text");
  ["pointerenter", "focus"].forEach((type) =>
    email.addEventListener(type, () => {
      if (!reducedMotion.matches) scramble(emailText, 700);
    }),
  );

  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    root.classList.remove("motion", "motion-ready");
    jobs.clear();
    settlers.forEach((settle) => settle());
  });
} else document.querySelector(".orbit-svg").pauseAnimations();

// The header steps aside while reading down and returns on the way back up.
let lastScrollY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (Math.abs(y - lastScrollY) < 6) return;
    header.classList.toggle(
      "is-tucked",
      y > lastScrollY &&
        y > 400 &&
        !document.body.classList.contains("menu-open") &&
        !header.contains(document.activeElement),
    );
    lastScrollY = y;
  },
  { passive: true },
);
header.addEventListener("focusin", () => header.classList.remove("is-tucked"));

console.log(
  "%cta✳ Hi there, fellow builder.%c\nCurious how this was made? tahamohamedadib@gmail.com",
  "font: 600 16px Space Grotesk, sans-serif; color: #6f8cff",
  "font: 12px DM Mono, monospace; color: #9ba3b4",
);
