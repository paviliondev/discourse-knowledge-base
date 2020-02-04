KnowledgeBase::Engine.routes.draw do
  get "/" => "knowledge_base#index"
  get "nowledge" => "knowledge_base#index"
  get "/:slug/" => "knowledge_base#section", defaults: { format: 'html' }
  get "/:slug.json" => "knowledge_base#section", defaults: { format: 'json' }
  get "/:slug/print" => "knowledge_base#section", format: :html, print: true
  put "/:slug/sort" => "knowledge_base#sort"
  get "/:slug/:title/:topic_id" => "knowledge_base#show", defaults: { format: 'html' }
  get "/:slug/:title/:topic_id.json" => "knowledge_base#show", defaults: { format: 'json' }
  get "/:slug/:title/:topic_id/print" => "knowledge_base#show", format: :html, print: true
end

Discourse::Application.routes.append do
  mount ::KnowledgeBase::Engine, at: "/k"
end