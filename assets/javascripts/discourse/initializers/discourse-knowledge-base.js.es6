import { withPluginApi } from "discourse/lib/plugin-api";
import NavItem from 'discourse/models/nav-item';

export default {
  name: "init-knowledge-base",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (!siteSettings.knowledge_base_enabled) return;

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
