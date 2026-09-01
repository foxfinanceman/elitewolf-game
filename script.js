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

let bone = 0;
let meat = 0;
let premium = 0;
let feast = 0;

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
        nextXP: 1000
    },
    {
        name: "Young Wolf",
        image: "images/YoungWolf.png",
        nextXP: 3000
    },
    {
        name: "Alpha Wolf",
        image: "images/AlphaWolf.png",
        nextXP: 6000
    },
    {
        name: "Elite Wolf",
        image: "images/EliteWolf.png",
        nextXP: 10000
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
// MESSAGE
// =========================

function showMessage(text) {
    const el = document.getElementById("message");

    if (el) {
        el.textContent = text;
    }
}


// =========================
// FORCE RESET V4
// =========================

function forceResetV4() {

    const currentVersion =
        localStorage.getItem("elitewolf_game_version");

    if (currentVersion === "v4") {
        return;
    }

    // Clear timers
    clearInterval(energyTimer);
    clearInterval(xpTimer);
    clearInterval(hungerTimer);

    energyTimer = null;
    xpTimer = null;
    hungerTimer = null;

    // Remove existing Elite Wolf localStorage keys
    localStorage.removeItem("elitewolf_xp");
    localStorage.removeItem("elitewolf_stage");
    localStorage.removeItem("elitewolf_coins");
    localStorage.removeItem("elitewolf_energy");
    localStorage.removeItem("elitewolf_health");
    localStorage.removeItem("elitewolf_hunger");
    localStorage.removeItem("elitewolf_mood");
    localStorage.removeItem("elitewolf_bone");
    localStorage.removeItem("elitewolf_meat");
    localStorage.removeItem("elitewolf_premium");
    localStorage.removeItem("elitewolf_feast");
    localStorage.removeItem("elitewolf_nextEnergyTick");
    localStorage.removeItem("elitewolf_migrated_v3");

    // Reset to default values
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

    // Save default values
    saveGame();

    // Set version to v4
    localStorage.setItem("elitewolf_game_version", "v4");
}


// =========================
// MIGRATION
// =========================

function migrateGame() {

    const migrationKey = "elitewolf_migrated_v3";

    if (localStorage.getItem(migrationKey)) {
        return;
    }

    const hasExistingData =
        localStorage.getItem("elitewolf_xp") !== null ||
        localStorage.getItem("elitewolf_stage") !== null ||
        localStorage.getItem("elitewolf_coins") !== null ||
        localStorage.getItem("elitewolf_energy") !== null ||
        localStorage.getItem("elitewolf_health") !== null ||
        localStorage.getItem("elitewolf_hunger") !== null ||
        localStorage.getItem("elitewolf_mood") !== null ||
        localStorage.getItem("elitewolf_bone") !== null ||
        localStorage.getItem("elitewolf_meat") !== null ||
        localStorage.getItem("elitewolf_premium") !== null ||
        localStorage.getItem("elitewolf_feast") !== null;

    if (hasExistingData) {

        clearInterval(energyTimer);
        clearInterval(xpTimer);
        clearInterval(hungerTimer);

        energyTimer = null;
        xpTimer = null;
        hungerTimer = null;

        // Remove old saved game values
        localStorage.removeItem("elitewolf_xp");
        localStorage.removeItem("elitewolf_stage");
        localStorage.removeItem("elitewolf_coins");
        localStorage.removeItem("elitewolf_energy");
        localStorage.removeItem("elitewolf_health");
        localStorage.removeItem("elitewolf_hunger");
        localStorage.removeItem("elitewolf_mood");
        localStorage.removeItem("elitewolf_bone");
        localStorage.removeItem("elitewolf_meat");
        localStorage.removeItem("elitewolf_premium");
        localStorage.removeItem("elitewolf_feast");
        localStorage.removeItem("elitewolf_nextEnergyTick");

        // Reset to defaults
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
    }

    localStorage.setItem(migrationKey, "1");
}


// =========================
// SAVE
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
            nextEnergyTick
        );
    } else {
        localStorage.removeItem(
            "elitewolf_nextEnergyTick"
        );
    }
}


// =========================
// LOAD
// =========================

function loadGame() {

    const get = (key, fallback) => {

        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;
    };

    xp = get("elitewolf_xp", 0);
    stage = get("elitewolf_stage", 0);
    coins = get("elitewolf_coins", 0);
    energy = get("elitewolf_energy", MAX_ENERGY);

    health = get("elitewolf_health", MAX_HEALTH);
    hunger = get("elitewolf_hunger", MAX_HUNGER);
    mood = get("elitewolf_mood", MAX_MOOD);

    bone = get("elitewolf_bone", 0);
    meat = get("elitewolf_meat", 0);
    premium = get("elitewolf_premium", 0);
    feast = get("elitewolf_feast", 0);

    const savedTick =
        localStorage.getItem(
            "elitewolf_nextEnergyTick"
        );

    if (savedTick !== null) {
        nextEnergyTick = Number(savedTick);
    }

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

    saveGame();
}


// =========================
// TRAIN
// =========================

function trainWolf() {

    if (stage === wolves.length - 1) {

        showMessage(
            "🔥 ELITE WOLF has reached MAX level!"
        );

        return;
    }

    if (energy < 10) {

        showMessage(
            "⚡ Not enough Energy!"
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

    let evolved = false;

    while (
        stage < wolves.length - 1 &&
        xp >= wolves[stage].nextXP
    ) {

        stage++;
        evolved = true;

        const wolf =
            document.querySelector(".wolf");

        if (wolf) {

            wolf.classList.add("evolving");

            setTimeout(() => {
                wolf.classList.remove("evolving");
            }, 800);
        }
    }

    if (evolved) {

        showMessage(
            "🔥 EVOLUTION! Your wolf became " +
            wolves[stage].name + "!"
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

    if (coins < food.price) {

        const msg =
            document.getElementById(
                "shopMessage"
            );

        if (msg) {

            msg.textContent =
                `❌ Not enough coins! Need ${food.price} 💰`;
        }

        return;
    }

    coins -= food.price;

    if (index === 0) bone++;
    if (index === 1) meat++;
    if (index === 2) premium++;
    if (index === 3) feast++;

    const shopMessage =
        document.getElementById(
            "shopMessage"
        );

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
// FEED MENU
// =========================

function openFeedMenu() {

    const menu =
        document.getElementById(
            "feedMenuPanel"
        );

    if (!menu) return;

    menu.classList.add("active");

    const message =
        document.getElementById(
            "feedMessage"
        );

    if (message) {
        message.textContent = "";
    }
}


function closeFeedMenu() {

    const menu =
        document.getElementById(
            "feedMenuPanel"
        );

    if (menu) {
        menu.classList.remove("active");
    }
}


// =========================
// FEED WOLF
// =========================

function feedWolf(index) {

    const food = foods[index];

    if (!food) return;

    let count = 0;

    if (index === 0) count = bone;
    if (index === 1) count = meat;
    if (index === 2) count = premium;
    if (index === 3) count = feast;

    if (count <= 0) {

        const feedMessage =
            document.getElementById(
                "feedMessage"
            );

        if (feedMessage) {

            feedMessage.textContent =
                `❌ You don't have any ${food.name}!`;
        }

        showMessage(
            `❌ You don't have any ${food.name}!`
        );

        return;
    }

    // Remove from inventory

    if (index === 0) bone--;
    if (index === 1) meat--;
    if (index === 2) premium--;
    if (index === 3) feast--;

    // Apply food

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
        `🍖 Your wolf ate ${food.name}! +${food.xp} XP`
    );

    updateGame();
    saveGame();

    // Close feed menu

    closeFeedMenu();
}


// =========================
// ENERGY
// =========================

function startEnergyRestore() {

    if (energy >= MAX_ENERGY) {
        return;
    }

    if (!nextEnergyTick) {

        nextEnergyTick =
            Date.now() + ENERGY_TICK_MS;
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

        if (Date.now() >= nextEnergyTick) {

            energy++;

            if (energy >= MAX_ENERGY) {

                energy = MAX_ENERGY;
                nextEnergyTick = null;

                clearInterval(energyTimer);
                energyTimer = null;

            } else {

                nextEnergyTick =
                    Date.now() + ENERGY_TICK_MS;
            }

            saveGame();
        }

        updateGame();

    }, 1000);

    saveGame();
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
// UPDATE UI
// =========================

function updateGame() {

    const wolf = wolves[stage];

    // Stage

    const stageEl =
        document.getElementById("stage");

    if (stageEl) {
        stageEl.textContent = wolf.name;
    }

    // Wolf

    const wolfEl =
        document.querySelector(".wolf");

    if (wolfEl) {

        wolfEl.innerHTML =
            `<img src="${wolf.image}"
                  alt="${wolf.name}">`;
    }

    // XP

    const xpEl =
        document.getElementById("xp");

    if (xpEl) {
        xpEl.textContent = xp;
    }

    // Coins

    const coinsEl =
        document.getElementById("coins");

    if (coinsEl) {
        coinsEl.textContent = coins;
    }

    // Energy

    const energyEl =
        document.getElementById("energy");

    if (energyEl) {

        energyEl.textContent =
            `Energy ${energy} / ${MAX_ENERGY}`;
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

    const boneEl =
        document.getElementById(
            "boneCount"
        );

    if (boneEl) {
        boneEl.textContent = bone;
    }

    const meatEl =
        document.getElementById(
            "meatCount"
        );

    if (meatEl) {
        meatEl.textContent = meat;
    }

    const premiumEl =
        document.getElementById(
            "premiumCount"
        );

    if (premiumEl) {
        premiumEl.textContent = premium;
    }

    const feastEl =
        document.getElementById(
            "feastCount"
        );

    if (feastEl) {
        feastEl.textContent = feast;
    }

    // XP

    const nextXPEl =
        document.getElementById(
            "nextXP"
        );

    const xpFill =
        document.getElementById(
            "xpFill"
        );

    if (stage < wolves.length - 1) {

        if (nextXPEl) {
            nextXPEl.textContent =
                wolf.nextXP;
        }

        if (xpFill) {

            const progress =
                Math.min(
                    100,
                    (xp / wolf.nextXP) * 100
                );

            xpFill.style.width =
                progress + "%";
        }

    } else {

        if (nextXPEl) {
            nextXPEl.textContent = "MAX";
        }

        if (xpFill) {
            xpFill.style.width = "100%";
        }
    }

    // Health bar

    const healthFill =
        document.getElementById(
            "healthFill"
        );

    if (healthFill) {

        healthFill.style.width =
            health + "%";
    }

    // Hunger bar

    const hungerFill =
        document.getElementById(
            "hungerFill"
        );

    if (hungerFill) {

        hungerFill.style.width =
            hunger + "%";
    }

    // Mood bar

    const moodFill =
        document.getElementById(
            "moodFill"
        );

    if (moodFill) {

        moodFill.style.width =
            mood + "%";
    }

    // Train button

    const trainBtn =
        document.getElementById(
            "trainBtn"
        );

    if (trainBtn) {

        trainBtn.disabled =
            energy < 10 ||
            stage >= wolves.length - 1;
    }

    updateEnergyCountdown();
}


// =========================
// ENERGY COUNTDOWN
// =========================

function updateEnergyCountdown() {

    const energyEl =
        document.getElementById(
            "energy"
        );

    if (!energyEl) return;

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
            "11px";

        countdown.style.marginTop =
            "3px";

        countdown.style.opacity =
            "0.7";

        energyEl.parentNode.appendChild(
            countdown
        );
    }

    if (
        energy >= MAX_ENERGY ||
        !nextEnergyTick
    ) {

        countdown.style.display = "none";

        return;
    }

    const seconds =
        Math.max(
            1,
            Math.ceil(
                (nextEnergyTick - Date.now()) /
                1000
            )
        );

    countdown.style.display = "block";

    countdown.textContent =
        `+1 Energy in ${seconds}s`;
}


// =========================
// CLOSE PANELS
// =========================

document.addEventListener(
    "click",
    function(event) {

        const shop =
            document.getElementById(
                "foodShopPanel"
            );

        const feed =
            document.getElementById(
                "feedMenuPanel"
            );

        if (
            shop &&
            shop.classList.contains("active") &&
            event.target === shop
        ) {
            closeFoodShop();
        }

        if (
            feed &&
            feed.classList.contains("active") &&
            event.target === feed
        ) {
            closeFeedMenu();
        }
    }
);


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeFoodShop();
            closeFeedMenu();
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
// START
// =========================

forceResetV4();

loadGame();

updateGame();

if (energy < MAX_ENERGY) {
    startEnergyRestore();
}

startXPTick();
startHungerTick();


// =========================
// SAVE BEFORE EXIT
// =========================

window.addEventListener(
    "beforeunload",
    saveGame
);
