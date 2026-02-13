// IMPORTANT: Replace this with your deployed Google Apps Script Web App URL
// that is connected to your Google Sheet.
// Example: const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwqXam7D7zpM-Cy5V9yqi6Bza-xyD7U_vDMC_IF-im6AjvBarJs6aJKaGae7W68q3nn/exec";

document.addEventListener("DOMContentLoaded", () => {
  // Set copyright year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Sticky Header Scroll Effect
  const header = document.querySelector(".main-header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });

  // Smooth Scroll for Navigation Links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = header?.offsetHeight || 0;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Intersection Observer for Scroll-Triggered Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and fade-in items
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    observer.observe(section);
  });

  const fadeInItems = document.querySelectorAll(".fade-in-item");
  fadeInItems.forEach((item, index) => {
    // Stagger animation delays
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Parallax Effect for Hero Section
  const heroCard = document.querySelector(".hero-card");
  if (heroCard) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      heroCard.style.transform = `translateY(${rate}px)`;
    });
  }

  // Contact Form Submission -> Google Sheets via Apps Script
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-status");
  const submitBtn = form ? form.querySelector(".contact-submit") : null;

  if (form && statusEl && submitBtn && GOOGLE_SCRIPT_URL.includes("https://script.google.com/macros/")) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      statusEl.textContent = "Sending your message...";
      statusEl.classList.remove("success", "error");
      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        formData.append("timestamp", new Date().toISOString());

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });

        statusEl.textContent = "✓ Thanks! Your message has been sent successfully.";
        statusEl.classList.add("success");
        form.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          statusEl.textContent = "";
          statusEl.classList.remove("success");
        }, 5000);
      } catch (error) {
        console.error("Error submitting contact form:", error);
        statusEl.textContent =
          "✗ Something went wrong while sending your message. Please try again or email me directly.";
        statusEl.classList.add("error");
      } finally {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
      }
    });
  } else if (statusEl && GOOGLE_SCRIPT_URL === "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec") {
    statusEl.textContent =
      "⚠ Contact form not fully configured yet. Please add your Google Apps Script URL in index.js.";
    statusEl.classList.add("error");
  }

  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll(
    ".chip, .btn-primary, .btn-ghost, .nav-link"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // Active Navigation Link Highlighting
  const updateActiveNav = () => {
    const sections = document.querySelectorAll(".content-section");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;
      if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav(); // Initial call

  // Theme toggle (persists to localStorage)
  const themeToggle = document.getElementById("theme-toggle");
  const applyTheme = (theme) => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      if (themeToggle) {
        themeToggle.textContent = "☀️";
        themeToggle.setAttribute("aria-pressed", "true");
      }
    } else {
      document.body.classList.remove("light-theme");
      if (themeToggle) {
        themeToggle.textContent = "🌙";
        themeToggle.setAttribute("aria-pressed", "false");
      }
    }
  };

  // Initialize theme from localStorage or prefers-color-scheme
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-theme");
      const next = isLight ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }
});
