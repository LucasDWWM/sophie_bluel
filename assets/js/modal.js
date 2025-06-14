const API_URL = "http://localhost:5678/api/works";
const modal = document.getElementById("modal");
const modalGallery = document.getElementById("modal-gallery");
const closeModalBtn = document.querySelector(".modal .close");
const editBtn = document.getElementById("edit-mode-btn");
const token = localStorage.getItem("token");

const addProjectForm = document.getElementById("add-project-form");
const projectForm = document.getElementById("project-form");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

// Ouvre la modale
function openModal() {
  modal.classList.remove("hidden");
  fetchModalProjects();
}

// Ferme la modale
function closeModal() {
  modal.classList.add("hidden");
}

// Récupère les projets pour la galerie modale
async function fetchModalProjects() {
  try {
    const response = await fetch(API_URL);
    const works = await response.json();
    displayModalProjects(works);
  } catch (error) {
    console.error("Erreur chargement modale:", error);
  }
}

// Affiche chaque projet avec bouton suppression
function displayModalProjects(works) {
  modalGallery.innerHTML = "";
  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>
        <button class="delete-btn" aria-label="Supprimer">🗑️</button>
      </figcaption>
    `;
    modalGallery.appendChild(figure);

    const deleteBtn = figure.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteProject(work.id, figure));
  });
}

// Affiche le formulaire d'ajout
function showAddProjectForm() {
  document.getElementById("modal-gallery-view").classList.add("hidden");
  addProjectForm.classList.remove("hidden");
  loadCategories();
}

// Retour à la galerie
function backToGallery() {
  addProjectForm.classList.add("hidden");
  document.getElementById("modal-gallery-view").classList.remove("hidden");
}

// Charge les catégories dynamiquement
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();

    categorySelect.innerHTML = ""; // Vide le select

    // Ajoute l'option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choisir une catégorie";
    categorySelect.appendChild(defaultOption);

    // Ajoute les vraies catégories
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erreur chargement catégories :", err);
  }
}

// Aperçu de l'image
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      imagePreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// Soumission du formulaire
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!token) return alert("Non autorisé");

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", document.getElementById("title").value);
  formData.append("category", categorySelect.value);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) throw new Error("Erreur ajout projet");

    // Retour à la galerie
    backToGallery();
    fetchModalProjects();
    if (typeof fetchWorks === "function") fetchWorks(); // rechargement de la galerie principale
  } catch (err) {
    console.error("Erreur envoi projet :", err);
  }
});

// Suppression d’un projet
async function deleteProject(id, figureEl) {
  if (!token) return alert("Non autorisé");

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Échec suppression");
    figureEl.remove();
  } catch (err) {
    console.error("Erreur suppression:", err);
  }
}

// Fermeture modale (clic fond ou Échap)
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Boutons
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (editBtn) editBtn.addEventListener("click", openModal);
const addProjectBtn = document.getElementById("add-project-btn");
if (addProjectBtn) addProjectBtn.addEventListener("click", showAddProjectForm);
const backBtn = document.getElementById("back-to-gallery");
if (backBtn) backBtn.addEventListener("click", backToGallery);
