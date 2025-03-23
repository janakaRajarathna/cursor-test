// DOM Elements
const submissionsList = document.getElementById('submissionsList');
const gradeSubmissionModal = new bootstrap.Modal(document.getElementById('gradeSubmissionModal'));
const saveGradeBtn = document.getElementById('saveGradeBtn');

let currentSubmissionId = null;

// Event Listeners
saveGradeBtn.addEventListener('click', async () => {
    const marks = document.getElementById('marks').value;
    const feedback = document.getElementById('feedback').value.trim();

    if (!marks) {
        showAlert('Please enter marks', 'danger');
        return;
    }

    try {
        showLoading();
        await apiRequest(`submissions/${currentSubmissionId}/grade`, {
            method: 'PUT',
            body: JSON.stringify({
                marks: parseFloat(marks),
                feedback
            })
        });

        gradeSubmissionModal.hide();
        loadSubmissions();
        showAlert('Submission graded successfully');
    } catch (error) {
        console.error('Grade submission error:', error);
    } finally {
        hideLoading();
    }
});

// Load submissions
async function loadSubmissions() {
    try {
        showLoading();
        const response = await apiRequest('submissions');
        displaySubmissions(response.submissions);
    } catch (error) {
        console.error('Load submissions error:', error);
    } finally {
        hideLoading();
    }
}

// Display submissions
function displaySubmissions(submissions) {
    submissionsList.innerHTML = '';

    submissions.forEach(submission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${submission.assignment_title}</td>
            <td>${submission.student_name}</td>
            <td>${new Date(submission.submitted_at).toLocaleString()}</td>
            <td>
                ${submission.marks !== null ?
                `<span class="badge badge-graded">Graded (${submission.marks})</span>` :
                `<span class="badge badge-pending">Pending</span>`
            }
            </td>
            <td>
                ${currentUser.role === 'lecturer' && submission.marks === null ? `
                    <button class="btn btn-primary btn-sm grade-submission" data-id="${submission.id}">
                        Grade
                    </button>
                ` : ''}
                <a href="/uploads/${submission.file_path}" class="btn btn-secondary btn-sm" target="_blank">
                    View
                </a>
            </td>
        `;

        // Add event listener for grade button
        const gradeBtn = row.querySelector('.grade-submission');
        if (gradeBtn) {
            gradeBtn.addEventListener('click', () => {
                currentSubmissionId = submission.id;
                gradeSubmissionModal.show();
            });
        }

        submissionsList.appendChild(row);
    });
}

// Export functions
window.loadSubmissions = loadSubmissions; 