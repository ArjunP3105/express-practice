import passport from "passport";
import { Strategy } from "passport-local";
import Users from "../utils/UsersData.mjs";

passport.serializeUser((user, done) => {
  console.log("inside the seriliser", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    console.log("inside the deserialiser");
    const curr_user = Users.find((user) => user.id === id);
    if (!curr_user) throw new Error("User doesnt exist");
    done(null, curr_user);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`username : ${username}`);
    console.log(`password : ${password}`);
    try {
      const findUser = Users.find((user) => user.username === username);
      if (!findUser) throw new Error("coudnt find user");

      if (findUser.password !== password)
        throw new Error("INVALID CREDENTIALS");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
