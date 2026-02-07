// app.js
(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Footer year ----
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ---- One-time live region for a11y status ----
  const ensureLiveRegion = () => {
    let el = document.getElementById("live");
    if (el) return el;
    el = document.createElement("div");
    el.id = "live";
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-atomic", "true");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.top = "0";
    document.body.appendChild(el);
    return el;
  };

  const announce = (msg) => {
    const live = ensureLiveRegion();
    // Clear first so repeated messages still announce
    live.textContent = "";
    setTimeout(() => (live.textContent = msg), 20);
  };

  // ---- Toast (no HTML required) ----
  const showToast = (msg = "Copied") => {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.position = "fixed";
      t.style.left = "50%";
      t.style.bottom = "18px";
      t.style.transform = "translateX(-50%) translateY(10px)";
      t.style.opacity = "0";
      t.style.transition = "opacity .18s ease, transform .18s ease";
      t.style.zIndex = "9999";
      t.style.padding = "10px 12px";
      t.style.borderRadius = "999px";
      t.style.border = "1px solid rgba(244,241,236,.16)";
      t.style.background = "rgba(15,17,21,.88)";
      t.style.color = "rgba(244,241,236,.92)";
      t.style.backdropFilter = "blur(10px)";
      t.style.webkitBackdropFilter = "blur(10px)";
      t.style.font = "600 13px/1.2 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
      t.style.letterSpacing = ".01em";
      document.body.appendChild(t);
    }

    t.textContent = msg;

    // Reset + animate in
    t.style.opacity = "0";
    t.style.transform = "translateX(-50%) translateY(10px)";
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateX(-50%) translateY(0)";
    });

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(10px)";
    }, 900);
  };

  // ---- Reveal on scroll ----
  const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "80px 0px -40px 0px", // smoother timing
      }
    );
    nodes.forEach((n) => io.observe(n));
  } else {
    nodes.forEach((n) => n.classList.add("is-in"));
  }

  // ---- Clipboard helpers ----
  const writeClipboard = async (text) => {
    // Try modern clipboard first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: textarea selection (more iOS-safe)
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);

    // iOS: explicit selection range helps
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }

    document.body.removeChild(ta);
    return ok;
  };

  // ---- Copy buttons ----
  const copyBtns = Array.from(document.querySelectorAll(".js-copy"));
  copyBtns.forEach((btn) => {
    // Store original label once to avoid layout jitter
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;

    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      if (!text) return;

      btn.disabled = true;

      try {
        const ok = await writeClipboard(text);
        if (ok) {
          btn.textContent = "Copied";
          announce("Copied to clipboard");
          showToast("Copied");
        } else {
          btn.textContent = "Copy failed";
          announce("Copy failed");
          showToast("Copy failed");
        }
      } catch {
        btn.textContent = "Copy failed";
        announce("Copy failed");
        showToast("Copy failed");
      } finally {
        setTimeout(() => {
          btn.textContent = btn.dataset.label || "Copy";
          btn.disabled = false;
        }, 900);
      }
    });
  });
})();
