// === CLANN STAFFING - MAIN JS ===

/* Toggle mobile menu */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

/* Close mobile menu on link click */
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

/* Highlight current nav link */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* Admin Panel: Jobs in localStorage */
function getJobs() {
  return JSON.parse(localStorage.getItem('clann_jobs') || '[]');
}

function saveJobs(jobs) {
  localStorage.setItem('clann_jobs', JSON.stringify(jobs));
}

function addJob(title, company, location, type) {
  const jobs = getJobs();
  jobs.push({ id: Date.now(), title, company, location, type, posted: new Date().toLocaleDateString() });
  saveJobs(jobs);
  renderJobs();
  renderStats();
}

function deleteJob(id) {
  let jobs = getJobs();
  jobs = jobs.filter(j => j.id !== id);
  saveJobs(jobs);
  renderJobs();
  renderStats();
}

function renderJobs() {
  const tbody = document.getElementById('jobsTableBody');
  if (!tbody) return;
  const jobs = getJobs();
  if (jobs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No jobs posted yet.</td></tr>';
    return;
  }
  tbody.innerHTML = jobs.map(j => `
    <tr>
      <td>${j.title}</td>
      <td>${j.company}</td>
      <td>${j.location}</td>
      <td>${j.type}</td>
      <td><button class="btn btn-outline" style="padding:6px 14px;font-size:0.85rem;" onclick="deleteJob(${j.id})">Delete</button></td>
    </tr>
  `).join('');
}

function renderStats() {
  const jobs = getJobs();
  const totalEl = document.getElementById('statTotal');
  const activeEl = document.getElementById('statActive');
  if (totalEl) totalEl.textContent = jobs.length;
  if (activeEl) activeEl.textContent = jobs.length; // all considered active for simplicity
}

/* Admin form handler */
const jobForm = document.getElementById('jobForm');
if (jobForm) {
  jobForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('jobCompany').value.trim();
    const location = document.getElementById('jobLocation').value.trim();
    const type = document.getElementById('jobType').value;
    if (!title || !company || !location) return;
    addJob(title, company, location, type);
    jobForm.reset();
  });
  // init
  renderJobs();
  renderStats();
}

/* Demo data for admin if empty */
if (document.getElementById('jobsTableBody') && getJobs().length === 0) {
  const demo = [
    { id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'Noida', type: 'Full-time', posted: '26/04/2026' },
    { id: 2, title: 'HR Manager', company: 'Clann Staffing', location: 'Noida', type: 'Full-time', posted: '26/04/2026' },
    { id: 3, title: 'Data Analyst', company: 'FinBank', location: 'Delhi', type: 'Contract', posted: '26/04/2026' }
  ];
  saveJobs(demo);
  renderJobs();
  renderStats();
}
