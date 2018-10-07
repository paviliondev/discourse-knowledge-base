export default function() {
  this.route('knowledgeBase', { path: '/k' }, function() {
    this.route('topic', { path: '/:slug/:title/:topic_id' });
  });
}
