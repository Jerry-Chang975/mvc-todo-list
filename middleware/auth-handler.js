module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', 'You need to login first');
  return res.redirect('/login');
};
