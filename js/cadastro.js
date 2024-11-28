document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('register-name').value;
  const username = document.getElementById('register-username').value;
  const cpf = document.getElementById('register-cpf').value;
  const senha = document.getElementById('register-password').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, username, cpf, senha })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
  }
});
