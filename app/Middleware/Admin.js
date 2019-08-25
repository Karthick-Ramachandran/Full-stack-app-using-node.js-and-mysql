"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth, session }, next) {
    // call next to advance the
    try {
      await auth.check();
      const user = await auth.getUser();
      if (user.isAdmin) {
        await next();
      } else {
        session.flash({ failed: "You are not the admin to access the page" });
        return response.redirect("/");
      }
    } catch {
      session.flash({ failed: "You should login" });
      return response.redirect("/");
    }
  }
}

module.exports = Admin;
