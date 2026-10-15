import { Component, setData, heroImages, useFallback, setThumb } from './app.js';

const base = (import.meta.env && import.meta.env.BASE_URL) || './';
const host = document.getElementById('app-root');
const scene = host.firstElementChild;

// The scene is designed at 1440×900. It scales to fit the window, and the
// extra width or height is added to the scene so it fills the screen edge to edge.
// The 1440×900 composition stays centered inside it.
function fit() {
  // Never shrink below this, even on a narrow phone: below it the UI text
  // (search box, labels, pills) becomes unreadably small. The decorative
  // background is free to crop at the edges instead (see #wrap overflow:hidden).
  const MIN_SCALE = 0.55;
  const s = Math.max(Math.min(window.innerWidth / 1440, window.innerHeight / 900), MIN_SCALE);
  const w = Math.ceil(window.innerWidth / s), h = Math.ceil(window.innerHeight / s);
  // Phones and portrait tablets: the scene is cropped at the sides, so the UI gets
  // a compact layout (see body.narrow in style.css). --dw is the visible width.
  document.body.classList.toggle('narrow', w < 1100 || window.innerWidth < window.innerHeight * 0.9);
  document.documentElement.style.setProperty('--dw', w + 'px');
  host.style.width = scene.style.width = w + 'px';
  host.style.height = scene.style.height = h + 'px';
  host.style.transform = 'scale(' + s + ')';
  const ox = (w - 1440) / 2, oy = (h - 900) / 2;
  scene.querySelectorAll('[data-frame]').forEach((el) => {
    el.style.left = ox + 'px';
    el.style.top = oy + (+el.dataset.frame || 0) + 'px';
  });
}
window.addEventListener('resize', fit);
fit();

// The scene is scaled with a transform, so its layout box is bigger than the
// screen. Tapping the search box would scroll #wrap to it and shift the whole
// scene up, so keep #wrap pinned in place.
const wrap = host.parentElement;
wrap.addEventListener('scroll', () => {
  if (wrap.scrollTop || wrap.scrollLeft) wrap.scrollTop = wrap.scrollLeft = 0;
});

const boot = document.getElementById('boot');
const bootText = document.getElementById('boot-text');
const liquid = document.getElementById('boot-level');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Raise Sniff's liquid: 0 is nearly empty, 1 is full to the shoulders.
function fill(p) {
  liquid.style.transform = 'translateY(' + (172 - 290 * p).toFixed(1) + 'px)';
}

// Load one photo; give up after `ms` so a slow or broken link never blocks the app.
function preload(url, ms) {
  return new Promise((resolve) => {
    const img = new Image();
    const t = setTimeout(() => done(false), ms);
    function done(ok) { clearTimeout(t); img.onload = img.onerror = null; resolve(ok); }
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = url;
  });
}

// Load a photo and keep a small copy (longest side `max` px). The floating cards
// are small, and full-size photos make phones flicker as the cards move.
// Resolves to a blob URL, or null if the photo can't be read (then the original is used).
function shrink(url, max, ms) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const t = setTimeout(() => done(null), ms);
    function done(v) { clearTimeout(t); img.onload = img.onerror = null; resolve(v); }
    img.onload = () => {
      try {
        const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * s));
        c.height = Math.max(1, Math.round(img.naturalHeight * s));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => done(b ? URL.createObjectURL(b) : null), 'image/webp', 0.85);
      } catch (e) { done(null); }
    };
    img.onerror = () => done(null);
    img.src = url;
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const started = performance.now();

fetch(base + 'data/dupedia.json')
  .then((r) => r.json())
  .then(async (data) => {
    setData(data);
    const list = heroImages();

    // 1. Sniff fills up as the photos load.
    let n = 0;
    fill(0.08);
    await Promise.all(list.map(({ k, url }) => shrink(url, 512, 4000).then((small) => {
      if (small) { setThumb(k, small); return true; }
      return preload(url, 2500);
    }).then((ok) => {
      if (!ok) useFallback(k);
      n++;
      fill(0.08 + 0.82 * (n / list.length));
    })));
    await wait(Math.max(0, 3600 - (performance.now() - started)));
    fill(1);
    await wait(calm ? 0 : 600);
    boot.classList.add('done');
    await wait(calm ? 0 : 800);

    // 2. Sniff shrinks away as the cards spread out into the floating sphere.
    const app = new Component({});
    const refs = app.renderVals();
    host.querySelectorAll('[data-ref]').forEach((el) => refs[el.dataset.ref](el));
    app.intro = calm ? null : performance.now();
    app.componentDidMount();
    boot.classList.add('thrown');
    document.body.classList.add('ready');
    const stage = host.querySelector('[data-ref="setStage"]');
    if (!calm) stage.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: 750, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    setTimeout(() => boot.remove(), 1200);
  })
  .catch((err) => {
    bootText.textContent = 'Could not load the perfume database. Check your connection and refresh the page.';
    console.error(err);
  });
