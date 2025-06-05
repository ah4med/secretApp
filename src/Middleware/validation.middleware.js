export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const schemaKeys = Object.keys(schema); // will return an array of keys(string) ["body", "params", "query", "headers"]
    let validationError = [];
    for (const key of schemaKeys) {
      //   console.log(key);
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      // {abortEarly: false} will return all errors at once
      if (error) {
        validationError.push(error.details);
      }
    }
    if (validationError.length) {
      return res
        .status(400)
        .json({ message: "validation error", error: validationError });
    }
    next();
  };
};
