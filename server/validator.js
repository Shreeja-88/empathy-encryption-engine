const predictability = require("./checks/predictability");
const keyboard = require("./checks/keyboard");
const repetition = require("./checks/repetition");
const visual = require("./checks/visual");
const structure = require("./checks/structure");

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

// Common passwords / trivially guessable patterns — reject outright
const COMMON_PASSWORDS = new Set([
    "password", "password1", "password123", "123456", "12345678",
    "qwerty", "qwerty123", "abc123", "iloveyou", "admin", "letmein",
    "welcome", "monkey", "dragon", "master", "sunshine", "princess",
    "football", "shadow", "superman", "batman", "111111", "000000",
    "pass1234", "pass@123", "test1234",
]);

// Visually ambiguous characters that confuse users when read on screen/aloud
const AMBIGUOUS_CHARS = new Set("0O1lI|");

// Keyboard walk sequences (horizontal rows, common patterns)
const KEYBOARD_WALKS = [
    "qwerty", "qwertyuiop", "asdfgh", "asdfghjkl", "zxcvbn", "zxcvbnm",
    "1234567890", "0987654321", "abcdef", "abcdefgh", "zyxwvut",
    "qazwsx", "wsxedc", "edcrfv", "rfvtgb", "tgbyhn", "yhnujm",
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

function shannonEntropy(s) {
    if (!s) return 0.0;
    const freq = {};
    for (const char of s) {
        freq[char] = (freq[char] || 0) + 1;
    }
    const length = s.length;
    return -Object.values(freq).reduce((sum, count) => {
        const p = count / length;
        return sum + p * Math.log2(p);
    }, 0);
}

function uniqueCharRatio(s) {
    return new Set(s).size / s.length;
}

function hasKeyboardWalk(s) {
    const lower = s.toLowerCase();
    for (const walk of KEYBOARD_WALKS) {
        for (let i = 0; i <= walk.length - 4; i++) {
            const sub = walk.slice(i, i + 4);
            if (lower.includes(sub) || lower.includes(sub.split('').reverse().join(''))) {
                return true;
            }
        }
    }
    return false;
}

function repetitionScore(s) {
    if (s.length <= 1) return 1.0;
    let maxRep = 0;
    for (let length = 1; length <= 3; length++) {
        for (let i = 0; i <= s.length - length; i++) {
            const chunk = s.slice(i, i + length);
            let count = 0;
            let pos = 0;
            while (pos < s.length) {
                const idx = s.indexOf(chunk, pos);
                if (idx === -1) break;
                count++;
                pos = idx + 1;
            }
            maxRep = Math.max(maxRep, count * length);
        }
    }
    return Math.min(maxRep / s.length, 1.0);
}

function consecutiveSameChars(s) {
    let maxRun = 1;
    let currentRun = 1;
    for (let i = 1; i < s.length; i++) {
        if (s[i].toLowerCase() === s[i - 1].toLowerCase()) {
            currentRun++;
            maxRun = Math.max(maxRun, currentRun);
        } else {
            currentRun = 1;
        }
    }
    return maxRun;
}

function hasHumanStructure(s) {
    // Year pattern (humans love embedding years)
    if (/(19|20)\d{2}/.test(s)) return true;

    // Meaningful CamelCase: two consecutive alpha segments of 3+ chars each
    if (/[A-Za-z]{3,}[A-Z][a-z]{2,}/.test(s)) return true;

    // Word + separator + number — classic human pattern
    const alphaClusters = s.match(/[A-Za-z]{3,}/g) || [];
    const meaningfulClusters = alphaClusters.filter(seg => /[A-Z]{2,}|[a-z]{2,}/.test(seg));
    if (meaningfulClusters.length >= 2) return true;

    // Single meaningful word followed by digits
    const wordDigitMatch = s.match(/[A-Za-z]{4,}(?=\d+)/);
    if (wordDigitMatch && /[A-Z]{2,}|[a-z]{2,}/.test(wordDigitMatch[0])) return true;

    // Word + symbol in any order with digit somewhere
    if (/[A-Za-z]{3,}[^A-Za-z0-9]\d/.test(s)) return true;
    if (/[A-Za-z]{3,}\d{2,}/.test(s)) return true;

    // Alphabetic segment of 5+ consecutive chars
    const alphaSegments = s.match(/[A-Za-z]{5,}/g) || [];
    for (const seg of alphaSegments) {
        let alternating = true;
        for (let i = 0; i < seg.length - 1; i++) {
            if (!((seg[i] === seg[i].toUpperCase() && seg[i+1] === seg[i+1].toLowerCase()) ||
                  (seg[i] === seg[i].toLowerCase() && seg[i+1] === seg[i+1].toUpperCase()))) {
                alternating = false;
                break;
            }
        }
        if (!alternating) return true;
    }

    return false;
}

function hasAmbiguousChars(s) {
    return [...s].some(c => AMBIGUOUS_CHARS.has(c));
}

function characterVarietyScore(s) {
    let score = 0;
    if (/[A-Z]/.test(s)) score++;
    if (/[a-z]/.test(s)) score++;
    if (/\d/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    return score;
}

// ---------------------------------------------------------------------------
// MAIN VALIDATION FUNCTION
// ---------------------------------------------------------------------------

function isValidPassword(password) {
    // ------------------------------------------------------------------
    // HARD REJECTIONS — Fail immediately, no partial credit
    // ------------------------------------------------------------------

    // 1. Minimum length: 8 chars
    if (password.length < 8) return false;

    // 2. Maximum length: 64 chars
    if (password.length > 64) return false;

    // 3. Common password blocklist
    if (COMMON_PASSWORDS.has(password.toLowerCase())) return false;

    // 4. All characters the same
    if (new Set(password.toLowerCase()).size === 1) return false;

    // 5. Pure numeric
    if (/^\d+$/.test(password)) return false;

    // 6. Pure alphabetic with no other variety
    if (/^[A-Za-z]+$/.test(password)) return false;

    // 7. Keyboard walk detected
    if (hasKeyboardWalk(password)) return false;

    // 8. Consecutive same characters run ≥ 5
    if (consecutiveSameChars(password) >= 5) return false;

    // 9. All-unique characters + no human structure = machine-generated
    if (uniqueCharRatio(password) >= 0.95 && !hasHumanStructure(password)) return false;

    // ------------------------------------------------------------------
    // SOFT SCORING — Accumulate points, require a minimum threshold
    // ------------------------------------------------------------------
    let score = 0;

    // SECURITY — Length bonus
    if (password.length >= 10) score += 1;
    if (password.length >= 12) score += 1;

    // SECURITY — Character variety
    const variety = characterVarietyScore(password);
    if (variety < 2) return false; // Hard rejection
    score += (variety - 1);

    // INTENTIONALITY & BALANCE — Entropy check
    const entropy = shannonEntropy(password);
    if (entropy < 2.0) return false; // Too repetitive

    // Suspiciously random
    const ucr = uniqueCharRatio(password);
    if (entropy > 4.8 && ucr > 0.80 && !hasHumanStructure(password)) return false;

    if (entropy >= 2.5 && entropy <= 4.8) score += 2;

    // INTENTIONALITY — Unique character ratio
    if (ucr >= 0.4 && ucr <= 0.85) score += 1;

    // INTENTIONALITY — Repetition check
    const rep = repetitionScore(password);
    if (rep < 0.5) score += 1;
    else if (rep > 0.75) return false;

    // VISUAL CLARITY — Penalize ambiguous characters
    if (hasAmbiguousChars(password)) score -= 1;

    // HUMAN STRUCTURE — Signs of thoughtful composition
    if (hasHumanStructure(password)) score += 2;

    // All-same-case with no structure feels like a brute-force artifact
    if (/^[A-Z]+$/.test(password) || /^[a-z]+$/.test(password)) score -= 1;

    // ------------------------------------------------------------------
    // FINAL DECISION — Require a minimum score of 5
    // ------------------------------------------------------------------
    return score >= 5;
}

function evaluatePassword(password, mode = 'empathy') {
    if (mode === 'strict') {
        return evaluateStrictMode(password);
    } else {
        return evaluateEmpathyMode(password);
    }
}

function evaluateEmpathyMode(password) {
    const isValid = isValidPassword(password);

    // For backward compatibility with the UI, we'll still provide a score-like response
    // But now it's binary: valid or invalid
    let score = isValid ? 85 : 25; // High score for valid, low for invalid
    let strength = isValid ? "Strong" : "Weak";
    let issues = [];
    let positives = [];

    if (isValid) {
        positives.push("Meets all empathy encryption principles");
        positives.push("Good intentional structure and balance");
    } else {
        issues.push("Does not meet empathy encryption requirements");
        // Could add more specific feedback here if needed
    }

    return {
        score,
        strength,
        issues,
        positives,
        isValid // Add this for clearer API
    };
}

function evaluateStrictMode(password) {
    let score = 0;
    let issues = [];
    let positives = [];
    let isValid = true;

    // Length requirements
    if (password.length < 8) {
        issues.push("Password must be at least 8 characters long");
        isValid = false;
    } else if (password.length >= 8) {
        score += 20;
        positives.push("Good minimum length");
    }

    if (password.length >= 12) {
        score += 20;
        positives.push("Excellent length");
    }

    // Character variety requirements (more lenient - only need 2 types)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

    if (varietyCount < 2) {
        issues.push("Password must contain at least 2 of: lowercase, uppercase, digits, special characters");
        isValid = false;
    } else {
        score += varietyCount * 15;
        positives.push(`Character variety (${varietyCount} types)`);
    }

    // Check for common patterns (basic)
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        issues.push("Password is too common");
        isValid = false;
        score = 0;
    }

    // Basic keyboard pattern check (penalty only, not rejection)
    if (hasKeyboardWalk(password)) {
        score -= 15;
        issues.push("Contains keyboard patterns");
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    const strength = score >= 80 ? "Strong" : score >= 60 ? "Moderate" : "Weak";

    return {
        score,
        strength,
        issues,
        positives,
        isValid
    };
}

module.exports = { evaluatePassword };

