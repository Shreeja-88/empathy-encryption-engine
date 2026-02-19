function hasKeyboardPattern(password) {
    const keyboardPatterns = [
        /qwerty|asdf|zxcv|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik,|ol\.|p;\//i,
        /123456|654321|098765|567890/i,
        /qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm/i
    ];

    const lowerPassword = password.toLowerCase();
    for (const pattern of keyboardPatterns) {
        if (pattern.test(lowerPassword)) {
            return true;
        }
    }

    return false;
}

module.exports = { hasKeyboardPattern };