"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("welcome");

Route.get("/register", function({ view }) {
  return view.render("register");
}).middleware("authenticated");

Route.post("/register", "AuthController.register").as("register");
Route.get("/login", function({ view }) {
  return view.render("login");
}).middleware("authenticated");
Route.post("/login", "AuthController.login").as("login");
Route.get("/logout", "AuthController.logout");
Route.get("/profile", "ProfileController.index").middleware(["loggedin"]);
Route.post("/profile", "ProfileController.store")
  .as("profile")
  .middleware(["loggedin"]);
Route.get("/stories", "StoryController.index");
Route.get("/read/:id", "StoryController.read").as("read");

Route.group(function() {
  Route.get("/create/story", "StoryController.create");
  Route.post("/create/story", "StoryController.store").as("createstory");
  Route.get("/story/:id", "StoryController.edit").as("editview");
  Route.post("/story/:id", "StoryController.update").as("editstory");
}).middleware(["loggedin"]);
Route.get("/search", "StoryController.search").as("search");
Route.get("/admin/login", "AuthController.admin");
Route.post("/admin/login", "AuthController.adminLogin").as("adminlogin");
Route.get("/admin/stories", "StoryController.adminStory").middleware("admin");
Route.get("/story/delete/:id", "StoryController.delete")
  .as("storydelete")
  .middleware("admin");

Route.get("*", function({ view }) {
  return view.render("404");
});
