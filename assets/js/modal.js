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
        <button class="delete-btn" aria-label="Supprimer">🗑️</button>
      </figcaption>
    `;
    modalGallery.appendChild(figure);

    const deleteBtn = figure.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteProject(work.id, figure));
  });
}

const addProjectForm = document.getElementById("add-project-form");
const projectForm = document.getElementById("project-form");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

// Bouton pour afficher formulaire d'ajout
function showAddProjectForm() {
  modalGallery.classList.add("hidden");
  addProjectForm.classList.remove("hidden");
  loadCategories();
}

// Charger les catégories dans le <select>
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();
    categorySelect.innerHTML = "";
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

// Affichage image preview
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

    // Remet la modale d’origine
    addProjectForm.classList.add("hidden");
    modalGallery.classList.remove("hidden");

    // Recharge la modale + galerie principale
    fetchModalProjects();
    if (typeof fetchWorks === "function") fetchWorks();
  } catch (err) {
    console.error("Erreur envoi projet :", err);
  }
});

const addProjectBtn = document.getElementById("add-project-btn");
if (addProjectBtn) {
  addProjectBtn.addEventListener("click", showAddProjectForm);
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

