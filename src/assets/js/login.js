document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/v1/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
      localStorage.setItem('userId', data.userId); // Almacena el userId en localStorage
      window.location.href = '/home';
  } else {
      alert('Login failed');
  }
});
