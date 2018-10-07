import { acceptance } from "helpers/qunit-helpers";

acceptance("DiscourseKnowledgeBase", { loggedIn: true });

test("DiscourseKnowledgeBase works", async assert => {
  await visit("/admin/plugins/discourse-knowledge-base");

  assert.ok(false, "it shows the DiscourseKnowledgeBase button");
});
