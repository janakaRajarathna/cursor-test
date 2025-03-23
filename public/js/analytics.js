// Chart instances
let studentPerformanceChart = null;
let classPerformanceChart = null;

// Load analytics
async function loadAnalytics() {
    try {
        showLoading();

        // Load student performance
        const studentResponse = await apiRequest(`analytics/student/${currentUser.id}`);
        displayStudentPerformance(studentResponse.performance);

        // Load class performance if user is a lecturer
        if (currentUser.role === 'lecturer') {
            const classResponse = await apiRequest(`analytics/class/${currentUser.id}`);
            displayClassPerformance(classResponse.performance);
        }
    } catch (error) {
        console.error('Load analytics error:', error);
    } finally {
        hideLoading();
    }
}

// Display student performance
function displayStudentPerformance(performance) {
    const ctx = document.getElementById('studentPerformanceChart').getContext('2d');

    // Destroy existing chart if it exists
    if (studentPerformanceChart) {
        studentPerformanceChart.destroy();
    }

    // Prepare data for the chart
    const labels = performance.performanceTrend.map(item =>
        new Date(item.date).toLocaleDateString()
    );
    const data = performance.performanceTrend.map(item => item.percentage);

    // Create new chart
    studentPerformanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance Trend',
                data: data,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Student Performance Over Time'
                }
            }
        }
    });

    // Display performance metrics
    const metricsHtml = `
        <div class="row mt-4">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Assignments</h5>
                        <p class="card-text display-6">${performance.totalAssignments}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Completed</h5>
                        <p class="card-text display-6">${performance.completedAssignments}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Average Marks</h5>
                        <p class="card-text display-6">${performance.averageMarks.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Submission Rate</h5>
                        <p class="card-text display-6">${performance.submissionRate.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('studentPerformanceChart').parentElement.insertAdjacentHTML('afterend', metricsHtml);
}

// Display class performance
function displayClassPerformance(performance) {
    const ctx = document.getElementById('classPerformanceChart').getContext('2d');

    // Destroy existing chart if it exists
    if (classPerformanceChart) {
        classPerformanceChart.destroy();
    }

    // Prepare data for the chart
    const labels = Object.keys(performance.marksDistribution);
    const data = Object.values(performance.marksDistribution);

    // Create new chart
    classPerformanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Students',
                data: data,
                backgroundColor: [
                    '#dc3545',
                    '#ffc107',
                    '#0dcaf0',
                    '#198754',
                    '#0d6efd'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Marks Range'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Class Performance Distribution'
                }
            }
        }
    });

    // Display class metrics
    const metricsHtml = `
        <div class="row mt-4">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total Students</h5>
                        <p class="card-text display-6">${performance.totalStudents}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Submitted</h5>
                        <p class="card-text display-6">${performance.submittedCount}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Average Marks</h5>
                        <p class="card-text display-6">${performance.averageMarks.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Submission Rate</h5>
                        <p class="card-text display-6">${performance.submissionRate.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('classPerformanceChart').parentElement.insertAdjacentHTML('afterend', metricsHtml);
}

// Export functions
window.loadAnalytics = loadAnalytics; 