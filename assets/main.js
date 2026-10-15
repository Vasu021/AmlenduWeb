/* Amlendu Shekhar — portfolio behaviour.
   No dependencies, no build step. Everything degrades to a working page. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sections only start hidden once we know JS can bring them back. */
  if (!reduceMotion) document.documentElement.classList.add("js-anim");

  /* ------------------------------------------------------ mobile nav -- */

  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  var mobile = window.matchMedia("(max-width: 860px)");

  function applyNavMode() {
    if (!links) return;
    if (mobile.matches) {
      links.hidden = toggle.getAttribute("aria-expanded") !== "true";
    } else {
      links.hidden = false;
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function closeNav() {
    if (!mobile.matches) return;
    toggle.setAttribute("aria-expanded", "false");
    links.hidden = true;
  }

  if (toggle && links) {
    applyNavMode();
    (mobile.addEventListener ? mobile.addEventListener.bind(mobile, "change")
      : mobile.addListener.bind(mobile))(applyNavMode);

    toggle.addEventListener("click", function () {
      /* The toggle only exists below 860px; never let it hide the desktop nav. */
      if (!mobile.matches) return;
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.hidden = open;
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (e) {
      if (!mobile.matches) return;
      if (links.hidden) return;
      if (e.target.closest("#nav-links") || e.target.closest("#nav-toggle")) return;
      closeNav();
    });
  }

  /* ------------------------------------------------- sticky nav line -- */

  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.dataset.stuck = String(window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----------------------------------------------- active section ----- */

  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  var sections = sectionLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  /* The section whose top has most recently passed under the nav bar wins.
     Nothing is marked while the hero is still on screen.
     Offsets are cached so scrolling never forces a layout. */
  var offsets = [];
  var marked = null;

  function measure() {
    var page = window.scrollY;
    offsets = sections.map(function (s) {
      return { id: s.id, top: s.getBoundingClientRect().top + page };
    });
  }

  function syncActive() {
    if (!offsets.length) return;
    var line = window.scrollY + (nav ? nav.offsetHeight : 64) + 24;
    var current = "";

    for (var i = 0; i < offsets.length; i++) {
      if (offsets[i].top <= line) current = offsets[i].id;
    }
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = offsets[offsets.length - 1].id;
    }
    if (current === marked) return;
    marked = current;

    sectionLinks.forEach(function (a) {
      if (current && a.getAttribute("href") === "#" + current) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  function remeasure() { measure(); marked = null; syncActive(); }

  window.addEventListener("scroll", syncActive, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(remeasure).catch(function () {});
  }
  remeasure();

  /* ------------------------------------------------ reveal on scroll -- */

  var revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("in"); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0 });
    Array.prototype.forEach.call(revealables, function (el) { revealer.observe(el); });

    /* Belt and braces: nothing stays invisible for more than a few seconds. */
    setTimeout(function () {
      Array.prototype.forEach.call(revealables, function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    }, 2500);
  }

  /* --------------------------------------------------- project archive */

  var archiveToggle = document.getElementById("archive-toggle");
  var archivePanel = document.getElementById("archive-panel");
  var archiveLabel = document.getElementById("archive-label");

  if (archiveToggle && archivePanel && archiveLabel) {
    var count = archivePanel.children.length;
    archiveLabel.textContent = "Show earlier & smaller projects (" + count + ")";

    archiveToggle.addEventListener("click", function () {
      var open = archiveToggle.getAttribute("aria-expanded") === "true";
      archiveToggle.setAttribute("aria-expanded", String(!open));
      archivePanel.hidden = open;
      archiveLabel.textContent = open
        ? "Show earlier & smaller projects (" + count + ")"
        : "Hide earlier & smaller projects";
    });
  }

  /* -------------------------------------------------------- copy email */

  var copyBtn = document.getElementById("copy-email");
  var copyLabel = document.getElementById("copy-label");

  if (copyBtn && copyLabel) {
    var revert;
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email;
      var done = function (ok) {
        copyLabel.textContent = ok ? "Copied!" : "Press ⌘/Ctrl + C";
        copyBtn.dataset.copied = String(ok);
        clearTimeout(revert);
        revert = setTimeout(function () {
          copyLabel.textContent = "Copy address";
          copyBtn.dataset.copied = "false";
        }, 2200);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); },
          function () { done(false); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = email;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });
  }

  /* -------------------------------------------------------------- year */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
