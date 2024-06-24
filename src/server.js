const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const User = require('./models/User');
const app = express();

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
mongoose.connect('mongodb://20.109.10.158:27017/CapacityCare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database');
}).catch((error) => {
  console.error('Database connection error:', error);
});

// Middleware de sesión
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
}));

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Rutas
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/posts', upload.single('image'), postRoutes);

// Ruta de login
app.post('/api/v1/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    req.session.userId = user._id;
    res.send('Login successful');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Ruta de logout
app.post('/api/v1/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid');
    res.send('Logout successful');
  });
});

// Rutas de páginas
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/home', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Redireccionar raíz a login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Servidor escuchando
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
