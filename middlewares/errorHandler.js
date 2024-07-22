const errorHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error.name === "SequelizeValidationError") {
    console.log(
      "SequelizeValidationError handled: validation error",
      request.body
    );
    const bodyAsString = JSON.stringify(request.body);
    return response.status(400).send({
      error: `Error in ${error.source}: ${error.errors[0].message} for ${bodyAsString}`,
    });
  }

  if (error.name === "BlogValidationError") {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = errorHandler;
