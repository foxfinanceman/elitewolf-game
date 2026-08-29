let xp = 0;
let stage = 0;

const wolves = [
    {
        name: "Wolf Pup",
        emoji: "🐺",
        xp: 100
    },
    {
        name: "Young Wolf",
        emoji: "🐺",
        xp: 250
    },
    {
        name: "Alpha Wolf",
        emoji: "🐺",
        xp: 500
    },
    {
        name: "Elite Wolf",
        emoji: "👑🐺",
        xp: 1000
    }
];

function trainWolf() {

    if (stage >= wolves.length - 1) {
        document.getElementById("message").textContent =
            "🔥 ELITE WOLF HAS REACHED MAX LEVEL!";
        return;
    }

    xp += 25;

    checkEvolution();
    updateGame();

    const messages = [
        "The wolf is getting stronger...",
        "Keep training the pack! 🐺",
        "Your wolf is evolving...",
        "The hunt continues! 🔥"
    ];

    const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

    document.getElementById("message").textContent = randomMessage;
}

function checkEvolution() {

    if (xp >= wolves[stage].xp) {

        if (stage < wolves.length - 1) {
            stage++;

            document.getElementById("message").textContent =
                "🔥 EVOLUTION! Your wolf became " +
                wolves[stage].name + "!";
        }
    }
}

function updateGame() {

    const currentWolf = wolves[stage];

    document.getElementById("stage").textContent =
        currentWolf.name;

    document.querySelector(".wolf").textContent =
        currentWolf.emoji;

    document.getElementById("xp").textContent =
        xp;

    if (stage < wolves.length - 1) {

        document.getElementById("nextXP").textContent =
            currentWolf.xp;

        let progress =
            (xp / currentWolf.xp) * 100;

        if (progress > 100) progress = 100;

        document.getElementById("xpFill").style.width =
            progress + "%";

    } else {

        document.getElementById("nextXP").textContent =
            "MAX";

        document.getElementById("xpFill").style.width =
            "100%";
    }
}

updateGame();
