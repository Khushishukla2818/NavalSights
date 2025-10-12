let currentUser = null;
let charts = {};

const rolePermissions = {
    admin: ['dashboard', 'upload', 'threat', 'analytics', 'health', 'notifications', 'models', 'settings'],
    operator: ['dashboard', 'upload', 'threat', 'analytics', 'health', 'notifications', 'models'],
    viewer: ['dashboard', 'threat', 'analytics', 'health', 'notifications']
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);

    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle.addEventListener('click', toggleSidebar);

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });

    initializeUploadPage();
    initializeThreatPage();
    initializeNotificationsPage();
    initializeModelsPage();
    initializeSettingsPage();
    initializeSystemHealthPage();

    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function hasAccess(page) {
    if (!currentUser || !currentUser.role) return false;
    return rolePermissions[currentUser.role].includes(page);
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    currentUser = { username, role };

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'grid';

    updateClock();
    setInterval(updateClock, 1000);

    applyRoleRestrictions(role);
    initializeCharts();
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    clockElement.textContent = timeString;
}

function applyRoleRestrictions(role) {
    const accessLevelSelect = document.getElementById('access-level-select');
    accessLevelSelect.value = role;

    if (role === 'viewer') {
        const restrictedItems = ['upload', 'models', 'settings'];
        restrictedItems.forEach(page => {
            const navItem = document.querySelector(`[data-page="${page}"]`);
            if (navItem) {
                navItem.style.opacity = '0.5';
                navItem.style.pointerEvents = 'none';
            }
        });
    } else if (role === 'operator') {
        const restrictedItems = ['settings'];
        restrictedItems.forEach(page => {
            const navItem = document.querySelector(`[data-page="${page}"]`);
            if (navItem) {
                navItem.style.opacity = '0.5';
                navItem.style.pointerEvents = 'none';
            }
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function navigateToPage(pageName) {
    if (!hasAccess(pageName)) {
        showModal('Access Denied', `You don't have permission to access ${pageName} page. Your role: ${currentUser.role}`);
        return;
    }

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    const activeNav = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    if (pageName === 'analytics') {
        initializeAnalyticsCharts();
    }
}

function initializeCharts() {
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    charts.lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Images Processed',
                data: [120, 150, 180, 220, 170, 190, 210],
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                }
            }
        }
    });

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    charts.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Mine', 'Submarine', 'Debris', 'Unknown'],
            datasets: [{
                data: [12, 5, 4, 2],
                backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#6366f1']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            }
        }
    });
}

function initializeAnalyticsCharts() {
    if (charts.analyticsLineChart) return;

    const lineCtx = document.getElementById('analyticsLineChart').getContext('2d');
    charts.analyticsLineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Images Processed',
                data: [145, 178, 165, 210, 189, 156, 201],
                borderColor: '#14b8a6',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                }
            }
        }
    });

    const pieCtx = document.getElementById('analyticsPieChart').getContext('2d');
    charts.analyticsPieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Mine', 'Submarine', 'Debris', 'Unknown', 'Ship'],
            datasets: [{
                data: [12, 5, 4, 2, 3],
                backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#6366f1', '#14b8a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            }
        }
    });

    const barCtx = document.getElementById('analyticsBarChart').getContext('2d');
    charts.analyticsBarChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Mine', 'Submarine', 'Debris', 'Unknown', 'Ship'],
            datasets: [{
                label: 'Average Confidence (%)',
                data: [92, 85, 78, 65, 88],
                backgroundColor: '#0ea5e9'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                }
            }
        }
    });
}

function initializeUploadPage() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const enhanceBtn = document.getElementById('enhance-btn');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0ea5e9';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#334155';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#334155';
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });

    enhanceBtn.addEventListener('click', performEnhancement);
}

function handleFileUpload(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('original-image').src = e.target.result;
            document.getElementById('enhance-btn').disabled = false;
            showModal('Success', 'File uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
}

function performEnhancement() {
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar').querySelector('.progress-bar');
    const progressText = document.getElementById('progress-text');
    const comparisonContainer = document.getElementById('comparison-container');

    progressContainer.style.display = 'block';
    let progress = 0;

    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressBar.querySelector('::before') ? null : progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressContainer.style.display = 'none';
                showEnhancedResults();
            }, 500);
        }
    }, 200);
}

function showEnhancedResults() {
    const originalSrc = document.getElementById('original-image').src;
    document.getElementById('enhanced-image').src = originalSrc;

    document.getElementById('psnr-value').textContent = (28 + Math.random() * 7).toFixed(2) + ' dB';
    document.getElementById('ssim-value').textContent = (0.85 + Math.random() * 0.1).toFixed(3);
    document.getElementById('uiqm-value').textContent = (2.5 + Math.random() * 1.5).toFixed(2);

    document.getElementById('comparison-container').style.display = 'block';
}

function initializeThreatPage() {
    const threatUploadArea = document.getElementById('threat-upload-area');
    const threatFileInput = document.getElementById('threat-file-input');
    const detectBtn = document.getElementById('detect-btn');
    const sendAlertBtn = document.getElementById('send-alert-btn');

    threatUploadArea.addEventListener('click', () => threatFileInput.click());

    threatFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                detectBtn.disabled = false;
                detectBtn.dataset.imageSrc = e.target.result;
                showModal('Success', 'Image loaded for threat detection!');
            };
            reader.readAsDataURL(file);
        }
    });

    detectBtn.addEventListener('click', performThreatDetection);

    if (sendAlertBtn) {
        sendAlertBtn.addEventListener('click', () => {
            showModal('Alert Sent', 'Email and SMS alerts have been sent successfully!');
        });
    }
}

function performThreatDetection() {
    const imageSrc = document.getElementById('detect-btn').dataset.imageSrc;
    const canvas = document.getElementById('detection-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const threats = [
            { type: 'Mine', confidence: 0.92, severity: 'high', x: 0.3, y: 0.4, w: 0.15, h: 0.15 },
            { type: 'Submarine', confidence: 0.85, severity: 'high', x: 0.6, y: 0.3, w: 0.2, h: 0.2 },
            { type: 'Debris', confidence: 0.78, severity: 'medium', x: 0.2, y: 0.7, w: 0.1, h: 0.1 }
        ];

        threats.forEach(threat => {
            const x = threat.x * canvas.width;
            const y = threat.y * canvas.height;
            const w = threat.w * canvas.width;
            const h = threat.h * canvas.height;

            ctx.strokeStyle = threat.severity === 'high' ? '#ef4444' : '#eab308';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);

            ctx.fillStyle = threat.severity === 'high' ? '#ef4444' : '#eab308';
            ctx.font = '16px Arial';
            ctx.fillText(`${threat.type} ${(threat.confidence * 100).toFixed(0)}%`, x, y - 5);
        });

        populateThreatsTable(threats);
        document.getElementById('detection-results').style.display = 'block';
    };

    img.src = imageSrc;
}

function populateThreatsTable(threats) {
    const tbody = document.querySelector('#threats-table tbody');
    tbody.innerHTML = '';

    threats.forEach(threat => {
        const now = new Date();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${threat.type}</td>
            <td>${(threat.confidence * 100).toFixed(1)}%</td>
            <td class="severity-${threat.severity}">${threat.severity.toUpperCase()}</td>
            <td>${(threat.x * 100).toFixed(1)}N, ${(threat.y * 100).toFixed(1)}E</td>
            <td>${now.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initializeNotificationsPage() {
    const markReadBtn = document.getElementById('mark-read-btn');
    const emailAlertBtn = document.getElementById('email-alert-btn');
    const smsAlertBtn = document.getElementById('sms-alert-btn');

    markReadBtn.addEventListener('click', () => {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        document.querySelector('.badge').textContent = '0';
        showModal('Success', 'All notifications marked as read!');
    });

    emailAlertBtn.addEventListener('click', () => {
        showModal('Email Alert', 'Email alerts sent to all registered users!');
    });

    smsAlertBtn.addEventListener('click', () => {
        showModal('SMS Alert', 'SMS alerts sent to all registered users!');
    });
}

function initializeModelsPage() {
    const deployBtn = document.getElementById('deploy-btn');
    const deviceSelect = document.getElementById('device-select');

    deployBtn.addEventListener('click', () => {
        const selectedDevice = deviceSelect.value;
        if (selectedDevice) {
            showModal('Deployment Success', `Model deployed successfully to ${selectedDevice}!`);
        } else {
            showModal('Error', 'Please select a device first!');
        }
    });

    const downloadBtns = document.querySelectorAll('.model-card button');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelName = e.target.closest('.model-card').querySelector('h4').textContent;
            const btnText = e.target.textContent;
            showModal('Download Started', `${modelName} ${btnText} started!`);
        });
    });
}

function initializeSettingsPage() {
    const saveBtn = document.getElementById('save-settings-btn');
    const darkModeToggle = document.getElementById('dark-mode');

    saveBtn.addEventListener('click', () => {
        showModal('Settings Saved', 'Your settings have been saved successfully!');
    });

    darkModeToggle.addEventListener('change', (e) => {
        if (!e.target.checked) {
            showModal('Light Mode', 'Light mode is not implemented in this prototype.');
            e.target.checked = true;
        }
    });
}

function initializeSystemHealthPage() {
    const clearDataBtn = document.getElementById('clear-data-btn');

    clearDataBtn.addEventListener('click', () => {
        const retentionDays = document.getElementById('retention-select').value;
        showModal('Data Cleared', `Data older than ${retentionDays} days has been cleared!`);
    });

    setInterval(() => {
        updateSystemMetrics();
    }, 3000);
}

function updateSystemMetrics() {
    const cpuValue = Math.floor(Math.random() * 30) + 40;
    const gpuValue = Math.floor(Math.random() * 30) + 60;
    const memoryValue = Math.floor(Math.random() * 30) + 50;

    document.getElementById('cpu-bar').style.width = `${cpuValue}%`;
    document.getElementById('cpu-value').textContent = `${cpuValue}%`;

    document.getElementById('gpu-bar').style.width = `${gpuValue}%`;
    document.getElementById('gpu-value').textContent = `${gpuValue}%`;

    document.getElementById('memory-bar').style.width = `${memoryValue}%`;
    document.getElementById('memory-value').textContent = `${memoryValue}%`;
}

function showModal(title, message) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <p style="margin-top: 1rem; color: var(--text-secondary);">${message}</p>
        <button class="btn-primary" onclick="document.getElementById('modal').style.display='none'" style="margin-top: 1.5rem;">OK</button>
    `;
    modal.style.display = 'block';
}
