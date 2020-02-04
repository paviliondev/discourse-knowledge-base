# frozen_string_literal: true

# name: discourse-knowledge-base
# about: Create a knowledge base in Discourse
# version: 0.2
# author: Angus McLeod
# url: https://github.com/paviliondev/discourse-knowledge-base

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
  %w[
    ../lib/knowledge_base/engine.rb
    ../config/routes.rb
    ../app/controllers/knowledge_base/knowledge_base_controller.rb
  ].each do |path|
    load File.expand_path(path, __FILE__)
  end
  
  Category.register_custom_field_type('knowledge_base', :boolean)

  add_to_class(:category, :knowledge_base) do
    if custom_fields['knowledge_base'] != nil
      custom_fields['knowledge_base']
    else
      false
    end
  end

  Site.preloaded_category_custom_fields << 'knowledge_base' if Site.respond_to? :preloaded_category_custom_fields

  add_to_serializer(:basic_category, :knowledge_base) { object.knowledge_base }
  add_to_serializer(:basic_category, :topic_id) { object.topic_id }

  Topic.register_custom_field_type('knowledge_base_index', :integer)
  
  add_to_class(:topic, :knowledge_base_index) do
    if custom_fields['knowledge_base_index'] != nil
      custom_fields['knowledge_base_index'].to_i
    else
      nil
    end
  end

  TopicList.preloaded_custom_fields << 'knowledge_base_index' if TopicList.respond_to? :preloaded_custom_fields
  add_to_serializer(:basic_topic, :knowledge_base_index) { object.knowledge_base_index }
  add_to_serializer(:basic_topic, :include_knowledge_base_index?) { object.category && object.category.knowledge_base }
  
  TopicQuery::SORTABLE_MAPPING['knowledge_base'] = 'custom_fields.knowledge_base_index'
  
  add_to_class(:topic_query, :list_kb) do
    @options[:order] = 'knowledge_base'
    @options[:ascending] = "true"
    @options[:limit] = false
    create_list(:knowledge_base, {})
  end
end
