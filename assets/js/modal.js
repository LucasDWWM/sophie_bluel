const API_URL = "http://localhost:5678/api/works";
const token = localStorage.getItem("token");

const galleryModal = document.getElementById("modal-gallery");
const closeGalleryBtn = galleryModal.querySelector(".close");
const openGalleryBtn = document.getElementById("edit-mode-btn");
const openAddModalBtn = document.getElementById("open-add-modal");
const galleryContent = document.getElementById("modal-gallery-content");

// Ouvrir la galerie
openGalleryBtn?.addEventListener("click", () => {
  galleryModal.classList.remove("hidden");
  fetchModalProjects();
});

// Fermer la galerie
closeGalleryBtn?.addEventListener("click", () => {
  galleryModal.classList.add("hidden");
});

// Ouvrir la modale d'ajout depuis galerie
openAddModalBtn?.addEventListener("click", () => {
  galleryModal.classList.add("hidden");
  document.getElementById("modal-add").classList.remove("hidden");
  loadCategories(); // Depuis addProjectModal.js
});

// Fermer en cliquant à l’extérieur
galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) galleryModal.classList.add("hidden");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") galleryModal.classList.add("hidden");
});

// Charger les projets
async function fetchModalProjects() {
  try {
    const res = await fetch(API_URL);
    const works = await res.json();
    displayModalProjects(works);
  } catch (err) {
    console.error("Erreur chargement modale:", err);
  }
}

function displayModalProjects(works) {
  galleryContent.innerHTML = "";
  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>
        <button class="delete-btn" aria-label="Supprimer">🗑️</button>
      </figcaption>
    `;
    galleryContent.appendChild(figure);

    const deleteBtn = figure.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteProject(work.id, figure));
  });
}

async function deleteProject(id, figureEl) {
  if (!token) return alert("Non autorisé");
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Échec suppression");
    figureEl.remove();
  } catch (err) {
    console.error("Erreur suppression:", err);
  }
}

// Exporté si besoin ailleurs
window.fetchModalProjects = fetchModalProjects;
