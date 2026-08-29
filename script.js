let xp = 0;
let stage = 0;
let coins = 0;
let energy = 100;
let energyCountdownInterval = null;
let nextEnergyTick = null; // timestamp (ms) for the next +1 energy

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
        if (energy < 100) {
            const now = Date.now();
            if (now >= nextEnergyTick) {
                const elapsed = now - nextEnergyTick;
                const increments = 1 + Math.floor(elapsed / 3000);
                energy = Math.min(100, energy + increments);

                if (energy < 100) {
                    // schedule next tick 3s from now
                    nextEnergyTick = now + 3000;
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
    if (energy >= 100) return;

    if (!nextEnergyTick) {
        nextEnergyTick = Date.now() + 3000;
        saveGame();
    }

    energyCountdownInterval = setInterval(() => {
        if (energy >= 100) {
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
            const increments = 1 + Math.floor(elapsed / 3000);
            energy = Math.min(100, energy + increments);

            if (energy < 100) {
                // schedule next tick 3s from now
                nextEnergyTick = now + 3000;
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
    if (energy < 100) startEnergyRestore();
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
    document.getElementById("energy").textContent = energy;

    // Ensure there's a small countdown element next to the energy stat
    const energyEl = document.getElementById("energy");
    let countdownEl = document.getElementById("energyCountdown");
    if (!countdownEl) {
        countdownEl = document.createElement("span");
        countdownEl.id = "energyCountdown";
        countdownEl.style.marginLeft = "8px";
        countdownEl.style.fontSize = "0.95em";
        // Insert after the energy element
        if (energyEl && energyEl.parentNode) {
            energyEl.parentNode.insertBefore(countdownEl, energyEl.nextSibling);
        }
    }

    if (energy >= 100) {
        countdownEl.textContent = "⚡ Energy Full";
    } else {
        // Compute remaining seconds until next +1
        let remaining = 3;
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
if (energy < 100) {
    startEnergyRestore();
}
