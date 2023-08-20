module.exports = (error, req, res, next) => {
  console.log(error);
  req.flash('error', error.errorMessage || 'something went wrang');
  res.redirect('back');
  next(error);
};
