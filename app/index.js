require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/sequelize');
const Url = require('./models/url');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

// Add the redirect route at root level
const urlController = require('./controller/urlController');
app.get('/:short', urlController.redirectShortUrl);

// Force sync in development mode only - this will drop and recreate all tables
sequelize.sync({ force: true }).then(() => {
  console.log('Database synchronized');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
