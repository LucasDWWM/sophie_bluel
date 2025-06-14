const API_URL = "http://localhost:5678/api/works";
const token = localStorage.getItem("token");

const addModal = document.getElementById("modal-add");
const backBtn = document.getElementById("back-to-gallery");
const projectForm = document.getElementById("project-form");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");
const submitBtn = document.getElementById("submit-btn");


// Revenir à la galerie
backBtn?.addEventListener("click", () => {
  addModal.classList.add("hidden");
  document.getElementById("modal-gallery").classList.remove("hidden");
  fetchModalProjects();
});

// Fermer la modale d’ajout avec la croix
const closeAddBtn = document.querySelector(".close-add");
closeAddBtn?.addEventListener("click", () => {
  addModal.classList.add("hidden");
});


// Fermer en cliquant sur le fond
addModal.addEventListener("click", (e) => {
  if (e.target === addModal) addModal.classList.add("hidden");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") addModal.classList.add("hidden");
});

// Charger les catégories
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();
    categorySelect.innerHTML = '<option value="">Choisir une catégorie</option>';
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

// Aperçu image
const dropZone = document.getElementById("drop-zone");

// Affiche l'image en aperçu
function handleImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.src = reader.result;
    imagePreview.classList.remove("hidden");
    document.getElementById("drop-zone-content").classList.add("hidden"); // cache icône + texte
    document.getElementById("drop-zone").setAttribute("data-has-image", "true");// enlever l’icône CSS
    validateForm(); // Vérifie si on peut activer le bouton
  };
  reader.readAsDataURL(file);
}

// Glisser-déposer
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    imageInput.files = e.dataTransfer.files;
    handleImage(file);
  }
});

// Clique sur la zone = clique sur input
dropZone.addEventListener("click", () => imageInput.click());

// Si l'utilisateur sélectionne via le fichier input
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) handleImage(file);
});

function validateForm() {
  const isImageOk = imageInput.files.length > 0;
  const isTitleOk = projectForm.title.value.trim() !== "";
  const isCategoryOk = categorySelect.value !== "";
  submitBtn.disabled = !(isImageOk && isTitleOk && isCategoryOk);
}


// Activation du bouton Valider
projectForm.addEventListener("input", () => {
  submitBtn.disabled = !imageInput.files.length || !projectForm.title.value || !categorySelect.value;
});

// Soumission
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!token) return alert("Non autorisé");

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", projectForm.title.value);
  formData.append("category", categorySelect.value);

  try {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error("Erreur ajout projet");

  const newProject = await res.json(); // <- récupère le projet ajouté

  // Réinitialise le formulaire
  projectForm.reset();
  imagePreview.classList.add("hidden");
  submitBtn.disabled = true;

  // Ferme la modale d’ajout, ouvre la modale galerie
  addModal.classList.add("hidden");
  document.getElementById("modal-gallery").classList.remove("hidden");

  // Actualise dynamiquement la galerie principale et la modale
  addProjectToGallery(newProject);
  addProjectToModal(newProject);
} 
catch (err) {
  console.error("Erreur envoi projet :", err);
}

});

function addProjectToGallery(project) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${project.imageUrl}" alt="${project.title}">
    <figcaption>${project.title}</figcaption>
  `;
  gallery.appendChild(figure);
}

function addProjectToModal(project) {
  const galleryContent = document.getElementById("modal-gallery-content");
  if (!galleryContent) return;

  const figure = document.createElement("figure");
  figure.dataset.id = project.id;
  figure.innerHTML = `
   <div class="figure-wrapper">
        <img src="${project.imageUrl}" alt="${project.title}">
        <button class="delete-btn" aria-label="Supprimer">🗑️</button>
    </div>
  <figcaption>${project.title}</figcaption>
  `;
  galleryContent.appendChild(figure);

  // Bouton de suppression dynamique
  const deleteBtn = figure.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => deleteProject(project.id, figure));
}

projectForm.addEventListener("input", validateForm);
window.loadCategories = loadCategories;