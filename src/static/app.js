document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;
        
        // Create participants list HTML
        const participantsList = details.participants.length > 0 
          ? details.participants.map(participant => `<li class="participant-item">${participant}</li>`).join('')
          : '<li class="no-participants">Nenhum participante inscrito ainda</li>';

        activityCard.innerHTML = `
          <div class="activity-header">
            <h4>${name}</h4>
            <span class="spots-badge">${spotsLeft} vagas restantes</span>
          </div>
          <p class="activity-description">${details.description}</p>
          <p class="activity-schedule"><strong>📅 Horário:</strong> ${details.schedule}</p>
          
          <div class="participants-section">
            <h5 class="participants-title">👥 Participantes Inscritos (${details.participants.length})</h5>
            <ul class="participants-list">
              ${participantsList}
            </ul>
          </div>
          
          <div class="activity-footer">
            <p class="availability-info"><strong>Disponibilidade:</strong> ${spotsLeft} vagas restantes</p>
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Funcionalidade do botão interativo
  const botaoInterativo = document.getElementById("botao-interativo");
  const resultado = document.getElementById("resultado");

  botaoInterativo.addEventListener("click", function () {
    const mensagens = [
      "GitHub Copilot está funcionando!",
      "Parabéns! Você clicou no botão.",
      "Bem-vindo ao mundo da programação assistida por IA!",
      "Continue explorando as funcionalidades do Copilot.",
    ];

    const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    resultado.textContent = mensagemAleatoria;
    resultado.style.display = "block";

    // Adicionar animação
    resultado.style.opacity = "0";
    setTimeout(() => {
      resultado.style.opacity = "1";
    }, 100);
  });

  // Funcionalidade do formulário de contato
  const formulario = document.getElementById("formulario-contato");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    if (nome && email && mensagem) {
      alert(`Obrigado, ${nome}! Sua mensagem foi recebida. Entraremos em contato via ${email}.`);
      formulario.reset();
    }
  });

  // Navegação suave
  const links = document.querySelectorAll('nav a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Adicionar classe ativa ao link atual
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Initialize app
  fetchActivities();
});
