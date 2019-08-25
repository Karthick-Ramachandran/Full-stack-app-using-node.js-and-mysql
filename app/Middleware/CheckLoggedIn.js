"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckLoggedIn {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth, session }, next) {
    try {
      await auth.check();
      await next();
    } catch {
      session.flash({ failed: "Login to continue" });
      return response.redirect("/");
    }
  }
}

module.exports = CheckLoggedIn;
