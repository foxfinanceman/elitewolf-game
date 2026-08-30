let xp = 0;
let stage = 0;
let coins = 0;

const MAX_ENERGY = 25;
let energy = MAX_ENERGY;

let energyCountdownInterval = null;
let nextEnergyTick = null;

const MAX_HEALTH = 100;
let health = MAX_HEALTH;

const MAX_HUNGER = 100;
let hunger = MAX_HUNGER;

const MAX_MOOD = 100;
let mood = MAX_MOOD;

let bone = 0;
let meat = 0;
let premium = 0;
let feast = 0;

const ENERGY_TICK_MS = 60000; // +1 Energy every 1 minute
const XP_TICK_MS = 60000;     // +1 XP every 1 minute
const HUNGER_TICK_MS = 60000; // -1 Hunger every 1 minute

let xpTimer = null;
let hungerTimer = null;

// =========================
// WOLVES
// =========================

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

// =========================
// FOOD
// =========================

const foods = [
    {
        name: "Bone",
        price: 10,
        hunger: 10,
        mood: 5,
        xp: 5
    },
    {
        name: "Meat",
        price: 25,
        hunger: 25,
        mood: 10,
        xp: 15
    },
    {
        name: "Premium Meat",
        price: 50,
        hunger: 50,
        mood: 20,
        xp: 35
    },
    {
        name: "Elite Feast",
        price: 100,
        hunger: 100,
        mood: 40,
        xp: 75
    }
];

// =========================
// SAVE GAME
// =========================

function saveGame() {
    localStorage.setItem("elitewolf_xp", xp);
    localStorage.setItem("elitewolf_stage", stage);
    localStorage.setItem("elitewolf_coins", coins);
    localStorage.setItem("elitewolf_energy", energy);

    localStorage.setItem("elitewolf_health", health);
    localStorage.setItem("elitewolf_hunger", hunger);
    localStorage.setItem("elitewolf_mood", mood);

    localStorage.setItem("elitewolf_bone", bone);
    localStorage.setItem("elitewolf_meat", meat);
    localStorage.setItem("elitewolf_premium", premium);
    localStorage.setItem("elitewolf_feast", feast);

    if (nextEnergyTick) {
        localStorage.setItem(
            "elitewolf_nextEnergyTick",
            String(nextEnergyTick)
        );
    } else {
        localStorage.removeItem("elitewolf_nextEnergyTick");
    }
}

// =========================
// LOAD GAME
// =========================

function loadGame() {
    const savedXP = localStorage.getItem("elitewolf_xp");
    const savedStage = localStorage.getItem("elitewolf_stage");
    const savedCoins = localStorage.getItem("elitewolf_coins");
    const savedEnergy = localStorage.getItem("elitewolf_energy");

    const savedHealth = localStorage.getItem("elitewolf_health");
    const savedHunger = localStorage.getItem("elitewolf_hunger");
    const savedMood = localStorage.getItem("elitewolf_mood");

    const savedBone = localStorage.getItem("elitewolf_bone");
    const savedMeat = localStorage.getItem("elitewolf_meat");
    const savedPremium = localStorage.getItem("elitewolf_premium");
    const savedFeast = localStorage.getItem("elitewolf_feast");

    const savedNextTick = localStorage.getItem("elitewolf_nextEnergyTick");

    if (savedXP !== null) xp = parseInt(savedXP);
    if (savedStage !== null) stage = parseInt(savedStage);
    if (savedCoins !== null) coins = parseInt(savedCoins);
    if (savedEnergy !== null) energy = parseInt(savedEnergy);

    if (savedHealth !== null) health = parseInt(savedHealth);
    if (savedHunger !== null) hunger = parseInt(savedHunger);
    if (savedMood !== null) mood = parseInt(savedMood);

    if (savedBone !== null) bone = parseInt(savedBone);
    if (savedMeat !== null) meat = parseInt(savedMeat);
    if (savedPremium !== null) premium = parseInt(savedPremium);
    if (savedFeast !== null) feast = parseInt(savedFeast);

    if (savedNextTick !== null && !Number.isNaN(parseInt(savedNextTick))) {
        nextEnergyTick = parseInt(savedNextTick);

        if (energy < MAX_ENERGY) {
            const now = Date.now();

            if (now >= nextEnergyTick) {
                const elapsed = now - nextEnergyTick;

                const increments =
                    1 +
                    Math.floor(elapsed / ENERGY_TICK_MS);

                energy = Math.min(MAX_ENERGY, energy + increments);

                if (energy < MAX_ENERGY) {
                    nextEnergyTick = now + ENERGY_TICK_MS;
                } else {
                    nextEnergyTick = null;
                }

                saveGame();
            }
        } else {
            nextEnergyTick = null;
            localStorage.removeItem("elitewolf_nextEnergyTick");
        }
    }

    if (stage < 0) stage = 0;
    if (stage >= wolves.length) stage = wolves.length - 1;

    energy = Math.max(0, Math.min(MAX_ENERGY, energy));
    health = Math.max(0, Math.min(MAX_HEALTH, health));
    hunger = Math.max(0, Math.min(MAX_HUNGER, hunger));
    mood = Math.max(0, Math.min(MAX_MOOD, mood));
}

// =========================
// TRAIN
// =========================

function trainWolf() {
    if (energy < 10) {
        const msgEl = document.getElementById("message");
        if (msgEl) msgEl.textContent = "⚡ Your wolf needs to rest!";
        return;
    }

    if (stage >= wolves.length - 1) {
        const msgEl = document.getElementById("message");
        if (msgEl) msgEl.textContent = "🔥 ELITE WOLF HAS REACHED MAX LEVEL!";
        return;
    }

    xp += 25;
    coins += 5;
    energy -= 10;
    mood += 5;
    if (mood > MAX_MOOD) mood = MAX_MOOD;

    checkEvolution();

    if (energy < MAX_ENERGY) startEnergyRestore();

    const msgEl = document.getElementById("message");
    if (msgEl) msgEl.textContent = "⚔️ Training complete! +25 XP +5 💰";

    updateGame();
    saveGame();
}

// =========================
// FOOD SHOP
// =========================

function openFoodShop() {
    const shop = document.getElementById("foodShopPanel");

    if (shop) {
        shop.classList.add("active");

        const message = document.getElementById("shopMessage");
        if (message) message.textContent = "";
    }
}

function closeFoodShop() {
    const shop = document.getElementById("foodShopPanel");
    if (shop) shop.classList.remove("active");
}

// =========================
// BUY FOOD
// =========================

function buyFood(index) {
    const food = foods[index];
    if (!food) return;

    const shopMessage = document.getElementById("shopMessage");

    if (coins < food.price) {
        if (shopMessage) shopMessage.textContent = `❌ Not enough coins! You need ${food.price} 💰`;
        return;
    }

    // Pay
    coins -= food.price;

    // Add to inventory (no XP given)
    switch (index) {
        case 0:
            bone += 1;
            break;
        case 1:
            meat += 1;
            break;
        case 2:
            premium += 1;
            break;
        case 3:
            feast += 1;
            break;
    }

    if (shopMessage) shopMessage.textContent = `✅ ${food.name} purchased and added to inventory!`;

    const msgEl = document.getElementById("message");
    if (msgEl) msgEl.textContent = `🎒 You bought ${food.name}.`;

    updateGame();
    saveGame();
}

// =========================
// FEED WOLF
// =========================

function feedWolf(index) {
    // index: 0=Bone,1=Meat,2=Premium,3=Feast
    const food = foods[index];
    if (!food) return;

    let count = 0;
    switch (index) {
        case 0:
            count = bone;
            break;
        case 1:
            count = meat;
            break;
        case 2:
            count = premium;
            break;
        case 3:
            count = feast;
            break;
    }

    if (count <= 0) {
        const msgEl = document.getElementById("message");
        if (msgEl) msgEl.textContent = `❌ You don't have any ${food.name}!`;
        return;
    }

    // Consume
    switch (index) {
        case 0:
            bone -= 1;
            break;
        case 1:
            meat -= 1;
            break;
        case 2:
            premium -= 1;
            break;
        case 3:
            feast -= 1;
            break;
    }

    // Apply effects
    hunger = Math.min(MAX_HUNGER, hunger + food.hunger);
    mood = Math.min(MAX_MOOD, mood + food.mood);
    xp += food.xp;

    const msgEl = document.getElementById("message");
    if (msgEl) msgEl.textContent = `🍖 Your wolf ate ${food.name}! +${food.xp} XP`;

    checkEvolution();
    updateGame();
    saveGame();
}

// =========================
// EVOLUTION
// =========================

function checkEvolution() {
    while (stage < wolves.length - 1 && xp >= wolves[stage].nextXP) {
        stage++;

        const wolfElement = document.querySelector(".wolf");
        if (wolfElement) {
            wolfElement.classList.add("evolving");
            setTimeout(() => {
                wolfElement.classList.remove("evolving");
            }, 800);
        }

        const msgEl = document.getElementById("message");
        if (msgEl) msgEl.textContent = "🔥 EVOLUTION! Your wolf became " + wolves[stage].name + "!";
    }
}

// =========================
// TRAIN WOLF (alternate kept earlier too)
// =========================
// (The primary trainWolf function above already handles training.)

// =========================
// ENERGY
// =========================

function startEnergyRestore() {
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
            const elapsed = now - nextEnergyTick;
            const increments = 1 + Math.floor(elapsed / ENERGY_TICK_MS);

            energy = Math.min(MAX_ENERGY, energy + increments);

            if (energy < MAX_ENERGY) {
                nextEnergyTick = now + ENERGY_TICK_MS;
            } else {
                nextEnergyTick = null;
                clearInterval(energyCountdownInterval);
                energyCountdownInterval = null;
            }

            saveGame();
            updateGame();
        } else {
            updateGame();
        }
    }, 1000);
}

// =========================
// XP and HUNGER TICKS
// =========================

function startXPTick() {
    if (xpTimer) return;
    xpTimer = setInterval(() => {
        xp += 1;
        checkEvolution();
        updateGame();
        saveGame();
    }, XP_TICK_MS);
}

function stopXPTick() {
    if (xpTimer) {
        clearInterval(xpTimer);
        xpTimer = null;
    }
}

function startHungerTick() {
    if (hungerTimer) return;
    hungerTimer = setInterval(() => {
        hunger = Math.max(0, hunger - 1);

        // Effects of low hunger
        if (hunger <= 30) {
            mood = Math.max(0, mood - 1);
        }

        if (hunger <= 10) {
            health = Math.max(0, health - 1);
        }

        updateGame();
        saveGame();
    }, HUNGER_TICK_MS);
}

function stopHungerTick() {
    if (hungerTimer) {
        clearInterval(hungerTimer);
        hungerTimer = null;
    }
}

// =========================
// UPDATE GAME
// =========================

function updateGame() {
    const currentWolf = wolves[stage];

    const stageEl = document.getElementById("stage");
    if (stageEl) stageEl.textContent = currentWolf.name;

    const wolfEl = document.querySelector(".wolf");
    if (wolfEl) wolfEl.innerHTML = `<img src="${currentWolf.image}" alt="${currentWolf.name}">`;

    const xpEl = document.getElementById("xp");
    if (xpEl) xpEl.textContent = xp;

    const coinsEl = document.getElementById("coins");
    if (coinsEl) coinsEl.textContent = coins;

    // Energy
    const energyEl = document.getElementById("energy");
    if (energyEl) energyEl.textContent = `⚡ Energy ${energy} / ${MAX_ENERGY}`;

    // Health / Hunger / Mood
    const healthEl = document.getElementById("health");
    if (healthEl) healthEl.textContent = `❤️ Health ${health} / ${MAX_HEALTH}`;

    const hungerEl = document.getElementById("hunger");
    if (hungerEl) hungerEl.textContent = `🍖 Hunger ${hunger} / ${MAX_HUNGER}`;

    const moodEl = document.getElementById("mood");
    if (moodEl) moodEl.textContent = `😊 Mood ${mood} / ${MAX_MOOD}`;

    // Inventory counts
    const boneEl = document.getElementById("boneCount");
    if (boneEl) boneEl.textContent = bone;
    const meatEl = document.getElementById("meatCount");
    if (meatEl) meatEl.textContent = meat;
    const premiumEl = document.getElementById("premiumCount");
    if (premiumEl) premiumEl.textContent = premium;
    const feastEl = document.getElementById("feastCount");
    if (feastEl) feastEl.textContent = feast;

    // Countdown for next energy tick
    let countdownEl = document.getElementById("energyCountdown");
    if (!countdownEl && energyEl) {
        countdownEl = document.createElement("div");
        countdownEl.id = "energyCountdown";
        countdownEl.style.display = "block";
        countdownEl.style.marginTop = "4px";
        countdownEl.style.fontSize = "0.7em";
        countdownEl.style.opacity = "0.65";
        countdownEl.style.color = "#666";
        energyEl.parentNode.insertBefore(countdownEl, energyEl.nextSibling);
    }

    if (countdownEl) {
        if (energy >= MAX_ENERGY) {
            countdownEl.textContent = "";
            countdownEl.style.display = "none";
        } else {
            countdownEl.style.display = "block";
            let remaining = Math.ceil((nextEnergyTick - Date.now()) / 1000);
            if (!nextEnergyTick || remaining < 1) remaining = Math.ceil(ENERGY_TICK_MS / 1000);
            countdownEl.textContent = `${remaining}s`;
        }
    }

    // Train button
    const trainBtn = document.getElementById("trainBtn");
    if (trainBtn) trainBtn.disabled = energy < 10;

    // XP bar
    if (stage < wolves.length - 1) {
        const nextXPEl = document.getElementById("nextXP");
        if (nextXPEl) nextXPEl.textContent = currentWolf.nextXP;

        let progress = (xp / currentWolf.nextXP) * 100;
        if (progress > 100) progress = 100;

        const xpFill = document.getElementById("xpFill");
        if (xpFill) xpFill.style.width = progress + "%";
    } else {
        const nextXPEl = document.getElementById("nextXP");
        if (nextXPEl) nextXPEl.textContent = "MAX";
        const xpFill = document.getElementById("xpFill");
        if (xpFill) xpFill.style.width = "100%";
    }
}

// =========================
// SHOP OVERLAY CLOSE
// =========================

document.addEventListener("click", function(event) {
    const shop = document.getElementById("foodShopPanel");
    if (shop && shop.classList.contains("active") && event.target === shop) {
        closeFoodShop();
    }
});

// ESC CLOSE
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeFoodShop();
    }
});

// =========================
// RESET TEST
// =========================

function resetTest() {
    if (energyCountdownInterval) {
        clearInterval(energyCountdownInterval);
        energyCountdownInterval = null;
    }

    stopXPTick();
    stopHungerTick();

    xp = 0;
    stage = 0;
    coins = 0;
    energy = MAX_ENERGY;
    nextEnergyTick = null;

    health = MAX_HEALTH;
    hunger = MAX_HUNGER;
    mood = MAX_MOOD;

    bone = 0;
    meat = 0;
    premium = 0;
    feast = 0;

    localStorage.removeItem("elitewolf_xp");
    localStorage.removeItem("elitewolf_stage");
    localStorage.removeItem("elitewolf_coins");
    localStorage.removeItem("elitewolf_energy");
    localStorage.removeItem("elitewolf_nextEnergyTick");

    localStorage.removeItem("elitewolf_health");
    localStorage.removeItem("elitewolf_hunger");
    localStorage.removeItem("elitewolf_mood");

    localStorage.removeItem("elitewolf_bone");
    localStorage.removeItem("elitewolf_meat");
    localStorage.removeItem("elitewolf_premium");
    localStorage.removeItem("elitewolf_feast");

    saveGame();
    updateGame();

    const msgEl = document.getElementById("message");
    if (msgEl) msgEl.textContent = "RESET TEST: Game reset to default testing state.";
}

// =========================
// START
// =========================

loadGame();
updateGame();

if (energy < MAX_ENERGY) {
    startEnergyRestore();
}

startXPTick();
startHungerTick();

// Ensure we don't leak timers when the page is hidden/unloaded
window.addEventListener("beforeunload", () => {
    saveGame();
});
