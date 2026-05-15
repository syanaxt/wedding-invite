const unlockButton = document.querySelector(".unlock-button");
const lockScreen = document.querySelector(".lock-screen");
const coverPhoto = document.querySelector(".cover-photo");
const countdownValues = document.querySelectorAll(".countdown strong");
const weddingDate = new Date("2026-08-20T16:30:00+03:00");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let isUnlocking = false;
let revealObserver;

function unlockInvite() {
  if (isUnlocking) {
    return;
  }

  isUnlocking = true;
  lockScreen?.classList.add("is-unlocking");

  if (!coverPhoto || reduceMotion) {
    finishUnlock();
    return;
  }

  const rect = coverPhoto.getBoundingClientRect();
  const clone = coverPhoto.cloneNode();

  clone.className = "unlock-photo-clone";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  document.body.append(clone);
  clone.getBoundingClientRect();

  requestAnimationFrame(() => {
    clone.classList.add("is-expanded");
  });

  window.setTimeout(() => {
    finishUnlock();
    clone.classList.add("is-fading-out");
    window.setTimeout(() => clone.remove(), 560);
  }, 1450);
}

function finishUnlock() {
  document.body.classList.remove("locked");
  document.body.classList.add("unlocked");
  lockScreen?.setAttribute("hidden", "");
  window.scrollTo({ top: 0, left: 0 });
  revealVisibleElements();
}

function updateCountdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const values = [days, hours, minutes, seconds];

  countdownValues.forEach((node, index) => {
    node.textContent = String(values[index]);
  });
}

unlockButton?.addEventListener("click", unlockInvite);

updateCountdown();
setInterval(updateCountdown, 1000);

function setupScrollReveal() {
  const selectors = [
    ".hero .monogram",
    ".countdown",
    ".scroll-hint",
    ".intro .dash",
    ".intro h1",
    ".intro p",
    ".calendar-section h2",
    ".calendar",
    ".timeline",
    ".event",
    ".image-break .hero-image",
    ".image-break .monogram",
    ".place .dash",
    ".place h2",
    ".place .venue",
    ".place p:not(.venue)",
    ".outline-link",
    ".note-card",
    ".dress-code .decor-photo",
    ".dress-code h2",
    ".dress-code p",
    ".palette span",
    ".rsvp h2",
    ".rsvp p",
    ".form-button",
    ".contacts h2",
    ".contacts p"
  ];
  const elements = [...new Set(document.querySelectorAll(selectors.join(",")))];

  if (reduceMotion) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12
  });

  elements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 80, 240)}ms`);
    revealObserver.observe(element);
  });
}

function revealVisibleElements() {
  if (reduceMotion) {
    return;
  }

  requestAnimationFrame(() => {
    document.querySelectorAll(".reveal").forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

      if (isVisible) {
        element.classList.add("is-visible");
        revealObserver?.unobserve(element);
      }
    });
  });
}

setupScrollReveal();
