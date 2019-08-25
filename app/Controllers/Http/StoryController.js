"use strict";
const Story = use("App/Models/Story");
const User = use("App/Models/User");
const { validate } = use("Validator");
const Helpers = use("Helpers");
class StoryController {
  async index({ view, response }) {
    const stories = await Story.query()
      .orderBy("created_at", "desc")
      .fetch();
    return view.render("story.story", { stories: stories.toJSON() });
  }

  async create({ response, view }) {
    return view.render("story.create");
  }

  async store({ response, request, session, auth }) {
    const req = request.all();
    const rules = {
      title: "required",
      content: "required"
    };
    const messages = {
      "title.required": "Title is Required",
      "content.required": "Content is Required"
    };
    const validation = await validate(req, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("/");
    }
    const user = await auth.getUser();
    const story = await new Story();

    story.user_id = user.id;

    story.title = req.title;
    story.content = req.content;

    const postImage = request.file("image", {
      size: "10mb"
    });

    const image = await postImage;
    const date = Date.now();
    image.move(Helpers.publicPath("story"), {
      name: date + image.clientName,
      overwrite: true
    });
    story.image = "story/" + date + image.clientName;
    story.save();
    session.flash({ success: "Your Story Created successfully" });
    return response.redirect("/");
  }
  async read({ view, params }) {
    const story = await Story.find(params.id);
    const user = await User.query()
      .where("id", story.user_id)
      .with("profile")
      .first();
    return view.render("story.read", { story: story, user: user.toJSON() });
  }

  async edit({ view, params, auth, response, session }) {
    const story = await Story.find(params.id);
    const user = await auth.getUser();
    if (user.id === story.user_id) {
      return view.render("story.edit", { story: story.toJSON() });
    } else {
      session.flash({ failed: "You are not the owner of this story. Sorry!" });
      return response.redirect("/");
    }
  }

  async update({ request, response, auth, params, session }) {
    const req = request.all();
    const rules = {
      title: "required",
      content: "required"
    };
    const messages = {
      "title.required": "Title is Required",
      "content.required": "Content is Required"
    };
    const validation = await validate(req, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("/");
    }
    const user = await auth.getUser();
    const story = await Story.find(params.id);

    story.user_id = user.id;

    story.title = req.title;
    story.content = req.content;

    const postImage = request.file("image", {
      size: "10mb"
    });

    const image = await postImage;
    const date = Date.now();
    image.move(Helpers.publicPath("story"), {
      name: date + image.clientName,
      overwrite: true
    });
    story.image = "story/" + date + image.clientName;
    story.save();
    session.flash({ success: "Your Story edited successfully" });
    return response.redirect("/");
  }
  async search({ request, view }) {
    const req = request.all();
    const story = await Story.query()
      .where("title", "like", "%" + req.searchterm + "%")
      .orWhere("content", "like", "%" + req.searchterm + "%")
      .fetch();
    return view.render("search", { story: story.toJSON() });
  }
  async adminStory({ view }) {
    const story = await Story.all();
    return view.render("admin.story", { story: story.toJSON() });
  }
  async delete({ response, auth, session, params }) {
    const story = await Story.find(params.id);
    story.delete();
    session.flash({ success: "Your Story deleted successfully" });
    return response.redirect("/");
  }
}

module.exports = StoryController;
