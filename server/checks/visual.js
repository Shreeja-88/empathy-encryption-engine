function hasVisualConfusion(password) {
    // Characters that look similar: 0/O, 1/l/I, etc.
    const confusingChars = /[01lIiOo]/;

    // If password has many confusing characters, it might be visually confusing
    const matches = password.match(confusingChars);
    if (matches && matches.length > password.length * 0.3) {
        return true;
    }

    // Check for patterns that might confuse visually, like alternating cases randomly
    // But for now, keep it simple

    return false;
}

module.exports = { hasVisualConfusion };