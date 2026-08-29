let xp = 0;
let stage = 0;

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

function trainWolf() {
    if (stage >= wolves.length - 1) {
        document.getElementById("message").textContent =
            "🔥 ELITE WOLF HAS REACHED MAX LEVEL!";
        return;
    }

    xp += 25;

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

    updateGame();
}

function updateGame() {
    const currentWolf = wolves[stage];

    document.getElementById("stage").textContent =
        currentWolf.name;

    document.querySelector(".wolf").innerHTML =
        `<img src="${currentWolf.image}" alt="${currentWolf.name}">`;

    document.getElementById("xp").textContent = xp;

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

updateGame();
