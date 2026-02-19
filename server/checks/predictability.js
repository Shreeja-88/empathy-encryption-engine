function hasSequentialPattern(password) {
    // Check for numeric sequences like 123, 456
    if (/012|123|234|345|456|567|678|789|890/.test(password)) {
        return true;
    }

    // Check for alphabetic sequences like abc, xyz
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(password.toLowerCase())) {
        return true;
    }

    // Check for repeated characters like aaa, 111
    if (/(.)\1{2,}/.test(password)) {
        return true;
    }

    return false;
}

module.exports = { hasSequentialPattern };