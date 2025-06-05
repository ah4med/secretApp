export const errorHandler = (api) => {
  return (req, res, next) => {
    api(req, res, next).catch((error) => {
      console.log(`error in ${req.url} error handler middleware`, error);
      return next(new Error(error.message), { cause: 500 });
    });
  };
};

// to handle errors not handled by error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  console.log(`global error middleware`, err.message);
  return res.status(err.cause || 500).json({ message: err.message });
};
