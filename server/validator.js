const predictability = require("./checks/predictability");
const keyboard = require("./checks/keyboard");
const repetition = require("./checks/repetition");
const visual = require("./checks/visual");
const structure = require("./checks/structure");

function evaluatePassword(password) {
    let score = 50; // Start with base score
    let issues = [];
    let positives = [];

    if (structure.hasIntentionalStructure(password)) {
        score += 30;
        positives.push("Good intentional structure");
    } else {
        score -= 20;
        issues.push("Lacks intentional structure");
    }

    if (predictability.hasSequentialPattern(password)) {
        score -= 20;
        issues.push("Sequential pattern detected");
    }

    if (repetition.hasExcessiveRepetition(password)) {
        score -= 15;
        issues.push("Excessive repetition detected");
    }

    if (keyboard.hasKeyboardPattern(password)) {
        score -= 15;
        issues.push("Keyboard pattern detected");
    }

    if (visual.hasVisualConfusion(password)) {
        score -= 10;
        issues.push("Visually confusing characters");
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        strength: score > 75 ? "Strong" : score > 50 ? "Moderate" : "Weak",
        issues,
        positives
    };
}
module.exports = { evaluatePassword };

