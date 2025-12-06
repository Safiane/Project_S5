// controllers/auth.route.js
const auth = require('../utils/users.auth');
const express = require('express');
const router = express.Router();
const userRepo = require("../utils/users.repository");

// http://localhost:9000/auth
// USE AUTHORIZATION HERE (the method does not know if authorization is present)
// MAC/DAC/RBAC, Claims-based authorization, Policy-based authorization, Resource-based authorization
router.get("/user", auth.authorizeRequest("USER"), userdataAction); // expose function only for USER roles
router.get("/admin", auth.authorizeRequest("ADMIN"), userdataAction); // expose function only for ADMIN roles
router.get("/protected", protectedGetAction); // execute authorization in action method: needed for resource-based auth
router.post("/login", loginPostAction);
router.post("/register", registerPostAction);
router.get("/logout", logoutAction);

// use same endpoints for both roles
async function userdataAction(request, response) {
  let userJson = JSON.stringify(request.user); 
  response.send(userJson);
}

async function protectedGetAction(request, response) {
  // TODO: authorize using all factors (resource / context / environment) ...
  let userRole = "GUEST CONTENT";
  if (request.isAuthenticated()) {
    if (request.user.user_role === "ADMIN") {
      userRole = "ADMIN CONTENT";
    } else {
      userRole = "USER CONTENT";
    }
  } 
  let resultObject = { "contentResult": userRole, "timestamp": new Date().toLocaleString() };
  response.send(JSON.stringify(resultObject));
}

async function loginPostAction(request, response) {
  console.log('LOGIN BODY = ', request.body);

  let areValid = await userRepo.areValidCredentials(
    request.body.username,
    request.body.userpass
  );

  console.log('LOGIN VALID = ', areValid);

  if (areValid) {
    const user = await userRepo.getOneUser(request.body.username);

    request.login(user, function (err) {
      if (err) {
        console.log('LOGINERROR');
        console.log(err);
        areValid = false;
      }

      const resultObject = {
        loginResult: areValid,
        timestamp: new Date().toLocaleString(),
      };
      response.send(JSON.stringify(resultObject));
    });
  } else {
    const resultObject = {
      loginResult: false,
      timestamp: new Date().toLocaleString(),
    };
    response.send(JSON.stringify(resultObject));
  }
}


function logoutAction(request, response) {
  request.logout(function(err){
    let resultObject = { "logoutResult": true, "timestamp": new Date().toLocaleString() };
    if (err) { 
      console.log("LOGINERROR");
      console.log(err); 
      areValid = false;
      // return next(err);
    }
    response.send(JSON.stringify(resultObject));
  });
}

router.get("/me", meGetAction);

async function meGetAction(request, response) {
  if (!request.isAuthenticated || !request.isAuthenticated()) {
    return response.status(200).send(JSON.stringify({ user: null }));
  }

  // on renvoie seulement les infos utiles
  const user = {
    user_id: request.user.user_id,
    user_name: request.user.user_name,
    user_role: request.user.user_role
  };

  response.send(JSON.stringify({ user }));
}

async function registerPostAction(request, response) {
  try {
    const { username, userpass } = request.body;

    if (!username || !userpass) {
      return response
        .status(400)
        .send(JSON.stringify({ registerResult: false, message: "Missing fields" }));
    }

    // tout nouvel utilisateur sera USER
    const newId = await userRepo.registerUser(username, userpass, "USER");

    const resultObject = {
      registerResult: true,
      userId: newId,
      timestamp: new Date().toLocaleString(),
    };
    response.send(JSON.stringify(resultObject));
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .send(JSON.stringify({ registerResult: false, message: "Registration failed" }));
  }
}

module.exports = router;