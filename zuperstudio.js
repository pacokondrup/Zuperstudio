//home page
const links = document.querySelectorAll(".container a");
const bg = document.querySelector(".bg");
const showClass = "bg-show";
//const year = document.write(new Date().getFullYear())

for (const link of links) {
  const img = new Image();
  img.src = link.dataset.bg;

  link.addEventListener("mouseenter", function() {
    bg.style.backgroundImage = `url(${this.dataset.bg})`;
    document.body.classList.add(showClass);
  });

  link.addEventListener("mouseleave", () => {
    document.body.classList.remove(showClass);
  });
}



//FIX THE HOME BUTTON SCROLLING ISSUE 
(function() {
  // Elements
  const arrowLink = document.querySelector('.arrow a[href*="#"]');
  const torso = document.getElementById('torso');
  const homeLink = document.querySelector('.bottom-menu a[href="#"], .bottom-menu a[href=""]');

  // Safety: bail if elements missing
  if (!torso || !arrowLink || !homeLink) return;

  // state
  let isScrolling = false;
  let lockTimer = null;

  // helper to clear hash from URL (no back history)
  function clearHashFromURL() {
    const clean = location.pathname + location.search;
    history.replaceState(null, '', clean);
  }

  // helper to perform smooth scroll to element
  function smoothScrollToElement(el, durationFallback = 600) {
    // Use native smooth where available
    isScrolling = true;
    // Ensure CSS smooth behavior for consistency
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';

    el.scrollIntoView({ block: 'start', behavior: 'smooth' });

    // lock for a bit longer than typical smooth scroll to avoid races
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = prev || '';
      isScrolling = false;
    }, durationFallback + 100); // 100ms cushion
  }

  // arrow: prevent default hash navigation; do JS scroll instead
  arrowLink.addEventListener('click', e => {
    e.preventDefault();               // stop native hash navigation
    clearTimeout(lockTimer);
    // clear any hash immediately (prevent it from "sticking")
    clearHashFromURL();
    smoothScrollToElement(torso, 550);
    // Optionally set hash in URL without creating back entry (comment out if you don't want it)
    // history.replaceState(null, '', '#torso');
  }, { passive: false });

  // home: reliable top scroll, respects ongoing scroll (waits shortly if locked)
  homeLink.addEventListener('click', e => {
    e.preventDefault();

    // If currently scrolling to torso, wait a moment for it to finish then scroll to top
    if (isScrolling) {
      // Wait until lock releases (or a max timeout) then scroll to top
      const waitMax = 700; // ms
      const start = performance.now();
      const tryScroll = () => {
        if (!isScrolling || (performance.now() - start) > waitMax) {
          // clear hash and force top
          clearHashFromURL();
          // Temporarily disable smooth to ensure it really goes to top (avoid further races)
          const prev = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo(0, 0);
          // restore smooth behavior
          setTimeout(() => { document.documentElement.style.scrollBehavior = prev || ''; }, 20);
        } else {
          requestAnimationFrame(tryScroll);
        }
      };
      tryScroll();
    } else {
      // Nothing in flight — immediate top scroll
      clearHashFromURL();
      const prev = document.documentElement.style.scrollBehavior;
      // Use smooth scroll to top (or change to 'auto' if you want immediate jump)
      document.documentElement.style.scrollBehavior = 'smooth';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { document.documentElement.style.scrollBehavior = prev || ''; }, 50);
    }
  }, { passive: false });

})();
