// we then create a schema this schema is bascially whats insude the djanp class name(models.Model): the name = models.CharFIeld() etc etc

import mongoose from "mongoose";

//so schema describes what goes into a model
const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  displayName: String,
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.String,
      },
      quantity: {
        type: mongoose.Schema.Types.Number,
      },
    },
  ],
});

// we then create a mondel and use the schema to define whats insde the model

export const User = mongoose.model("User", userSchema);
