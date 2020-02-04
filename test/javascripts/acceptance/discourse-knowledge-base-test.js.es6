import { acceptance } from "helpers/qunit-helpers";

acceptance("KnowledgeBase", { loggedIn: true });

test("KnowledgeBase works", async assert => {
  await visit("/admin/plugins/discourse-knowledge-base");

  assert.ok(false, "it shows the KnowledgeBase button");
});
