function hasExcessiveRepetition(password) {
    // Check for more than 3 consecutive same characters
    if (/(.)\1{3,}/.test(password)) {
        return true;
    }

    // Check for alternating repetition like ababab
    if (/(.)(.)\1\2{2,}/.test(password)) {
        return true;
    }

    // Check if more than 50% of characters are the same
    const charCount = {};
    for (const char of password) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    const maxCount = Math.max(...Object.values(charCount));
    if (maxCount / password.length > 0.5) {
        return true;
    }

    return false;
}

module.exports = { hasExcessiveRepetition };