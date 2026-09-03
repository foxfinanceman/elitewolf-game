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


// =========================
// GAME BALANCE
// =========================

const ENERGY_TICK_MS = 60000;
const XP_TICK_MS = 60000;

const HUNGER_TICK_MS = 300000;
const MOOD_TICK_MS = 600000;

const HEALTH_REGEN_MS = 120000;
const HEALTH_LOSS_MS = 300000;


let energyTimer = null;
let xpTimer = null;
let hungerTimer = null;
let moodTimer = null;
let healthTimer = null;

let nextEnergyTick = null;
let lastUpdateTime = null;


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

    const el =
        document.getElementById("message");

    if (el) {
        el.textContent = text;
    }
}


// =========================
// RESET V5
// =========================

function forceResetV5() {

    const currentVersion =
        localStorage.getItem(
            "elitewolf_game_version"
        );

    if (currentVersion === "v5") {
        return;
    }

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
    lastUpdateTime = Date.now();

    saveGame();

    localStorage.setItem(
        "elitewolf_game_version",
        "v5"
    );
}


// =========================
// SAVE
// =========================

function saveGame() {

    localStorage.setItem(
        "elitewolf_xp",
        xp
    );

    localStorage.setItem(
        "elitewolf_stage",
        stage
    );

    localStorage.setItem(
        "elitewolf_coins",
        coins
    );

    localStorage.setItem(
        "elitewolf_energy",
        energy
    );

    localStorage.setItem(
        "elitewolf_health",
        health
    );

    localStorage.setItem(
        "elitewolf_hunger",
        hunger
    );

    localStorage.setItem(
        "elitewolf_mood",
        mood
    );

    localStorage.setItem(
        "elitewolf_bone",
        bone
    );

    localStorage.setItem(
        "elitewolf_meat",
        meat
    );

    localStorage.setItem(
        "elitewolf_premium",
        premium
    );

    localStorage.setItem(
        "elitewolf_feast",
        feast
    );


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


    if (lastUpdateTime !== null) {

        localStorage.setItem(
            "elitewolf_lastUpdateTime",
            lastUpdateTime
        );
    }
}


// =========================
// LOAD
// =========================

function loadGame() {

    const get = (key, fallback) => {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        const number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;
    };


    xp = get(
        "elitewolf_xp",
        0
    );

    stage = get(
        "elitewolf_stage",
        0
    );

    coins = get(
        "elitewolf_coins",
        0
    );

    energy = get(
        "elitewolf_energy",
        MAX_ENERGY
    );

    health = get(
        "elitewolf_health",
        MAX_HEALTH
    );

    hunger = get(
        "elitewolf_hunger",
        MAX_HUNGER
    );

    mood = get(
        "elitewolf_mood",
        MAX_MOOD
    );

    bone = get(
        "elitewolf_bone",
        0
    );

    meat = get(
        "elitewolf_meat",
        0
    );

    premium = get(
        "elitewolf_premium",
        0
    );

    feast = get(
        "elitewolf_feast",
        0
    );


    const savedTick =
        localStorage.getItem(
            "elitewolf_nextEnergyTick"
        );

    if (savedTick !== null) {

        nextEnergyTick =
            Number(savedTick);

    } else {

        nextEnergyTick = null;
    }


    const savedLastTime =
        localStorage.getItem(
            "elitewolf_lastUpdateTime"
        );

    if (savedLastTime !== null) {

        lastUpdateTime =
            Number(savedLastTime);

    } else {

        lastUpdateTime =
            Date.now();
    }


    stage = Math.max(
        0,
        Math.min(
            stage,
            wolves.length - 1
        )
    );

    energy = Math.max(
        0,
        Math.min(
            energy,
            MAX_ENERGY
        )
    );

    health = Math.max(
        0,
        Math.min(
            health,
            MAX_HEALTH
        )
    );

    hunger = Math.max(
        0,
        Math.min(
            hunger,
            MAX_HUNGER
        )
    );

    mood = Math.max(
        0,
        Math.min(
            mood,
            MAX_MOOD
        )
    );
}


// =========================
// OFFLINE PROGRESS
// =========================

function applyOfflineProgress() {

    const now = Date.now();

    if (!lastUpdateTime) {

        lastUpdateTime = now;
        return;
    }


    let elapsed =
        now - lastUpdateTime;

    if (elapsed < 0) {
        elapsed = 0;
    }


    const minutes =
        Math.floor(
            elapsed / 60000
        );


    if (minutes <= 0) {
        return;
    }


    // ENERGY

    if (energy < MAX_ENERGY) {

        energy = Math.min(
            MAX_ENERGY,
            energy + minutes
        );

        if (energy >= MAX_ENERGY) {
            nextEnergyTick = null;
        }
    }


    // XP

    xp += minutes;

    checkEvolution();


    // HUNGER

    const hungerLoss =
        Math.floor(
            minutes / 5
        );

    hunger = Math.max(
        0,
        hunger - hungerLoss
    );


    // MOOD

    const moodTicks =
        Math.floor(
            minutes / 10
        );

    if (hunger < 50) {

        mood = Math.max(
            0,
            mood - moodTicks
        );
    }


    // HEALTH

    if (hunger <= 10) {

        const healthLoss =
            Math.floor(
                minutes / 5
            );

        health = Math.max(
            0,
            health - healthLoss
        );

    } else if (hunger > 30) {

        const healthGain =
            Math.floor(
                minutes / 2
            );

        health = Math.min(
            MAX_HEALTH,
            health + healthGain
        );
    }


    lastUpdateTime = now;

    saveGame();
}


// =========================
// TRAIN
// =========================

function trainWolf() {

    if (
        stage ===
        wolves.length - 1
    ) {

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

            wolf.classList.add(
                "evolving"
            );


            setTimeout(() => {

                wolf.classList.remove(
                    "evolving"
                );

            }, 800);
        }
    }


    if (evolved) {

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


    if (index === 0) bone--;
    if (index === 1) meat--;
    if (index === 2) premium--;
    if (index === 3) feast--;


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


    closeFeedMenu();
}


// =========================
// ENERGY
// =========================

function startEnergyRestore() {

    if (energy >= MAX_ENERGY) {

        nextEnergyTick = null;
        return;
    }


    if (!nextEnergyTick) {

        nextEnergyTick =
            Date.now() +
            ENERGY_TICK_MS;
    }


    if (energyTimer) {
        return;
    }


    energyTimer =
        setInterval(() => {

            if (energy >= MAX_ENERGY) {

                clearInterval(
                    energyTimer
                );

                energyTimer = null;
                nextEnergyTick = null;

                saveGame();
                updateGame();

                return;
            }


            if (
                Date.now() >=
                nextEnergyTick
            ) {

                energy++;


                if (
                    energy >=
                    MAX_ENERGY
                ) {

                    energy = MAX_ENERGY;

                    nextEnergyTick = null;


                    clearInterval(
                        energyTimer
                    );

                    energyTimer = null;

                } else {

                    nextEnergyTick =
                        Date.now() +
                        ENERGY_TICK_MS;
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


    xpTimer =
        setInterval(() => {

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


    hungerTimer =
        setInterval(() => {

            hunger = Math.max(
                0,
                hunger - 1
            );


            updateGame();
            saveGame();

        }, HUNGER_TICK_MS);
}


// =========================
// MOOD TIMER
// =========================

function startMoodTick() {

    if (moodTimer) return;


    moodTimer =
        setInterval(() => {

            if (hunger < 50) {

                mood = Math.max(
                    0,
                    mood - 1
                );
            }


            updateGame();
            saveGame();

        }, MOOD_TICK_MS);
}


// =========================
// HEALTH TIMER
// =========================

function startHealthTick() {

    if (healthTimer) return;


    healthTimer =
        setInterval(() => {

            if (hunger <= 10) {

                health = Math.max(
                    0,
                    health - 1
                );

            } else if (hunger > 30) {

                health = Math.min(
                    MAX_HEALTH,
                    health + 1
                );
            }


            updateGame();
            saveGame();

        }, HEALTH_REGEN_MS);
}


// =========================
// WOLF MOOD EMOJI
// =========================

function updateMoodEmoji() {

    const moodEmoji =
        document.getElementById(
            "wolfMoodEmoji"
        );

    if (!moodEmoji) return;


    if (mood >= 80) {

        moodEmoji.textContent = "😎";

    } else if (mood >= 60) {

        moodEmoji.textContent = "😊";

    } else if (mood >= 40) {

        moodEmoji.textContent = "😐";

    } else if (mood >= 20) {

        moodEmoji.textContent = "😟";

    } else {

        moodEmoji.textContent = "😡";
    }
}


// =========================
// UPDATE UI
// =========================

function updateGame() {

    const wolf = wolves[stage];


    // =========================
    // STAGE
    // =========================

    const stageEl =
        document.getElementById("stage");

    if (stageEl) {

        stageEl.textContent =
            wolf.name;
    }


    // =========================
    // WOLF IMAGE
    // =========================

    const wolfEl =
        document.querySelector(".wolf");

    if (wolfEl) {

        /*
         * IMPORTANT:
         * Do NOT recreate the image on every update.
         * Reusing the same <img> keeps the floating
         * animation smooth after button clicks.
         */

        let wolfImg =
            wolfEl.querySelector("img");

        if (!wolfImg) {

            wolfImg =
                document.createElement("img");

            wolfEl.appendChild(
                wolfImg
            );
        }


        /*
         * Change the image only when
         * the wolf actually evolves.
         */

        if (
            wolfImg.getAttribute("src") !==
            wolf.image
        ) {

            wolfImg.src =
                wolf.image;
        }


        wolfImg.alt =
            wolf.name;
    }


    // =========================
    // XP
    // =========================

    const xpEl =
        document.getElementById("xp");

    if (xpEl) {
        xpEl.textContent = xp;
    }


    // =========================
    // COINS
    // =========================

    const coinsEl =
        document.getElementById("coins");

    if (coinsEl) {
        coinsEl.textContent = coins;
    }


    // =========================
    // ENERGY
    // =========================

    const energyEl =
        document.getElementById("energy");

    if (energyEl) {

        energyEl.textContent =
            `Energy ${energy} / ${MAX_ENERGY}`;
    }


    // =========================
    // HEALTH TEXT
    // =========================

    const healthText =
        document.getElementById(
            "healthText"
        );

    if (healthText) {

        healthText.textContent =
            `${health} / ${MAX_HEALTH}`;
    }


    // =========================
    // HUNGER TEXT
    // =========================

    const hungerText =
        document.getElementById(
            "hungerText"
        );

    if (hungerText) {

        hungerText.textContent =
            `${hunger} / ${MAX_HUNGER}`;
    }


    // =========================
    // MOOD TEXT
    // =========================

    const moodText =
        document.getElementById(
            "moodText"
        );

    if (moodText) {

        moodText.textContent =
            `${mood} / ${MAX_MOOD}`;
    }


    // =========================
    // INVENTORY
    // =========================

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


    // =========================
    // XP PROGRESS
    // =========================

    const nextXPEl =
        document.getElementById(
            "nextXP"
        );

    const xpFill =
        document.getElementById(
            "xpFill"
        );


    if (
        stage <
        wolves.length - 1
    ) {

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


    // =========================
    // HEALTH BAR
    // =========================

    const healthFill =
        document.getElementById(
            "healthFill"
        );

    if (healthFill) {

        healthFill.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    health
                )
            ) + "%";
    }


    // =========================
    // HUNGER BAR
    // =========================

    const hungerFill =
        document.getElementById(
            "hungerFill"
        );

    if (hungerFill) {

        hungerFill.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    hunger
                )
            ) + "%";
    }


    // =========================
    // MOOD BAR
    // =========================

    const moodFill =
        document.getElementById(
            "moodFill"
        );

    if (moodFill) {

        moodFill.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    mood
                )
            ) + "%";
    }


    // =========================
    // MOOD EMOJI
    // =========================

    updateMoodEmoji();


    // =========================
    // TRAIN BUTTON
    // =========================

    const trainBtn =
        document.getElementById(
            "trainBtn"
        );

    if (trainBtn) {

        trainBtn.disabled =
            energy < 10 ||
            stage >= wolves.length - 1;
    }


    // =========================
    // ENERGY COUNTDOWN
    // =========================

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
            document.createElement(
                "div"
            );

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

        countdown.style.display =
            "none";

        return;
    }


    const seconds =
        Math.max(
            1,
            Math.ceil(
                (
                    nextEnergyTick -
                    Date.now()
                ) / 1000
            )
        );


    countdown.style.display =
        "block";


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
    clearInterval(moodTimer);
    clearInterval(healthTimer);


    energyTimer = null;
    xpTimer = null;
    hungerTimer = null;
    moodTimer = null;
    healthTimer = null;


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

    lastUpdateTime =
        Date.now();


    localStorage.clear();


    localStorage.setItem(
        "elitewolf_game_version",
        "v5"
    );


    updateGame();
    saveGame();


    showMessage(
        "🔄 Game reset successfully!"
    );


    startXPTick();
    startHungerTick();
    startMoodTick();
    startHealthTick();
}


// =========================
// START
// =========================

forceResetV5();

loadGame();


// =========================
// OFFLINE PROGRESS
// =========================

applyOfflineProgress();


// =========================
// UPDATE TIMESTAMP
// =========================

lastUpdateTime =
    Date.now();

saveGame();


// =========================
// FIRST UI UPDATE
// =========================

updateGame();


// =========================
// START TIMERS
// =========================

if (
    energy <
    MAX_ENERGY
) {

    startEnergyRestore();
}

startXPTick();
startHungerTick();
startMoodTick();
startHealthTick();


// =========================
// SAVE BEFORE EXIT
// =========================

window.addEventListener(
    "beforeunload",
    function() {

        lastUpdateTime =
            Date.now();

        saveGame();
    }
);
