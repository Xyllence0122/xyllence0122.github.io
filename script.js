/* =========================================================
   Chao Lin Chen — portfolio scripts
   No external dependencies. Loaded with `defer`, so the DOM
   is ready when this runs.
   Sections:
     1. Hero node-network background (vanilla canvas, no Three.js)
     2. Scroll-driven UI (progress bar, nav, canvas fade)
     3. Scroll reveal + skill pills
     4. Custom cursor + project hover preview
     5. Preloader
     6. Theme toggle
     7. Mobile nav
     8. Site data + admin panel
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* =========================================================
     1. Hero node-network background
     A lightweight 3D point/line network projected onto a 2D
     canvas — replaces the ~600 KB Three.js dependency with a
     few KB of math, same visual.
     ========================================================= */
  var canvas = document.getElementById('hero-canvas');
  var ctx = canvas.getContext('2d');

  var NODE_COUNT = 46;
  var CAMERA_Z = 9;
  var FOV = 55 * Math.PI / 180;

  var nodes = [];
  var edges = [];
  var mouseX = 0, mouseY = 0;
  var scrollYCache = 0;
  var heroVisible = true;
  var colors = { accent: '#6ef0d8', node: '#3a4450', line: '#1d242c' };

  function refreshColors() {
    var cs = getComputedStyle(document.documentElement);
    colors.accent = cs.getPropertyValue('--accent').trim() || colors.accent;
    colors.node = cs.getPropertyValue('--node').trim() || colors.node;
    colors.line = cs.getPropertyValue('--line').trim() || colors.line;
  }
  refreshColors();

  // scatter nodes on a squashed sphere shell
  for (var i = 0; i < NODE_COUNT; i++) {
    var r = 3.6 + Math.random() * 1.4;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(Math.random() * 2 - 1);
    nodes.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta) * 0.7,
      z: r * Math.cos(phi),
      accent: Math.random() < 0.18,
      speed: 0.2 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2
    });
  }

  // connect nearby nodes
  for (var a = 0; a < nodes.length; a++) {
    for (var b = a + 1; b < nodes.length; b++) {
      var dx = nodes[a].x - nodes[b].x;
      var dy = nodes[a].y - nodes[b].y;
      var dz = nodes[a].z - nodes[b].z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.0 && Math.random() < 0.22) {
        edges.push([a, b]);
      }
    }
  }

  var dpr = 1, vw = 0, vh = 0;
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (prefersReducedMotion) drawFrame(0); // keep the static frame in sync
  }

  var projected = new Array(NODE_COUNT);
  function drawFrame(t) {
    var rotY = t * 0.06 + mouseX * 0.4;
    var rotX = 0.15 + mouseY * 0.25;
    var groupY = -scrollYCache * 0.0015;

    var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    var focal = (vh / 2) / Math.tan(FOV / 2);
    var cx2 = vw * 0.62, cy2 = vh / 2; // network sits right of center so it doesn't sit behind the hero text

    ctx.clearRect(0, 0, vw, vh);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var ny = n.y + Math.sin(t * n.speed + n.offset) * 0.12;

      // rotate around Y, then X
      var x1 = n.x * cosY + n.z * sinY;
      var z1 = -n.x * sinY + n.z * cosY;
      var y2 = ny * cosX - z1 * sinX;
      var z2 = ny * sinX + z1 * cosX;
      y2 += groupY;

      var depth = CAMERA_Z - z2;
      var s = focal / depth;
      projected[i] = {
        x: cx2 + x1 * s,
        y: cy2 - y2 * s,
        r: Math.max(0.6, 0.045 * s),
        visible: depth > 0.1
      };
    }

    // lines first, nodes on top
    ctx.strokeStyle = colors.line;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var e = 0; e < edges.length; e++) {
      var p1 = projected[edges[e][0]];
      var p2 = projected[edges[e][1]];
      if (p1.visible && p2.visible) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    for (var j = 0; j < projected.length; j++) {
      var p = projected[j];
      if (!p.visible) continue;
      ctx.fillStyle = nodes[j].accent ? colors.accent : colors.node;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var startTime = performance.now();
  function animate(now) {
    if (heroVisible && !document.hidden) {
      drawFrame((now - startTime) / 1000);
    }
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  if (prefersReducedMotion) {
    drawFrame(0); // static image, no animation loop
  } else {
    // pause rendering while the hero is scrolled far out of view
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }, { rootMargin: '200px' }).observe(document.querySelector('.hero'));
    requestAnimationFrame(animate);
  }

  if (finePointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX / vw - 0.5;
      mouseY = e.clientY / vh - 0.5;
    }, { passive: true });
  }

  /* =========================================================
     2. Scroll-driven UI — one rAF-throttled scroll handler
        (progress bar, nav background, hero canvas fade)
     ========================================================= */
  var progressBar = document.getElementById('scroll-progress');
  var navEl = document.querySelector('nav');
  var heroEl = document.querySelector('.hero');
  var scrollTicking = false;

  function onScrollFrame() {
    scrollTicking = false;
    var doc = document.documentElement;
    scrollYCache = window.scrollY;

    var max = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = (max > 0 ? (scrollYCache / max) * 100 : 0) + '%';

    navEl.classList.toggle('scrolled', scrollYCache > 40);

    var heroHeight = heroEl.offsetHeight || vh;
    canvas.style.opacity = Math.max(0.12, 1 - (scrollYCache / heroHeight) * 0.85);
  }
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });
  onScrollFrame();

  /* =========================================================
     3. Scroll reveal + staggered skill pills
     ========================================================= */
  // "decode" scramble effect for section titles as they reveal
  var SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#';
  function scrambleText(el) {
    if (prefersReducedMotion) return;
    var finalText = el.textContent;
    var totalFrames = Math.max(14, finalText.length * 3);
    var frame = 0;
    (function step() {
      var settled = (frame / totalFrames) * finalText.length * 1.4;
      var out = '';
      for (var i = 0; i < finalText.length; i++) {
        out += i < settled || finalText[i] === ' '
          ? finalText[i]
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame <= totalFrames) requestAnimationFrame(step);
      else el.textContent = finalText;
    })();
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        if (entry.target.classList.contains('eyebrow')) scrambleText(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .eyebrow').forEach(function (el) { io.observe(el); });

  var skillPills = document.querySelectorAll('.skill-pill');
  skillPills.forEach(function (pill, i) {
    pill.style.transitionDelay = (i * 0.06) + 's';
  });
  var skillsWrap = document.querySelector('.skills-groups') || document.querySelector('.skills-wrap');
  if (skillsWrap && skillPills.length) {
    var skillIo = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        skillPills.forEach(function (p) { p.classList.add('in'); });
        skillIo.disconnect();
      }
    }, { threshold: 0.2 });
    skillIo.observe(skillsWrap);
  }

  /* =========================================================
     4. Custom cursor + project hover preview (fine pointers only)
     ========================================================= */
  if (finePointer) {
    var cursorDot = document.getElementById('cursor-dot');
    var cursorRing = document.getElementById('cursor-ring');
    var preview = document.getElementById('project-preview');
    var cx = 0, cy = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top = cy + 'px';
      if (e.target.closest && e.target.closest('.project')) {
        preview.style.left = cx + 'px';
        preview.style.top = cy + 'px';
      }
    }, { passive: true });

    (function cursorLoop() {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(cursorLoop);
    })();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .skill-pill, label')) cursorRing.classList.add('hovering');
      if (e.target.closest('.project')) preview.classList.add('show');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .skill-pill, label')) cursorRing.classList.remove('hovering');
      var el = e.target.closest('.project');
      if (el && !el.contains(e.relatedTarget)) preview.classList.remove('show');
    });
  }

  /* =========================================================
     5. Preloader
     ========================================================= */
  var preloader = document.getElementById('preloader');
  function hidePreloader() { preloader.classList.add('hidden'); }

  if (prefersReducedMotion) {
    hidePreloader();
  } else {
    var pct = document.getElementById('pre-pct');
    var fill = document.getElementById('pre-bar-fill');
    var n = 0;
    var tick = setInterval(function () {
      n = Math.min(100, n + Math.ceil(Math.random() * 22));
      pct.textContent = n;
      fill.style.width = n + '%';
      if (n === 100) {
        clearInterval(tick);
        setTimeout(hidePreloader, 250);
      }
    }, 60);
    // safety: never block the page for more than 2s
    setTimeout(hidePreloader, 2000);
  }

  /* =========================================================
     6. Theme toggle
     ========================================================= */
  var themeCheckbox = document.getElementById('theme-checkbox');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var THEME_KEY = 'clc_theme';

  function applyTheme(theme) {
    var light = theme === 'light';
    if (light) document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    themeCheckbox.checked = light;
    themeCheckbox.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    if (themeMeta) themeMeta.setAttribute('content', light ? '#f3f1ec' : '#0a0d12');
    refreshColors(); // keep the hero canvas palette in sync
    if (prefersReducedMotion) drawFrame(0);
  }

  var storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(storedTheme === 'light' ? 'light' : 'dark');

  themeCheckbox.addEventListener('change', function () {
    var next = themeCheckbox.checked ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });

  /* =========================================================
     6.5 Visitor counter
     GitHub Pages is static, so the count lives on a free
     public counter API (abacus.jasoncameron.dev). Each new
     browser session increments the count once; reloads within
     the same session just read the current value. If the API
     is unreachable the element simply stays hidden.
     ========================================================= */
  var visitorEl = document.getElementById('visitor-counter');
  var visitorNum = document.getElementById('visitor-num');
  if (visitorEl && visitorNum && window.fetch) {
    var VISIT_KEY = 'clc_visit_counted';
    var alreadyCounted = false;
    try { alreadyCounted = sessionStorage.getItem(VISIT_KEY) === '1'; } catch (e) {}

    fetch('https://abacus.jasoncameron.dev/' + (alreadyCounted ? 'get' : 'hit') + '/xyllence0122-github-io/visits')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (typeof data.value !== 'number') return;
        try { sessionStorage.setItem(VISIT_KEY, '1'); } catch (e) {}
        visitorNum.textContent = '#' + String(data.value).padStart(6, '0');
        visitorEl.classList.add('show');
      })
      .catch(function () { /* counter is decorative — fail silently */ });
  }

  /* =========================================================
     6.6 Hero typewriter — cycles through focus areas
     ========================================================= */
  var typedEl = document.getElementById('typed-role');
  var ROLES = ['EMBEDDED SYSTEMS', 'ROBOTICS', 'MACHINE LEARNING', 'COMPUTER VISION', 'NPC · PROGRAMMING CLUB'];
  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = ROLES[0];
    } else {
      (function typeLoop(roleIdx, charIdx, deleting) {
        var word = ROLES[roleIdx];
        typedEl.textContent = word.slice(0, charIdx);
        var delay;
        if (!deleting && charIdx < word.length) {
          charIdx++; delay = 55 + Math.random() * 60;
        } else if (!deleting) {
          deleting = true; delay = 2200; // pause on full word
        } else if (charIdx > 0) {
          charIdx--; delay = 28;
        } else {
          deleting = false; roleIdx = (roleIdx + 1) % ROLES.length; delay = 400;
        }
        setTimeout(function () { typeLoop(roleIdx, charIdx, deleting); }, delay);
      })(0, 0, false);
    }
  }

  /* =========================================================
     6.7 Scroll spy — highlight the nav link of the section in view
     ========================================================= */
  var spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var spyMap = {};
  spyLinks.forEach(function (link) { spyMap[link.getAttribute('href').slice(1)] = link; });

  var spyIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      spyLinks.forEach(function (l) { l.classList.remove('active'); });
      var link = spyMap[entry.target.id];
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (sec) { spyIo.observe(sec); });

  /* =========================================================
     6.8 GitHub repos — auto-synced into the PROJECTS section
     Repos already listed as featured projects are skipped.
     Cached in sessionStorage to stay well under the 60 req/hr
     unauthenticated API limit. Fails silently to a plain link.
     ========================================================= */
  var GH_USER = 'Xyllence0122';
  var GH_CACHE_KEY = 'clc_gh_cache_v2';
  var GH_CACHE_TTL = 30 * 60 * 1000; // 30 min

  var ghReposEl = document.getElementById('gh-repos');
  var ghFallbackEl = document.getElementById('gh-fallback');
  var ghMoreLabel = document.getElementById('gh-more-label');

  var LANG_COLORS = {
    'Python': '#3572A5', 'C++': '#f34b7d', 'C': '#8f8f8f', 'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6', 'HTML': '#e34c26', 'CSS': '#563d7c',
    'Jupyter Notebook': '#DA5B0B', 'MATLAB': '#e16737', 'Shell': '#89e051'
  };

  function timeAgo(iso) {
    var days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days < 30) return days + 'd ago';
    if (days < 365) return Math.floor(days / 30) + 'mo ago';
    return Math.floor(days / 365) + 'y ago';
  }

  function renderRepos(repos) {
    // footer "site updated" badge, from this site's own repo
    var updEl = document.getElementById('site-updated');
    var siteRepo = repos.filter(function (r) { return /\.github\.io$/i.test(r.name); })[0];
    if (updEl && siteRepo) {
      updEl.textContent = 'SITE UPDATED ' + timeAgo(siteRepo.pushed_at).toUpperCase();
      updEl.hidden = false;
    }

    // skip forks and repos already shown as featured projects
    var featured = {};
    siteData.projects.forEach(function (p) {
      featured[String(p.url || '').toLowerCase().replace(/\/+$/, '')] = true;
    });
    var list = repos.filter(function (r) {
      return !r.fork && !featured[String(r.html_url || '').toLowerCase().replace(/\/+$/, '')];
    }).sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); }).slice(0, 6);

    if (!list.length) {
      ghFallbackEl.innerHTML = '<a href="https://github.com/' + GH_USER + '" target="_blank" rel="noopener">See everything on GitHub →</a>';
      return;
    }

    ghReposEl.innerHTML = list.map(function (r) {
      var lang = r.language || '';
      var dot = lang
        ? '<span><span class="lang-dot" style="background:' + (LANG_COLORS[lang] || 'var(--accent)') + '"></span>' + escapeHtml(lang) + '</span>'
        : '';
      var stars = r.stargazers_count ? '<span>★ ' + r.stargazers_count + '</span>' : '';
      return '<a class="repo-card" href="' + sanitizeUrl(r.html_url) + '" target="_blank" rel="noopener">' +
        '<div class="repo-name">' + escapeHtml(r.name) + '</div>' +
        '<div class="repo-desc">' + escapeHtml(r.description || 'No description yet.') + '</div>' +
        '<div class="repo-meta">' + dot + stars + '<span>UPDATED ' + timeAgo(r.pushed_at).toUpperCase() + '</span></div>' +
        '</a>';
    }).join('');

    ghMoreLabel.hidden = false;
    ghFallbackEl.hidden = true;
  }

  if (ghReposEl && window.fetch) {
    var ghCached = null;
    try {
      var rawCache = sessionStorage.getItem(GH_CACHE_KEY);
      if (rawCache) {
        var parsedCache = JSON.parse(rawCache);
        if (Date.now() - parsedCache.at < GH_CACHE_TTL) ghCached = parsedCache.repos;
      }
    } catch (e) {}

    if (ghCached) {
      // defer one microtask so siteData (defined below) exists before rendering
      Promise.resolve().then(function () { renderRepos(ghCached); });
    } else {
      fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100')
        .then(function (r) {
          if (!r.ok) throw new Error(r.status); return r.json();
        })
        .then(function (raw) {
          // keep only the fields we render so the cache stays small
          var repos = raw.map(function (r) {
            return {
              name: r.name, description: r.description, html_url: r.html_url,
              language: r.language, stargazers_count: r.stargazers_count,
              pushed_at: r.pushed_at, fork: r.fork
            };
          });
          try { sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify({ at: Date.now(), repos: repos })); } catch (e) {}
          renderRepos(repos);
        })
        .catch(function () {
          ghFallbackEl.innerHTML = 'Couldn’t load repos right now. <a href="https://github.com/' + GH_USER + '" target="_blank" rel="noopener">See everything on GitHub →</a>';
        });
    }
  }

  /* =========================================================
     6.9 Back to top + copy email + toast + footer clock
     ========================================================= */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    var btnTicking = false;
    window.addEventListener('scroll', function () {
      if (btnTicking) return;
      btnTicking = true;
      requestAnimationFrame(function () {
        btnTicking = false;
        backToTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
      });
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('EMAIL COPIED — ' + email);
        }).catch(function () { showToast(email); });
      } else {
        showToast(email);
      }
    });
  }

  var clockEl = document.getElementById('local-time');
  if (clockEl) {
    var updateClock = function () {
      try {
        clockEl.textContent = 'TAIPEI ' + new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Taipei'
        }).format(new Date());
      } catch (e) {}
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  // console easter egg for fellow devs
  try {
    console.log(
      '%c CLC.DEV %c hey, fellow dev \u{1F44B} — source at github.com/' + GH_USER,
      'background:#6ef0d8;color:#0a0d12;font-weight:bold;padding:4px 8px;border-radius:3px;',
      'color:#6ef0d8;padding:4px 0;'
    );
  } catch (e) {}

  /* =========================================================
     7. Mobile nav
     ========================================================= */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* =========================================================
     8. Site data + admin panel
     Edit DEFAULT_DATA below to permanently change the content
     shipped to every visitor. The admin panel only changes
     what's stored in YOUR browser (localStorage) — use it to
     draft changes, then copy the values into DEFAULT_DATA and
     push the file to publish them for everyone.

     NOTE: this is a convenience gate, not real security —
     everything on a static site is public. The password is
     stored as a SHA-256 hash so it isn't readable in the
     source. To change it, run in the browser console:
       crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
         .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
     and paste the result into ADMIN_PASSWORD_HASH.
     ========================================================= */
  var ADMIN_PASSWORD_HASH = '8274b7ababf1ac99fbed6eb0e7e57bae9b7e8f8e6f326435b468dce244c129d7';

  var DEFAULT_DATA = {
    resumeUrl: '',
    contacts: [
      { label: 'EMAIL', text: 'mmmax.tw@gmail.com', url: 'mailto:mmmax.tw@gmail.com' },
      { label: 'DISCORD', text: 'max.tw', url: '#' },
      { label: 'GITHUB', text: 'Xyllence0122', url: 'https://github.com/Xyllence0122' },
      { label: 'LINKEDIN', text: 'Chao Lin Chen', url: 'https://www.linkedin.com/in/%E5%85%86%E8%87%A8-%E9%99%B3-12a1a838b/' }
    ],
    projects: [
      {
        name: 'Autonomous Mecanum Tracking Robot',
        tags: 'RASPBERRY PI 5 · ARDUINO MEGA 2560 · PYTHON',
        desc: 'Omnidirectional Mecanum chassis with real-time vision tracking for autonomous navigation and target following. Final project for a Python course.',
        url: 'https://github.com/Xyllence0122/Autonomous-Mecanum-Tracking-Robot'
      }
    ]
  };

  var STORAGE_KEY = 'clc_site_data_v1';

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // only allow safe link schemes; blocks javascript: and data: URLs
  function sanitizeUrl(url) {
    var u = String(url || '').trim();
    if (!u || u === '#') return '#';
    if (/^(https?:|mailto:|tel:|#|\/)/i.test(u)) return escapeHtml(u);
    return '#';
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_DATA);
      var parsed = JSON.parse(raw);
      return {
        resumeUrl: typeof parsed.resumeUrl === 'string' ? parsed.resumeUrl : '',
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : structuredClone(DEFAULT_DATA.contacts),
        projects: Array.isArray(parsed.projects) ? parsed.projects : structuredClone(DEFAULT_DATA.projects)
      };
    } catch (e) {
      return structuredClone(DEFAULT_DATA);
    }
  }

  function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  var siteData = loadData();

  function renderSite() {
    var resumeLink = document.getElementById('resume-link');
    if (siteData.resumeUrl) {
      resumeLink.href = siteData.resumeUrl;
      resumeLink.hidden = false;
    } else {
      resumeLink.hidden = true;
    }

    document.getElementById('contact-container').innerHTML = siteData.contacts.map(function (c) {
      return '<div class="contact-item">' +
        '<span>' + escapeHtml(c.label) + '</span>' +
        '<a href="' + sanitizeUrl(c.url) + '" target="_blank" rel="noopener">' + escapeHtml(c.text) + '</a>' +
        '</div>';
    }).join('');

    document.getElementById('projects-container').innerHTML = siteData.projects.map(function (p, i) {
      return '<a class="project" href="' + sanitizeUrl(p.url) + '" target="_blank" rel="noopener">' +
        '<div class="project-index">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div>' +
        '<div class="project-name">' + escapeHtml(p.name) + '</div>' +
        '<div class="project-tags">' + escapeHtml(p.tags || '') + '</div>' +
        '</div>' +
        '<div class="project-desc">' + escapeHtml(p.desc || '') + '</div>' +
        '<div class="project-arrow" aria-hidden="true">↗</div>' +
        '</a>';
    }).join('');
  }

  renderSite();

  // ---- admin panel ----
  var overlay = document.getElementById('admin-overlay');
  var gate = document.getElementById('admin-gate');
  var content = document.getElementById('admin-content');
  var passwordInput = document.getElementById('admin-password');
  var unlocked = false;

  function openOverlay() {
    overlay.classList.add('open');
    if (unlocked) openAdminContent();
    else passwordInput.focus();
  }
  function closeOverlay() { overlay.classList.remove('open'); }

  document.getElementById('admin-trigger').addEventListener('click', openOverlay);
  document.getElementById('admin-close').addEventListener('click', closeOverlay);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });

  function sha256Hex(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (x) {
        return x.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  function tryLogin() {
    sha256Hex(passwordInput.value).then(function (hash) {
      if (hash === ADMIN_PASSWORD_HASH) {
        unlocked = true;
        document.getElementById('admin-error').style.display = 'none';
        openAdminContent();
      } else {
        document.getElementById('admin-error').style.display = 'block';
      }
    });
  }

  document.getElementById('admin-login').addEventListener('click', tryLogin);
  passwordInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });

  function openAdminContent() {
    gate.style.display = 'none';
    content.style.display = 'block';
    document.getElementById('resume-input').value = siteData.resumeUrl;
    renderAdminLists();
  }

  document.getElementById('admin-logout').addEventListener('click', function () {
    unlocked = false;
    gate.style.display = 'block';
    content.style.display = 'none';
    passwordInput.value = '';
  });

  function renderAdminLists() {
    var cList = document.getElementById('admin-contact-list');
    cList.innerHTML = siteData.contacts.map(function (c, i) {
      return '<div class="admin-list-item">' +
        '<span>' + escapeHtml(c.label) + ' — ' + escapeHtml(c.text) + '</span>' +
        '<button class="admin-btn danger" data-remove-contact="' + i + '">Remove</button>' +
        '</div>';
    }).join('');
    cList.querySelectorAll('[data-remove-contact]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        siteData.contacts.splice(Number(btn.dataset.removeContact), 1);
        saveData(siteData); renderSite(); renderAdminLists();
      });
    });

    var pList = document.getElementById('admin-project-list');
    pList.innerHTML = siteData.projects.map(function (p, i) {
      return '<div class="admin-list-item">' +
        '<span>' + escapeHtml(p.name) + '</span>' +
        '<button class="admin-btn danger" data-remove-project="' + i + '">Remove</button>' +
        '</div>';
    }).join('');
    pList.querySelectorAll('[data-remove-project]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        siteData.projects.splice(Number(btn.dataset.removeProject), 1);
        saveData(siteData); renderSite(); renderAdminLists();
      });
    });
  }

  document.getElementById('resume-save').addEventListener('click', function () {
    siteData.resumeUrl = document.getElementById('resume-input').value.trim();
    saveData(siteData); renderSite();
  });

  document.getElementById('contact-add').addEventListener('click', function () {
    var label = document.getElementById('contact-label').value.trim();
    var text = document.getElementById('contact-text').value.trim();
    var url = document.getElementById('contact-url').value.trim();
    if (!label || !text || !url) return;
    siteData.contacts.push({ label: label.toUpperCase(), text: text, url: url });
    saveData(siteData); renderSite(); renderAdminLists();
    ['contact-label', 'contact-text', 'contact-url'].forEach(function (id) {
      document.getElementById(id).value = '';
    });
  });

  document.getElementById('project-add').addEventListener('click', function () {
    var name = document.getElementById('project-name').value.trim();
    var tags = document.getElementById('project-tags').value.trim();
    var desc = document.getElementById('project-desc').value.trim();
    var url = document.getElementById('project-url').value.trim();
    if (!name) return;
    siteData.projects.push({ name: name, tags: tags, desc: desc, url: url });
    saveData(siteData); renderSite(); renderAdminLists();
    ['project-name', 'project-tags', 'project-desc', 'project-url'].forEach(function (id) {
      document.getElementById(id).value = '';
    });
  });

  document.getElementById('admin-reset').addEventListener('click', function () {
    if (!confirm('Reset all content back to the default values?')) return;
    siteData = structuredClone(DEFAULT_DATA);
    saveData(siteData); renderSite(); renderAdminLists();
    document.getElementById('resume-input').value = siteData.resumeUrl;
  });

  /* =========================================================
     9. Terminal easter egg
     Open with the ` (backtick) key or the ">_ TERMINAL" button
     in the footer. Type "help" for the command list.
     ========================================================= */
  var termOverlay = document.getElementById('terminal');
  var termBody = document.getElementById('term-body');
  var termInput = document.getElementById('term-input');
  var termForm = document.getElementById('term-form');

  if (termOverlay && termBody && termInput && termForm) {
    var termBooted = false;

    var termPrint = function (text, cls) {
      var line = document.createElement('div');
      if (cls) line.className = cls;
      line.textContent = text;
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
    };

    var openTerm = function () {
      termOverlay.hidden = false;
      if (!termBooted) {
        termBooted = true;
        termPrint('CLC.DEV terminal — welcome, visitor.', 't-muted');
        termPrint('Type "help" to see what I can do.', 't-muted');
      }
      termInput.focus();
    };
    var closeTerm = function () { termOverlay.hidden = true; };

    var TERM_CMDS = {
      help: function () {
        termPrint('available commands:');
        termPrint('  about      who is Max?');
        termPrint('  projects   list featured projects');
        termPrint('  skills     list skills');
        termPrint('  contact    how to reach me');
        termPrint('  github     my GitHub profile');
        termPrint('  theme      toggle light / dark');
        termPrint('  whoami     who are YOU?');
        termPrint('  date       current date & time');
        termPrint('  clear      clear the screen');
        termPrint('  exit       close the terminal');
      },
      about: function () {
        termPrint('Chao Lin Chen (Max) — Intelligent Automation Engineering @ NTUT.');
        termPrint('President of NPC (NTUT Programming Club).');
        termPrint('Building embedded robots and edge-computing systems.');
      },
      projects: function () {
        siteData.projects.forEach(function (p, i) {
          termPrint(String(i + 1).padStart(2, '0') + '  ' + p.name);
          if (p.url) termPrint('    ' + p.url, 't-muted');
        });
        termPrint('more on github.com/' + GH_USER, 't-muted');
      },
      skills: function () {
        var pills = Array.prototype.map.call(document.querySelectorAll('.skill-pill'), function (el) {
          return el.textContent;
        });
        termPrint(pills.join(' · '));
      },
      contact: function () {
        siteData.contacts.forEach(function (c) {
          termPrint(c.label.padEnd(10) + c.text);
        });
      },
      github: function () { termPrint('https://github.com/' + GH_USER); },
      theme: function () {
        themeCheckbox.click();
        termPrint('theme switched to ' + (themeCheckbox.checked ? 'light' : 'dark') + '.');
      },
      whoami: function () { termPrint('guest — hi there, thanks for poking around.'); },
      date: function () { termPrint(new Date().toString()); },
      clear: function () { termBody.innerHTML = ''; },
      sudo: function () { termPrint('nice try.'); },
      exit: function () { closeTerm(); }
    };
    TERM_CMDS.quit = TERM_CMDS.exit;
    TERM_CMDS.ls = TERM_CMDS.projects;

    termForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = termInput.value.trim();
      termInput.value = '';
      if (!raw) return;
      termPrint('max@clc.dev:~$ ' + raw, 't-cmd');
      var cmd = raw.toLowerCase().split(/\s+/)[0];
      if (TERM_CMDS[cmd]) TERM_CMDS[cmd]();
      else termPrint('command not found: ' + cmd + ' — try "help"');
    });

    document.getElementById('term-open').addEventListener('click', openTerm);
    document.getElementById('term-close').addEventListener('click', closeTerm);
    termOverlay.addEventListener('click', function (e) { if (e.target === termOverlay) closeTerm(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        if (termOverlay.hidden) openTerm(); else closeTerm();
      }
      if (e.key === 'Escape' && !termOverlay.hidden) closeTerm();
    });
  }
})();
