"use strict";
const Profile = use("App/Models/Profile");
const Helpers = use("Helpers");
const { validate } = use("Validator");
class ProfileController {
  async index({ request, auth, response, view }) {
    const user = await auth.getUser();
    const profile = await user.profile().first();
    return view.render("profile", { user: user, profile: profile });
  }

  async create({ request, response, view }) {}

  async store({ request, response, session, auth }) {
    const req = request.all();
    const profile = await new Profile();
    const user_id = await auth.getUser();
    profile.user_id = user_id.id;
    const profileImage = request.file("image", {
      size: "5mb"
    });

    const image = await profileImage;
    const date = Date.now();
    image.move(Helpers.publicPath("profile"), {
      name: date + image.clientName,
      overwrite: true
    });
    profile.image = "profile/" + date + image.clientName;
    profile.save();
    session.flash({ success: "Done" });
    return response.redirect("/");
  }

  async show({ params, request, response, view }) {}

  async edit({ params, request, response, view }) {}

  async update({ params, request, response }) {}
  async destroy({ params, request, response }) {}
}

module.exports = ProfileController;
