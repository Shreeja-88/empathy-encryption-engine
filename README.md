# Empathy Encryption Engine

A full-stack human-centered password validation system that rethinks password security from a user experience perspective. Instead of rigid rule-based validation, it evaluates passwords based on empathy principles: intentionality, balance, visual clarity, and human structure.

## Core Philosophy

Traditional password validators enforce arbitrary rules (8+ chars, special symbols, etc.) without considering user psychology. The Empathy Encryption Engine asks:

- **Is this password intentionally created, not randomly mashed?**
- **Does it balance security with memorability?**
- **Can users read and communicate it clearly?**
- **Does it show thoughtful human structure?**

## Features

### **Dual Validation Modes**

#### **Empathy Mode** (Recommended)
- **Shannon Entropy Analysis** - Measures randomness vs. repetition
- **Human Structure Detection** - Recognizes meaningful patterns (CamelCase, word+symbol+number, embedded years)
- **Keyboard Walk Detection** - Sliding window approach catches partial keyboard patterns
- **Repetition Scoring** - Advanced analysis of repetitive patterns
- **Intentionality Checks** - Rejects machine-generated patterns
- **Binary Validation** - Either meets empathy principles or doesn't

#### **Strict Mode**
- **Traditional Requirements** - Length, character variety, common password blocking
- **Lenient Variety** - Only requires 2 of 4 character types (vs 3+ in empathy)
- **Penalty System** - Keyboard patterns reduce score but don't reject
- **Scored Validation** - 0-100 scale with Moderate/Strong/Weak ratings

### **Modern UI/UX**
- **Live Validation** - Real-time feedback as you type
- **Mode Toggle** - Switch between empathy and strict validation
- **Visual Feedback** - Progress bars, strength badges, issue/positive lists
- **Character Mapping** - Visual breakdown of password composition
- **Glassmorphism Design** - Modern card-based interface with backdrop blur
- **Responsive Layout** - Works on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation
```bash
git clone https://github.com/Shreeja-88/empathy-encryption-engine.git
cd empathy-encryption-engine
npm install
```

### Running the Application
```bash
npm start
```
Open `http://localhost:3000` in your browser (serves the client)  
API runs on `http://localhost:5000`

## 📡 API Documentation

### POST `/validate`

Validates a password using the specified mode.

**Request:**
```json
{
  "password": "yourpassword",
  "mode": "empathy"  // or "strict" (default: "empathy")
}
```

**Response:**
```json
{
  "score": 85,
  "strength": "Strong",
  "issues": [],
  "positives": [
    "Meets all empathy encryption principles",
    "Good intentional structure and balance"
  ],
  "isValid": true
}
```

### Mode Differences

| Password | Empathy Mode | Strict Mode | Why Different? |
|----------|-------------|-------------|----------------|
| `xKzQpWmTnL9#` | ❌ Reject | ✅ Accept | Machine-generated pattern |
| `Hello123` | ✅ Accept | ✅ Accept | Meets both criteria |
| `SkyRain9` | ✅ Accept | ❌ Reject | Missing special characters |
| `qwerty12` | ❌ Reject | ✅ Accept | Keyboard pattern detected |

## Architecture

```
empathy-encryption-engine/
├── client/
│   ├── index.html          # Main UI with validation logic
│   ├── script.js           # Password visibility, mode switching
│   └── style.css           # Glassmorphism design
├── server/
│   ├── index.js            # Express server, API routes
│   ├── validator.js        # Main validation logic
│   └── checks/             # Modular validation components
│       ├── structure.js    # Intentional structure checks
│       ├── predictability.js # Sequential pattern detection
│       ├── repetition.js   # Repetition analysis
│       ├── visual.js       # Visual clarity checks
│       └── keyboard.js     # Keyboard pattern detection
├── package.json
└── README.md
```

## Validation Logic Deep Dive

### Empathy Mode Algorithm

1. **Hard Rejections** (Immediate Fail):
   - Length < 8 or > 64 characters
   - Common password blocklist
   - All identical characters
   - Pure numeric or alphabetic
   - Keyboard walk patterns
   - 5+ consecutive identical characters
   - Too unique without human structure

2. **Soft Scoring** (Weighted Requirements):
   - Length bonuses (10+ chars, 12+ chars)
   - Character variety (3+ types required)
   - Entropy balance (2.5-4.8 bits/char sweet spot)
   - Unique character ratio (0.4-0.85 range)
   - Repetition score (< 0.5 preferred)
   - Human structure bonus (+2 points)
   - Ambiguous character penalty (-1 point)

3. **Final Decision**: Score ≥ 5 required

### Strict Mode Algorithm

1. **Hard Requirements**:
   - Length ≥ 8 characters
   - 2+ character types (uppercase, lowercase, digits, special)
   - Not in common password list

2. **Scoring System**:
   - Length bonuses (8+ chars: +20, 12+ chars: +20)
   - Character variety (+15 per type)
   - Keyboard pattern penalty (-15)

3. **Strength Levels**: 0-39 Weak, 40-69 Moderate, 70+ Strong

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new validation logic
5. Submit a pull request

## Acknowledgments

- **UnsaidTalks Education** for the inspiring hackathon challenge
- **Human-Centered Design** principles that guided the approach
- **Information Theory** (Shannon Entropy) for the technical foundation</content>
<parameter name="filePath">c:\Users\hebba\OneDrive\Desktop\Codes\Github\empathy-encryption-engine\README.md
