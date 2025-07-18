export const createUserValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: "This field cant be empty",
    },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "Length has to be b/w 3-10",
    },
  },

  displayName: {
    notEmpty: {
      errorMessage: "Display Name cant be empty",
    },
  },
};

export const querySchemaValidation = {
  filter: {
    isString: {
      errorMessage: "has to be a string",
    },
    notEmpty: {
      errorMessage: "Cant be empty",
    },
    isLength: {
      options: { min: 3, max: 8 },
      errorMessage: "length must be 3-8",
    },
  },
};

export const validateAuthentication = {
  username: {
    notEmpty: {
      errorMessage: "This field cant be empty",
    },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "Length has to be b/w 3-10",
    },
  },

  password: {
    notEmpty: {
      errorMessage: "Password cant be empty",
    },
  },
};
