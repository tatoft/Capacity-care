document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');
  const addPostButton = document.getElementById('addPostButton');
  const postFormContainer = document.getElementById('postFormContainer');
  const postForm = document.getElementById('postForm');
  const postList = document.getElementById('postList');

  logoutButton.addEventListener('click', async () => {
    await fetch('/api/v1/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    window.location.href = '/login';
  });

  addPostButton.addEventListener('click', () => {
    postFormContainer.classList.toggle('hidden');
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const response = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert('Post created successfully');
      postForm.reset();
      postFormContainer.classList.add('hidden');
      fetchPosts();
    } else {
      const errorData = await response.json();
      console.error('Failed to create post:', errorData);
      alert(`Failed to create post: ${errorData.error}`);
    }
  });

  async function fetchPosts() {
    const response = await fetch('/api/v1/posts');
    const posts = await response.json();
    postList.innerHTML = '';
    posts.forEach(post => {
      const postItem = document.createElement('div');
      postItem.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-md');
      postItem.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <img class="w-12 h-12 rounded-full" src="img/user.jpg" alt="Avatar">
            <div class="ml-2 text-lg font-semibold">${post.userId.name}</div>
          </div>
          <div class="text-gray-500">${new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="mt-4">
          <div class="text-xl font-bold">${post.title}</div>
          <div class="mt-2 text-gray-700">${post.content}</div>
        </div>
      `;
      postList.appendChild(postItem);
    });
  }

  fetchPosts();
});
