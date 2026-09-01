// ======================================================
// ELITE WOLF — GAME LOGIC V1
// ======================================================

// =========================
// GAME VARIABLES
// =========================

let xp = 0;
let stage = 0;
let coins = 0;

const MAX_ENERGY = 25;
let energy = MAX_ENERGY;

const MAX_HEALTH = 100;
let health = MAX_HEALTH;

const MAX_HUNGER = 100;
let hunger = MAX_HUNGER;

const MAX_MOOD = 100;
let mood = MAX_MOOD;

// =========================
// INVENTORY
// =========================

let bone = 0;
let meat = 0;
let premium = 0;
let feast = 0;

// =========================
// TIMERS
// =========================

const ENERGY_TICK_MS = 60000;
const XP_TICK_MS = 60000;
const HUNGER_TICK_MS = 60000;

let energyTimer = null;
let xpTimer = null;
let hungerTimer = null;

let nextEnergyTick = null;

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
// LOCAL STORAGE
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

    if (nextEnergyTick !== null) {
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

    const getNumber = (key, defaultValue) => {

        const value = localStorage.getItem(key);

        if (value === null) {
            return defaultValue;
        }

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : defaultValue;
    };

    xp = getNumber("elitewolf_xp", 0);
    stage = getNumber("elitewolf_stage", 0);
    coins = getNumber("elitewolf_coins", 0);
    energy = getNumber("elitewolf_energy", MAX_ENERGY);

    health = getNumber("elitewolf_health", MAX_HEALTH);
    hunger = getNumber("elitewolf_hunger", MAX_HUNGER);
    mood = getNumber("elitewolf_mood", MAX_MOOD);

    bone = getNumber("elitewolf_bone", 0);
    meat = getNumber("elitewolf_meat", 0);
    premium = getNumber("elitewolf_premium", 0);
    feast = getNumber("elitewolf_feast", 0);

    const savedTick = localStorage.getItem(
        "elitewolf_nextEnergyTick"
    );

    if (savedTick !== null) {

        const tick = Number(savedTick);

        if (Number.isFinite(tick)) {
            nextEnergyTick = tick;
        }
    }

    // Safety limits

    stage = Math.max(
        0,
        Math.min(stage, wolves.length - 1)
    );

    energy = Math.max(
        0,
        Math.min(energy, MAX_ENERGY)
    );

    health = Math.max(
        0,
        Math.min(health, MAX_HEALTH)
    );

    hunger = Math.max(
        0,
        Math.min(hunger, MAX_HUNGER)
    );

    mood = Math.max(
        0,
        Math.min(mood, MAX_MOOD)
    );

    // Calculate offline energy restoration

    if (
        energy < MAX_ENERGY &&
        nextEnergyTick !== null
    ) {

        const now = Date.now();

        if (now >= nextEnergyTick) {

            const elapsed =
                now - nextEnergyTick;

            const amount =
                1 +
                Math.floor(
                    elapsed / ENERGY_TICK_MS
                );

            energy = Math.min(
                MAX_ENERGY,
                energy + amount
            );

            if (energy >= MAX_ENERGY) {

                nextEnergyTick = null;

            } else {

                nextEnergyTick =
                    now + ENERGY_TICK_MS;
            }
        }
    }

    if (energy >= MAX_ENERGY) {
        nextEnergyTick = null;
    }

    saveGame();
}

// =========================
// MESSAGE
// =========================

function showMessage(text) {

    const message =
        document.getElementById("message");

    if (message) {
        message.textContent = text;
    }
}

// =========================
// TRAIN WOLF
// =========================

function trainWolf() {

    if (stage >= wolves.length - 1) {

        showMessage(
            "🔥 ELITE WOLF has reached MAX level!"
        );

        return;
    }

    if (energy < 10) {

        showMessage(
            "⚡ Your wolf needs more energy!"
        );

        return;
    }

    energy -= 10;

    xp += 25;

    coins += 5;

    mood = Math.min(
        MAX_MOOD,
        mood + 5
    );

    checkEvolution();

    startEnergyRestore();

    showMessage(
        "⚔️ Training complete! +25 XP +5 💰"
    );

    updateGame();
    saveGame();
}

// =========================
// EVOLUTION
// =========================

function checkEvolution() {

    while (
        stage < wolves.length - 1 &&
        xp >= wolves[stage].nextXP
    ) {

        stage++;

        const wolf =
            document.querySelector(".wolf");

        if (wolf) {

            wolf.classList.add("evolving");

            setTimeout(() => {

                wolf.classList.remove(
                    "evolving"
                );

            }, 800);
        }

        showMessage(
            "🔥 EVOLUTION! Your wolf became " +
            wolves[stage].name +
            "!"
        );
    }
}

// =========================
// FOOD SHOP
// =========================

function openFoodShop() {

    const shop =
        document.getElementById(
            "foodShopPanel"
        );

    if (!shop) return;

    shop.classList.add("active");

    const message =
        document.getElementById(
            "shopMessage"
        );

    if (message) {
        message.textContent = "";
    }
}

function closeFoodShop() {

    const shop =
        document.getElementById(
            "foodShopPanel"
        );

    if (shop) {
        shop.classList.remove("active");
    }
}

// =========================
// BUY FOOD
// =========================

function buyFood(index) {

    const food = foods[index];

    if (!food) return;

    const shopMessage =
        document.getElementById(
            "shopMessage"
        );

    if (coins < food.price) {

        if (shopMessage) {

            shopMessage.textContent =
                `❌ Not enough coins! ` +
                `You need ${food.price} 💰`;
        }

        return;
    }

    coins -= food.price;

    switch (index) {

        case 0:
            bone++;
            break;

        case 1:
            meat++;
            break;

        case 2:
            premium++;
            break;

        case 3:
            feast++;
            break;
    }

    if (shopMessage) {

        shopMessage.textContent =
            `✅ ${food.name} added to inventory!`;
    }

    showMessage(
        `🎒 You bought ${food.name}.`
    );

    updateGame();
    saveGame();
}

// =========================
// FEED WOLF
// =========================

function feedWolf(index) {

    const food = foods[index];

    if (!food) return;

    let inventoryCount = 0;

    switch (index) {

        case 0:
            inventoryCount = bone;
            break;

        case 1:
            inventoryCount = meat;
            break;

        case 2:
            inventoryCount = premium;
            break;

        case 3:
            inventoryCount = feast;
            break;
    }

    if (inventoryCount <= 0) {

        showMessage(
            `❌ You don't have any ${food.name}!`
        );

        return;
    }

    // Remove food

    switch (index) {

        case 0:
            bone--;
            break;

        case 1:
            meat--;
            break;

        case 2:
            premium--;
            break;

        case 3:
            feast--;
            break;
    }

    // Apply food effects

    hunger = Math.min(
        MAX_HUNGER,
        hunger + food.hunger
    );

    mood = Math.min(
        MAX_MOOD,
        mood + food.mood
    );

    xp += food.xp;

    checkEvolution();

    showMessage(
        `🍖 Your wolf ate ${food.name}! ` +
        `+${food.xp} XP`
    );

    updateGame();
    saveGame();
}

// =========================
// ENERGY RESTORE
// =========================

function startEnergyRestore() {

    if (energy >= MAX_ENERGY) {
        return;
    }

    if (!nextEnergyTick) {

        nextEnergyTick =
            Date.now() + ENERGY_TICK_MS;

        saveGame();
    }

    if (energyTimer) {
        return;
    }

    energyTimer = setInterval(() => {

        if (energy >= MAX_ENERGY) {

            clearInterval(energyTimer);

            energyTimer = null;

            nextEnergyTick = null;

            saveGame();
            updateGame();

            return;
        }

        const now = Date.now();

        if (
            nextEnergyTick &&
            now >= nextEnergyTick
        ) {

            energy++;

            if (energy >= MAX_ENERGY) {

                energy = MAX_ENERGY;

                nextEnergyTick = null;

                clearInterval(
                    energyTimer
                );

                energyTimer = null;

            } else {

                nextEnergyTick =
                    now + ENERGY_TICK_MS;
            }

            saveGame();
        }

        updateGame();

    }, 1000);
}

// =========================
// XP TIMER
// =========================

function startXPTick() {

    if (xpTimer) return;

    xpTimer = setInterval(() => {

        xp++;

        checkEvolution();

        updateGame();
        saveGame();

    }, XP_TICK_MS);
}

// =========================
// HUNGER TIMER
// =========================

function startHungerTick() {

    if (hungerTimer) return;

    hungerTimer = setInterval(() => {

        hunger = Math.max(
            0,
            hunger - 1
        );

        if (hunger <= 30) {

            mood = Math.max(
                0,
                mood - 1
            );
        }

        if (hunger <= 10) {

            health = Math.max(
                0,
                health - 1
            );
        }

        updateGame();
        saveGame();

    }, HUNGER_TICK_MS);
}

// =========================
// UPDATE GAME UI
// =========================

function updateGame() {

    const currentWolf =
        wolves[stage];

    // Stage

    const stageElement =
        document.getElementById("stage");

    if (stageElement) {
        stageElement.textContent =
            currentWolf.name;
    }

    // Wolf image

    const wolfElement =
        document.querySelector(".wolf");

    if (wolfElement) {

        wolfElement.innerHTML =
            `<img src="${currentWolf.image}"
                  alt="${currentWolf.name}">`;
    }

    // XP

    const xpElement =
        document.getElementById("xp");

    if (xpElement) {
        xpElement.textContent = xp;
    }

    // Coins

    const coinsElement =
        document.getElementById("coins");

    if (coinsElement) {
        coinsElement.textContent = coins;
    }

    // Energy

    const energyElement =
        document.getElementById("energy");

    if (energyElement) {

        energyElement.textContent =
            `⚡ Energy ${energy} / ${MAX_ENERGY}`;
    }

    // Health

    const healthText =
        document.getElementById(
            "healthText"
        );

    if (healthText) {

        healthText.textContent =
            `${health} / ${MAX_HEALTH}`;
    }

    // Hunger

    const hungerText =
        document.getElementById(
            "hungerText"
        );

    if (hungerText) {

        hungerText.textContent =
            `${hunger} / ${MAX_HUNGER}`;
    }

    // Mood

    const moodText =
        document.getElementById(
            "moodText"
        );

    if (moodText) {

        moodText.textContent =
            `${mood} / ${MAX_MOOD}`;
    }

    // Inventory

    const boneElement =
        document.getElementById(
            "boneCount"
        );

    if (boneElement) {
        boneElement.textContent = bone;
    }

    const meatElement =
        document.getElementById(
            "meatCount"
        );

    if (meatElement) {
        meatElement.textContent = meat;
    }

    const premiumElement =
        document.getElementById(
            "premiumCount"
        );

    if (premiumElement) {
        premiumElement.textContent =
            premium;
    }

    const feastElement =
        document.getElementById(
            "feastCount"
        );

    if (feastElement) {
        feastElement.textContent =
            feast;
    }

    // XP bar

    const xpFill =
        document.getElementById(
            "xpFill"
        );

    const nextXP =
        document.getElementById(
            "nextXP"
        );

    if (stage < wolves.length - 1) {

        if (nextXP) {
            nextXP.textContent =
                currentWolf.nextXP;
        }

        if (xpFill) {

            let progress =
                (xp / currentWolf.nextXP) * 100;

            progress =
                Math.max(
                    0,
                    Math.min(100, progress)
                );

            xpFill.style.width =
                progress + "%";
        }

    } else {

        if (nextXP) {
            nextXP.textContent = "MAX";
        }

        if (xpFill) {
            xpFill.style.width = "100%";
        }
    }

    // Energy countdown

    updateEnergyCountdown();

    // Train button

    const trainButton =
        document.getElementById(
            "trainBtn"
        );

    if (trainButton) {

        trainButton.disabled =
            energy < 10 ||
            stage >= wolves.length - 1;
    }
}

// =========================
// ENERGY COUNTDOWN
// =========================

function updateEnergyCountdown() {

    const energyElement =
        document.getElementById("energy");

    if (!energyElement) return;

    let countdown =
        document.getElementById(
            "energyCountdown"
        );

    if (!countdown) {

        countdown =
            document.createElement("div");

        countdown.id =
            "energyCountdown";

        countdown.style.fontSize =
            "0.7em";

        countdown.style.opacity =
            "0.65";

        countdown.style.marginTop =
            "4px";

        energyElement.parentNode.appendChild(
            countdown
        );
    }

    if (
        energy >= MAX_ENERGY ||
        !nextEnergyTick
    ) {

        countdown.textContent = "";
        countdown.style.display = "none";

        return;
    }

    const remaining =
        Math.max(
            1,
            Math.ceil(
                (nextEnergyTick - Date.now()) /
                1000
            )
        );

    countdown.style.display = "block";

    countdown.textContent =
        `+1 Energy in ${remaining}s`;
}

// =========================
// SHOP CLICK OUTSIDE
// =========================

document.addEventListener(
    "click",
    function(event) {

        const shop =
            document.getElementById(
                "foodShopPanel"
            );

        if (
            shop &&
            shop.classList.contains("active") &&
            event.target === shop
        ) {

            closeFoodShop();
        }
    }
);

// =========================
// ESC CLOSE SHOP
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeFoodShop();
        }
    }
);

// =========================
// RESET
// =========================

function resetTest() {

    clearInterval(energyTimer);
    clearInterval(xpTimer);
    clearInterval(hungerTimer);

    energyTimer = null;
    xpTimer = null;
    hungerTimer = null;

    xp = 0;
    stage = 0;
    coins = 0;

    energy = MAX_ENERGY;

    health = MAX_HEALTH;
    hunger = MAX_HUNGER;
    mood = MAX_MOOD;

    bone = 0;
    meat = 0;
    premium = 0;
    feast = 0;

    nextEnergyTick = null;

    localStorage.clear();

    updateGame();
    saveGame();

    showMessage(
        "🔄 Game reset successfully!"
    );

    startXPTick();
    startHungerTick();
}

// =========================
// START GAME
// =========================

loadGame();

updateGame();

if (energy < MAX_ENERGY) {
    startEnergyRestore();
}

startXPTick();

startHungerTick();

// =========================
// SAVE BEFORE LEAVING
// =========================

window.addEventListener(
    "beforeunload",
    saveGame
);
