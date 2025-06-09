// URL de l'API
const API_URL = "http://localhost:5678/api/works";

// Sélection de l'élément HTML où seront affichés les projets
const gallery = document.getElementById("gallery");

// Attend que tout le DOM soit chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  fetchWorks(); // Lance la récupération des projets
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


