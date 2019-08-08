# name: discourse-knowledge-base
# about: Create a knowledge base in Discourse
# version: 0.1
# author: Angus McLeod

enabled_site_setting :knowledge_base_enabled

register_asset 'stylesheets/common/knowledge-base.scss'
register_asset 'stylesheets/mobile/knowledge-base.scss', :mobile

if respond_to?(:register_svg_icon)
  register_svg_icon "print"
  register_svg_icon "angle-double-up"
  register_svg_icon "angle-double-down"
end

Discourse.top_menu_items.push(:kb)
Discourse.anonymous_top_menu_items.push(:kb)
Discourse.filters.push(:kb)
Discourse.anonymous_filters.push(:kb)

after_initialize do
  module ::DiscourseKnowledgeBase
    class Engine < ::Rails::Engine
      engine_name 'knowledge_base'
      isolate_namespace DiscourseKnowledgeBase
    end
  end

  DiscourseKnowledgeBase::Engine.routes.draw do
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
    mount ::DiscourseKnowledgeBase::Engine, at: "/k"
  end
  
  Category.register_custom_field_type('knowledge_base', :boolean)

  class ::Category
    def knowledge_base
      if custom_fields['knowledge_base'] != nil
        custom_fields['knowledge_base']
      else
        false
      end
    end
  end

  Site.preloaded_category_custom_fields << 'knowledge_base' if Site.respond_to? :preloaded_category_custom_fields

  add_to_serializer(:basic_category, :knowledge_base) { object.knowledge_base }
  add_to_serializer(:basic_category, :topic_id) { object.topic_id }

  Topic.register_custom_field_type('knowledge_base_index', :integer)

  class ::Topic
    def knowledge_base_index
      if custom_fields['knowledge_base_index'] != nil
        custom_fields['knowledge_base_index'].to_i
      else
        nil
      end
    end
  end

  TopicList.preloaded_custom_fields << 'knowledge_base_index' if TopicList.respond_to? :preloaded_custom_fields
  add_to_serializer(:basic_topic, :knowledge_base_index) { object.knowledge_base_index }
  add_to_serializer(:basic_topic, :include_knowledge_base_index?) { object.category && object.category.knowledge_base }

  require_dependency 'topic_query'
  class ::TopicQuery
    SORTABLE_MAPPING['knowledge_base'] = 'custom_fields.knowledge_base_index'

    def list_kb
      @options[:order] = 'knowledge_base'
      @options[:ascending] = "true"
      @options[:limit] = false
      create_list(:knowledge_base, {})
    end
  end

  load File.expand_path('../app/controllers/knowledge_base_controller.rb', __FILE__)
end
