document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadRecentActivity();
    setupTimeRangeFilter();
    updateMetrics();
});

function updateMetrics() {
    // Get applications from localStorage
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const timeRange = document.getElementById('timeRange').value;
    
    // Filter applications based on selected time range
    const filteredApps = filterApplicationsByTimeRange(applications, timeRange);
    
    // Update total applications
    const totalApps = filteredApps.length;
    document.getElementById('totalApplications').textContent = totalApps;
    
    // Update interviews scheduled
    const totalInterviews = filteredApps.filter(app => app.status === 'interview').length;
    document.getElementById('totalInterviews').textContent = totalInterviews;
    
    // Calculate and update response rate based on gotResponse field
    const responsesReceived = filteredApps.filter(app => app.gotResponse).length;
    const responseRate = totalApps > 0 
        ? Math.round((responsesReceived / totalApps) * 100) 
        : 0;
    document.getElementById('responseRate').textContent = `${responseRate}%`;
    
    // Update pie chart
    updateStatusChart(filteredApps);
    
    // Update application sources
    updateSourcesChart(filteredApps);
}

function filterApplicationsByTimeRange(applications, timeRange) {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch(timeRange) {
        case '7':
            cutoffDate.setDate(now.getDate() - 7);
            break;
        case '30':
            cutoffDate.setDate(now.getDate() - 30);
            break;
        case '90':
            cutoffDate.setDate(now.getDate() - 90);
            break;
        default:
            return applications; // 'all' case - return all applications
    }
    
    return applications.filter(app => {
        const appDate = new Date(app.dateApplied);
        return appDate >= cutoffDate;
    });
}

function updateStatusChart(applications) {
    // Count applications by status
    const statusCounts = {
        applied: applications.filter(app => app.status === 'applied').length,
        interview: applications.filter(app => app.status === 'interview').length,
        offer: applications.filter(app => app.status === 'offer').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        noResponse: applications.filter(app => app.status === 'noResponse').length
    };
    
    // Get the existing chart instance
    const chart = Chart.getChart('statusChart');
    
    // Update chart data
    if (chart) {
        chart.data.datasets[0].data = [
            statusCounts.applied,
            statusCounts.interview,
            statusCounts.offer,
            statusCounts.rejected,
            statusCounts.noResponse
        ];
        chart.update();
    }
}

function updateSourcesChart(applications) {
    // Count applications by source
    const sourceCounts = applications.reduce((acc, app) => {
        const source = app.applicationSource || 'other';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
    }, {});

    // Convert to percentages and sort by count
    const total = applications.length;
    const sourcePercentages = Object.entries(sourceCounts)
        .map(([source, count]) => ({
            source: source,
            displayName: formatSourceName(source),
            percentage: Math.round((count / total) * 100),
            count: count
        }))
        .sort((a, b) => b.count - a.count);

    // Update the sources bar
    const sourcesBar = document.querySelector('.sources-bar');
    sourcesBar.innerHTML = '';

    // Only show top 4 sources, combine rest into "Other"
    let displaySources = sourcePercentages.slice(0, 4);
    if (sourcePercentages.length > 4) {
        const otherPercentage = sourcePercentages
            .slice(4)
            .reduce((sum, source) => sum + source.percentage, 0);
        
        if (otherPercentage > 0) {
            displaySources.push({
                source: 'other',
                displayName: 'Other',
                percentage: otherPercentage
            });
        }
    }

    // Create and append source elements
    displaySources.forEach(item => {
        if (item.percentage > 0) {
            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'source';
            sourceDiv.setAttribute('data-source', item.source);
            sourceDiv.style.width = `${item.percentage}%`;
            sourceDiv.textContent = `${item.displayName} ${item.percentage}%`;
            sourcesBar.appendChild(sourceDiv);
        }
    });
}

function formatSourceName(source) {
    // Convert source values to display names
    const sourceNames = {
        linkedin: 'LinkedIn',
        indeed: 'Indeed',
        company_website: 'Company Website',
        employee_referral: 'Employee Referral',
        glassdoor: 'Glassdoor',
        ziprecruiter: 'ZipRecruiter',
        job_fair: 'Job Fair',
        professional_network: 'Prof. Network',
        university: 'University',
        internal: 'Internal',
        social_media: 'Social Media',
        company_ats: 'Company ATS',
        cold_application: 'Cold Application',
        job_board_other: 'Other Job Board',
        referral_other: 'Other Referral',
        other: 'Other'
    };
    return sourceNames[source] || source;
}

function initializeCharts() {
    // Initialize the status pie chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['Applied', 'Interview', 'Offer', 'Rejected', 'No Response'],
            datasets: [{
                data: [0, 0, 0, 0, 0], // Start with zeros, will be updated
                backgroundColor: [
                    '#e3f2fd', // Applied (light blue)
                    '#fff3e0', // Interview (light orange)
                    '#e8f5e9', // Offer (light green)
                    '#ffebee', // Rejected (light red)
                    '#f5f5f5'  // No Response (light grey)
                ],
                borderColor: [
                    '#1976d2', // Applied (blue)
                    '#f57c00', // Interview (orange)
                    '#2e7d32', // Offer (green)
                    '#c62828', // Rejected (red)
                    '#9e9e9e'  // No Response (grey)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: "'Harmattan', sans-serif"
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);
                                    return {
                                        text: `${label} (${data.datasets[0].data[i]})`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: 1,
                                        hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

function loadRecentActivity() {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    // Sort applications by date, most recent first
    const sortedApps = applications.sort((a, b) => 
        new Date(b.dateApplied) - new Date(a.dateApplied)
    );
    
    // Take the 4 most recent applications
    const recentApps = sortedApps.slice(0, 4);
    
    const activityContainer = document.getElementById('recentActivity');
    activityContainer.innerHTML = recentApps.map(app => {
        const timeAgo = getTimeAgo(new Date(app.dateApplied));
        const statusColors = {
            applied: '#1976d2',
            interview: '#f57c00',
            offer: '#2e7d32',
            rejected: '#c62828',
            noResponse: '#9e9e9e'
        };
        
        return `
            <div class="activity-item">
                <div class="activity-indicator" style="background-color: ${statusColors[app.status]}"></div>
                <div class="activity-details">
                    <div class="activity-company">${app.company}</div>
                    <div class="activity-date">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
}

function setupTimeRangeFilter() {
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', () => {
        updateMetrics();
    });
}

// Add export functionality
document.querySelector('.export-btn').addEventListener('click', () => {
    // Here you would implement the export functionality
    alert('Exporting report...');
});

// Add this to applications.js to trigger analytics update when applications change
function updateAnalytics() {
    // Check if we're on the analytics page
    const analyticsPage = document.getElementById('statusChart');
    if (analyticsPage) {
        updateMetrics();
        loadRecentActivity();
    }
}

// Modify the existing handleAddJob function in applications.js to include:
function handleAddJob(e) {
    // ... existing code ...
    
    applications.push(newJob);
    saveApplications();
    renderApplications();
    updateAnalytics(); // Add this line
    closeModal();
    e.target.reset();
}

// Also modify deleteApplication in applications.js:
function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        applications = applications.filter(a => a.id !== id);
        saveApplications();
        renderApplications();
        updateAnalytics(); // Add this line
    }
}

// Update the editApplication function to handle the response checkbox
function editApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    // Populate the modal with existing data
    document.getElementById('company').value = app.company;
    document.getElementById('position').value = app.position;
    document.getElementById('dateApplied').value = app.dateApplied;
    document.getElementById('status').value = app.status;
    document.getElementById('gotResponse').checked = app.gotResponse;
    document.getElementById('notes').value = app.notes;

    // Open the modal
    openModal();

    // Remove the old application when saving
    applications = applications.filter(a => a.id !== id);
} 