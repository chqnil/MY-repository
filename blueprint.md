# Blueprint: Capybara World

## Overview

A simple, fun, and responsive browser-based game, "Capybara." It features a jumping capybara, a section for random capybara facts, and is optimized for both desktop and mobile play with frame-rate independent game speed.

## Core Features & Design

### General
- **Layout:** A two-tab interface for "Capybara Facts" and "Capybara Game."
- **Styling:** Clean, modern design with a fixed-height fact container to prevent layout shifts.
- **Responsiveness:** The entire application, including the game canvas, is fully responsive.

### Game: Capybara
- **Character:** A charming capybara model.
- **Mechanics:** 
  - The player controls the capybara to **jump** over ground obstacles (logs).
- **Controls:**
  - **Desktop:** Press the **Spacebar** to jump.
  - **Mobile:** **Tap anywhere on the screen** to jump.
- **Performance:** Game logic is updated using a **delta time** calculation, ensuring that game speed is consistent across all devices, regardless of their frame rate.
- **Canvas:** The game canvas automatically resizes to fit its container. It uses a **responsive aspect ratio**, switching from 2:1 on desktops to a much taller **1:1 ratio on mobile screens** (768px or less) to maximize vertical playing area.
- **Scoring:** Tracks current score and saves the high score in local storage.

### Facts Section
- **Content:** Displays random, interesting facts about capybaras.
- **Layout:** The container for the fact text has a fixed minimum height for layout stability.

## Current Development Plan

### Goal: Maximize Vertical Space on Mobile

To further enhance the gameplay experience on mobile devices, the aspect ratio of the game canvas will be made significantly taller, moving to a 1:1 ratio for small screens.

1.  **Update Canvas Resizing Logic:**
    *   **Action:** Modify `game.js`.
    *   **Problem:** The previous 4:3 aspect ratio on mobile was an improvement, but more vertical space would make play more comfortable.
    *   **Solution:** In the `resizeCanvas` function, detect the screen width.
    *   **Implementation:**
        *   If the screen width is 768px or less (mobile), set the canvas aspect ratio to a square 1:1 (`canvas.height = newWidth`).
        *   For screens wider than 768px, maintain the original 2:1 aspect ratio (`canvas.height = newWidth * 0.5`).
