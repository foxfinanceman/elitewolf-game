let xp = 0;
let stage = 0;
let coins = 0;
let energy = 100;
let energyRestoreInterval = null;

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
}

function loadGame() {
    const savedXP = localStorage.getItem("elitewolf_xp");
    const savedStage = localStorage.getItem("elitewolf_stage");
    const savedCoins = localStorage.getItem("elitewolf_coins");
    const savedEnergy = localStorage.getItem("elitewolf_energy");

    if (savedXP !== null) xp = parseInt(savedXP);
    if (savedStage !== null) stage = parseInt(savedStage);
    if (savedCoins !== null) coins = parseInt(savedCoins);
    if (savedEnergy !== null) energy = parseInt(savedEnergy);
}

function startEnergyRestore() {
    if (energyRestoreInterval) return;

    energyRestoreInterval = setInterval(() => {
        if (energy < 100) {
            energy++;
            updateGame();
            saveGame();
        } else {
            clearInterval(energyRestoreInterval);
            energyRestoreInterval = null;
        }
    }, 3000);
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

    startEnergyRestore();
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