const userService = require('../services/UserService');

const register = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    await userService.register(username, password, name);
    res.status(201).json({
      success: true,
      message: 'Ulanyjy döredildi'
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await userService.login(username, password);
    res.json({
      success: true,
      message: 'Login başarili',
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
