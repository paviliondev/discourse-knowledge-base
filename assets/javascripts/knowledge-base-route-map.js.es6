export default function() {
  this.route('knowledgeBase', { path: '/k' }, function() {
    this.route('section', { path: '/:slug' });
    this.route('topic', { path: '/:slug/:title/:topic_id' });
  });
}
