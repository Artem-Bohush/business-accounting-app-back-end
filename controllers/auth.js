const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async (req, res) => {
  try {
    const candidate = await User.findOne({ email: req.body.email });

    if (candidate) {
      const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
      if (passwordResult) {
        const token = jwt.sign(
          {
            email: candidate.email,
            userId: candidate._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: 60 * 60 },
        );

        res.status(200).json({
          token: `Bearer ${token}`,
        });
      } else {
        res.status(401).json({
          message: 'Passwords do not match. Try it again.',
        });
      }
    } else {
      res.status(404).json({
        message: `User with '${req.body.email}' email was not found.`,
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.register = async (req, res) => {
  try {
    const candidate = await User.findOne({ email: req.body.email });

    if (candidate) {
      res.status(409).json({
        message: `Email '${req.body.email}' is already taken. Try another one.`,
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const { password } = req.body;
      const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(password, salt),
      });
      await user.save();
      res.status(201).json(user);
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
