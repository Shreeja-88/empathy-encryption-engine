// Password visibility toggle
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
});

// Live validation function
async function validate() {
    const password = document.getElementById("password").value;

    if (!password) {
        // Clear results if password is empty
        document.getElementById("result").style.display = 'none';
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        updateUI(data);
        document.getElementById("result").style.display = 'block';
    } catch (error) {
        console.error('Validation error:', error);
    }
}

// Update UI with validation results
function updateUI(data) {
    // Update score and progress bar
    document.getElementById("score").textContent = data.score;
    const progressBar = document.getElementById("progress");
    progressBar.style.width = `${data.score}%`;

    // Update progress bar color based on score
    if (data.score < 40) {
        progressBar.style.background = '#ff4757'; // Red
    } else if (data.score < 70) {
        progressBar.style.background = '#ffa726'; // Orange
    } else {
        progressBar.style.background = '#4caf50'; // Green
    }

    // Update strength badge
    const strengthBadge = document.getElementById("strength-badge");
    strengthBadge.textContent = data.strength;
    strengthBadge.className = `strength-badge ${data.strength.toLowerCase()}`;

    // Update issues
    const issuesContainer = document.getElementById("issues");
    if (data.issues && data.issues.length > 0) {
        issuesContainer.innerHTML = '<h4>Issues Found:</h4>' +
            data.issues.map(issue => `<div class="issue-item">${issue}</div>`).join('');
    } else {
        issuesContainer.innerHTML = '<h4>Issues Found:</h4><div class="issue-item" style="border-left-color: #4caf50; color: #4caf50;">No issues detected!</div>';
    }

    // Update positives
    const positivesContainer = document.getElementById("positives");
    if (data.positives && data.positives.length > 0) {
        positivesContainer.innerHTML = '<h4>Strengths:</h4>' +
            data.positives.map(positive => `<div class="positive-item">${positive}</div>`).join('');
    } else {
        positivesContainer.innerHTML = '';
    }
}

// Smooth scroll for CTA button
document.querySelector('.cta-button').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#validator').scrollIntoView({
        behavior: 'smooth'
    });
});

// Add loading animation to progress bar
document.addEventListener('DOMContentLoaded', function() {
    // Initial validation if there's text in the input
    validate();
});
