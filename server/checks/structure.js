function hasGoodStructure(password) {
    // Check for minimum length
    if (password.length < 8) {
        return false;
    }

    // Check for variety: has uppercase, lowercase, numbers, special chars
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    return varietyCount >= 3;
}

function hasIntentionalStructure(password) {
    // For now, just check good structure
    return hasGoodStructure(password);
}

module.exports = { hasIntentionalStructure };