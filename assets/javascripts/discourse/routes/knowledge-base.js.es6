import { ajax } from 'discourse/lib/ajax';

export default Ember.Route.extend({
  model() {
    return ajax('/k');
  },

  setupController(controller, model) {
    controller.set('topicsList', model);
  }
});
