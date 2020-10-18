module.exports = (res, error, status = 500) => {
  res.status(status).json({
    message: error.message ? error.message : error,
  });
};
