document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const senha = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, senha })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.href = 'pagina_principal.html'; // Ajuste o redirecionamento conforme necessário
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
});
