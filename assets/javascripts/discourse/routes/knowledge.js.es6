export default Ember.Route.extend({
  redirect() {
    return this.replaceWith('knowledgeBase');
  }
})
