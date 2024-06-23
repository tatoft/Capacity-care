const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const post = new Post({
      ...req.body,
      userId: req.session.userId // Asegurarse de que userId está en la sesión
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name avatar');
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name avatar');
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};
