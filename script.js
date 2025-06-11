let participants = [
  {
    id: 1,
    name: "Ana Carolina Silva",
    email: "ana.silva@empresa.com",
    winner: false,
  },
  {
    id: 2,
    name: "Bruno Costa e Santos",
    email: "bruno.costa@tech.com",
    winner: false,
  },
  {
    id: 3,
    name: "Carlos Eduardo Oliveira",
    email: "carlos.oliveira@digital.com",
    winner: false,
  },
  {
    id: 4,
    name: "Daniela Souza Lima",
    email: "daniela.souza@inovacao.com",
    winner: false,
  },
  {
    id: 5,
    name: "Eduardo Pereira Santos",
    email: "eduardo.santos@tecnologia.com",
    winner: false,
  },
  {
    id: 6,
    name: "Fernanda Lima Rodrigues",
    email: "fernanda.lima@digital.com",
    winner: false,
  },
  {
    id: 7,
    name: "Gustavo Henrique Pereira",
    email: "gustavo.pereira@future.com",
    winner: false,
  },
  {
    id: 8,
    name: "Helena Martins Costa",
    email: "helena.martins@next.com",
    winner: false,
  },
  {
    id: 9,
    name: "Igor Almeida Santos",
    email: "igor.almeida@tech.com",
    winner: false,
  },
  {
    id: 10,
    name: "Juliana Ferreira Gomes",
    email: "juliana.ferreira@inovacao.com",
    winner: false,
  },
];

const drawButton = document.getElementById("draw-button");
const resetButton = document.getElementById("reset-button");
const winnerName = document.getElementById("winner-name");
const winnerEmail = document.getElementById("winner-email");
const participantsList = document.getElementById("participants-list");
const winnersList = document.getElementById("winners-list");
const remainingCount = document.getElementById("remaining-count");
const totalCount = document.getElementById("total-count");
const availableCount = document.getElementById("available-count");
const winnersCount = document.getElementById("winners-count");
const addParticipantForm = document.getElementById("add-participant-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

updateStats();
renderParticipants();
renderWinners();

function updateStats() {
  const total = participants.length;
  const winners = participants.filter((p) => p.winner).length;
  const available = total - winners;

  totalCount.textContent = total;
  winnersCount.textContent = winners;
  availableCount.textContent = available;
  remainingCount.textContent = `${available} de ${total} participantes`;
}

function renderParticipants() {
  const availableParticipants = participants.filter((p) => !p.winner);

  if (availableParticipants.length === 0) {
    participantsList.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--gray);">
                    <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Todos os participantes já foram sorteados!</p>
                </div>`;
    return;
  }

  participantsList.innerHTML = "";

  availableParticipants.forEach((participant) => {
    const participantEl = document.createElement("div");
    participantEl.className = "participant-item";
    participantEl.innerHTML = `
                    <div class="participant-info">
                        <span class="participant-name">${participant.name}</span>
                        <span class="participant-email">${participant.email}</span>
                    </div>
                `;
    participantsList.appendChild(participantEl);
  });
}

function renderWinners() {
  const winners = participants.filter((p) => p.winner);

  if (winners.length === 0) {
    winnersList.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--gray);">
                    <i class="fas fa-trophy" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhum ganhador ainda. Realize um sorteio!</p>
                </div>`;
    return;
  }

  winnersList.innerHTML = "";

  winners.forEach((participant) => {
    const winnerEl = document.createElement("div");
    winnerEl.className = "participant-item";
    winnerEl.innerHTML = `
                    <div class="participant-info">
                        <span class="participant-name">${participant.name}</span>
                        <span class="participant-email">${participant.email}</span>
                    </div>
                    <span class="participant-badge">GANHADOR</span>
                `;
    winnersList.appendChild(winnerEl);
  });
}

function drawWinner() {
  const availableParticipants = participants.filter((p) => !p.winner);

  if (availableParticipants.length === 0) {
    showNotification("Todos os participantes já foram sorteados!", "warning");
    return;
  }

  drawButton.disabled = true;
  drawButton.classList.add("pulse");

  let counter = 0;
  const totalIterations = 25;
  const animationSpeed = 100; // ms

  const interval = setInterval(() => {
    const randomIndex = Math.floor(
      Math.random() * availableParticipants.length
    );
    const current = availableParticipants[randomIndex];

    winnerName.textContent = current.name;
    winnerEmail.textContent = current.email;

    counter++;
    if (counter >= totalIterations) {
      clearInterval(interval);

      const winnerIndex = Math.floor(
        Math.random() * availableParticipants.length
      );
      const winner = availableParticipants[winnerIndex];

      participants = participants.map((p) =>
        p.id === winner.id ? { ...p, winner: true } : p
      );

      winnerName.textContent = winner.name;
      winnerEmail.textContent = winner.email;
      drawButton.disabled = false;
      drawButton.classList.remove("pulse");

      createConfetti();

      updateStats();
      renderParticipants();
      renderWinners();

      showNotification(`${winner.name} foi sorteado!`, "success");
    }
  }, animationSpeed);
}

function resetDraws() {
  participants = participants.map((p) => ({ ...p, winner: false }));

  winnerName.textContent = "-";
  winnerEmail.textContent = "-";

  updateStats();
  renderParticipants();
  renderWinners();

  showNotification("Todos os sorteios foram reiniciados!", "info");
}

function addParticipant(name, email) {
  const emailExists = participants.some(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExists) {
    showNotification("Já existe um participante com este e-mail!", "error");
    return false;
  }

  const newParticipant = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    winner: false,
  };

  participants.push(newParticipant);

  updateStats();
  renderParticipants();

  nameInput.value = "";
  emailInput.value = "";

  showNotification("Participante adicionado com sucesso!", "success");
  return true;
}

function validateForm() {
  if (nameInput.value.trim().length < 3) {
    showNotification("Nome deve ter pelo menos 3 caracteres", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    showNotification("Por favor, insira um e-mail válido", "error");
    return false;
  }

  return true;
}

function showNotification(message, type) {
  alert(`${type.toUpperCase()}: ${message}`);
}

function createConfetti() {
  const colors = ["#4361ee", "#3a0ca3", "#f72585", "#4cc9f0", "#7209b7"];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = "50%";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.bottom = "0";
    confetti.style.zIndex = "1000";
    confetti.style.animation = `confetti ${
      Math.random() * 3 + 2
    }s linear forwards`;
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    tab.classList.add("active");

    const tabId = tab.getAttribute("data-tab");
    document.getElementById(`${tabId}-tab`).classList.add("active");
  });
});

drawButton.addEventListener("click", drawWinner);
resetButton.addEventListener("click", resetDraws);

addParticipantForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    addParticipant(nameInput.value, emailInput.value);
  }
});

document.querySelector(".tab.active").click();
