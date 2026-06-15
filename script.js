let currentRound = 1;
let players = [];
let matches = [];
let rounds = [];

/* ================= INIT ================= */

window.onload = function () {
    displayPlayers();
    updateDropdowns();
};

/* ================= PLAYER ================= */

function addPlayer() {
    let input = document.getElementById("playerName");
    let name = input.value.trim();

    if (!name) return;

    players.push({
        id: Date.now(),
        name: name,
        score: 0
    });

    input.value = "";

    displayPlayers();
    updateDropdowns();
}

/* Enter key support */
document.getElementById("playerName").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addPlayer();
    }
});

/* ================= SCORE ================= */

function addWin(id) {
    let player = players.find(p => p.id === id);
    if (player) player.score++;

    displayPlayers();
}

function removePoint(id) {
    let player = players.find(p => p.id === id);
    if (player && player.score > 0) player.score--;

    displayPlayers();
}

/* ================= DISPLAY PLAYERS ================= */

function displayPlayers() {
    let list = document.getElementById("playerList");
    list.innerHTML = "";

    let sorted = [...players].sort((a, b) => b.score - a.score);

    sorted.forEach((player, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <strong>#${index + 1}</strong>
            ${player.name} - Score: ${player.score}
            <button onclick="addWin(${player.id})">+1</button>
            <button onclick="removePoint(${player.id})">-1</button>
        `;

        list.appendChild(li);
    });
}

/* ================= DROPDOWNS ================= */

function updateDropdowns() {
    let playerA = document.getElementById("playerA");
    let playerB = document.getElementById("playerB");

    playerA.innerHTML = "";
    playerB.innerHTML = "";

    players.forEach(player => {
        let optionA = document.createElement("option");
        optionA.value = player.id;
        optionA.textContent = player.name;

        let optionB = document.createElement("option");
        optionB.value = player.id;
        optionB.textContent = player.name;

        playerA.appendChild(optionA);
        playerB.appendChild(optionB);
    });
}

/* ================= MATCH SYSTEM ================= */

function addMatchResult() {
    let aId = Number(document.getElementById("playerA").value);
    let bId = Number(document.getElementById("playerB").value);

    if (!aId || !bId) {
        alert("Select both players first");
        return;
    }

    if (aId === bId) {
        alert("A player cannot play themselves");
        return;
    }

    let winner = prompt("Who won? (A / B / D)");

    let playerA = players.find(p => p.id === aId);
    let playerB = players.find(p => p.id === bId);

    if (!playerA || !playerB) return;

    if (winner === "A") playerA.score++;
    else if (winner === "B") playerB.score++;
    else if (winner === "D") {
        playerA.score += 0.5;
        playerB.score += 0.5;
    }

    matches.push({
        round: currentRound,
        a: playerA.name,
        b: playerB.name,
        result: winner
    });

    displayPlayers();
    displayMatches();
}

/* ================= MATCH DISPLAY ================= */

function displayMatches() {
    let list = document.getElementById("matchList");
    list.innerHTML = "";

    matches.forEach(match => {
        let li = document.createElement("li");
        li.textContent = `${match.a} vs ${match.b} → Winner: ${match.result}`;
        list.appendChild(li);
    });
}

/* ================= ROUNDS ================= */

function nextRound() {
    currentRound++;
    document.getElementById("roundNumber").textContent = currentRound;

    rounds[currentRound] = [];

    alert("Round " + currentRound + " started!");
}

/* ================= SWISS PAIRING ================= */

function generateSwissPairings() {
    let sorted = [...players].sort((a, b) => b.score - a.score);

    let pairings = [];

    for (let i = 0; i < sorted.length; i += 2) {
        if (sorted[i + 1]) {
            pairings.push({
                playerA: sorted[i],
                playerB: sorted[i + 1]
            });
        } else {
            pairings.push({
                playerA: sorted[i],
                playerB: null
            });
        }
    }

    displayPairings(pairings);
}

function displayPairings(pairings) {
    let list = document.getElementById("matchList");
    list.innerHTML = "";

    pairings.forEach(pair => {
        let li = document.createElement("li");

        if (pair.playerB) {
            li.textContent = `${pair.playerA.name} vs ${pair.playerB.name}`;
        } else {
            li.textContent = `${pair.playerA.name} gets a BYE`;
        }

        list.appendChild(li);
    });
}