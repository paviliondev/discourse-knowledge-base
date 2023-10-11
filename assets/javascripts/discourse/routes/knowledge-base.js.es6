import { ajax } from 'discourse/lib/ajax';
import { cook } from 'discourse/lib/text';
import DiscourseURL from 'discourse/lib/url';

export default Ember.Route.extend({
  model() {
    return ajax('/k');
  },

  setupController(controller, model) {
    controller.setProperties({
      topicsList: model
    });

    cook(I18n.t('knowledge_base.description')).then((cooked) => {
      controller.set('description', cooked);
    });
  }
});
