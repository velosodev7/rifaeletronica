// Lista de participantes (pode ser substituída por uma chamada API ou banco de dados)
let allParticipants = [
  { name: "Ana Silva", email: "ana.silva@example.com", winner: false },
  {
    name: "Bruno Costa",
    email: "bruno.costa@example.com",
    winner: false,
  },
  {
    name: "Carlos Oliveira",
    email: "carlos.oliveira@example.com",
    winner: false,
  },
  {
    name: "Daniela Souza",
    email: "daniela.souza@example.com",
    winner: false,
  },
  {
    name: "Eduardo Santos",
    email: "eduardo.santos@example.com",
    winner: false,
  },
];

// Elementos DOM
const drawButton = document.getElementById("draw-button");
const resetButton = document.getElementById("reset-button");
const winnerName = document.getElementById("winner-name");
const winnerEmail = document.getElementById("winner-email");
const participantsList = document.getElementById("participants-list");
const allParticipantsList = document.getElementById("all-participants-list");
const remainingCount = document.getElementById("remaining-count");
const addParticipantForm = document.getElementById("add-participant-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

// Inicialização
displayParticipants();
updateRemainingCount();

// Mostrar lista de participantes (não sorteados)
function displayParticipants() {
  participantsList.innerHTML = "";
  const availableParticipants = allParticipants.filter((p) => !p.winner);

  availableParticipants.forEach((participant) => {
    const li = document.createElement("li");
    li.textContent = `${participant.name} (${participant.email})`;
    participantsList.appendChild(li);
  });
}

// Mostrar todos os participantes
function displayAllParticipants() {
  allParticipantsList.innerHTML = "";

  allParticipants.forEach((participant) => {
    const li = document.createElement("li");
    li.innerHTML = `${participant.name} (${participant.email})`;

    if (participant.winner) {
      const badge = document.createElement("span");
      badge.className = "winner-badge";
      badge.textContent = "GANHADOR";
      li.appendChild(badge);
    }

    allParticipantsList.appendChild(li);
  });
}

// Atualizar contador de participantes restantes
function updateRemainingCount() {
  const remaining = allParticipants.filter((p) => !p.winner).length;
  remainingCount.textContent = `(${remaining} restantes de ${allParticipants.length})`;
}

// Sortear um participante aleatório
function drawWinner() {
  const availableParticipants = allParticipants.filter((p) => !p.winner);

  if (availableParticipants.length === 0) {
    winnerName.textContent = "Todos já foram sorteados!";
    winnerEmail.textContent = "-";
    drawButton.disabled = true;
    return;
  }

  // Adiciona efeito visual durante o sorteio
  drawButton.disabled = true;
  drawButton.classList.add("pulse");

  // Simula um tempo de sorteio
  let counter = 0;
  const totalIterations = 20;
  const interval = setInterval(() => {
    const randomIndex = Math.floor(
      Math.random() * availableParticipants.length
    );
    winnerName.textContent = availableParticipants[randomIndex].name;
    winnerEmail.textContent = availableParticipants[randomIndex].email;

    counter++;
    if (counter >= totalIterations) {
      clearInterval(interval);
      drawButton.disabled = false;
      drawButton.classList.remove("pulse");

      // Resultado final
      const winnerIndex = Math.floor(
        Math.random() * availableParticipants.length
      );
      const winner = availableParticipants[winnerIndex];

      winnerName.textContent = winner.name;
      winnerEmail.textContent = winner.email;

      // Marca como ganhador
      const winnerGlobalIndex = allParticipants.findIndex(
        (p) => p.email === winner.email && p.name === winner.name
      );

      if (winnerGlobalIndex !== -1) {
        allParticipants[winnerGlobalIndex].winner = true;
      }

      // Atualiza as listas
      displayParticipants();
      displayAllParticipants();
      updateRemainingCount();
    }
  }, 100);
}

// Reiniciar todos os sorteios
function resetDraws() {
  allParticipants.forEach((p) => (p.winner = false));
  winnerName.textContent = "-";
  winnerEmail.textContent = "-";
  drawButton.disabled = false;
  displayParticipants();
  displayAllParticipants();
  updateRemainingCount();
}

// Adicionar novo participante
function addParticipant(name, email) {
  // Verifica se já existe
  const exists = allParticipants.some(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    alert("Já existe um participante com este e-mail!");
    return false;
  }

  allParticipants.push({
    name: name.trim(),
    email: email.trim(),
    winner: false,
  });

  displayParticipants();
  displayAllParticipants();
  updateRemainingCount();
  return true;
}

// Validar formulário
function validateForm() {
  let valid = true;

  // Validação do nome
  if (nameInput.value.trim() === "" || nameInput.value.trim().length < 3) {
    nameError.style.display = "block";
    valid = false;
  } else {
    nameError.style.display = "none";
  }

  // Validação do e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.style.display = "block";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  return valid;
}

// Event listeners
drawButton.addEventListener("click", drawWinner);
resetButton.addEventListener("click", resetDraws);

addParticipantForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    const added = addParticipant(nameInput.value, emailInput.value);

    if (added) {
      nameInput.value = "";
      emailInput.value = "";
      alert("Participante adicionado com sucesso!");
    }
  }
});

// Controle das abas
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove classe active de todas as abas e conteúdos
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    // Adiciona classe active à aba clicada
    tab.classList.add("active");

    // Mostra o conteúdo correspondente
    const tabId = tab.getAttribute("data-tab");
    document.getElementById(`${tabId}-tab`).classList.add("active");

    // Atualiza a lista completa quando muda para a aba de adição
    if (tabId === "add") {
      displayAllParticipants();
    }
  });
});
