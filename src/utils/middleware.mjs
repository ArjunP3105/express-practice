export const getUserIdmiddleware = (req, res, next) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(404).send({
      message: "Invalid Id",
    });
  }
  req.userId = userId;
  next(); //pass controll to the next middleware
};
