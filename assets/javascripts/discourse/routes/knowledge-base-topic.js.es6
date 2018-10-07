import { ajax } from 'discourse/lib/ajax';

export default Ember.Route.extend({
  model(params) {
    return ajax(`/k/${params.slug}/${params.title}/${params.topic_id}`);
  },

  afterModel(model) {
    this.controllerFor('knowledgeBase').set('currentItemId', model.topic_id);
  },

  setupController(controller, model) {
    const topicsList = this.controllerFor('knowledgeBase').get('topicsList');
    let topics = topicsList[model.category_id];
    let topic = topics.find(t => t.id == model.topic_id);

    controller.setProperties({
      post: model.post,
      topic
    });
  }
});
