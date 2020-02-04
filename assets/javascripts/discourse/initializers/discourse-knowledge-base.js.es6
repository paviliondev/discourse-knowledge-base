import { withPluginApi } from "discourse/lib/plugin-api";
import { knowledgeBaseCategoryLinkRenderer } from '../lib/knowledge-base-utilities';

export default {
  name: "init-knowledge-base",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    
    if (!siteSettings.knowledge_base_enabled) return;

    withPluginApi('0.8.37', api => {
      if (siteSettings.knowledge_base_change_category_badge_link) {
        api.replaceCategoryLinkRenderer(knowledgeBaseCategoryLinkRenderer);
      }
      
      if (siteSettings.knowledge_base_category_list) {
        api.addNavigationBarItem({
          name: "kb",
          customHref: (category, args, router) => { 
            return `${category.url}/l/kb`;
          },
          customFilter: (category, args, router) => { 
            return category && category.knowledge_base;
          }
        });
      }
    });
  }
};
