// ---- Hero 3D node network ----
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0,0,9);
 
  function resize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
 
  // node network group (represents networked robotics / embedded nodes)
  const group = new THREE.Group();
  scene.add(group);
 
  const NODE_COUNT = 46;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const nodeMatAccent = new THREE.MeshBasicMaterial({ color: 0x6ef0d8 });
  const nodeMatMuted = new THREE.MeshBasicMaterial({ color: 0x3a4450 });
 
  for(let i=0;i<NODE_COUNT;i++){
    const isAccent = Math.random() < 0.18;
    const mesh = new THREE.Mesh(nodeGeo, isAccent ? nodeMatAccent : nodeMatMuted);
    const r = 3.6 + Math.random()*1.4;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos((Math.random()*2)-1);
    mesh.position.set(
      r*Math.sin(phi)*Math.cos(theta),
      r*Math.sin(phi)*Math.sin(theta)*0.7,
      r*Math.cos(phi)
    );
    mesh.userData.basePos = mesh.position.clone();
    mesh.userData.speed = 0.2 + Math.random()*0.4;
    mesh.userData.offset = Math.random()*Math.PI*2;
    group.add(mesh);
    nodes.push(mesh);
  }
 
  // connecting lines between nearby nodes
  const lineMat = new THREE.LineBasicMaterial({ color: 0x1d242c, transparent:true, opacity:0.7 });
  const linePositions = [];
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      if(nodes[i].position.distanceTo(nodes[j].position) < 2.0 && Math.random() < 0.22){
        linePositions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
        linePositions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);
 
  group.rotation.x = 0.15;
 
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e)=>{
    mouseX = (e.clientX/window.innerWidth - 0.5);
    mouseY = (e.clientY/window.innerHeight - 0.5);
  });
 
  let scrollY = 0;
  window.addEventListener('scroll', ()=>{ scrollY = window.scrollY; });
 
  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    group.rotation.y = t*0.06 + mouseX*0.4;
    group.rotation.x = 0.15 + mouseY*0.25;
    group.position.y = -scrollY*0.0015;
 
    nodes.forEach(n=>{
      const b = n.userData.basePos;
      n.position.y = b.y + Math.sin(t*n.userData.speed + n.userData.offset)*0.12;
    });
 
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
 
  // ---- scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal, .eyebrow');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
  }, { threshold:0.15 });
  revealEls.forEach(el=>io.observe(el));
 
  // staggered skill pill reveal
  const skillPills = document.querySelectorAll('.skill-pill');
  skillPills.forEach((pill, i) => { pill.style.transitionDelay = `${i * 0.06}s`; });
  const skillIo = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){
      skillPills.forEach(p => p.classList.add('in'));
      skillIo.disconnect();
    }});
  }, { threshold:0.2 });
  if(skillPills.length) skillIo.observe(document.querySelector('.skills-wrap'));
 
  // ---- custom magnetic cursor ----
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let cx = 0, cy = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    cx = e.clientX; cy = e.clientY;
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top = cy + 'px';
  });
  function cursorLoop(){
    rx += (cx - rx) * 0.18;
    ry += (cy - ry) * 0.18;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  document.addEventListener('mouseover', (e) => {
    if(e.target.closest('a, button, .skill-pill, #admin-trigger')) cursorRing.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if(e.target.closest('a, button, .skill-pill, #admin-trigger')) cursorRing.classList.remove('hovering');
  });
 
  // (magnetic-pull hover effect removed — project rows now stay still on hover)
 
  // ---- scroll progress bar ----
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progressBar.style.width = (max > 0 ? (scrolled/max)*100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();
 
  // fade the background canvas as the hero scrolls out of view
  const heroEl = document.querySelector('.hero');
  function updateCanvasOpacity(){
    const heroHeight = heroEl.offsetHeight || window.innerHeight;
    const fade = Math.max(0.12, 1 - (window.scrollY / heroHeight) * 0.85);
    canvas.style.opacity = fade;
  }
  window.addEventListener('scroll', updateCanvasOpacity);
  updateCanvasOpacity();
 
  // ---- preloader ----
  window.addEventListener('load', () => {
    const pct = document.getElementById('pre-pct');
    const fill = document.getElementById('pre-bar-fill');
    const preloader = document.getElementById('preloader');
    let n = 0;
    const tick = setInterval(() => {
      n += Math.ceil(Math.random()*18);
      if(n >= 100){ n = 100; clearInterval(tick); }
      pct.textContent = n;
      fill.style.width = n + '%';
      if(n === 100){
        setTimeout(() => preloader.classList.add('hidden'), 280);
      }
    }, 70);
  });
  // safety: never let the preloader block the page for more than 2.5s
  setTimeout(() => document.getElementById('preloader')?.classList.add('hidden'), 2500);
 
  // ---- theme toggle (sliding switch) ----
  const themeCheckbox = document.getElementById('theme-checkbox');
  const THEME_KEY = 'clc_theme';
  function applyTheme(theme){
    if(theme === 'light'){
      document.documentElement.setAttribute('data-theme','light');
      themeCheckbox.checked = true;
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeCheckbox.checked = false;
    }
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
  themeCheckbox.addEventListener('change', () => {
    const next = themeCheckbox.checked ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
 
  // ---- nav background on scroll ----
  const navEl = document.querySelector('nav');
  function updateNav(){
    if(window.scrollY > 40) navEl.classList.add('scrolled');
    else navEl.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateNav);
  updateNav();
 
  // ---- project hover preview tag ----
  const preview = document.getElementById('project-preview');
  document.addEventListener('mousemove', (e) => {
    if(e.target.closest('.project')){
      preview.style.left = e.clientX + 'px';
      preview.style.top = e.clientY + 'px';
    }
  });
  document.addEventListener('mouseover', (e) => {
    if(e.target.closest('.project')) preview.classList.add('show');
  });
  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('.project');
    if(el && !el.contains(e.relatedTarget)) preview.classList.remove('show');
  });
 
/* =========================================================
     SITE DATA + ADMIN PANEL
     Edit DEFAULT_DATA below to permanently change the content
     shipped to every visitor. The admin panel only changes
     what's stored in YOUR browser (localStorage) — it does not
     write back to this file or affect other visitors. Use it
     to draft changes, then copy the values into DEFAULT_DATA
     and re-save the file if you want them live for everyone.
     ========================================================= */
 
  const ADMIN_PASSWORD = "max2026"; // change this to your own password
 
  const DEFAULT_DATA = {
    resumeUrl: "",
    contacts: [
      { label:"EMAIL", text:"mmmax.tw@gmail.com", url:"mailto:mmmax.tw@gmail.com" },
      { label:"DISCORD", text:"max.tw", url:"#" },
      { label:"GITHUB", text:"Xyllence0122", url:"https://github.com/Xyllence0122" },
      { label:"LINKEDIN", text:"Chao Lin Chen", url:"https://www.linkedin.com/in/%E5%85%86%E8%87%A8-%E9%99%B3-12a1a838b/" }
    ],
    projects: [
      {
        name:"Autonomous Mecanum Tracking Robot",
        tags:"RASPBERRY PI 5 · ARDUINO MEGA 2560 · PYTHON",
        desc:"Omnidirectional Mecanum chassis with real-time vision tracking for autonomous navigation and target following. Final project for a Python course.",
        url:"https://github.com/Xyllence0122/Autonomous-Mecanum-Tracking-Robot"
      }
    ]
  };
 
  const STORAGE_KEY = "clc_site_data_v1";
 
  function loadData(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return structuredClone(DEFAULT_DATA);
      const parsed = JSON.parse(raw);
      return {
        resumeUrl: parsed.resumeUrl ?? "",
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : DEFAULT_DATA.contacts,
        projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_DATA.projects
      };
    }catch(e){
      return structuredClone(DEFAULT_DATA);
    }
  }
 
  function saveData(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
 
  let siteData = loadData();
 
  function renderSite(){
    // resume link
    const resumeLink = document.getElementById('resume-link');
    if(siteData.resumeUrl){
      resumeLink.href = siteData.resumeUrl;
      resumeLink.style.display = '';
    } else {
      resumeLink.style.display = 'none';
    }
 
    // contacts
    const contactContainer = document.getElementById('contact-container');
    contactContainer.innerHTML = siteData.contacts.map(c => `
      <div class="contact-item">
        <span>${escapeHtml(c.label)}</span>
        <a href="${escapeAttr(c.url)}" target="_blank" rel="noopener">${escapeHtml(c.text)}</a>
      </div>
    `).join('');
 
    // projects
    const projectContainer = document.getElementById('projects-container');
    projectContainer.innerHTML = siteData.projects.map((p, i) => `
      <a class="project reveal in" href="${escapeAttr(p.url || '#')}" target="_blank" rel="noopener">
        <div class="project-index">${String(i+1).padStart(2,'0')}</div>
        <div>
          <div class="project-name">${escapeHtml(p.name)}</div>
          <div class="project-tags">${escapeHtml(p.tags || '')}</div>
        </div>
        <div class="project-desc">${escapeHtml(p.desc || '')}</div>
        <div class="project-arrow">↗</div>
      </a>
    `).join('');
  }
 
  function escapeHtml(str){
    return (str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function escapeAttr(str){ return escapeHtml(str); }
 
  renderSite();
 
  // ---- admin panel ----
  const overlay = document.getElementById('admin-overlay');
  const gate = document.getElementById('admin-gate');
  const content = document.getElementById('admin-content');
  let unlocked = false;
 
  document.getElementById('admin-trigger').addEventListener('click', () => {
    overlay.classList.add('open');
    if(unlocked){ openAdminContent(); }
  });
  document.getElementById('admin-close').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.classList.remove('open'); });
 
  document.getElementById('admin-login').addEventListener('click', tryLogin);
  document.getElementById('admin-password').addEventListener('keydown', (e) => { if(e.key === 'Enter') tryLogin(); });
 
  function tryLogin(){
    const val = document.getElementById('admin-password').value;
    if(val === ADMIN_PASSWORD){
      unlocked = true;
      document.getElementById('admin-error').style.display = 'none';
      openAdminContent();
    } else {
      document.getElementById('admin-error').style.display = 'block';
    }
  }
 
  function openAdminContent(){
    gate.style.display = 'none';
    content.style.display = 'block';
    document.getElementById('resume-input').value = siteData.resumeUrl;
    renderAdminLists();
  }
 
  document.getElementById('admin-logout').addEventListener('click', () => {
    unlocked = false;
    gate.style.display = 'block';
    content.style.display = 'none';
    document.getElementById('admin-password').value = '';
  });
 
  function renderAdminLists(){
    const cList = document.getElementById('admin-contact-list');
    cList.innerHTML = siteData.contacts.map((c, i) => `
      <div class="admin-list-item">
        <span>${escapeHtml(c.label)} — ${escapeHtml(c.text)}</span>
        <button class="admin-btn danger" data-remove-contact="${i}">Remove</button>
      </div>
    `).join('');
    cList.querySelectorAll('[data-remove-contact]').forEach(btn => {
      btn.addEventListener('click', () => {
        siteData.contacts.splice(Number(btn.dataset.removeContact), 1);
        saveData(siteData); renderSite(); renderAdminLists();
      });
    });
 
    const pList = document.getElementById('admin-project-list');
    pList.innerHTML = siteData.projects.map((p, i) => `
      <div class="admin-list-item">
        <span>${escapeHtml(p.name)}</span>
        <button class="admin-btn danger" data-remove-project="${i}">Remove</button>
      </div>
    `).join('');
    pList.querySelectorAll('[data-remove-project]').forEach(btn => {
      btn.addEventListener('click', () => {
        siteData.projects.splice(Number(btn.dataset.removeProject), 1);
        saveData(siteData); renderSite(); renderAdminLists();
      });
    });
  }
 
  document.getElementById('resume-save').addEventListener('click', () => {
    siteData.resumeUrl = document.getElementById('resume-input').value.trim();
    saveData(siteData); renderSite();
  });
 
  document.getElementById('contact-add').addEventListener('click', () => {
    const label = document.getElementById('contact-label').value.trim();
    const text = document.getElementById('contact-text').value.trim();
    const url = document.getElementById('contact-url').value.trim();
    if(!label || !text || !url) return;
    siteData.contacts.push({ label: label.toUpperCase(), text, url });
    saveData(siteData); renderSite(); renderAdminLists();
    document.getElementById('contact-label').value = '';
    document.getElementById('contact-text').value = '';
    document.getElementById('contact-url').value = '';
  });
 
  document.getElementById('project-add').addEventListener('click', () => {
    const name = document.getElementById('project-name').value.trim();
    const tags = document.getElementById('project-tags').value.trim();
    const desc = document.getElementById('project-desc').value.trim();
    const url = document.getElementById('project-url').value.trim();
    if(!name) return;
    siteData.projects.push({ name, tags, desc, url });
    saveData(siteData); renderSite(); renderAdminLists();
    document.getElementById('project-name').value = '';
    document.getElementById('project-tags').value = '';
    document.getElementById('project-desc').value = '';
    document.getElementById('project-url').value = '';
  });
 
  document.getElementById('admin-reset').addEventListener('click', () => {
    if(!confirm('Reset all content back to the default values?')) return;
    siteData = structuredClone(DEFAULT_DATA);
    saveData(siteData); renderSite(); renderAdminLists();
    document.getElementById('resume-input').value = siteData.resumeUrl;
  });
 
