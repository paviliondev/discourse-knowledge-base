import { registerUnbound } from "discourse-common/lib/helpers";
import { categoryBadgeHTML } from 'discourse/helpers/category-link';

if (Discourse.SiteSettings.knowledge_base_change_category_badge_link) {
  registerUnbound("category-link", function(category, options) {
    var categoryOptions = {};

    // TODO: This is a compatibility layer with the old helper structure.
    // Can be removed once we migrate to `registerUnbound` fully
    if (options && options.hash) {
      options = options.hash;
    }

    if (options) {
      if (options.allowUncategorized) {
        categoryOptions.allowUncategorized = true;
      }
      if (options.link !== undefined) {
        categoryOptions.link = options.link;
      }
      if (options.extraClasses) {
        categoryOptions.extraClasses = options.extraClasses;
      }
      if (options.hideParent) {
        categoryOptions.hideParent = true;
      }
      if (options.categoryStyle) {
        categoryOptions.categoryStyle = options.categoryStyle;
      }
    }

    // UPDATE
    if (category.knowledge_base) {
      categoryOptions.url = `/k/${category.slug}` ;
    }

    return new Handlebars.SafeString(
      categoryBadgeHTML(category, categoryOptions)
    );
  });
}
