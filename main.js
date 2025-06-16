  // URL de l'API
  const API_URL = "http://localhost:5678/api/works";

  // Sélection de l'élément HTML où seront affichés les projets
  const gallery = document.getElementById("gallery");

  // Attend que tout le DOM soit chargé avant d'exécuter le script
  document.addEventListener("DOMContentLoaded", () => {
    fetchWorks();
    if (isLogged()) {
      activateEditMode();
    }
  });


  // Fonction asynchrone pour récupérer les projets depuis l'API
  async function fetchWorks() {
    try {
      const response = await fetch(API_URL); // Requête GET à l'API
      if (!response.ok) throw new Error(`Erreur : ${response.status}`); // Gestion d'erreur HTTP
      const works = await response.json(); // Conversion de la réponse en JSON
      displayWorks(works); // Affiche les projets
      fetchCategoriesAndCreateFilters(works); // Crée les filtres à partir des catégories
    } catch (error) {
      console.error("Erreur lors de la récupération des projets :", error);
      gallery.innerHTML = "<p>Erreur lors du chargement des projets.</p>"; // Affiche un message d'erreur à l'utilisateur
    }
  }

  // Fonction pour afficher une liste de projets dans la galerie
  function displayWorks(works) {
    gallery.innerHTML = ""; // Vide la galerie avant d'afficher
    works.forEach((work) => {
      const figure = document.createElement("figure"); // Crée un élément <figure>

      const img = document.createElement("img"); 
      img.src = work.imageUrl; // Définit l'URL de l'image
      img.alt = work.title; // Texte alternatif

      const caption = document.createElement("figcaption"); // Crée une légende
      caption.textContent = work.title; // Titre du projet

      // Ajoute l'image et la légende à la figure
      figure.appendChild(img);
      figure.appendChild(caption);

      // Ajoute la figure à la galerie
      gallery.appendChild(figure);
    });
  }

  // Sélection du conteneur où seront ajoutés les boutons de filtre
  const filtersContainer = document.getElementById("filters");

  // Fonction pour récupérer les catégories et créer les boutons de filtre
  async function fetchCategoriesAndCreateFilters(works) {
    try {
      const response = await fetch("http://localhost:5678/api/categories"); // Requête pour les catégories
      const categories = await response.json();

      // Crée un bouton "Tous" qui affiche tous les projets
      createFilterButton("Tous", () => displayWorks(works));

      // Pour chaque catégorie, crée un bouton de filtre
      categories.forEach(category => {
        createFilterButton(category.name, () => {
          // Filtre les projets appartenant à cette catégorie
          const filtered = works.filter(work => work.categoryId === category.id);
          displayWorks(filtered); // Affiche les projets filtrés
        });
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }

  // Fonction pour créer un bouton de filtre
  function createFilterButton(name, onClick) {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("filter-btn");
    button.addEventListener("click", onClick);
    filtersContainer.appendChild(button); // Ajoute le bouton dans le conteneur
  }

  // Vérifie si l’utilisateur est connecté
  function isLogged() {
    return !!localStorage.getItem("token");
  }


  function activateEditMode() {
    if (!isLogged()) return;

    // Affiche le bouton "modifier"
    const editBtn = document.getElementById("edit-mode-btn");
    if (editBtn) {
      editBtn.style.display = "inline-flex";
    }

    // Cache les filtres
    const filters = document.getElementById("filters");
    if (filters) {
      filters.style.display = "none";
    }
  }