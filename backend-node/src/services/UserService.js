const { User } = require('../models');
const jwt = require('jsonwebtoken');

class UserService extends require('./BaseService') {
  constructor() {
    super(User);
  }

  async register(username, password, name) {
    if (!username || !password || !name) {
      throw { status: 400, message: 'Ähli meýdanlary dolduryň' };
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw { status: 400, message: 'Bu ulanyjy ady eýýam bar' };
    }

    return await this.create({ username, password, name });
  }

  async login(username, password) {
    if (!username || !password) {
      throw { status: 400, message: 'Ulanyjy ady we parol gerek' };
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw { status: 401, message: 'Ulanyjy ady ýa-da parol nädogry' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw { status: 401, message: 'Ulanyjy ady ýa-da parol nädogry' };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'ecommerce-secret-key-2024',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return { user, token };
  }
}

module.exports = new UserService();
