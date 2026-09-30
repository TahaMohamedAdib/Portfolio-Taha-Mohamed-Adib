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
  safespend: {
    eyebrow: "02 / PUBLISHED MOBILE PRODUCT",
    title: "SafeSpend.",
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
        "I designed, developed, and published SafeSpend. My role covered the full lifecycle, from the interface and application logic to Google Play submission and post-release updates.",
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
    dialogContent.innerHTML = `<div class="dialog-body"><p class="eyebrow">${project.eyebrow}</p><h2 id="dialog-title">${project.title}</h2><p class="dialog-deck">${project.deck}</p><div class="dialog-meta"><div><span>MY ROLE</span><strong>${project.role}</strong></div><div><span>CONTEXT</span><strong>${project.context}</strong></div><div><span>CORE STACK</span><strong>${project.stack}</strong></div></div>${project.sections.map(([title, text]) => `<section class="dialog-section"><h3>${title}</h3><p>${text}</p></section>`).join("")}<div class="dialog-flow">${project.flow.map(([title, text], index) => `<div><span>0${index + 1}</span><strong>${title}</strong><small>${text}</small></div>`).join("")}</div><div class="dialog-footer"><p>Want to talk through the decisions behind it?</p><a href="mailto:tahamohamedadib@gmail.com?subject=${encodeURIComponent(`Let’s talk about ${project.title}`)}">Let’s discuss the project <span aria-hidden="true">↗</span></a></div></div>`;
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
