import { withPluginApi } from "discourse/lib/plugin-api";
import NavItem from 'discourse/models/nav-item';

function initializeKnowledgeBase(api) {

}

export default {
  name: "init-knowledge-base",
  initialize() {
    withPluginApi("0.8.24", initializeKnowledgeBase);

    NavItem.reopenClass({
      buildList(category, args) {
        let items = this._super(category, args);

        if (category) {
          items = items.reject((item) => item.name === 'kb');

          if (category.knowledge_base) {
            items.push(Discourse.NavItem.fromText('kb', args));
          }
        }

        return items;
      }
    });
  }
};
