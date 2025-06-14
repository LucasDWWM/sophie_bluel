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

    projectForm.reset();
    imagePreview.classList.add("hidden");
    submitBtn.disabled = true;

    addModal.classList.add("hidden");
    document.getElementById("modal-gallery").classList.remove("hidden");
    fetchModalProjects();
  } catch (err) {
    console.error("Erreur envoi projet :", err);
  }
});

window.loadCategories = loadCategories;