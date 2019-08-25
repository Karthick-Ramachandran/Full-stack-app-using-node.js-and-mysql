"use strict";
const User = use("App/Models/User");
const Profile = use("App/Models/Profile");
const { validate } = use("Validator");
class AuthController {
  async register({ response, auth, request, session }) {
    const req = request.all();
    const rules = {
      username: "required",
      email: "email|required|unique:users",
      password: "required|min:6"
    };

    const messages = {
      "email.email": "Email address is not a valid one",
      "email.unique": "Email address already exists",
      "email.required": "Email address is required",
      "username.required": "Username is required",
      "password.required": "Password is required",
      "password.min": "passoword should be 6 characters long"
    };

    const validation = await validate(req, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }
    const user = await new User();
    user.username = req.username;
    user.email = req.email;
    user.password = req.password;
    user.isAdmin = 0;
    user.save();
    await auth.attempt(req.email, req.password);
    session.flash({ success: "You are registered and logged in" });
    return response.redirect("/");
  }

  async login({ session, auth, request, response }) {
    const req = request.all();
    const rules = {
      email: "required",
      password: "required"
    };

    const messages = {
      "email.required": "Email address is required",
      "password.required": "Password is required"
    };
    const validation = await validate(req, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    await auth.attempt(req.email, req.password);
    session.flash({ success: "You are logged in" });
    return response.redirect("/");
  }
  async logout({ auth, session, response }) {
    await auth.logout();
    session.flash({ success: "You are logged out" });
    return response.redirect("/login");
  }
  async admin({ view }) {
    return view.render("admin.login");
  }
  async adminLogin({ session, auth, response, request }) {
    const req = request.all();
    const rules = {
      email: "required",
      password: "required"
    };

    const messages = {
      "email.required": "Email address is required",
      "password.required": "Password is required"
    };
    const validation = await validate(req, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }
    await auth.attempt(req.email, req.password);
    const admin = await auth.getUser();
    if (admin.isAdmin) {
      session.flash({ success: "You are logged in as admin" });
      return response.redirect("/");
    } else {
      await auth.logout();
      session.flash({ failed: "You are not the admin" });
      return response.redirect("/");
    }
  }
}

module.exports = AuthController;
