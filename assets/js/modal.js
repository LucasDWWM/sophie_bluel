const API_URL = "http://localhost:5678/api/works";
const modal = document.getElementById("modal");
const modalGallery = document.getElementById("modal-gallery");
const closeModalBtn = document.querySelector(".modal .close");
const editBtn = document.getElementById("edit-mode-btn");
const token = localStorage.getItem("token");

// Ouvre la modale
function openModal() {
  modal.classList.remove("hidden");
  fetchModalProjects(); // charge les projets dans la modale
}

// Ferme la modale
function closeModal() {
  modal.classList.add("hidden");
}

// Récupère et affiche les projets dans la modale
async function fetchModalProjects() {
  try {
    const response = await fetch(API_URL);
    const works = await response.json();
    displayModalProjects(works);
  } catch (error) {
    console.error("Erreur chargement modale:", error);
  }
}

// Affiche les projets dans la modale avec bouton éditer / supprimer
function displayModalProjects(works) {
  modalGallery.innerHTML = "";
  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>
        <span class="edit-text">éditer</span>
        <button class="delete-btn" aria-label="Supprimer">🗑️</button>
      </figcaption>
    `;
    modalGallery.appendChild(figure);

    const deleteBtn = figure.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteProject(work.id, figure));
  });
}

// Supprime un projet
async function deleteProject(id, figureEl) {
  if (!token) return alert("Non autorisé");
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Échec suppression");
    figureEl.remove();
  } catch (err) {
    console.error("Erreur suppression:", err);
  }
}

// Clic hors modale pour la fermer
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Touche Échap pour fermer
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Bouton croix
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

// Bouton "modifier"
if (editBtn) {
  editBtn.addEventListener("click", openModal);
}

