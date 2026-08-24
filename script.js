let xp = 0;
let level = 1;
const xpNeeded = 100;

function addXP(amount, action) {
  xp += amount;

  if (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;

    document.getElementById("message").textContent =
      `🐺 Your wolf reached Level ${level}!`;

    if (level >= 5) {
      document.getElementById("wolf").textContent = "⚡🐺⚡";
    }
  } else {
    document.getElementById("message").textContent =
      `${action} +${amount} XP`;
  }

  updateGame();
}

function feed() {
  addXP(10, "🍖 Fed the wolf!");
}

function play() {
  addXP(15, "🎾 Played with the wolf!");
}

function train() {
  addXP(20, "⚔️ Trained the wolf!");
}

function updateGame() {
  document.getElementById("level").textContent =
    `Level ${level}`;

  document.getElementById("xp-text").textContent =
    `${xp} / ${xpNeeded} XP`;

  const percentage = (xp / xpNeeded) * 100;

  document.getElementById("xp-fill").style.width =
    `${percentage}%`;
}

updateGame();
