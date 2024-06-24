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

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]);

    const response = await fetch('/api/v1/posts', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
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
      postItem.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'mt-4');
      postItem.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <img class="w-12 h-12 rounded-full" src="img/user.jpg" alt="Avatar">
            <div class="ml-2 text-lg font-semibold">${post.userId.name}</div>
          </div>
          <div class="text-gray-500">${new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
          <hr class="ml-14 border-black border-1">
        <div class="mt-4">
          <div class="text-xl font-bold">${post.title}</div>
          <div class="mt-2 text-gray-700">${post.content}</div>
        </div>
        ${post.image ? `<img src="data:image/jpeg;base64,${post.image}" alt="Post image" class="mt-4 rounded-md h-full w-60 mx-auto"/>` : ''}
      `;
      postList.appendChild(postItem);
    });
  }

  fetchPosts();
});
