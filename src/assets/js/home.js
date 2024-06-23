document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    const userList = document.getElementById('userList');
  
    logoutButton.addEventListener('click', async () => {
      await fetch('/api/v1/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.href = '/login';
    });
  
    async function fetchUsers() {
      const response = await fetch('/api/v1/users');
      const users = await response.json();
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.name} - ${user.email}`;
        userList.appendChild(listItem);
      });
    }
  
    fetchUsers();
  });
  