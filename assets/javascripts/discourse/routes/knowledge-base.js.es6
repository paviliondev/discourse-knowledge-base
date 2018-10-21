import { ajax } from 'discourse/lib/ajax';
import { cookAsync } from 'discourse/lib/text';

export default Ember.Route.extend({
  model() {
    return ajax('/k');
  },

  setupController(controller, model) {
    controller.setProperties({
      topicsList: model
    });

    const rawDescription = Discourse.SiteSettings.knowledge_base_description;
    cookAsync(rawDescription).then((cooked) => {
      controller.set('description', cooked);
    });
  }
});
