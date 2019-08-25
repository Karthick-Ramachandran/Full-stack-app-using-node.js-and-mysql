"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StorySchema extends Schema {
  up() {
    this.create("stories", table => {
      table.increments();
      table.integer("user_id").unsigned();
      table.string("title");
      table.text("content");
      table.string("image");
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("cascade");
      table.boolean("isApproved").default(0);
      table.timestamps();
    });
  }

  down() {
    this.drop("stories");
  }
}

module.exports = StorySchema;
