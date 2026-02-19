# Empathy Encryption Engine

A full-stack human-centered password validation system that evaluates intentional structure, predictability, keyboard patterns, and visual clarity through an explainable scoring engine.

## Features

- **Human-Centered Validation**: Goes beyond rigid rules to encourage thoughtful password creation
- **Pattern Detection**: Identifies sequential, keyboard, and repetitive patterns
- **Visual Clarity**: Checks for confusing character combinations
- **Structure Analysis**: Evaluates intentional password structure and variety
- **Explainable Scoring**: Provides clear feedback on password strengths and weaknesses
- **Modern UI**: Dark premium security theme with glassmorphism effects and smooth animations

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: Vanilla HTML/CSS/JavaScript with modern design
- **Validation Logic**: Modular check system

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open `client/index.html` in your browser

## API

### POST /validate

Validates a password and returns a score, strength, issues, and positives.

**Request Body:**
```json
{
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "score": 75,
  "strength": "Moderate",
  "issues": ["Sequential pattern detected"],
  "positives": ["Good intentional structure"]
}
```

## Project Structure

```
empathy-encryption-engine/
├── client/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server/
│   ├── index.js
│   ├── validator.js
│   └── checks/
│       ├── keyboard.js
│       ├── predictability.js
│       ├── repetition.js
│       ├── structure.js
│       └── visual.js
├── package.json
└── README.md
```

## UI Features

- **Live Validation**: Real-time password analysis as you type
- **Password Visibility Toggle**: Show/hide password functionality
- **Animated Progress Bar**: Visual strength indicator
- **Glassmorphism Design**: Modern card-based UI with backdrop blur
- **Responsive Layout**: Works on desktop and mobile devices
- **Smooth Animations**: Professional transitions and effects

## Hackathon Context

This project is prepared for "The Empathy Encryption Hackathon" by UnsaidTalks Education, focusing on rethinking password validation from a human-centered perspective.
