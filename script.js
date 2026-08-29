let xp = 0;
let stage = 0;
let coins = 0;
const MAX_ENERGY = 25;
let energy = MAX_ENERGY;
let energyCountdownInterval = null;
let nextEnergyTick = null; // timestamp (ms) for the next +1 energy
const ENERGY_TICK_MS = 5000; // +1 energy every 5 seconds

const wolves = [
    {
        name: "Wolf Pup",
        image: "images/WolfPup.png",
        nextXP: 100
    },
    {
        name: "Young Wolf",
        image: "images/YoungWolf.png",
        nextXP: 250
    },
    {
        name: "Alpha Wolf",
        image: "images/AlphaWolf.png",
        nextXP: 500
    },
    {
        name: "Elite Wolf",
        image: "images/EliteWolf.png",
        nextXP: 1000
    }
];

function saveGame() {
    localStorage.setItem("elitewolf_xp", xp);
    localStorage.setItem("elitewolf_stage", stage);
    localStorage.setItem("elitewolf_coins", coins);
    localStorage.setItem("elitewolf_energy", energy);

    if (nextEnergyTick) {
        localStorage.setItem("elitewolf_nextEnergyTick", String(nextEnergyTick));
    } else {
        localStorage.removeItem("elitewolf_nextEnergyTick");
    }
}

function loadGame() {
    const savedXP = localStorage.getItem("elitewolf_xp");
    const savedStage = localStorage.getItem("elitewolf_stage");
    const savedCoins = localStorage.getItem("elitewolf_coins");
    const savedEnergy = localStorage.getItem("elitewolf_energy");
    const savedNextTick = localStorage.getItem("elitewolf_nextEnergyTick");

    if (savedXP !== null) xp = parseInt(savedXP);
    if (savedStage !== null) stage = parseInt(savedStage);
    if (savedCoins !== null) coins = parseInt(savedCoins);
    if (savedEnergy !== null) energy = parseInt(savedEnergy);

    if (savedNextTick !== null && !Number.isNaN(parseInt(savedNextTick))) {
        nextEnergyTick = parseInt(savedNextTick);

        // If time already passed while the game was closed, apply missed increments
        if (energy < MAX_ENERGY) {
            const now = Date.now();
            if (now >= nextEnergyTick) {
                const elapsed = now - nextEnergyTick;
                const increments = 1 + Math.floor(elapsed / ENERGY_TICK_MS);
                energy = Math.min(MAX_ENERGY, energy + increments);

                if (energy < MAX_ENERGY) {
                    // schedule next tick ENERGY_TICK_MS from now
                    nextEnergyTick = now + ENERGY_TICK_MS;
                } else {
                    nextEnergyTick = null;
                }

                // Persist any changes caused by applying missed increments
                saveGame();
            }
        } else {
            nextEnergyTick = null;
            localStorage.removeItem("elitewolf_nextEnergyTick");
        }
    } else {
        nextEnergyTick = null;
    }
}

function startEnergyRestore() {
    // One-second interval drives countdown display and applies +1 energy when its time
    if (energyCountdownInterval) return;
    if (energy >= MAX_ENERGY) return;

    if (!nextEnergyTick) {
        nextEnergyTick = Date.now() + ENERGY_TICK_MS;
        saveGame();
    }

    energyCountdownInterval = setInterval(() => {
        if (energy >= MAX_ENERGY) {
            clearInterval(energyCountdownInterval);
            energyCountdownInterval = null;
            nextEnergyTick = null;
            saveGame();
            updateGame();
            return;
        }

        const now = Date.now();
        if (now >= nextEnergyTick) {
            // If many intervals passed (tab was inactive), grant multiple increments
            const elapsed = now - nextEnergyTick;
            const increments = 1 + Math.floor(elapsed / ENERGY_TICK_MS);
            energy = Math.min(MAX_ENERGY, energy + increments);

            if (energy < MAX_ENERGY) {
                // schedule next tick ENERGY_TICK_MS from now
                nextEnergyTick = now + ENERGY_TICK_MS;
            } else {
                nextEnergyTick = null;
                clearInterval(energyCountdownInterval);
                energyCountdownInterval = null;
            }

            saveGame();
            updateGame();
        } else {
            // Just update countdown display
            updateGame();
        }
    }, 1000);
}

function trainWolf() {
    if (energy < 10) {
        document.getElementById("message").textContent =
            "⚡ Your wolf needs to rest!";
        return;
    }

    if (stage >= wolves.length - 1) {
        document.getElementById("message").textContent =
            "🔥 ELITE WOLF HAS REACHED MAX LEVEL!";
        return;
    }

    xp += 25;
    coins += 5;
    energy -= 10;

    if (xp >= wolves[stage].nextXP) {
        stage++;

        const wolfElement = document.querySelector(".wolf");

        wolfElement.classList.add("evolving");

        setTimeout(() => {
            wolfElement.classList.remove("evolving");
        }, 800);

        document.getElementById("message").textContent =
            "🔥 EVOLUTION! Your wolf became " +
            wolves[stage].name + "!";
    } else {
        document.getElementById("message").textContent =
            "The wolf is getting stronger... 🐺";
    }

    // If energy dropped below max, ensure the restore process runs
    if (energy < MAX_ENERGY) startEnergyRestore();
    updateGame();
    saveGame();
}

function updateGame() {
    const currentWolf = wolves[stage];

    document.getElementById("stage").textContent =
        currentWolf.name;

    document.querySelector(".wolf").innerHTML =
        `<img src="${currentWolf.image}" alt="${currentWolf.name}">`;

    document.getElementById("xp").textContent = xp;
    document.getElementById("coins").textContent = coins;

    // Energy display: keep normal font size and exact format
    const energyEl = document.getElementById("energy");
    energyEl.textContent = `⚡ Energy ${energy} / ${MAX_ENERGY}`;

    // Ensure there's a small countdown element underneath the energy stat
    let countdownEl = document.getElementById("energyCountdown");
    if (!countdownEl) {
        countdownEl = document.createElement("div");
        countdownEl.id = "energyCountdown";
        countdownEl.style.display = "block";
        countdownEl.style.marginTop = "4px";
        countdownEl.style.fontSize = "0.85em"; // smaller and less prominent
        countdownEl.style.opacity = "0.8";
        // Insert after the energy element
        if (energyEl && energyEl.parentNode) {
            energyEl.parentNode.insertBefore(countdownEl, energyEl.nextSibling);
        }
    }

    if (energy >= MAX_ENERGY) {
        countdownEl.textContent = "⚡ Energy Full";
    } else {
        // Compute remaining seconds until next +1
        let remaining = Math.ceil(ENERGY_TICK_MS / 1000);
        if (nextEnergyTick) {
            remaining = Math.ceil((nextEnergyTick - Date.now()) / 1000);
            if (remaining < 1) remaining = 1;
        }
        countdownEl.textContent = `+1 Energy in ${remaining}s`;
    }

    if (energy < 10) {
        document.getElementById("trainBtn").disabled = true;
    } else {
        document.getElementById("trainBtn").disabled = false;
    }

    if (stage < wolves.length - 1) {
        document.getElementById("nextXP").textContent =
            currentWolf.nextXP;

        let progress =
            (xp / currentWolf.nextXP) * 100;

        if (progress > 100) progress = 100;

        document.getElementById("xpFill").style.width =
            progress + "%";
    } else {
        document.getElementById("nextXP").textContent = "MAX";
        document.getElementById("xpFill").style.width = "100%";
    }
}

loadGame();
updateGame();
if (energy < MAX_ENERGY) {
    startEnergyRestore();
}


// TEMPORARY: RESET TEST button for development/testing only
// - Resets the runtime state to: Wolf Pup, XP 0, Coins 0, Energy MAX_ENERGY
// - Clears saved localStorage progress
// This button is intentionally added as a temporary helper and should be removed before release.
function resetTest() {
    // Stop any running energy restore interval
    if (energyCountdownInterval) {
        clearInterval(energyCountdownInterval);
        energyCountdownInterval = null;
    }

    // Reset runtime variables
    xp = 0;
    stage = 0;
    coins = 0;
    energy = MAX_ENERGY;
    nextEnergyTick = null;

    // Clear saved progress from localStorage
    localStorage.removeItem("elitewolf_xp");
    localStorage.removeItem("elitewolf_stage");
    localStorage.removeItem("elitewolf_coins");
    localStorage.removeItem("elitewolf_energy");
    localStorage.removeItem("elitewolf_nextEnergyTick");

    // Persist the fresh reset state so tests start from a clean, known baseline
    saveGame();

    updateGame();

    const msgEl = document.getElementById("message");
    if (msgEl) msgEl.textContent = "RESET TEST: Game reset to default testing state.";
}

// Create a visible, clearly temporary button and append to the document body
(function createResetTestButton() {
    try {
        const btn = document.createElement("button");
        btn.id = "resetTestBtn";
        btn.textContent = "RESET TEST";
        // Styling to make it noticeable but unobtrusive in the corner
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = 10000;
        btn.style.background = "#d9534f"; // bootstrap danger red
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.padding = "8px 10px";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.title = "Temporary: Reset game to test state and clear saved progress";

        btn.addEventListener("click", () => {
            if (confirm("Reset game to test state? This will clear saved progress.")) {
                resetTest();
            }
        });

        document.addEventListener("DOMContentLoaded", () => {
            document.body.appendChild(btn);
        });

        // If DOM already loaded, append immediately
        if (document.readyState === "interactive" || document.readyState === "complete") {
            document.body.appendChild(btn);
        }
    } catch (err) {
        // If DOM APIs aren't available in the current environment, fail quietly
        // This avoids breaking tests where document may be undefined.
        // eslint-disable-next-line no-console
        console.warn("Could not create RESET TEST button:", err);
    }
})();
