let currentUser = null;
let charts = {};
let selectedImage = null;
let enhancedImage = null;
let selectedThreatImage = null;

const rolePermissions = {
    admin: ['dashboard', 'upload', 'threat', 'reports', 'analytics', 'health', 'notifications', 'models', 'settings'],
    operator: ['dashboard', 'upload', 'threat', 'reports', 'analytics', 'health', 'notifications', 'models'],
    viewer: ['dashboard', 'threat', 'reports', 'analytics', 'health', 'notifications']
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
    const sampleImages = document.querySelectorAll('.sample-image-card');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const selectedPreview = document.getElementById('selected-preview');
    const previewImage = document.getElementById('preview-image');
    const proceedBtn = document.getElementById('proceed-to-step2');
    const startEnhanceBtn = document.getElementById('start-enhancement-btn');
    const downloadBtn = document.getElementById('download-enhanced-btn');
    const resetBtn = document.getElementById('reset-enhancement-btn');
    const proceedThreatBtn = document.getElementById('proceed-to-threat');

    sampleImages.forEach(card => {
        card.addEventListener('click', () => {
            sampleImages.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const imagePath = card.dataset.image;
            selectedImage = imagePath;
            previewImage.src = imagePath;
            selectedPreview.style.display = 'block';
        });
    });

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

    proceedBtn.addEventListener('click', () => {
        goToEnhancementStep(2);
    });

    startEnhanceBtn.addEventListener('click', () => {
        performEnhancement();
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'enhanced-image.jpg';
        link.href = document.getElementById('enhanced-image').src;
        link.click();
        showModal('Download Started', 'Enhanced image download started!');
    });

    resetBtn.addEventListener('click', () => {
        resetEnhancement();
    });

    proceedThreatBtn.addEventListener('click', () => {
        navigateToPage('threat');
        if (enhancedImage) {
            setTimeout(() => {
                loadImageToThreatDetection(enhancedImage);
            }, 300);
        }
    });
}

function handleFileUpload(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImage = e.target.result;
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('selected-preview').style.display = 'block';
            document.querySelectorAll('.sample-image-card').forEach(c => c.classList.remove('selected'));
        };
        reader.readAsDataURL(file);
    }
}

function goToEnhancementStep(stepNum) {
    const steps = document.querySelectorAll('#upload-page .step');
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNum}`).classList.add('active');
}

function performEnhancement() {
    goToEnhancementStep(3);

    const processItems = [
        { id: 'process-1', text: 'Loading image...', delay: 500 },
        { id: 'process-2', text: 'Applying AI model...', delay: 1500 },
        { id: 'process-3', text: 'Enhancing details...', delay: 2500 },
        { id: 'process-4', text: 'Calculating metrics...', delay: 3500 }
    ];

    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(showEnhancedResults, 500);
        }
    }, 60);

    processItems.forEach((item, index) => {
        setTimeout(() => {
            const el = document.getElementById(item.id);
            el.classList.add('active');
            if (index > 0) {
                const prevEl = document.getElementById(processItems[index-1].id);
                prevEl.classList.remove('active');
                prevEl.classList.add('completed');
                prevEl.querySelector('i').className = 'fas fa-check-circle';
            }
        }, item.delay);
    });

    setTimeout(() => {
        const lastItem = document.getElementById('process-4');
        lastItem.classList.remove('active');
        lastItem.classList.add('completed');
        lastItem.querySelector('i').className = 'fas fa-check-circle';
    }, 4000);
}

function showEnhancedResults() {
    goToEnhancementStep(4);

    document.getElementById('original-image').src = selectedImage;
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.filter = 'contrast(1.35) brightness(1.15) saturate(1.4)';
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.15);
            data[i + 1] = Math.min(255, data[i + 1] * 1.12);
            data[i + 2] = Math.min(255, data[i + 2] * 1.2);
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        enhancedImage = canvas.toDataURL('image/jpeg', 0.95);
        document.getElementById('enhanced-image').src = enhancedImage;
    };
    img.src = selectedImage;

    document.getElementById('psnr-value').textContent = (29.5 + Math.random() * 4).toFixed(2);
    document.getElementById('ssim-value').textContent = (0.88 + Math.random() * 0.08).toFixed(3);
    document.getElementById('uiqm-value').textContent = (3.1 + Math.random() * 0.9).toFixed(2);
}

function resetEnhancement() {
    goToEnhancementStep(1);
    selectedImage = null;
    enhancedImage = null;
    document.getElementById('selected-preview').style.display = 'none';
    document.getElementById('preview-image').src = '';
    document.getElementById('file-input').value = '';
    document.querySelectorAll('.sample-image-card').forEach(c => c.classList.remove('selected'));
    
    document.querySelectorAll('.process-item').forEach((item, index) => {
        item.classList.remove('active', 'completed');
        item.querySelector('i').className = index === 0 ? 'fas fa-circle-notch fa-spin' : 'fas fa-circle';
    });
    
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('progress-text').textContent = '0%';
}

function initializeThreatPage() {
    const threatSampleImages = document.querySelectorAll('.threat-sample-card');
    const threatUploadArea = document.getElementById('threat-upload-area');
    const threatFileInput = document.getElementById('threat-file-input');
    const startDetectionBtn = document.getElementById('start-detection-btn');
    const sendAlertBtn = document.getElementById('send-alert-btn');
    const downloadReportBtn = document.getElementById('download-report-btn');
    const resetDetectionBtn = document.getElementById('reset-detection-btn');

    threatSampleImages.forEach(card => {
        card.addEventListener('click', () => {
            threatSampleImages.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedThreatImage = card.dataset.image;
            goToThreatStep(2);
        });
    });

    threatUploadArea.addEventListener('click', () => threatFileInput.click());

    threatFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedThreatImage = e.target.result;
                goToThreatStep(2);
            };
            reader.readAsDataURL(file);
        }
    });

    startDetectionBtn.addEventListener('click', () => {
        if (selectedThreatImage) {
            performThreatDetection(selectedThreatImage);
        } else {
            showModal('No Image', 'Please select an image first!');
        }
    });

    sendAlertBtn.addEventListener('click', () => {
        showModal('Alert Sent', 'Email and SMS alerts have been sent successfully to all registered users!');
    });

    downloadReportBtn.addEventListener('click', () => {
        showModal('Download Started', 'Threat detection report (PDF) download started!');
    });

    resetDetectionBtn.addEventListener('click', () => {
        resetThreatDetection();
    });
}

function loadImageToThreatDetection(imageSrc) {
    selectedThreatImage = imageSrc;
    goToThreatStep(2);
    showModal('Enhanced Image Loaded', 'Your enhanced image is ready for threat detection. Select a model and click "Start Detection".');
}

function goToThreatStep(stepNum) {
    const steps = document.querySelectorAll('.threat-step');
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`threat-step${stepNum}`).classList.add('active');
}

function performThreatDetection(imageSrc) {
    goToThreatStep(3);

    const canvas = document.getElementById('detection-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const threats = generateRandomThreats();
        
        threats.forEach(threat => {
            const x = threat.x * canvas.width;
            const y = threat.y * canvas.height;
            const w = threat.w * canvas.width;
            const h = threat.h * canvas.height;

            ctx.strokeStyle = threat.severity === 'high' ? '#ef4444' : threat.severity === 'medium' ? '#eab308' : '#22c55e';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, w, h);

            ctx.fillStyle = threat.severity === 'high' ? '#ef4444' : threat.severity === 'medium' ? '#eab308' : '#22c55e';
            ctx.font = 'bold 16px Arial';
            const label = `${threat.type} ${(threat.confidence * 100).toFixed(0)}%`;
            const metrics = ctx.measureText(label);
            ctx.fillRect(x, y - 25, metrics.width + 10, 25);
            ctx.fillStyle = '#fff';
            ctx.fillText(label, x + 5, y - 7);
        });

        populateThreatsTable(threats);
        
        const highestSeverity = threats.some(t => t.severity === 'high') ? 'HIGH' : 
                               threats.some(t => t.severity === 'medium') ? 'MEDIUM' : 'LOW';
        const detectedImage = canvas.toDataURL('image/jpeg', 0.95);
        const psnr = document.getElementById('psnr-value')?.textContent;
        const ssim = document.getElementById('ssim-value')?.textContent;
        const uiqm = document.getElementById('uiqm-value')?.textContent;
        
        updateReportData(selectedImage, enhancedImage || selectedImage, detectedImage, threats.length, psnr, ssim, uiqm);
        
        if (document.getElementById('report-severity')) {
            document.getElementById('report-severity').textContent = highestSeverity;
        }
    };

    img.src = imageSrc;
}

function generateRandomThreats() {
    const threatTypes = ['Mine', 'Submarine', 'Debris', 'Unknown Object', 'Naval Vessel'];
    const numThreats = Math.floor(Math.random() * 3) + 2;
    const threats = [];

    for (let i = 0; i < numThreats; i++) {
        const confidence = 0.7 + Math.random() * 0.3;
        let severity = 'low';
        if (confidence > 0.9) severity = 'high';
        else if (confidence > 0.8) severity = 'medium';

        threats.push({
            type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
            confidence: confidence,
            severity: severity,
            x: Math.random() * 0.6 + 0.1,
            y: Math.random() * 0.6 + 0.1,
            w: 0.15 + Math.random() * 0.15,
            h: 0.15 + Math.random() * 0.15
        });
    }

    return threats;
}

function populateThreatsTable(threats) {
    const tbody = document.querySelector('#threats-table tbody');
    tbody.innerHTML = '';

    threats.forEach(threat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${threat.type}</td>
            <td>${(threat.confidence * 100).toFixed(1)}%</td>
            <td class="severity-${threat.severity}">${threat.severity.toUpperCase()}</td>
            <td>${(threat.x * 100).toFixed(1)}°N, ${(threat.y * 100).toFixed(1)}°E</td>
        `;
        tbody.appendChild(tr);
    });
}

function resetThreatDetection() {
    selectedThreatImage = null;
    goToThreatStep(1);
    document.querySelectorAll('.threat-sample-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('threat-file-input').value = '';
    const canvas = document.getElementById('detection-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector('#threats-table tbody').innerHTML = '';
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

function downloadReport(type) {
    const typeNames = {
        pdf: 'PDF Report',
        images: 'Raw Images Package',
        json: 'JSON Data',
        model: 'Model Outputs'
    };
    showModal('Download Started', `${typeNames[type]} download will begin shortly!`);
}

function updateThreshold(type, value) {
    document.getElementById(`${type}-value`).textContent = `${value}%`;
}

function toggleAlertMethod(element, method) {
    element.classList.toggle('active');
    const isActive = element.classList.contains('active');
    showModal('Alert Method Updated', `${method.toUpperCase()} alerts ${isActive ? 'enabled' : 'disabled'}`);
}

function saveAlertConfig() {
    const confidence = document.getElementById('confidence-threshold').value;
    const severity = document.getElementById('severity-threshold').value;
    showModal('Configuration Saved', `Alert thresholds saved: Confidence ${confidence}%, Severity ${severity}`);
}

function testAlert() {
    showModal('Test Alert Sent', 'Test alert has been sent via all active methods!');
}

function downloadModel(type) {
    const modelNames = {
        full: 'Full Model Package',
        quantized: 'Quantized Model Package',
        tensorrt: 'TensorRT Optimized Model'
    };
    showModal('Download Started', `${modelNames[type]} download will begin shortly!`);
}

function pullDocker() {
    showModal('Docker Pull Started', 'Docker pull command: docker pull navalsight/maritime-ai:latest\n\nThis will download the pre-configured environment with all dependencies.');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        showModal('Settings Reset', 'All settings have been reset to default values!');
    }
}

function updateReportData(original, enhanced, detected, threats, psnr, ssim, uiqm) {
    if (document.getElementById('report-original')) {
        document.getElementById('report-original').src = original || '';
        document.getElementById('report-enhanced').src = enhanced || '';
        document.getElementById('report-detected').src = detected || '';
        document.getElementById('report-timestamp').textContent = new Date().toLocaleString();
        document.getElementById('report-threats').textContent = threats || '0';
        document.getElementById('report-psnr').textContent = psnr ? `${psnr} dB` : '-';
        document.getElementById('report-ssim').textContent = ssim || '-';
        document.getElementById('report-uiqm').textContent = uiqm || '-';
        
        const selectedModel = document.querySelector('input[name="enhancement-model"]:checked');
        if (selectedModel) {
            const modelCard = selectedModel.closest('.model-option');
            document.getElementById('report-enh-model').textContent = modelCard.querySelector('h4').textContent;
        }
        
        const detectionModel = document.querySelector('input[name="detection-model"]:checked');
        if (detectionModel) {
            const detCard = detectionModel.closest('.detection-model-option');
            document.getElementById('report-det-model').textContent = detCard.querySelector('h4').textContent;
        }
    }
}
