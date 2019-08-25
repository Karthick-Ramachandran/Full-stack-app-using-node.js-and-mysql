"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Authenticated {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, session, response }, next) {
    try {
      await auth.check();
      session.flash({ failed: "You are already logged in" });
      return response.redirect("/");
    } catch {
      await next();
    }
  }
}

module.exports = Authenticated;
