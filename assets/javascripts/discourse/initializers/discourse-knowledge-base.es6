import { withPluginApi } from "discourse/lib/plugin-api";

function initializeKnowledgeBase(api) {

  // see app/assets/javascripts/discourse/lib/plugin-api
  // for the functions available via the api object

}

export default {
  name: "init-knowledge-base",

  initialize() {
    withPluginApi("0.8.24", initializeKnowledgeBase);
  }
};
