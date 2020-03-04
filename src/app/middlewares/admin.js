import User from '../models/User';

export default async (req, res, next) => {
  const checkUser = await User.findByPk(req.userId);

  if (!checkUser) {
    return res.status(401).json({ error: 'User not found.' });
  }

  const isAdmin = await checkUser.get('is_admin');

  if (!isAdmin) {
    return res.status(401).json({ error: 'Not authorized.' });
  }
  return next();
};
