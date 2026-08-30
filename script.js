let xp = 0;
let stage = 0;
let coins = 0;

const MAX_ENERGY = 25;
let energy = MAX_ENERGY;

let energyCountdownInterval = null;
let nextEnergyTick = null;

const ENERGY_TICK_MS = 5000;

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
        xp: 10
    },
    {
        name: "Meat",
        price: 25,
        xp: 30
    },
    {
        name: "Premium Meat",
        price: 50,
        xp: 70
    },
    {
        name: "Elite Feast",
        price: 100,
        xp: 150
    }
];

// =========================
// SAVE
// =========================

function saveGame() {
    localStorage.setItem("elitewolf_xp", xp);
    localStorage.setItem("elitewolf_stage", stage);
    localStorage.setItem("elitewolf_coins", coins);
    localStorage.setItem("elitewolf_energy", energy);

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
// LOAD
// =========================

function loadGame() {
    const savedXP = localStorage.getItem("elitewolf_xp");
    const savedStage = localStorage.getItem("elitewolf_stage");
    const savedCoins = localStorage.getItem("elitewolf_coins");
    const savedEnergy = localStorage.getItem("elitewolf_energy");
    const savedNextTick =
        localStorage.getItem("elitewolf_nextEnergyTick");

    if (savedXP !== null)
        xp = parseInt(savedXP);

    if (savedStage !== null)
        stage = parseInt(savedStage);

    if (savedCoins !== null)
        coins = parseInt(savedCoins);

    if (savedEnergy !== null)
        energy = parseInt(savedEnergy);

    if (
        savedNextTick !== null &&
        !Number.isNaN(parseInt(savedNextTick))
    ) {
        nextEnergyTick = parseInt(savedNextTick);

        if (energy < MAX_ENERGY) {
            const now = Date.now();

            if (now >= nextEnergyTick) {
                const elapsed = now - nextEnergyTick;

                const increments =
                    1 +
                    Math.floor(
                        elapsed / ENERGY_TICK_MS
                    );

                energy = Math.min(
                    MAX_ENERGY,
                    energy + increments
                );

                if (energy < MAX_ENERGY) {
                    nextEnergyTick =
                        now + ENERGY_TICK_MS;
                } else {
                    nextEnergyTick = null;
                }

                saveGame();
            }
        } else {
            nextEnergyTick = null;

            localStorage.removeItem(
                "elitewolf_nextEnergyTick"
            );
        }
    }
}

// =========================
// FOOD SHOP OPEN
// =========================

function openFoodShop() {
    const shop =
        document.getElementById("foodShopPanel");

    if (shop) {
        shop.classList.add("active");

        const message =
            document.getElementById("shopMessage");

        if (message) {
            message.textContent = "";
        }
    }
}

// =========================
// FOOD SHOP CLOSE
// =========================

function closeFoodShop() {
    const shop =
        document.getElementById("foodShopPanel");

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
        document.getElementById("shopMessage");

    // Not enough coins
    if (coins < food.price) {

        if (shopMessage) {
            shopMessage.textContent =
                `❌ Not enough coins! You need ${food.price} 💰`;
        }

        return;
    }

    // Pay
    coins -= food.price;

    // Give XP
    xp += food.xp;

    // Check evolution
    checkEvolution();

    // Message
    if (shopMessage) {
        shopMessage.textContent =
            `✅ ${food.name} purchased! +${food.xp} XP`;
    }

    document.getElementById("message").textContent =
        `🐺 Your wolf ate ${food.name}!`;

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

        const wolfElement =
            document.querySelector(".wolf");

        if (wolfElement) {

            wolfElement.classList.add("evolving");

            setTimeout(() => {
                wolfElement.classList.remove("evolving");
            }, 800);
        }

        document.getElementById("message").textContent =
            "🔥 EVOLUTION! Your wolf became " +
            wolves[stage].name + "!";
    }
}

// =========================
// TRAIN WOLF
// =========================

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

    checkEvolution();

    if (energy < MAX_ENERGY) {
        startEnergyRestore();
    }

    if (stage < wolves.length - 1) {
        document.getElementById("message").textContent =
            "The wolf is getting stronger... 🐺";
    }

    updateGame();
    saveGame();
}

// =========================
// ENERGY
// =========================

function startEnergyRestore() {

    if (energyCountdownInterval)
        return;

    if (energy >= MAX_ENERGY)
        return;

    if (!nextEnergyTick) {

        nextEnergyTick =
            Date.now() + ENERGY_TICK_MS;

        saveGame();
    }

    energyCountdownInterval =
        setInterval(() => {

            if (energy >= MAX_ENERGY) {

                clearInterval(
                    energyCountdownInterval
                );

                energyCountdownInterval = null;
                nextEnergyTick = null;

                saveGame();
                updateGame();

                return;
            }

            const now = Date.now();

            if (now >= nextEnergyTick) {

                const elapsed =
                    now - nextEnergyTick;

                const increments =
                    1 +
                    Math.floor(
                        elapsed / ENERGY_TICK_MS
                    );

                energy = Math.min(
                    MAX_ENERGY,
                    energy + increments
                );

                if (energy < MAX_ENERGY) {

                    nextEnergyTick =
                        now + ENERGY_TICK_MS;

                } else {

                    nextEnergyTick = null;

                    clearInterval(
                        energyCountdownInterval
                    );

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
// UPDATE GAME
// =========================

function updateGame() {

    const currentWolf =
        wolves[stage];

    document.getElementById("stage").textContent =
        currentWolf.name;

    document.querySelector(".wolf").innerHTML =
        `<img src="${currentWolf.image}" alt="${currentWolf.name}">`;

    document.getElementById("xp").textContent =
        xp;

    document.getElementById("coins").textContent =
        coins;

    // Energy
    const energyEl =
        document.getElementById("energy");

    energyEl.textContent =
        `⚡ Energy ${energy} / ${MAX_ENERGY}`;

    // Countdown
    let countdownEl =
        document.getElementById("energyCountdown");

    if (!countdownEl) {

        countdownEl =
            document.createElement("div");

        countdownEl.id =
            "energyCountdown";

        countdownEl.style.display =
            "block";

        countdownEl.style.marginTop =
            "4px";

        countdownEl.style.fontSize =
            "0.7em";

        countdownEl.style.opacity =
            "0.65";

        countdownEl.style.color =
            "#666";

        energyEl.parentNode.insertBefore(
            countdownEl,
            energyEl.nextSibling
        );
    }

    if (energy >= MAX_ENERGY) {

        countdownEl.textContent = "";
        countdownEl.style.display = "none";

    } else {

        countdownEl.style.display =
            "block";

        let remaining = 5;

        if (nextEnergyTick) {

            remaining =
                Math.ceil(
                    (nextEnergyTick -
                        Date.now()) /
                    1000
                );

            if (remaining < 1)
                remaining = 1;
        }

        countdownEl.textContent =
            `${remaining}s`;
    }

    // Train button
    document.getElementById("trainBtn").disabled =
        energy < 10;

    // XP bar
    if (stage < wolves.length - 1) {

        document.getElementById("nextXP").textContent =
            currentWolf.nextXP;

        let progress =
            (xp / currentWolf.nextXP) * 100;

        if (progress > 100)
            progress = 100;

        document.getElementById("xpFill").style.width =
            progress + "%";

    } else {

        document.getElementById("nextXP").textContent =
            "MAX";

        document.getElementById("xpFill").style.width =
            "100%";
    }
}

// =========================
// SHOP OVERLAY CLOSE
// =========================

document.addEventListener(
    "click",
    function(event) {

        const shop =
            document.getElementById("foodShopPanel");

        if (
            shop &&
            shop.classList.contains("active") &&
            event.target === shop
        ) {
            closeFoodShop();
        }
    }
);

// ESC CLOSE
document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeFoodShop();
        }
    }
);

// =========================
// RESET TEST
// =========================

function resetTest() {

    if (energyCountdownInterval) {

        clearInterval(
            energyCountdownInterval
        );

        energyCountdownInterval = null;
    }

    xp = 0;
    stage = 0;
    coins = 0;
    energy = MAX_ENERGY;
    nextEnergyTick = null;

    localStorage.removeItem("elitewolf_xp");
    localStorage.removeItem("elitewolf_stage");
    localStorage.removeItem("elitewolf_coins");
    localStorage.removeItem("elitewolf_energy");
    localStorage.removeItem(
        "elitewolf_nextEnergyTick"
    );

    saveGame();
    updateGame();

    document.getElementById("message").textContent =
        "RESET TEST: Game reset to default testing state.";
}

// =========================
// START
// =========================

loadGame();
updateGame();

if (energy < MAX_ENERGY) {
    startEnergyRestore();
}
