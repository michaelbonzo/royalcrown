// Royal Crown Business Consultancy — shared scripts
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // year
  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

  // mobile menu
  const menu = $('#menu');
  $('.burger')?.addEventListener('click', () => menu.classList.toggle('open'));
  $$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  // header shrink + back-to-top
  const header = $('header.site'), top = $('.to-top');
  const onScroll = () => {
    header?.classList.toggle('scrolled', scrollY > 40);
    top?.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top?.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.rv').forEach(el => io.observe(el));

  // count-up
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, start = end > 100 ? end - 40 : 0, t0 = performance.now();
    (function f(t) {
      const p = Math.min((t - t0) / 1600, 1);
      el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
    cio.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // services card slider
  const track = $('#track');
  if (track) {
    const cards = [...track.children], dotsEl = $('#sdots');
    let page = 0;
    const per = () => (innerWidth <= 640 ? 1 : innerWidth <= 1024 ? 2 : 3);
    const pages = () => Math.ceil(cards.length / per());
    const render = () => {
      page = Math.max(0, Math.min(page, pages() - 1));
      const w = cards[0].getBoundingClientRect().width + 28;
      track.style.transform = `translateX(${-page * per() * w}px)`;
      dotsEl.innerHTML = '';
      for (let i = 0; i < pages(); i++) {
        const b = document.createElement('button');
        b.className = i === page ? 'on' : '';
        b.setAttribute('aria-label', 'Slide ' + (i + 1));
        b.onclick = () => { page = i; render(); };
        dotsEl.appendChild(b);
      }
    };
    $$('.slider-ctrl button').forEach(b => (b.onclick = () => { page = (page + +b.dataset.dir + pages()) % pages(); render(); }));
    addEventListener('resize', render); render();
  }

  // quote slider
  const qs = $$('.q-slide');
  if (qs.length) {
    const ctrl = $('.q-ctrl'); let i = 0, timer;
    const dots = qs.map((_, k) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Quote ' + (k + 1)); b.onclick = () => go(k); ctrl.appendChild(b); return b; });
    const go = k => { qs[i].classList.remove('on'); dots[i].classList.remove('on'); i = (k + qs.length) % qs.length; qs[i].classList.add('on'); dots[i].classList.add('on'); clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); };
    go(0);
  }

  // forms → open email client (static site, no backend)
  $$('form[data-mailto]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(f), lines = [];
    for (const [k, v] of d) if (v) lines.push(`${k}: ${v}`);
    const subj = d.get('Service') ? `Enquiry: ${d.get('Service')}` : 'Consultation request';
    location.href = `mailto:${f.dataset.mailto}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }));
})();
