

const data = ['body', 'query', 'params','file','files']; // to access the elements inside schema

export const validation = (schema) => {

  return (req, res, next) => {

     const validationErrors = [];

    // element can be body,params,quer
    data.forEach(ele => {
      if (schema[ele]) {
        const validationResult = schema[ele].validate(req[ele], {
          abortEarly: false,
        }); //default false

        if (validationResult.error) {
          validationErrors.push({
            [ele]: validationResult.error.details.map((err) => {
              return err.message;
            }),
          });
        }
      }
    });

    if (validationErrors.length) {
        return res.status(423).json({
            status:423,
            message:validationErrors
        })
    } else {
      return next();
    }
  };
};
