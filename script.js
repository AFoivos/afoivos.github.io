const root = document.documentElement;
document.body.classList.add("js-enabled");

const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navActions = document.querySelector(".nav-actions");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    return;
  }
}

const storedTheme = getStoredTheme();
const initialTheme = storedTheme || "dark";

function setTheme(theme) {
  root.dataset.theme = theme;
  storeTheme(theme);

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

setTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

function closeMenu() {
  navActions?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navActions?.classList.toggle("is-open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));

    if (section) {
      sectionObserver.observe(section);
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
