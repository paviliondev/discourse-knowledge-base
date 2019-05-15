import { withPluginApi } from "discourse/lib/plugin-api";
import NavItem from 'discourse/models/nav-item';
import Category from 'discourse/models/category';
import { default as computed } from 'ember-addons/ember-computed-decorators';

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

    if (siteSettings.knowledge_base_change_category_badge_link) {
      withPluginApi('0.8.22', api => {
        api.modifyClass('component:category-title-link', {
          init() {
            this._super();
            const category = this.get('category');
            if (category.knowledge_base) {
              this.set('category.url', Discourse.getURL("/k/") + category.slug);
            }
          }
        })
      });
    }
  }
};
