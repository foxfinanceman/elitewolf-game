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

const ENERGY_TICK_MS = 60000;
const XP_TICK_MS = 60000;
const HUNGER_TICK_MS = 60000;

let xpTimer = null;
let hungerTimer = null;


// =========================================================
// WOLVES
// =========================================================

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


// =========================================================
// FOOD
// =========================================================

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


// =========================================================
// SAVE GAME
// =========================================================

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

        localStorage.removeItem(
            "elitewolf_nextEnergyTick"
        );
    }
}


// =========================================================
// LOAD GAME
// =========================================================

function loadGame() {

    const savedXP =
        localStorage.getItem("elitewolf_xp");

    const savedStage =
        localStorage.getItem("elitewolf_stage");

    const savedCoins =
        localStorage.getItem("elitewolf_coins");

    const savedEnergy =
        localStorage.getItem("elitewolf_energy");

    const savedHealth =
        localStorage.getItem("elitewolf_health");

    const savedHunger =
        localStorage.getItem("elitewolf_hunger");

    const savedMood =
        localStorage.getItem("elitewolf_mood");

    const savedBone =
        localStorage.getItem("elitewolf_bone");

    const savedMeat =
        localStorage.getItem("elitewolf_meat");

    const savedPremium =
        localStorage.getItem("elitewolf_premium");

    const savedFeast =
        localStorage.getItem("elitewolf_feast");

    const savedNextTick =
        localStorage.getItem(
            "elitewolf_nextEnergyTick"
        );


    if (savedXP !== null)
        xp = parseInt(savedXP);

    if (savedStage !== null)
        stage = parseInt(savedStage);

    if (savedCoins !== null)
        coins = parseInt(savedCoins);

    if (savedEnergy !== null)
        energy = parseInt(savedEnergy);

    if (savedHealth !== null)
        health = parseInt(savedHealth);

    if (savedHunger !== null)
        hunger = parseInt(savedHunger);

    if (savedMood !== null)
        mood = parseInt(savedMood);

    if (savedBone !== null)
        bone = parseInt(savedBone);

    if (savedMeat !== null)
        meat = parseInt(savedMeat);

    if (savedPremium !== null)
        premium = parseInt(savedPremium);

    if (savedFeast !== null)
        feast = parseInt(savedFeast);


    if (
        savedNextTick !== null &&
        !Number.isNaN(parseInt(savedNextTick))
    ) {

        nextEnergyTick =
            parseInt(savedNextTick);

        if (energy < MAX_ENERGY) {

            const now = Date.now();

            if (now >= nextEnergyTick) {

                const elapsed =
                    now - nextEnergyTick;

                const increments =
                    1 +
                    Math.floor(
                        elapsed / ENERGY_TICK_MS
                    );

                energy =
                    Math.min(
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


    if (stage < 0)
        stage = 0;

    if (stage >= wolves.length)
        stage = wolves.length - 1;


    energy =
        Math.max(
            0,
            Math.min(MAX_ENERGY, energy)
        );

    health =
        Math.max(
            0,
            Math.min(MAX_HEALTH, health)
        );

    hunger =
        Math.max(
            0,
            Math.min(MAX_HUNGER, hunger)
        );

    mood =
        Math.max(
            0,
            Math.min(MAX_MOOD, mood)
        );
}


// =========================================================
// TRAIN WOLF
// =========================================================

function trainWolf() {

    if (energy < 10) {

        const msgEl =
            document.getElementById("message");

        if (msgEl)
            msgEl.textContent =
                "⚡ Your wolf needs to rest!";

        return;
    }


    if (stage >= wolves.length - 1) {

        const msgEl =
            document.getElementById("message");

        if (msgEl)
            msgEl.textContent =
                "🔥 ELITE WOLF HAS REACHED MAX LEVEL!";

        return;
    }


    xp += 25;
    coins += 5;
    energy -= 10;

    mood += 5;

    if (mood > MAX_MOOD)
        mood = MAX_MOOD;


    checkEvolution();


    if (energy < MAX_ENERGY)
        startEnergyRestore();


    const msgEl =
        document.getElementById("message");

    if (msgEl)
        msgEl.textContent =
            "⚔️ Training complete! +25 XP +5 💰";


    updateGame();
    saveGame();
}


// =========================================================
// FOOD SHOP
// =========================================================

function openFoodShop() {

    const shop =
        document.getElementById("foodShopPanel");

    if (shop) {

        shop.classList.add("active");

        const message =
            document.getElementById("shopMessage");

        if (message)
            message.textContent = "";
    }
}


function closeFoodShop() {

    const shop =
        document.getElementById("foodShopPanel");

    if (shop)
        shop.classList.remove("active");
}


// =========================================================
// BUY FOOD
// =========================================================

function buyFood(index) {

    const food = foods[index];

    if (!food)
        return;


    const shopMessage =
        document.getElementById("shopMessage");


    if (coins < food.price) {

        if (shopMessage) {

            shopMessage.textContent =
                `❌ Not enough coins! You need ${food.price} 💰`;
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
            `✅ ${food.name} purchased and added to inventory!`;
    }


    const msgEl =
        document.getElementById("message");

    if (msgEl)
        msgEl.textContent =
            `🎒 You bought ${food.name}.`;


    updateGame();
    saveGame();
}


// =========================================================
// FEED WOLF
// =========================================================

function feedWolf(index) {

    const food = foods[index];

    if (!food)
        return;


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

        const msgEl =
            document.getElementById("message");

        if (msgEl)
            msgEl.textContent =
                `❌ You don't have any ${food.name}!`;

        return;
    }


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


    hunger =
        Math.min(
            MAX_HUNGER,
            hunger + food.hunger
        );

    mood =
        Math.min(
            MAX_MOOD,
            mood + food.mood
        );

    xp += food.xp;


    const msgEl =
        document.getElementById("message");

    if (msgEl)
        msgEl.textContent =
            `🍖 Your wolf ate ${food.name}! +${food.xp} XP`;


    checkEvolution();

    updateGame();
    saveGame();
}


// =========================================================
// EVOLUTION
// =========================================================

function checkEvolution() {

    while (
        stage < wolves.length - 1 &&
        xp >= wolves[stage].nextXP
    ) {

        stage++;


        const wolfElement =
            document.querySelector(".wolf");


        if (wolfElement) {

            wolfElement.classList.add(
                "evolving"
            );


            setTimeout(() => {

                wolfElement.classList.remove(
                    "evolving"
                );

            }, 800);
        }


        const msgEl =
            document.getElementById("message");


        if (msgEl) {

            msgEl.textContent =
                "🔥 EVOLUTION! Your wolf became " +
                wolves[stage].name +
                "!";
        }
    }
}


// =========================================================
// ENERGY
// =========================================================

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


            if (
                nextEnergyTick &&
                now >= nextEnergyTick
            ) {

                const elapsed =
                    now - nextEnergyTick;

                const increments =
                    1 +
                    Math.floor(
                        elapsed / ENERGY_TICK_MS
                    );


                energy =
                    Math.min(
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


// =========================================================
// XP TIMER
// =========================================================

function startXPTick() {

    if (xpTimer)
        return;


    xpTimer =
        setInterval(() => {

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


// =========================================================
// HUNGER TIMER
// =========================================================

function startHungerTick() {

    if (hungerTimer)
        return;


    hungerTimer =
        setInterval(() => {

            hunger =
                Math.max(
                    0,
                    hunger - 1
                );


            if (hunger <= 30) {

                mood =
                    Math.max(
                        0,
                        mood - 1
                    );
            }


            if (hunger <= 10) {

                health =
                    Math.max(
                        0,
                        health - 1
                    );
            }


            updateGame();
            saveGame();

        }, HUNGER_TICK_MS);
}


function stopHungerTick() {

    if (hungerTimer) {

        clearInterval(
            hungerTimer
        );

        hungerTimer = null;
    }
}


// =========================================================
// UPDATE GAME
// =========================================================

function updateGame() {

    const currentWolf =
        wolves[stage];


    /* WOLF STAGE */

    const stageEl =
        document.getElementById("stage");

    if (stageEl)
        stageEl.textContent =
            currentWolf.name;


    /* WOLF IMAGE */

    const wolfEl =
        document.querySelector(".wolf");

    if (wolfEl) {

        wolfEl.innerHTML =
            `<img src="${currentWolf.image}" alt="${currentWolf.name}">`;
    }


    /* XP */

    const xpEl =
        document.getElementById("xp");

    if (xpEl)
        xpEl.textContent = xp;


    /* COINS */

    const coinsEl =
        document.getElementById("coins");

    if (coinsEl)
        coinsEl.textContent = coins;


    /* =====================================================
       ENERGY
       ===================================================== */

    const energyEl =
        document.getElementById("energy");

    /*
       IMPORTANT:
       The ⚡ already exists in index.html.
       Therefore we only output the text here.
    */

    if (energyEl)
        energyEl.textContent =
            `Energy ${energy} / ${MAX_ENERGY}`;


    /* =====================================================
       HEALTH
       ===================================================== */

    const healthText =
        document.getElementById("healthText");

    const healthFill =
        document.getElementById("healthFill");

    if (healthText)
        healthText.textContent =
            `${health} / ${MAX_HEALTH}`;

    if (healthFill)
        healthFill.style.width =
            `${health}%`;


    /* =====================================================
       HUNGER
       ===================================================== */

    const hungerText =
        document.getElementById("hungerText");

    const hungerFill =
        document.getElementById("hungerFill");

    if (hungerText)
        hungerText.textContent =
            `${hunger} / ${MAX_HUNGER}`;

    if (hungerFill)
        hungerFill.style.width =
            `${hunger}%`;


    /* =====================================================
       MOOD
       ===================================================== */

    const moodText =
        document.getElementById("moodText");

    const moodFill =
        document.getElementById("moodFill");

    if (moodText)
        moodText.textContent =
            `${mood} / ${MAX_MOOD}`;

    if (moodFill)
        moodFill.style.width =
            `${mood}%`;


    /* =====================================================
       INVENTORY
       ===================================================== */

    const boneEl =
        document.getElementById("boneCount");

    const meatEl =
        document.getElementById("meatCount");

    const premiumEl =
        document.getElementById("premiumCount");

    const feastEl =
        document.getElementById("feastCount");


    if (boneEl)
        boneEl.textContent = bone;

    if (meatEl)
        meatEl.textContent = meat;

    if (premiumEl)
        premiumEl.textContent = premium;

    if (feastEl)
        feastEl.textContent = feast;


    /* =====================================================
       ENERGY COUNTDOWN
       ===================================================== */

    let countdownEl =
        document.getElementById(
            "energyCountdown"
        );


    if (!countdownEl && energyEl) {

        countdownEl =
            document.createElement("div");

        countdownEl.id =
            "energyCountdown";

        countdownEl.style.display =
            "block";

        countdownEl.style.marginTop =
            "3px";

        countdownEl.style.fontSize =
            "0.7em";

        countdownEl.style.opacity =
            "0.65";

        countdownEl.style.color =
            "#aaa";


        energyEl.parentNode.insertBefore(
            countdownEl,
            energyEl.nextSibling
        );
    }


    if (countdownEl) {

        if (energy >= MAX_ENERGY) {

            countdownEl.textContent = "";

            countdownEl.style.display =
                "none";

        } else {

            countdownEl.style.display =
                "block";


            let remaining = 0;


            if (nextEnergyTick) {

                remaining =
                    Math.ceil(
                        (
                            nextEnergyTick -
                            Date.now()
                        ) / 1000
                    );
            }


            if (
                !nextEnergyTick ||
                remaining < 1
            ) {

                remaining =
                    Math.ceil(
                        ENERGY_TICK_MS / 1000
                    );
            }


            countdownEl.textContent =
                `${remaining}s`;
        }
    }


    /* =====================================================
       TRAIN BUTTON
       ===================================================== */

    const trainBtn =
        document.getElementById(
            "trainBtn"
        );

    if (trainBtn)
        trainBtn.disabled =
            energy < 10;


    /* =====================================================
       XP BAR
       ===================================================== */

    const nextXPEl =
        document.getElementById(
            "nextXP"
        );

    const xpFill =
        document.getElementById(
            "xpFill"
        );


    if (stage < wolves.length - 1) {

        if (nextXPEl)
            nextXPEl.textContent =
                currentWolf.nextXP;


        let progress =
            (
                xp /
                currentWolf.nextXP
            ) * 100;


        if (progress > 100)
            progress = 100;


        if (xpFill)
            xpFill.style.width =
                progress + "%";

    } else {

        if (nextXPEl)
            nextXPEl.textContent =
                "MAX";


        if (xpFill)
            xpFill.style.width =
                "100%";
    }
}


// =========================================================
// SHOP OVERLAY CLOSE
// =========================================================

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


// =========================================================
// ESC CLOSE
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape")
            closeFoodShop();
    }
);


// =========================================================
// RESET TEST
// =========================================================

function resetTest() {

    if (energyCountdownInterval) {

        clearInterval(
            energyCountdownInterval
        );

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


    localStorage.removeItem(
        "elitewolf_xp"
    );

    localStorage.removeItem(
        "elitewolf_stage"
    );

    localStorage.removeItem(
        "elitewolf_coins"
    );

    localStorage.removeItem(
        "elitewolf_energy"
    );

    localStorage.removeItem(
        "elitewolf_nextEnergyTick"
    );

    localStorage.removeItem(
        "elitewolf_health"
    );

    localStorage.removeItem(
        "elitewolf_hunger"
    );

    localStorage.removeItem(
        "elitewolf_mood"
    );

    localStorage.removeItem(
        "elitewolf_bone"
    );

    localStorage.removeItem(
        "elitewolf_meat"
    );

    localStorage.removeItem(
        "elitewolf_premium"
    );

    localStorage.removeItem(
        "elitewolf_feast"
    );


    saveGame();
    updateGame();


    const msgEl =
        document.getElementById(
            "message"
        );


    if (msgEl)
        msgEl.textContent =
            "RESET TEST: Game reset to default testing state.";
}


// =========================================================
// START GAME
// =========================================================

loadGame();

updateGame();


if (energy < MAX_ENERGY)
    startEnergyRestore();


startXPTick();

startHungerTick();


// =========================================================
// SAVE BEFORE LEAVING
// =========================================================

window.addEventListener(
    "beforeunload",
    () => {
        saveGame();
    }
);
