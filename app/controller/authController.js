const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { successResponse, errorResponse } = require('../utils/response');

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return errorResponse(res, 'Username and password required', 400);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    return successResponse(
      res,
      { id: user.id, username: user.username },
      'User created successfully',
      201
    );
  } catch (err) {
    return errorResponse(res, 'User already exists', 400, err.message);
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Debug log
    console.log('User found:', { id: user.id, username: user.username });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return successResponse(res, { token, user: { id: user.id, username: user.username } }, 'Login successful');
  } catch (err) {
    return errorResponse(res, 'Login failed', 500, err.message);
  }
};
