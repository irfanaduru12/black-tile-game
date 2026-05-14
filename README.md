# Black Tile Game

A fast-paced, reflex-testing web game where the objective is to tap as many black tiles as possible within a 10-second time limit.

## 🎮 Features
- **Interactive 4x4 Grid:** Dynamic tile spawning system.
- **Scoring & Point Decay:** The faster you tap, the more points you earn. Points per tile decay over time.
- **High Score Tracking:** Your best score is saved locally in your browser using `localStorage`.
- **Visual Effects:** Smooth CSS transitions, floating point text, and a confetti celebration for new high scores.

## 🚀 How to Play
1. Clone or download this repository.
2. Open the `proje.html` file in any modern web browser (no server required).
3. Tap the cover screen to initiate the 3-second countdown.
4. **Tap the black tiles** as quickly as you can to earn points.
5. The game ends after 10 seconds. Press `F5` (or refresh the page) to play again and beat your high score!

## 🛠️ Technologies Used
- **HTML5** - Game structure and UI screens.
- **CSS3** - Styling, animations, and responsive flex/grid layouts.
- **Vanilla JavaScript** - Core game loop, event listeners, and timers.
- **Canvas Confetti** - Third-party library for the end-game celebration effects.

## 📂 File Structure
- `proje.html`: Main HTML document containing the layout and screens.
- `style.css`: Stylesheet for all visual designs and CSS animations.
- `proje.js`: JavaScript file handling the game state, scoring, and logic.
