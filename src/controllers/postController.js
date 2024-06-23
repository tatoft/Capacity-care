const Post = require('../models/Post');

// Manejo de errores
function handleError(res, error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}

// Crear un nuevo post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const { file } = req;
  try {
    const newPost = new Post({
      title,
      content,
      userId: req.session.userId,
      image: file ? file.buffer : null
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener todos los posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId');
    res.json(posts.map(post => ({
      ...post.toObject(),
      image: post.image ? post.image.toString('base64') : null
    })));
  } catch (error) {
    handleError(res, error);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId');
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
