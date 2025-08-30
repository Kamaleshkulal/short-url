const Url = require('../models/url');
const { successResponse, errorResponse } = require('../utils/response');

exports.createShortUrl = async (req, res) => {
  const { original } = req.body;
  if (!original) {
    return errorResponse(res, 'Original URL required', 400);
  }

  try {
    console.log('User from token:', req.user); // Debug log
    if (!req.user || !req.user.id) {
      return errorResponse(res, 'User not properly authenticated', 401);
    }

    const short = Math.random().toString(36).substring(2, 8);
    const url = await Url.create({
      short,
      original,
      userId: req.user.id
    });
    return successResponse(
      res,
      { short: url.short, original: url.original },
      'Short URL created successfully'
    );
  } catch (err) {
    return errorResponse(res, 'Failed to create short URL', 500, err.message);
  }
};

// New endpoint to get URL history for a user
exports.getUrlHistory = async (req, res) => {
  try {
    const urls = await Url.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']], // Most recent first
      attributes: ['short', 'original', 'createdAt']
    });
    return successResponse(
      res,
      { urls },
      'URL history retrieved successfully'
    );
  } catch (err) {
    return errorResponse(res, 'Failed to fetch URL history', 500, err.message);
  }
};

exports.redirectShortUrl = async (req, res) => {
  const { short } = req.params;
  try {
    const url = await Url.findOne({ where: { short } });
    if (!url) {
      return errorResponse(res, 'Short URL not found', 404);
    }
    return res.redirect(url.original);
  } catch (err) {
    return errorResponse(res, 'Failed to redirect', 500, err.message);
  }
};
