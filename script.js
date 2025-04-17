// Login con GitHub
document.getElementById("loginButton").addEventListener("click", () => {
  const clientId = "tu_client_id"; // Reemplaza con tu Client ID
  const redirectUri = encodeURIComponent("https://tu-usuario.github.io/mi-restaurante/callback.html");
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
  window.location.href = url;
});

// Manejar la respuesta de GitHub
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
  fetch(`https://tu-backend-proxy.herokuapp.com/authenticate?code=${code}`)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("token", data.token);
      document.getElementById("commentSection").style.display = "block";
      document.getElementById("debugSection").style.display = "block";
      alert("Login exitoso");
    });
}

// Publicar Comentario
document.getElementById("commentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const comment = document.getElementById("comment").value;
  const token = localStorage.getItem("token");

  const response = await fetch("https://api.github.com/repos/tu-usuario/mi-restaurante/contents/comments.json", {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Nuevo comentario",
      content: btoa(JSON.stringify({ user: "Usuario", comment })),
      sha: "sha_del_archivo", // Obtén el SHA del archivo existente
    }),
  });

  if (response.ok) {
    alert("Comentario publicado");
  }
});

// Modo Debug
document.getElementById("saveButton").addEventListener("click", async () => {
  const content = document.getElementById("codeEditor").value;
  const token = localStorage.getItem("token");

  const response = await fetch("https://api.github.com/repos/tu-usuario/mi-restaurante/contents/index.html", {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Actualización desde el modo debug",
      content: btoa(content),
      sha: "sha_del_archivo", // Obtén el SHA del archivo existente
    }),
  });

  if (response.ok) {
    alert("Cambios guardados en GitHub");
  }
});
