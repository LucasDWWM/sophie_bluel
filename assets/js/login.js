const form = document.querySelector("#login form");
const errorZone = document.createElement("p");
errorZone.className = "error-msg";
form.appendChild(errorZone);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("bad-credentials");

    const data = await res.json();          // { token }
    localStorage.setItem("token", data.token);

    // Redirection vers la page d’accueil « mode édition »
    window.location.href = "index.html";
  } catch (err) {
    errorZone.textContent = "Erreur dans l’identifiant ou le mot de passe";
    errorZone.style.color = "red";
  }
});
