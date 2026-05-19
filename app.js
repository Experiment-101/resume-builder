/* ============================================================
   ResumeAI Pro — app.js
   AI Resume Builder with ATS Scoring
   ============================================================ */

/* ---------- ANALYTICS (localStorage) ---------- */
function initAnalytics() {
  // Track visitors
  const visits = parseInt(localStorage.getItem('rai_visits') || '0') + 1;
  localStorage.setItem('rai_visits', visits);

  const resumes = parseInt(localStorage.getItem('rai_resumes') || '0');

  updateStatDisplays(visits, resumes);
  animateCounters();
}

function updateStatDisplays(visits, resumes) {
  ['nav-visitors','h-visitors'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = visits.toLocaleString();
  });
  ['nav-resumes','h-resumes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = resumes.toLocaleString();
  });
}

function incrementResumeCount() {
  const n = parseInt(localStorage.getItem('rai_resumes') || '0') + 1;
  localStorage.setItem('rai_resumes', n);
  const visits = parseInt(localStorage.getItem('rai_visits') || '1');
  updateStatDisplays(visits, n);
  showToast('🎉 Resume created! You\'re one of ' + n + ' people to build with ResumeAI Pro!');
}

function animateCounters() {
  const visits = parseInt(localStorage.getItem('rai_visits') || '0');
  const resumes = parseInt(localStorage.getItem('rai_resumes') || '0');
  animateNum('h-visitors', visits);
  animateNum('h-resumes', resumes);
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 30);
}

/* ---------- STEP NAVIGATION ---------- */
let currentStep = 1;
const totalSteps = 5;

function nextStep(n) {
  document.getElementById(`step-${currentStep}`)?.classList.remove('active');
  document.querySelectorAll('.ps').forEach((el, i) => {
    if (i < n - 1) el.classList.add('done');
    el.classList.toggle('active', i === n - 1);
  });
  currentStep = n;
  document.getElementById(`step-${currentStep}`)?.classList.add('active');
  document.getElementById('progressFill').style.width = `${(n / totalSteps) * 100}%`;
  updatePreview();
  document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToBuilder() {
  document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
}

function showDemo() {
  showToast('💡 Fill in the form on the left and watch the live preview update!');
}

/* ---------- DYNAMIC ENTRIES ---------- */
let expCount = 0, eduCount = 0, achCount = 0, projCount = 0, certCount = 0;

function addExperience() {
  const id = ++expCount;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `exp-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('exp-${id}')"><i class="fa fa-times"></i></button>
    <div class="form-grid">
      <div class="field"><label>Job Title</label>
        <input type="text" placeholder="e.g. Software Engineer" oninput="updatePreview()" data-exp="${id}" data-field="title"/></div>
      <div class="field"><label>Company Name</label>
        <input type="text" placeholder="e.g. Google India" oninput="updatePreview()" data-exp="${id}" data-field="company"/></div>
      <div class="field"><label>Start Date</label>
        <input type="month" oninput="updatePreview()" data-exp="${id}" data-field="start"/></div>
      <div class="field"><label>End Date</label>
        <input type="month" placeholder="Present" oninput="updatePreview()" data-exp="${id}" data-field="end"/></div>
      <div class="field full"><label>Location</label>
        <input type="text" placeholder="Mumbai, India / Remote" oninput="updatePreview()" data-exp="${id}" data-field="loc"/></div>
      <div class="field full"><label>Key Responsibilities & Achievements</label>
        <textarea rows="4" placeholder="• Built X that resulted in Y% improvement&#10;• Led team of N engineers to deliver Z&#10;• Reduced latency by X% using Y technology" oninput="updatePreview()" data-exp="${id}" data-field="desc"></textarea>
        <button class="ai-btn" onclick="aiGenerateExp(${id})"><i class="fa fa-robot"></i> AI Write Bullet Points</button>
      </div>
    </div>`;
  document.getElementById('exp-list').appendChild(div);
}

function addEducation() {
  const id = ++eduCount;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `edu-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('edu-${id}')"><i class="fa fa-times"></i></button>
    <div class="form-grid">
      <div class="field full"><label>Degree / Course</label>
        <input type="text" placeholder="e.g. B.Tech Computer Science" oninput="updatePreview()" data-edu="${id}" data-field="degree"/></div>
      <div class="field full"><label>Institution Name</label>
        <input type="text" placeholder="e.g. IIT Bombay" oninput="updatePreview()" data-edu="${id}" data-field="school"/></div>
      <div class="field"><label>Start Year</label>
        <input type="text" placeholder="2019" oninput="updatePreview()" data-edu="${id}" data-field="start"/></div>
      <div class="field"><label>End Year</label>
        <input type="text" placeholder="2023" oninput="updatePreview()" data-edu="${id}" data-field="end"/></div>
      <div class="field"><label>CGPA / Percentage</label>
        <input type="text" placeholder="9.2 CGPA / 85%" oninput="updatePreview()" data-edu="${id}" data-field="grade"/></div>
      <div class="field"><label>Location</label>
        <input type="text" placeholder="Mumbai, India" oninput="updatePreview()" data-edu="${id}" data-field="loc"/></div>
    </div>`;
  document.getElementById('edu-list').appendChild(div);
}

function addAchievement() {
  const id = ++achCount;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `ach-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('ach-${id}')"><i class="fa fa-times"></i></button>
    <div class="field full">
      <label>Achievement</label>
      <input type="text" placeholder="e.g. Won 1st place at HackIndia 2024 among 2000+ participants" oninput="updatePreview()" data-ach="${id}" data-field="text"/>
    </div>`;
  document.getElementById('ach-list').appendChild(div);
}

function addProject() {
  const id = ++projCount;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `proj-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('proj-${id}')"><i class="fa fa-times"></i></button>
    <div class="form-grid">
      <div class="field"><label>Project Name</label>
        <input type="text" placeholder="e.g. AI Resume Builder" oninput="updatePreview()" data-proj="${id}" data-field="name"/></div>
      <div class="field"><label>Tech Stack</label>
        <input type="text" placeholder="React, Node.js, MongoDB" oninput="updatePreview()" data-proj="${id}" data-field="tech"/></div>
      <div class="field full"><label>GitHub / Live Link</label>
        <input type="url" placeholder="github.com/you/project" oninput="updatePreview()" data-proj="${id}" data-field="link"/></div>
      <div class="field full"><label>Description</label>
        <textarea rows="3" placeholder="Describe what it does, impact, key features..." oninput="updatePreview()" data-proj="${id}" data-field="desc"></textarea>
      </div>
    </div>`;
  document.getElementById('proj-list').appendChild(div);
}

function addCertificate() {
  const id = ++certCount;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `cert-${id}`;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('cert-${id}')"><i class="fa fa-times"></i></button>
    <div class="form-grid">
      <div class="field"><label>Certificate Name</label>
        <input type="text" placeholder="AWS Solutions Architect" oninput="updatePreview()" data-cert="${id}" data-field="name"/></div>
      <div class="field"><label>Issuing Organization</label>
        <input type="text" placeholder="Amazon Web Services" oninput="updatePreview()" data-cert="${id}" data-field="org"/></div>
      <div class="field"><label>Date Issued</label>
        <input type="month" oninput="updatePreview()" data-cert="${id}" data-field="date"/></div>
      <div class="field"><label>Credential ID</label>
        <input type="text" placeholder="ABC-123-XYZ" oninput="updatePreview()" data-cert="${id}" data-field="id"/></div>
    </div>`;
  document.getElementById('cert-list').appendChild(div);
}

function removeEntry(id) {
  document.getElementById(id)?.remove();
  updatePreview();
}

/* ---------- DATA COLLECTION ---------- */
function collectData() {
  // Personal
  const personal = {
    name:      val('fullName'),
    dob:       val('dob'),
    nationality: val('nationality'),
    email:     val('email'),
    phone:     val('phone'),
    linkedin:  val('linkedin'),
    github:    val('github'),
    location:  val('location'),
    title:     val('jobTitle'),
    summary:   val('summary'),
  };

  // Skills
  const skills = {
    langs:     val('prog-langs'),
    frameworks:val('frameworks'),
    tools:     val('tools'),
    databases: val('databases'),
    soft:      val('soft-skills'),
    languages: val('languages'),
  };

  // Experience
  const experience = [];
  document.querySelectorAll('[data-exp]').forEach(el => {
    const id = el.dataset.exp;
    if (!experience[id]) experience[id] = {};
    experience[id][el.dataset.field] = el.value;
  });

  // Education
  const education = [];
  document.querySelectorAll('[data-edu]').forEach(el => {
    const id = el.dataset.edu;
    if (!education[id]) education[id] = {};
    education[id][el.dataset.field] = el.value;
  });

  // Achievements
  const achievements = [];
  document.querySelectorAll('[data-ach]').forEach(el => {
    if (el.value) achievements.push(el.value);
  });

  // Projects
  const projects = [];
  document.querySelectorAll('[data-proj]').forEach(el => {
    const id = el.dataset.proj;
    if (!projects[id]) projects[id] = {};
    projects[id][el.dataset.field] = el.value;
  });

  // Certificates
  const certificates = [];
  document.querySelectorAll('[data-cert]').forEach(el => {
    const id = el.dataset.cert;
    if (!certificates[id]) certificates[id] = {};
    certificates[id][el.dataset.field] = el.value;
  });

  const hobbies = val('hobbies');

  return { personal, skills, experience: experience.filter(Boolean), education: education.filter(Boolean), achievements, projects: projects.filter(Boolean), certificates: certificates.filter(Boolean), hobbies };
}

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

/* ---------- TEMPLATES ---------- */
let currentTemplate = 'clean';

function changeTemplate(t) {
  currentTemplate = t;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tmpl-${t}`)?.classList.add('active');
  updatePreview();
}

function formatDate(d) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m)-1]} ${y}`;
}

function skillTags(str, cls) {
  if (!str) return '';
  return str.split(',').map(s => s.trim()).filter(Boolean)
    .map(s => `<span class="${cls}">${s}</span>`).join('');
}

function buildCleanTemplate(d) {
  const { personal: p, skills: sk, experience, education, achievements, projects, certificates, hobbies } = d;

  const expHTML = experience.map(e => !e.title && !e.company ? '' : `
    <div class="r-item">
      <div class="r-item-head">
        <span class="r-item-title">${e.title || ''} ${e.company ? `— ${e.company}` : ''}</span>
        <span class="r-item-date">${formatDate(e.start)} ${e.end ? '– ' + formatDate(e.end) : e.start ? '– Present' : ''}</span>
      </div>
      ${e.loc ? `<div class="r-item-sub">${e.loc}</div>` : ''}
      ${e.desc ? `<div class="r-item-desc"><ul>${e.desc.split('\n').filter(Boolean).map(l => `<li>${l.replace(/^[•\-\*]\s*/,'')}</li>`).join('')}</ul></div>` : ''}
    </div>`).join('');

  const eduHTML = education.map(e => !e.degree && !e.school ? '' : `
    <div class="r-item">
      <div class="r-item-head">
        <span class="r-item-title">${e.degree || ''}</span>
        <span class="r-item-date">${e.start || ''}${e.end ? ' – ' + e.end : ''}</span>
      </div>
      <div class="r-item-sub">${e.school || ''} ${e.loc ? `| ${e.loc}` : ''}</div>
      ${e.grade ? `<div class="r-item-desc">${e.grade}</div>` : ''}
    </div>`).join('');

  const projHTML = projects.map(pr => !pr.name ? '' : `
    <div class="r-item">
      <div class="r-item-head">
        <span class="r-item-title">${pr.name}</span>
        ${pr.link ? `<a href="${pr.link}" style="font-size:0.7rem;color:#2563eb;">Link</a>` : ''}
      </div>
      ${pr.tech ? `<div class="r-item-sub">Stack: ${pr.tech}</div>` : ''}
      ${pr.desc ? `<div class="r-item-desc">${pr.desc}</div>` : ''}
    </div>`).join('');

  const certHTML = certificates.map(c => !c.name ? '' : `
    <div class="r-item">
      <div class="r-item-head">
        <span class="r-item-title">${c.name}</span>
        <span class="r-item-date">${formatDate(c.date)}</span>
      </div>
      ${c.org ? `<div class="r-item-sub">${c.org}</div>` : ''}
      ${c.id ? `<div class="r-item-desc">ID: ${c.id}</div>` : ''}
    </div>`).join('');

  const achHTML = achievements.filter(Boolean).map(a => `<div class="r-item"><div class="r-item-desc">✦ ${a}</div></div>`).join('');

  const allSkills = [sk.langs, sk.frameworks, sk.tools, sk.databases].filter(Boolean).join(', ');

  return `
  <div class="tmpl-clean">
    <div class="r-header">
      <div class="r-name">${p.name || 'Your Name'}</div>
      <div class="r-title">${p.title || 'Professional Title'}</div>
      <div class="r-contact">
        ${p.email ? `<span>✉ ${p.email}</span>` : ''}
        ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        ${p.location ? `<span>📍 ${p.location}</span>` : ''}
        ${p.linkedin ? `<span>🔗 ${p.linkedin}</span>` : ''}
        ${p.github ? `<span>💻 ${p.github}</span>` : ''}
      </div>
    </div>
    <div class="r-body">
      <div class="r-main">
        ${p.summary ? `<div class="r-summary">${p.summary}</div>` : ''}
        ${expHTML ? `<div class="r-section"><div class="r-section-title">Work Experience</div>${expHTML}</div>` : ''}
        ${projHTML ? `<div class="r-section"><div class="r-section-title">Projects</div>${projHTML}</div>` : ''}
        ${achHTML ? `<div class="r-section"><div class="r-section-title">Achievements</div>${achHTML}</div>` : ''}
      </div>
      <div class="r-side">
        ${eduHTML ? `<div class="r-section"><div class="r-section-title">Education</div>${eduHTML}</div>` : ''}
        ${allSkills ? `<div class="r-section"><div class="r-section-title">Technical Skills</div><div>${skillTags(allSkills, 'skill-tag')}</div></div>` : ''}
        ${sk.soft ? `<div class="r-section"><div class="r-section-title">Soft Skills</div><div>${skillTags(sk.soft, 'skill-tag')}</div></div>` : ''}
        ${sk.languages ? `<div class="r-section"><div class="r-section-title">Languages</div><div>${skillTags(sk.languages, 'skill-tag')}</div></div>` : ''}
        ${certHTML ? `<div class="r-section"><div class="r-section-title">Certifications</div>${certHTML}</div>` : ''}
        ${p.dob || p.nationality ? `<div class="r-section"><div class="r-section-title">Personal</div>
          ${p.dob ? `<div class="r-item-desc">DOB: ${p.dob}</div>` : ''}
          ${p.nationality ? `<div class="r-item-desc">Nationality: ${p.nationality}</div>` : ''}
        </div>` : ''}
        ${hobbies ? `<div class="r-section"><div class="r-section-title">Interests</div><div class="r-item-desc">${hobbies}</div></div>` : ''}
      </div>
    </div>
  </div>`;
}

function buildModernTemplate(d) {
  const { personal: p, skills: sk, experience, education, achievements, projects, certificates, hobbies } = d;

  const expHTML = experience.map(e => !e.title && !e.company ? '' : `
    <div class="r-item">
      <div class="r-item-title">${e.title || ''}</div>
      <div class="r-item-sub">${e.company || ''}</div>
      <div class="r-item-date">${formatDate(e.start)}${e.end ? ' – '+formatDate(e.end) : e.start ? ' – Present' : ''} ${e.loc ? '| '+e.loc : ''}</div>
      ${e.desc ? `<div class="r-item-desc"><ul>${e.desc.split('\n').filter(Boolean).map(l => `<li>${l.replace(/^[•\-\*]\s*/,'')}</li>`).join('')}</ul></div>` : ''}
    </div>`).join('');

  const eduHTML = education.map(e => !e.degree && !e.school ? '' : `
    <div class="r-item">
      <div class="r-item-title">${e.degree || ''}</div>
      <div class="r-item-sub">${e.school || ''}</div>
      <div class="r-item-date">${e.start || ''}${e.end ? ' – '+e.end : ''} ${e.grade ? '| '+e.grade : ''}</div>
    </div>`).join('');

  const allSkills = [sk.langs, sk.frameworks, sk.tools, sk.databases].filter(Boolean).join(', ');

  const certHTML = certificates.map(c => !c.name ? '' : `
    <div class="r-item">
      <div class="r-item-title" style="font-size:0.78rem">${c.name}</div>
      <div class="r-item-date">${c.org || ''} ${formatDate(c.date)}</div>
    </div>`).join('');

  const projHTML = projects.map(pr => !pr.name ? '' : `
    <div class="r-item">
      <div class="r-item-title">${pr.name}</div>
      ${pr.tech ? `<div class="r-item-sub">${pr.tech}</div>` : ''}
      ${pr.desc ? `<div class="r-item-desc">${pr.desc}</div>` : ''}
    </div>`).join('');

  return `
  <div class="tmpl-modern">
    <div class="r-header">
      <div class="r-name">${p.name || 'Your Name'}</div>
      <div class="r-title">${p.title || 'Professional Title'}</div>
      <div class="r-contact">
        ${p.email ? `<span>✉ ${p.email}</span>` : ''}
        ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        ${p.location ? `<span>📍 ${p.location}</span>` : ''}
        ${p.linkedin ? `<span>🔗 ${p.linkedin}</span>` : ''}
      </div>
    </div>
    <div class="r-body">
      <div class="r-side">
        ${allSkills ? `<div class="r-section"><div class="r-section-title">Skills</div>${allSkills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div>` : ''}
        ${sk.soft ? `<div class="r-section"><div class="r-section-title">Soft Skills</div>${sk.soft.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div>` : ''}
        ${eduHTML ? `<div class="r-section"><div class="r-section-title">Education</div>${eduHTML}</div>` : ''}
        ${certHTML ? `<div class="r-section"><div class="r-section-title">Certifications</div>${certHTML}</div>` : ''}
        ${p.dob ? `<div class="r-section"><div class="r-section-title">Personal</div><div class="r-item-desc">DOB: ${p.dob}</div></div>` : ''}
        ${hobbies ? `<div class="r-section"><div class="r-section-title">Interests</div><div class="r-item-desc" style="font-size:0.76rem">${hobbies}</div></div>` : ''}
      </div>
      <div class="r-main">
        ${p.summary ? `<div class="r-section"><div class="r-section-title">Profile</div><div class="r-summary">${p.summary}</div></div>` : ''}
        ${expHTML ? `<div class="r-section"><div class="r-section-title">Experience</div>${expHTML}</div>` : ''}
        ${projHTML ? `<div class="r-section"><div class="r-section-title">Projects</div>${projHTML}</div>` : ''}
        ${achievements.filter(Boolean).length ? `<div class="r-section"><div class="r-section-title">Achievements</div>${achievements.filter(Boolean).map(a => `<div class="r-item"><div class="r-item-desc">• ${a}</div></div>`).join('')}</div>` : ''}
      </div>
    </div>
  </div>`;
}

function buildBoldTemplate(d) {
  const { personal: p, skills: sk, experience, education, achievements, projects, certificates, hobbies } = d;

  const allSkills = [sk.langs, sk.frameworks, sk.tools, sk.databases].filter(Boolean).join(', ');

  const expHTML = experience.map(e => !e.title && !e.company ? '' : `
    <div class="r-item">
      <div class="r-item-title">${e.title || ''} @ ${e.company || ''}</div>
      <div class="r-item-date">${formatDate(e.start)}${e.end ? ' – '+formatDate(e.end) : e.start ? ' – Present' : ''}</div>
      ${e.desc ? `<div class="r-item-desc"><ul>${e.desc.split('\n').filter(Boolean).map(l => `<li>${l.replace(/^[•\-\*]\s*/,'')}</li>`).join('')}</ul></div>` : ''}
    </div>`).join('');

  const eduHTML = education.map(e => !e.degree && !e.school ? '' : `
    <div class="r-item">
      <div class="r-item-title">${e.degree || ''}</div>
      <div class="r-item-sub">${e.school || ''} ${e.end ? `| ${e.end}` : ''} ${e.grade ? `| ${e.grade}` : ''}</div>
    </div>`).join('');

  const certHTML = certificates.map(c => !c.name ? '' : `
    <div class="r-item">
      <div class="r-item-title" style="font-size:0.85rem">${c.name} — ${c.org || ''}</div>
    </div>`).join('');

  const projHTML = projects.map(pr => !pr.name ? '' : `
    <div class="r-item">
      <div class="r-item-title">${pr.name}</div>
      ${pr.tech ? `<div class="r-item-sub">Stack: ${pr.tech}</div>` : ''}
      ${pr.desc ? `<div class="r-item-desc">${pr.desc}</div>` : ''}
    </div>`).join('');

  return `
  <div class="tmpl-bold">
    <div class="r-header">
      <div class="r-name">${p.name || 'YOUR NAME'}</div>
      <div class="r-title">${p.title || 'Professional Title'}</div>
      <div class="r-contact">
        ${p.email ? `<span>✉ ${p.email}</span>` : ''}
        ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        ${p.location ? `<span>📍 ${p.location}</span>` : ''}
        ${p.linkedin ? `<span>in ${p.linkedin}</span>` : ''}
      </div>
    </div>
    <div class="r-body">
      ${p.summary ? `<div class="r-section"><div class="r-section-title">About Me</div><div class="r-summary">${p.summary}</div></div>` : ''}
      ${expHTML ? `<div class="r-section"><div class="r-section-title">Experience</div>${expHTML}</div>` : ''}
      ${eduHTML ? `<div class="r-section"><div class="r-section-title">Education</div>${eduHTML}</div>` : ''}
      ${allSkills ? `<div class="r-section"><div class="r-section-title">Skills</div><div>${skillTags(allSkills, 'skill-tag')}</div></div>` : ''}
      ${projHTML ? `<div class="r-section"><div class="r-section-title">Projects</div>${projHTML}</div>` : ''}
      ${achievements.filter(Boolean).length ? `<div class="r-section"><div class="r-section-title">Achievements</div>${achievements.filter(Boolean).map(a => `<div class="r-item"><div class="r-item-title" style="font-size:0.82rem">★ ${a}</div></div>`).join('')}</div>` : ''}
      ${certHTML ? `<div class="r-section"><div class="r-section-title">Certifications</div>${certHTML}</div>` : ''}
      ${hobbies ? `<div class="r-section"><div class="r-section-title">Interests</div><div class="r-summary">${hobbies}</div></div>` : ''}
    </div>
  </div>`;
}

/* ---------- LIVE PREVIEW ---------- */
function updatePreview() {
  const data = collectData();
  const wrapper = document.getElementById('resumeWrapper');
  if (!wrapper) return;

  let html = '';
  if (currentTemplate === 'modern') html = buildModernTemplate(data);
  else if (currentTemplate === 'bold') html = buildBoldTemplate(data);
  else html = buildCleanTemplate(data);

  wrapper.innerHTML = html;
  calculateATS(data);
}

/* ---------- ATS SCORING ---------- */
function calculateATS(data) {
  const { personal: p, skills: sk, experience, education, achievements, projects, certificates } = data;

  const checks = [
    { label: 'Contact Info',     score: (p.email && p.phone && p.location) ? 100 : (p.email || p.phone) ? 60 : 0, color: '#34d399' },
    { label: 'Summary/Objective',score: p.summary?.length > 50 ? 100 : p.summary?.length > 10 ? 60 : 0, color: '#4f8ef7' },
    { label: 'Work Experience',  score: experience.filter(e => e?.title).length > 0 ? (experience.filter(e => e?.desc?.length > 30).length > 0 ? 100 : 70) : 0, color: '#a78bfa' },
    { label: 'Education',        score: education.filter(e => e?.school).length > 0 ? 100 : 0, color: '#fb923c' },
    { label: 'Technical Skills', score: [sk.langs, sk.frameworks, sk.tools].filter(Boolean).length > 1 ? 100 : [sk.langs, sk.frameworks, sk.tools].filter(Boolean).length > 0 ? 60 : 0, color: '#22d3ee' },
    { label: 'Keywords/Impact',  score: experience.some(e => /\d+%|\d+ (users|clients|team|projects|million)/i.test(e?.desc || '')) ? 100 : achievements.length > 0 ? 60 : 0, color: '#fbbf24' },
    { label: 'Achievements',     score: achievements.filter(Boolean).length > 0 ? 100 : 0, color: '#f472b6' },
    { label: 'Certifications',   score: certificates.filter(c => c?.name).length > 0 ? 100 : 30, color: '#60a5fa' },
  ];

  const total = Math.round(checks.reduce((s, c) => s + c.score, 0) / checks.length);

  // Update bars
  document.getElementById('ats-bar-fill').style.width = `${total}%`;
  document.getElementById('ats-bar-fill').style.background = total >= 80 ? '#34d399' : total >= 60 ? '#fbbf24' : '#f87171';
  document.getElementById('ats-score-label').textContent = `${total}%`;
  document.getElementById('ats-score-label').style.color = total >= 80 ? '#34d399' : total >= 60 ? '#fbbf24' : '#f87171';

  // Show breakdown
  const breakdown = document.getElementById('atsBreakdown');
  const itemsEl = document.getElementById('atsItems');
  if (total > 0) {
    breakdown.style.display = 'block';
    itemsEl.innerHTML = checks.map(c => `
      <div class="ats-item">
        <span class="ats-item-label">${c.label}</span>
        <div class="ats-item-bar"><div class="ats-item-fill" style="width:${c.score}%;background:${c.color}"></div></div>
        <span class="ats-item-val" style="color:${c.color}">${c.score}%</span>
      </div>`).join('');
  }

  // Update hero ring too
  updateHeroRing(total);
}

function updateHeroRing(score) {
  const fill = document.getElementById('hero-ring-fill');
  const num = document.getElementById('hero-ats-num');
  if (fill && score > 0) {
    fill.style.strokeDashoffset = 251.2 - (251.2 * score / 100);
    num.textContent = score;
  }
}

/* ---------- AI GENERATION ---------- */
let aiTarget = 'summary';
let aiExpId = null;

async function aiGenerate(target) {
  aiTarget = target;
  aiExpId = null;
  const data = collectData();
  const p = data.personal;

  let prompt = '';
  if (target === 'summary') {
    prompt = `Write a professional resume summary (3-4 sentences, 80-100 words) for someone named ${p.name || 'the candidate'} who is a ${p.title || 'professional'}. Make it ATS-optimized, impactful, and achievement-focused. Start with their title and years of experience. End with what they bring to future employers. Return only the summary text.`;
  } else if (target === 'skills') {
    prompt = `Suggest a comprehensive list of technical skills for a ${p.title || 'software professional'}. Include: Programming Languages, Frameworks, Tools, Databases. Format as comma-separated lists under each category. Keep it realistic and ATS-friendly.`;
  } else {
    prompt = `Improve and polish the following resume summary to be more ATS-friendly and impactful:\n"${p.summary}"\nName: ${p.name}, Title: ${p.title}. Return only the improved summary.`;
  }

  openModal(prompt);
}

async function aiGenerateExp(expId) {
  aiTarget = 'experience';
  aiExpId = expId;
  const titleEl = document.querySelector(`[data-exp="${expId}"][data-field="title"]`);
  const compEl = document.querySelector(`[data-exp="${expId}"][data-field="company"]`);
  const descEl = document.querySelector(`[data-exp="${expId}"][data-field="desc"]`);

  const title = titleEl?.value || 'Software Engineer';
  const company = compEl?.value || 'a company';
  const existing = descEl?.value || '';

  const prompt = `Write 4-5 strong, ATS-optimized bullet points for a ${title} at ${company}.${existing ? ` Improve on these existing points:\n${existing}` : ''}\nUse action verbs, include metrics where possible (e.g., improved performance by X%, reduced costs by Y%). Each bullet should start with a strong verb. Return only the bullet points with • prefix.`;
  openModal(prompt);
}

function openModal(prompt) {
  const modal = document.getElementById('aiModal');
  modal.classList.add('open');
  document.getElementById('aiThinking').style.display = 'flex';
  document.getElementById('aiResult').style.display = 'none';
  callAnthropicAPI(prompt);
}

function closeModal() {
  document.getElementById('aiModal').classList.remove('open');
}

async function callAnthropicAPI(prompt) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || 'No response from AI.';

    document.getElementById('aiThinking').style.display = 'none';
    document.getElementById('aiResult').style.display = 'block';
    document.getElementById('aiOutput').textContent = text;
    window._aiLastResult = text;

  } catch (err) {
    document.getElementById('aiThinking').style.display = 'none';
    document.getElementById('aiResult').style.display = 'block';
    document.getElementById('aiOutput').textContent = '⚠️ Could not connect to AI. Please check your API key is configured in the server, or try again.\n\nTip: This feature requires an Anthropic API key. See README.md for setup instructions.';
    window._aiLastResult = '';
  }
}

function applyAiResult() {
  const result = window._aiLastResult;
  if (!result) return;

  if (aiTarget === 'summary') {
    document.getElementById('summary').value = result;
  } else if (aiTarget === 'skills') {
    // Parse and fill skill fields
    const lines = result.split('\n');
    lines.forEach(line => {
      if (/programming|language/i.test(line)) {
        const skills = line.replace(/.*?:/,'').trim();
        if (skills) document.getElementById('prog-langs').value = skills;
      } else if (/framework|library/i.test(line)) {
        const skills = line.replace(/.*?:/,'').trim();
        if (skills) document.getElementById('frameworks').value = skills;
      } else if (/tool|technology/i.test(line)) {
        const skills = line.replace(/.*?:/,'').trim();
        if (skills) document.getElementById('tools').value = skills;
      } else if (/database/i.test(line)) {
        const skills = line.replace(/.*?:/,'').trim();
        if (skills) document.getElementById('databases').value = skills;
      }
    });
    // Fallback: if the result is one big comma-list
    if (!document.getElementById('prog-langs').value) {
      document.getElementById('prog-langs').value = result;
    }
  } else if (aiTarget === 'experience' && aiExpId) {
    const descEl = document.querySelector(`[data-exp="${aiExpId}"][data-field="desc"]`);
    if (descEl) descEl.value = result;
  } else {
    document.getElementById('summary').value = result;
  }

  closeModal();
  updatePreview();
  showToast('✅ AI content applied to your resume!');
}

/* ---------- PDF DOWNLOAD ---------- */
function generateResume() {
  const data = collectData();
  if (!data.personal.name) {
    showToast('⚠️ Please enter your Full Name first!');
    return;
  }
  updatePreview();
  incrementResumeCount();
  setTimeout(() => downloadPDF(), 400);
}

function downloadPDF() {
  const data = collectData();
  if (!data.personal.name) {
    showToast('⚠️ Please fill in your details first!');
    nextStep(1);
    return;
  }

  // Build a clean printable page
  const wrapper = document.getElementById('resumeWrapper').innerHTML;
  const printWin = window.open('', '_blank', 'width=900,height=700');
  printWin.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Resume - ${data.personal.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; }
  @page { size: A4; margin: 12mm; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  ${getTemplatePrintCSS()}
</style>
</head>
<body>${wrapper}</body>
</html>`);
  printWin.document.close();
  setTimeout(() => {
    printWin.focus();
    printWin.print();
    printWin.close();
  }, 600);

  showToast('📄 Opening PDF export...');
}

function getTemplatePrintCSS() {
  return `
  .tmpl-clean .r-header { background:#fff; padding:24px 28px 16px; border-bottom:3px solid #2563eb; }
  .tmpl-clean .r-name { font-size:1.8rem; font-weight:700; color:#1a1a2e; margin-bottom:4px; }
  .tmpl-clean .r-title { font-size:0.9rem; color:#2563eb; font-weight:600; margin-bottom:10px; }
  .tmpl-clean .r-contact { display:flex; flex-wrap:wrap; gap:12px; font-size:0.75rem; color:#555; }
  .tmpl-clean .r-body { display:flex; }
  .tmpl-clean .r-main { flex:1; padding:16px 24px; }
  .tmpl-clean .r-side { width:34%; background:#f7f9ff; padding:16px; border-left:1px solid #e8ecf8; }
  .tmpl-clean .r-section { margin-bottom:16px; }
  .tmpl-clean .r-section-title { font-size:0.65rem; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid #dde4f8; }
  .tmpl-clean .r-item { margin-bottom:10px; }
  .tmpl-clean .r-item-head { display:flex; justify-content:space-between; }
  .tmpl-clean .r-item-title { font-size:0.84rem; font-weight:700; }
  .tmpl-clean .r-item-date { font-size:0.68rem; color:#888; }
  .tmpl-clean .r-item-sub { font-size:0.76rem; color:#555; }
  .tmpl-clean .r-item-desc { font-size:0.73rem; color:#444; line-height:1.45; }
  .tmpl-clean .r-item-desc ul { padding-left:12px; margin-top:2px; }
  .tmpl-clean .r-item-desc li { margin-bottom:1px; }
  .tmpl-clean .skill-tag { display:inline-block; padding:2px 6px; background:#e8ecf8; border-radius:3px; font-size:0.68rem; color:#2563eb; margin:2px; }
  .tmpl-clean .r-summary { font-size:0.78rem; color:#444; line-height:1.5; margin-bottom:12px; padding:8px; background:#f7f9ff; border-left:3px solid #2563eb; }
  .tmpl-modern .r-header { background:linear-gradient(135deg,#1a1a2e,#16213e); padding:24px 28px; color:#fff; }
  .tmpl-modern .r-name { font-size:1.7rem; font-weight:700; color:#fff; margin-bottom:4px; }
  .tmpl-modern .r-title { font-size:0.86rem; color:#4f8ef7; font-weight:600; margin-bottom:10px; }
  .tmpl-modern .r-contact { display:flex; flex-wrap:wrap; gap:10px; font-size:0.75rem; color:#aaa; }
  .tmpl-modern .r-body { display:grid; grid-template-columns:1fr 2fr; }
  .tmpl-modern .r-side { background:#f0f2fa; padding:16px; }
  .tmpl-modern .r-main { padding:16px 20px; }
  .tmpl-modern .r-section { margin-bottom:14px; }
  .tmpl-modern .r-section-title { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#1a1a2e; margin-bottom:8px; padding-bottom:3px; border-bottom:2px solid #4f8ef7; }
  .tmpl-modern .r-item { margin-bottom:10px; }
  .tmpl-modern .r-item-title { font-size:0.84rem; font-weight:700; color:#1a1a2e; }
  .tmpl-modern .r-item-sub { font-size:0.76rem; color:#4f8ef7; }
  .tmpl-modern .r-item-date { font-size:0.68rem; color:#888; }
  .tmpl-modern .r-item-desc { font-size:0.73rem; color:#444; line-height:1.45; }
  .tmpl-modern .r-item-desc ul { padding-left:12px; margin-top:2px; }
  .tmpl-modern .skill-tag { display:block; padding:4px 7px; margin-bottom:3px; background:#fff; border-radius:3px; border-left:3px solid #4f8ef7; font-size:0.72rem; color:#333; }
  .tmpl-modern .r-summary { font-size:0.78rem; color:#444; line-height:1.5; margin-bottom:12px; }
  .tmpl-bold .r-header { background:#f7c948; padding:24px 28px; }
  .tmpl-bold .r-name { font-size:2rem; font-weight:900; color:#1a1a2e; margin-bottom:4px; }
  .tmpl-bold .r-title { font-size:0.86rem; color:#1a1a2e; font-weight:700; margin-bottom:10px; }
  .tmpl-bold .r-contact { display:flex; flex-wrap:wrap; gap:10px; font-size:0.75rem; color:#333; }
  .tmpl-bold .r-body { padding:16px 20px; }
  .tmpl-bold .r-section { margin-bottom:14px; }
  .tmpl-bold .r-section-title { font-size:0.92rem; font-weight:900; color:#1a1a2e; text-transform:uppercase; margin-bottom:8px; padding:4px 10px; background:#f7c948; border-radius:3px; }
  .tmpl-bold .r-item { margin-bottom:8px; padding-left:10px; border-left:3px solid #f7c948; }
  .tmpl-bold .r-item-title { font-size:0.84rem; font-weight:800; }
  .tmpl-bold .r-item-sub { font-size:0.75rem; color:#555; }
  .tmpl-bold .r-item-date { font-size:0.68rem; color:#888; }
  .tmpl-bold .r-item-desc { font-size:0.73rem; color:#333; line-height:1.45; }
  .tmpl-bold .r-item-desc ul { padding-left:12px; margin-top:2px; }
  .tmpl-bold .skill-tag { display:inline-block; padding:2px 7px; background:#1a1a2e; border-radius:3px; font-size:0.68rem; color:#f7c948; margin:2px; }
  .tmpl-bold .r-summary { font-size:0.78rem; color:#333; line-height:1.5; margin-bottom:12px; }
  `;
}

/* ---------- COPY TO CLIPBOARD ---------- */
function copyToClipboard() {
  const text = document.getElementById('resumeWrapper')?.innerText || '';
  if (!text.trim()) { showToast('⚠️ Nothing to copy yet!'); return; }
  navigator.clipboard.writeText(text).then(() => showToast('✅ Resume text copied to clipboard!'));
}

/* ---------- TOAST ---------- */
function showToast(msg, duration = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ---------- NAVBAR SCROLL EFFECT ---------- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(8,9,13,0.98)';
  } else {
    nav.style.background = 'rgba(8,9,13,0.85)';
  }
});

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initAnalytics();
  // Add initial experience and education rows for better UX
  addExperience();
  addEducation();
});
/* ============================================================
   NEW ADDITIONS — 6 AI Features
   Paste at the BOTTOM of app.js
   ============================================================ */

// ── FIREBASE RESUME COUNT ──
function firebaseIncrResume() {
  if (window._useFirebase && window._firebaseDB) {
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js")
      .then(({ runTransaction }) => {
        runTransaction(window._firebaseRef(window._firebaseDB, 'stats/resumes'), n => (n||0)+1);
      });
  } else {
    // fallback localStorage
    const n = parseInt(localStorage.getItem('rai_resumes')||'0') + 1;
    localStorage.setItem('rai_resumes', n);
  }
}

// ── Override existing incrementResumeCount to also use Firebase ──
const _oldIncrement = window.incrementResumeCount || function(){};
window.incrementResumeCount = function() {
  _oldIncrement();
  firebaseIncrResume();
};

// ── AI PANEL OPEN / CLOSE ──
const _panelTitles = {
  summary:   '✍ AI Summary Writer',
  jd:        '🎯 Job Description Matcher',
  cover:     '✉ Cover Letter Generator',
  interview: '💬 Interview Prep',
  roast:     '🔥 Resume Roast',
  linkedin:  '💼 LinkedIn Optimizer',
};

function openAIPanel(tab) {
  document.getElementById('aiDrawer')?.classList.add('open');
  document.getElementById('aiOverlay')?.classList.add('open');
  switchAITab(tab || 'summary');
}

function closeAIPanel() {
  document.getElementById('aiDrawer')?.classList.remove('open');
  document.getElementById('aiOverlay')?.classList.remove('open');
}

function switchAITab(tab) {
  document.querySelectorAll('.aid-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.aid-sec').forEach(s => s.classList.remove('active'));
  document.getElementById('dtab-' + tab)?.classList.add('active');
  document.getElementById('dsec-' + tab)?.classList.add('active');
  const title = document.getElementById('drawerTitle');
  if (title) title.textContent = _panelTitles[tab] || 'AI Assistant';
}

// ── HELPER: get resume as plain text for AI context ──
function getResumeText() {
  const d = typeof collectData === 'function' ? collectData() : {};
  const p = d.personal || {};
  const sk = d.skills || {};
  const exp = d.experience || [];
  const edu = d.education || [];
  const ach = d.achievements || [];
  const proj = d.projects || [];
  const cert = d.certificates || [];
  return `
NAME: ${p.name || ''}
TITLE: ${p.title || ''}
EMAIL: ${p.email || ''} | PHONE: ${p.phone || ''} | LOCATION: ${p.location || ''}
LINKEDIN: ${p.linkedin || ''} | GITHUB: ${p.github || ''}

SUMMARY:
${p.summary || ''}

SKILLS: ${[sk.langs, sk.frameworks, sk.tools, sk.databases].filter(Boolean).join(', ')}
SOFT SKILLS: ${sk.soft || ''}

EXPERIENCE:
${exp.map(e => `${e.title || ''} at ${e.company || ''}\n${e.desc || ''}`).join('\n\n')}

EDUCATION:
${edu.map(e => `${e.degree || ''} — ${e.school || ''} (${e.start || ''}–${e.end || ''}) ${e.grade || ''}`).join('\n')}

ACHIEVEMENTS:
${ach.filter(Boolean).join('\n')}

PROJECTS:
${proj.map(pr => `${pr.name || ''}: ${pr.desc || ''} [${pr.tech || ''}]`).join('\n')}

CERTIFICATIONS:
${cert.map(c => `${c.name || ''} — ${c.org || ''}`).join('\n')}
  `.trim();
}

// ── CALL CLAUDE API ──
async function callClaudeAPI(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.content?.map(b => b.text || '').join('') || 'No response.';
}

// ── RUN AI TOOL ──
const _aiResults = {};

async function runAITool(type) {
  const resumeText = getResumeText();
  const v = id => (document.getElementById(id)?.value || '').trim();

  // Show thinking, hide result
  document.getElementById('dt-' + type).style.display = 'flex';
  document.getElementById('dr-' + type).style.display = 'none';

  let prompt = '';
  try {
    if (type === 'summary') {
      const role   = v('ai-role')       || v('jobTitle') || 'professional';
      const yoe    = v('ai-yoe')        || '';
      const skills = v('ai-skills-hint')|| [v('prog-langs'), v('frameworks')].filter(Boolean).join(', ');
      prompt = `Write a powerful, ATS-optimized professional resume summary (3-4 sentences, 80-100 words).
Name: ${v('fullName') || 'the candidate'}
Role: ${role}
Experience: ${yoe}
Skills: ${skills}
Start with role + experience. Include key skills. End with value to employer.
Return ONLY the summary text. No labels, no quotes.`;

    } else if (type === 'jd') {
      const jd = v('jd-paste');
      if (!jd) { showToast('⚠️ Paste a job description first!'); resetAIUI(type); return; }
      prompt = `You are an ATS expert. Analyse this resume vs the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jd}

Reply in EXACTLY this format:
MATCH_SCORE: [number 0-100]

STRONG MATCHES:
- [keyword]
- [keyword]

MISSING KEYWORDS:
- [keyword]
- [keyword]

TOP 3 IMPROVEMENTS:
1. [specific advice]
2. [specific advice]
3. [specific advice]`;

    } else if (type === 'cover') {
      const company = v('cl-company') || 'the company';
      const role    = v('cl-role')    || v('jobTitle') || 'the role';
      const extra   = v('cl-extra')   || '';
      prompt = `Write a professional, personalized cover letter.
Applicant: ${v('fullName')}
Role: ${role} at ${company}
Background: ${resumeText}
Extra notes: ${extra}
3 short paragraphs. Professional but warm. Under 300 words.
Return ONLY the letter text.`;

    } else if (type === 'interview') {
      const role  = v('int-role')  || v('jobTitle') || 'Software Engineer';
      const itype = v('int-type')  || 'Technical';
      const level = v('int-level') || 'Entry Level';
      prompt = `Generate 8 realistic ${itype} interview questions for a ${role} at ${level} level.
Based on this resume: ${resumeText}
For each question:
Q: [question]
💡 Tip: [30-word answer strategy]
Make questions specific to their background.`;

    } else if (type === 'roast') {
      const role = v('roast-role') || v('jobTitle') || 'tech role';
      prompt = `You are a brutally honest but helpful resume reviewer.
Roast this resume for a ${role} position:
${resumeText}

Provide:
🔥 BRUTAL TRUTH (2-3 specific weaknesses)
⚠️ RED FLAGS (ATS or recruiter red flags)
💡 QUICK WINS (3 specific improvements for TODAY)
✅ WHAT'S GOOD (1-2 genuine positives)
Be direct, specific, and actionable.`;

    } else if (type === 'linkedin') {
      const industry = v('li-industry') || 'tech';
      const goal     = v('li-goal')     || 'Get recruiter attention';
      prompt = `Create optimised LinkedIn content.
Person: ${v('fullName')}, ${v('jobTitle')}
Industry: ${industry}
Goal: ${goal}
Background: ${resumeText}

Generate:
**HEADLINE** (120 chars max, keyword-rich):
[headline]

**ABOUT SECTION** (first-person, 200 words, keywords, CTA):
[about]

**TOP 3 SKILLS TO ADD:**
[skills]`;
    }

    const result = await callClaudeAPI(prompt);
    _aiResults[type] = result;

    // Render result
    if (type === 'jd') {
      renderJDScore(result);
    } else {
      const out = document.getElementById('do-' + type);
      if (out) out.textContent = result;
    }

  } catch (err) {
    const out = document.getElementById('do-' + type);
    if (out) out.textContent = '⚠️ AI not connected.\n\nTo enable AI features:\n1. Get free API key at console.anthropic.com\n2. Set up a backend proxy (see README.md)\n\nAll resume building features work without AI!';
  }

  // Hide thinking, show result
  document.getElementById('dt-' + type).style.display = 'none';
  document.getElementById('dr-' + type).style.display = 'flex';
}

function resetAIUI(type) {
  document.getElementById('dt-' + type).style.display = 'none';
  document.getElementById('dr-' + type).style.display = 'none';
}

// ── RENDER JD SCORE ──
function renderJDScore(text) {
  const scoreMatch = text.match(/MATCH_SCORE:\s*(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  const color = score >= 70 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171';

  const matchLines   = (text.match(/STRONG MATCHES[\s\S]*?(?=MISSING|$)/)?.[0] || '').split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/,'').trim());
  const missingLines = (text.match(/MISSING KEYWORDS[\s\S]*?(?=TOP 3|$)/)?.[0] || '').split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/,'').trim());

  const ui = document.getElementById('jd-score-ui');
  ui.innerHTML = `
    <div class="jd-score-wrap">
      <div class="jd-score-num" style="color:${color}">${score}%</div>
      <div class="jd-score-lbl">Job Match Score</div>
    </div>
    <div style="margin-bottom:10px">
      <div class="kw-title">✅ Matching Keywords</div>
      <div class="kw-cloud">${matchLines.filter(Boolean).map(k => `<span class="kw match">${k}</span>`).join('')}</div>
    </div>
    <div>
      <div class="kw-title">❌ Add These Keywords</div>
      <div class="kw-cloud">${missingLines.filter(Boolean).map(k => `<span class="kw missing">${k}</span>`).join('')}</div>
    </div>`;

  const improvements = text.match(/TOP 3 IMPROVEMENTS[\s\S]*/)?.[0] || '';
  const out = document.getElementById('do-jd');
  if (out) out.textContent = improvements;
}

// ── APPLY AI RESULT TO RESUME ──
function applyAIResult(type) {
  const result = _aiResults[type] || '';
  if (!result || result.startsWith('⚠️')) { closeAIPanel(); return; }

  if (type === 'summary') {
    const el = document.getElementById('summary');
    if (el) { el.value = result; updatePreview(); }
    showToast('✅ Summary applied to resume!');
  }
  closeAIPanel();
}

// ── COPY AI RESULT ──
function copyAIResult(type) {
  const result = _aiResults[type] || '';
  if (!result) { showToast('⚠️ Run the AI tool first!'); return; }
  navigator.clipboard.writeText(result).then(() => showToast('✅ Copied to clipboard!'));
}

// ── SAVE RESUME (Ctrl+S) ──
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    const data = typeof collectData === 'function' ? collectData() : {};
    localStorage.setItem('rai_save', JSON.stringify(data));
    showToast('💾 Resume saved! (Ctrl+S)');
  }
});
/* ============================================================
   COMPANY INTELLIGENCE AI
   Paste at the BOTTOM of app.js
   ============================================================ */

// ── STATE ──
let _companyData    = {};   // stores AI fetched company info
let _pdfText        = '';   // stores extracted PDF text
let _companyResults = {};   // stores all 4 AI result sections

// ── STEP 1: Search Company Requirements ──
async function companyStep1() {
  const company = document.getElementById('company-name')?.value.trim();
  const role    = document.getElementById('company-role')?.value.trim();
  const level   = document.getElementById('company-level')?.value;

  if (!company) { showToast('⚠️ Please enter a company name!'); return; }
  if (!role)    { showToast('⚠️ Please enter the job role!');   return; }

  _companyData = { company, role, level };

  // Show step 2
  document.getElementById('cstep-1').style.display = 'none';
  document.getElementById('cstep-2').style.display = 'flex';
  document.getElementById('cstep-2').style.flexDirection = 'column';
  document.getElementById('cstep-2').style.gap = '12px';

  // Show company found box
  document.getElementById('company-found-box').innerHTML = `
    <div class="cf-name"><i class="fa fa-building"></i> ${company}</div>
    <div class="cf-meta">
      Role: <strong>${role}</strong> &nbsp;|&nbsp;
      Level: <strong>${level}</strong><br/>
      <span style="color:var(--green);font-size:.72rem">
        ✅ Company identified — now upload your resume PDF for personalized analysis
      </span>
    </div>`;
}

// ── HANDLE PDF UPLOAD ──
function handlePDFUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById('pdfStatus').style.display = 'flex';
  document.getElementById('pdfFileName').textContent  = file.name;
  document.getElementById('analyseBtn').style.display = 'block';

  // Read PDF as text using FileReader
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      // Try to extract text from PDF using a simple approach
      const arrayBuffer = e.target.result;
      const uint8Array  = new Uint8Array(arrayBuffer);
      let text = '';

      // Extract readable text from PDF bytes
      for (let i = 0; i < uint8Array.length; i++) {
        const char = String.fromCharCode(uint8Array[i]);
        if (char >= ' ' && char <= '~') text += char;
        else if (char === '\n' || char === '\r') text += '\n';
      }

      // Clean up extracted text
      text = text.replace(/[^\x20-\x7E\n]/g, ' ')
                 .replace(/ {3,}/g, ' ')
                 .replace(/\n{3,}/g, '\n\n')
                 .trim();

      // Keep only meaningful parts (skip PDF metadata)
      const lines = text.split('\n').filter(l => l.trim().length > 3);
      _pdfText = lines.join('\n').substring(0, 4000);

      showToast('✅ Resume PDF loaded successfully!');
    } catch(err) {
      _pdfText = '';
      showToast('⚠️ Could not read PDF text. Using form data instead.');
    }
  };
  reader.readAsArrayBuffer(file);

  // Drag and drop support
  setupDragDrop();
}

function setupDragDrop() {
  const area = document.getElementById('pdfUploadArea');
  area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      document.getElementById('resumePDF').files = e.dataTransfer.files;
      handlePDFUpload({ target: { files: [file] } });
    } else {
      showToast('⚠️ Please upload a PDF file!');
    }
  });
}

// ── STEP 2: Analyse with PDF ──
async function companyStep2() {
  const resumeContent = _pdfText || getResumeText();
  runCompanyAnalysis(resumeContent);
}

async function companyStep2WithoutPDF() {
  _pdfText = '';
  runCompanyAnalysis(getResumeText());
}

// ── MAIN ANALYSIS ──
async function runCompanyAnalysis(resumeContent) {
  const { company, role, level } = _companyData;

  // Show step 3
  document.getElementById('cstep-2').style.display = 'none';
  document.getElementById('cstep-3').style.display = 'flex';
  document.getElementById('cstep-3').style.flexDirection = 'column';
  document.getElementById('cstep-3').style.gap = '12px';

  document.getElementById('dt-company').style.display = 'flex';
  document.getElementById('resultTabs').style.display  = 'none';
  document.getElementById('resultActions').style.display = 'none';

  const thinkMsg = document.getElementById('company-think-msg');

  try {
    // ── CALL 1: Company Requirements ──
    thinkMsg.textContent = `Fetching ${company}'s tech stack & requirements...`;
    const reqPrompt = `You are a tech recruiter expert with deep knowledge of top companies worldwide.

Company: ${company}
Role: ${role}
Level: ${level}

Provide detailed information in this EXACT format:

COMPANY OVERVIEW:
[2-3 sentences about the company's tech culture and engineering team]

REQUIRED TECHNICAL SKILLS:
- [skill 1]
- [skill 2]
(list 8-10 must-have skills)

PREFERRED SKILLS:
- [skill]
(list 5-6 good-to-have skills)

INTERVIEW PROCESS:
[Describe ${company}'s typical interview process for ${role}]

WHAT THEY LOOK FOR:
[3-4 specific qualities ${company} values in ${role} candidates]

COMPANY TECH STACK:
[List the main technologies ${company} uses internally]`;

    const reqResult = await callClaudeAPI(reqPrompt);
    _companyResults.req = reqResult;
    document.getElementById('do-req').textContent = reqResult;

    // ── CALL 2: Skill Gap Analysis ──
    thinkMsg.textContent = 'Analysing your skill gaps...';
    const gapPrompt = `You are a career coach. Compare this candidate's resume with ${company}'s requirements for ${role} at ${level} level.

CANDIDATE RESUME:
${resumeContent}

COMPANY: ${company}
ROLE: ${role}

Provide analysis in this EXACT format:

MATCH_PERCENTAGE: [0-100]

STRONG SKILLS (candidate already has):
- [skill]: [why it matches]

MISSING CRITICAL SKILLS (must learn):
- [skill]: [how long to learn] | Priority: HIGH
- [skill]: [how long to learn] | Priority: HIGH

SKILLS TO IMPROVE:
- [skill]: [specific improvement needed]

OVERALL ASSESSMENT:
[2-3 sentences honest assessment of candidate's fit]

LEARNING ROADMAP:
Week 1-2: [focus area]
Week 3-4: [focus area]
Month 2: [focus area]
Month 3: [focus area]`;

    const gapResult = await callClaudeAPI(gapPrompt);
    _companyResults.gap = gapResult;
    renderSkillGap(gapResult);

    // ── CALL 3: Project Suggestions ──
    thinkMsg.textContent = 'Generating project ideas...';
    const projPrompt = `Suggest 4 specific projects a ${role} candidate should build to get hired at ${company}.

Candidate background: ${resumeContent.substring(0, 500)}
Level: ${level}

For each project provide in this format:

PROJECT [n]: [Name]
🎯 Why ${company} will love it: [reason]
🛠️ Tech Stack: [specific technologies]
⏱️ Build Time: [estimated time]
📋 Key Features to Build:
  - [feature 1]
  - [feature 2]
  - [feature 3]
🚀 How to make it stand out: [specific tip]
📊 Difficulty: [Easy/Medium/Hard]

Make projects realistic, impressive, and directly relevant to ${company}'s work.`;

    const projResult = await callClaudeAPI(projPrompt);
    _companyResults.proj = projResult;
    document.getElementById('do-proj').textContent = projResult;

    // ── CALL 4: Languages & Tech ──
    thinkMsg.textContent = 'Identifying required languages...';
    const langsPrompt = `List ALL programming languages and technologies required for ${role} at ${company} for ${level} level.

Format EXACTLY like this:

MUST_HAVE: Python, JavaScript, SQL, [etc]
GOOD_TO_HAVE: Go, Rust, TypeScript, [etc]
BONUS: Kotlin, Swift, [etc]

Then explain each category:

MUST HAVE (without these, application gets rejected):
[for each language: name, why needed at ${company}, learning resources]

GOOD TO HAVE (increases selection chances):
[for each: name, specific use at ${company}]

BONUS (sets you apart from other candidates):
[for each: name, when it helps]

CURRENT CANDIDATE LANGUAGES:
Based on resume: ${resumeContent.substring(0, 300)}
Gap analysis: [what they need to add]`;

    const langsResult = await callClaudeAPI(langsPrompt);
    _companyResults.langs = langsResult;
    renderLanguages(langsResult);

    // Show results
    document.getElementById('dt-company').style.display  = 'none';
    document.getElementById('resultTabs').style.display  = 'flex';
    document.getElementById('resultActions').style.display = 'flex';
    showResultTab('req');
    showToast(`✅ ${company} analysis complete!`);

  } catch(err) {
    document.getElementById('dt-company').style.display = 'none';
    document.getElementById('do-req').textContent =
      `⚠️ AI not connected.\n\nTo enable Company Intelligence:\n1. Get API key at console.anthropic.com\n2. Set up backend proxy\n3. See README.md\n\nThis feature needs Claude AI to fetch live company data.`;
    document.getElementById('resultTabs').style.display = 'flex';
    showResultTab('req');
  }
}

// ── RENDER SKILL GAP SCORE ──
function renderSkillGap(text) {
  const match = text.match(/MATCH_PERCENTAGE:\s*(\d+)/);
  const score = match ? parseInt(match[1]) : 0;
  const color = score >= 70 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171';
  const label = score >= 70 ? 'Great Match! 🎉' : score >= 50 ? 'Good Potential 💪' : 'Needs Work 📚';

  const offset = 251.2 - (251.2 * score / 100);

  document.getElementById('gapScoreWrap').innerHTML = `
    <div class="gap-score-circle">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" class="gap-ring-bg"/>
        <circle cx="50" cy="50" r="40" class="gap-ring-fill"
          style="stroke:${color};stroke-dashoffset:${offset}"/>
      </svg>
      <span class="gap-score-num" style="color:${color}">${score}%</span>
    </div>
    <div class="gap-score-info">
      <div class="gap-score-title">${label}</div>
      <div class="gap-score-sub">
        Your resume matches ${score}% of what<br/>
        <strong>${_companyData.company}</strong> needs for this role.
      </div>
    </div>`;

  document.getElementById('do-gap').textContent = text.replace(/MATCH_PERCENTAGE:\s*\d+\n?/, '');
}

// ── RENDER LANGUAGE TAGS ──
function renderLanguages(text) {
  const mustLine  = text.match(/MUST_HAVE:\s*([^\n]+)/)?.[1] || '';
  const goodLine  = text.match(/GOOD_TO_HAVE:\s*([^\n]+)/)?.[1] || '';
  const bonusLine = text.match(/BONUS:\s*([^\n]+)/)?.[1] || '';

  const mustLangs  = mustLine.split(',').map(s => s.trim()).filter(Boolean);
  const goodLangs  = goodLine.split(',').map(s => s.trim()).filter(Boolean);
  const bonusLangs = bonusLine.split(',').map(s => s.trim()).filter(Boolean);

  const langIcons = {
    'Python':'🐍','JavaScript':'⚡','TypeScript':'🔷','Java':'☕','C++':'⚙️',
    'Go':'🐹','Rust':'🦀','SQL':'🗄️','HTML':'🌐','CSS':'🎨','React':'⚛️',
    'Node.js':'💚','Swift':'🍎','Kotlin':'🎯','PHP':'🐘','Ruby':'💎',
    'C#':'🔵','Scala':'♾️','R':'📊','MATLAB':'📐','Dart':'🎯','Flutter':'💙',
  };

  let html = '';
  mustLangs.forEach(l  => { const icon = langIcons[l] || '💻'; html += `<span class="lang-tag must"><span>${icon}</span> ${l} <span class="lt-badge">MUST</span></span>`; });
  goodLangs.forEach(l  => { const icon = langIcons[l] || '💻'; html += `<span class="lang-tag good"><span>${icon}</span> ${l} <span class="lt-badge">GOOD</span></span>`; });
  bonusLangs.forEach(l => { const icon = langIcons[l] || '💻'; html += `<span class="lang-tag bonus"><span>${icon}</span> ${l} <span class="lt-badge">BONUS</span></span>`; });

  document.getElementById('langTags').innerHTML = html;
  document.getElementById('do-langs').textContent = text
    .replace(/MUST_HAVE:[^\n]+\n?/, '')
    .replace(/GOOD_TO_HAVE:[^\n]+\n?/, '')
    .replace(/BONUS:[^\n]+\n?/, '');
}

// ── SHOW RESULT TAB ──
function showResultTab(tab) {
  document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.result-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('rt-' + tab)?.classList.add('active');
  document.getElementById('rp-' + tab)?.classList.add('active');
}

// ── AUTO FILL SKILLS ──
function applyCompanySuggestions() {
  const text = _companyResults.langs || '';
  const mustLine = text.match(/MUST_HAVE:\s*([^\n]+)/)?.[1] || '';
  const goodLine = text.match(/GOOD_TO_HAVE:\s*([^\n]+)/)?.[1] || '';

  if (mustLine) {
    const existing = document.getElementById('prog-langs')?.value || '';
    const newSkills = mustLine.split(',').map(s => s.trim()).filter(Boolean);
    const existingSkills = existing.split(',').map(s => s.trim()).filter(Boolean);
    const combined = [...new Set([...existingSkills, ...newSkills])].join(', ');
    const el = document.getElementById('prog-langs');
    if (el) el.value = combined;
  }
  if (goodLine) {
    const existing = document.getElementById('frameworks')?.value || '';
    const newSkills = goodLine.split(',').map(s => s.trim()).filter(Boolean);
    const existingSkills = existing.split(',').map(s => s.trim()).filter(Boolean);
    const combined = [...new Set([...existingSkills, ...newSkills])].join(', ');
    const el = document.getElementById('frameworks');
    if (el) el.value = combined;
  }

  updatePreview();
  closeAIPanel();
  showToast(`✅ ${_companyData.company} skills added to your resume!`);
}

// ── DOWNLOAD FULL REPORT ──
function downloadCompanyReport() {
  const { company, role, level } = _companyData;
  const report = `
COMPANY INTELLIGENCE REPORT
Generated by ResumeAI Pro
==============================
Company: ${company}
Role: ${role}
Level: ${level}

==============================
COMPANY REQUIREMENTS
==============================
${_companyResults.req || 'Not generated'}

==============================
SKILL GAP ANALYSIS
==============================
${_companyResults.gap || 'Not generated'}

==============================
RECOMMENDED PROJECTS
==============================
${_companyResults.proj || 'Not generated'}

==============================
REQUIRED LANGUAGES & TECH
==============================
${_companyResults.langs || 'Not generated'}
`.trim();

  const blob = new Blob([report], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${company.replace(/\s+/g,'_')}_Career_Report.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📄 Report downloaded!');
}

// ── RESET ──
function resetCompanyTool() {
  _companyData = {}; _pdfText = ''; _companyResults = {};
  document.getElementById('cstep-1').style.display = 'flex';
  document.getElementById('cstep-2').style.display = 'none';
  document.getElementById('cstep-3').style.display = 'none';
  document.getElementById('resultTabs').style.display    = 'none';
  document.getElementById('resultActions').style.display = 'none';
  document.getElementById('dt-company').style.display    = 'none';
  document.getElementById('pdfStatus').style.display     = 'none';
  document.getElementById('analyseBtn').style.display    = 'none';
  document.getElementById('company-name').value = '';
  document.getElementById('company-role').value = '';
  _pdfText = '';
}
/* ── DRIVE LINK FEATURE ── */

// Convert Google Drive share link
// to direct viewable link
function formatDriveLink(url) {
  if (!url) return '';

  // Already a direct link
  if (url.includes('drive.google.com/file')) {
    // Extract file ID
    const match = url.match(
      /\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      // Return preview link
      // Anyone with link can view
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  // Handle /open?id= format
  if (url.includes('open?id=')) {
    const id = url.split('open?id=')[1]
      ?.split('&')[0];
    if (id) {
      return `https://drive.google.com/file/d/${id}/preview`;
    }
  }

  // Return as is if unknown format
  return url;
}

// Test if drive link works
function testDriveLink(btn) {
  // Find parent input
  const input = btn
    .parentElement
    .querySelector('input');
  const url = input?.value?.trim();

  if (!url) {
    showToast('⚠️ Enter a Google Drive link first!');
    return;
  }

  if (!url.includes('drive.google.com')) {
    showToast('⚠️ Please enter a valid Google Drive link!');
    return;
  }

  // Open in new tab to test
  const previewUrl = formatDriveLink(url);
  window.open(previewUrl, '_blank');
  showToast('✅ Link opened in new tab — check if it shows your file!');
}

// Build education HTML with drive links
// UPDATE your existing education map
// in your template builder to use this:

function buildEduWithDriveLink(eduList) {
  return eduList.map(e => {
    if (!e.degree && !e.school) return '';

    const driveUrl = e.drivelink
      ? formatDriveLink(e.drivelink)
      : '';

    return `
      <div class="ri">
        <div class="rih">
          <span class="rit">
            ${e.degree || ''}
          </span>
          <span class="rid">
            ${e.start || ''}
            ${e.end ? ' – ' + e.end : ''}
          </span>
        </div>

        <div class="ris">
          ${e.school || ''}
          ${e.loc ? ' | ' + e.loc : ''}
        </div>

        ${e.grade
          ? `<div class="ridesc"
              style="font-size:.7rem;
              color:#888;margin-top:2px">
              ${e.grade}
            </div>`
          : ''}

        ${driveUrl ? `
          <a href="${driveUrl}"
            target="_blank"
            class="r-drive-link"
            onclick="event.stopPropagation()"
            title="View Marksheet / Certificate">
            <svg width="12" height="12"
              viewBox="0 0 87.3 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H4.55c0 1.55.4 3.1 1.2 4.5l.85 13.35z"
                fill="#0066DA"/>
              <path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.1C.4 49.5 0 51.05 0 52.6h27.5L43.65 25z"
                fill="#00AC47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.65L73.55 76.8z"
                fill="#EA4335"/>
              <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2L43.65 25z"
                fill="#00832D"/>
              <path d="M59.8 52.6H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2L59.8 52.6z"
                fill="#2684FC"/>
              <path d="M73.4 26.3l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 27.6H87.2c0-1.55-.4-3.1-1.2-4.5L73.4 26.3z"
                fill="#FFBA00"/>
            </svg>
            View Marksheet / Certificate
          </a>` : ''}

      </div>`;
  }).join('');
}