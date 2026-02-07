// app.js
(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set footer year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Reveal on scroll
  const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });
    nodes.forEach(n => io.observe(n));
  } else {
    nodes.forEach(n => n.classList.add("is-in"));
  }

  // Copy buttons
  const copyBtns = Array.from(document.querySelectorAll(".js-copy"));
  copyBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = "Copied";
        btn.setAttribute("aria-live", "polite");
        setTimeout(() => (btn.textContent = prev), 900);
      } catch {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch {}
        document.body.removeChild(ta);
      }
    });
  });
})();
