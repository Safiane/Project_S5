const passport = require("passport");
const usersRepo = require(__dirname + "\\users.repository.js"); // use same folder as the current file

// session+passport docs:
// https://www.passportjs.org/howtos/session/
// https://www.passportjs.org/concepts/authentication/sessions/

module.exports = {
  initializeAuthentications(app) {
    app.use(passport.initialize());
    app.use(passport.authenticate("session"));

    // Serialization will be called during request.login(userFromDb)
    // Result will be saved into session
    passport.serializeUser(function (userFromDb, doneFunction) {
      console.log("");
      console.log(userFromDb);

      const userObj = {
        id: userFromDb.user_id,
        name: userFromDb.user_name,
        role: userFromDb.user_role,
      }; // only the ID/unique name would be enough...

      console.log(userObj);
      console.log("");

      doneFunction(null, userObj);
    });

    // This will be login when serialized user is in the session
    // Result will be saved into request.user
    passport.deserializeUser(async function (userObj, doneFunction) {
      console.log("");
      console.log(userObj);

      let userFromDb = await usersRepo.getOneUser(userObj.name);

      console.log(userFromDb);
      console.log("");

      doneFunction(null, userFromDb);
    });
  },

  authorizeRequest(requiredRole) {
  return function (request, response, next) {
    console.log('AUTH CHECK, requiredRole =', requiredRole, 'user =', request.user);

    if (request.isAuthenticated && request.isAuthenticated()) {
      // utilisateur connecté
      if (requiredRole) {
        // rôle spécial requis
        if (request.user && request.user.user_role === requiredRole) {
          return next();
        } else {
          return response.end(
            JSON.stringify({
              error: "401 Unauthorized (bad user level)",
              timestamp: new Date().toLocaleString(),
            })
          );
        }
      } else {
        // aucun rôle spécial requis
        return next();
      }
    } else {
      // pas authentifié
      return response.end(
        JSON.stringify({
          error: "401 Unauthorized (not authenticated)",
          timestamp: new Date().toLocaleString(),
        })
      );
    }
  };
} 
};
