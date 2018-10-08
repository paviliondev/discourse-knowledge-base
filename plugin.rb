# name: discourse-knowledge-base
# about: Create a knowledge base in Discourse
# version: 0.1
# author: Angus McLeod

enabled_site_setting :knowledge_base_enabled

register_asset 'stylesheets/common/knowledge-base.scss'

after_initialize do
  module ::DiscourseKnowledgeBase
    class Engine < ::Rails::Engine
      engine_name 'knowledge_base'
      isolate_namespace DiscourseKnowledgeBase
    end
  end

  DiscourseKnowledgeBase::Engine.routes.draw do
    get "/" => "knowledge_base#index"
    get "/:slug/:title/:topic_id" => "knowledge_base#article"
    get "/:slug/:title/:topic_id/print" => "knowledge_base#article", format: :html, print: true
  end

  Discourse::Application.routes.append do
    mount ::DiscourseKnowledgeBase::Engine, at: "/k"
  end

  class ::Category
    def knowledge_base
      if custom_fields['knowledge_base'] != nil
        custom_fields['knowledge_base']
      else
        false
      end
    end
  end

  add_to_serializer(:basic_category, :knowledge_base) { object.knowledge_base }

  class DiscourseKnowledgeBase::KnowledgeBaseController < ::ApplicationController
    prepend_view_path(Rails.root.join('plugins', 'discourse-knowledge-base', 'views'))
    before_action :init_guardian
    layout :set_layout

    helper_method :topic
    helper_method :post

    def index
      categories = Category.where("id IN (
        SELECT category_id FROM category_custom_fields
        WHERE name = 'knowledge_base'
        AND value::boolean IS TRUE
      )")

      categories = categories.select { |c| @guardian.can_see_category?(c) }

      topic_lists = {}

      categories.each do |c|
        if topics = Topic.where(category_id: c.id)
          topic_lists[c.id] = ActiveModel::ArraySerializer.new(topics, each_serializer: BasicTopicSerializer).as_json
        end
      end

      render json: topic_lists
    end

    def article
      if category.knowledge_base && topic
        render_json_dump(
          category_id: category.id,
          topic_id: topic.id,
          post: PostSerializer.new(post, scope: @guardian, root: false)
        )
      else
        render json: failed_json
      end
    end

    private

    def init_guardian
      @guardian = Guardian.new(current_user)
    end

    def set_layout
      params.key?("print") ? 'knowledge_base_print' : 'application'
    end

    def topic
      @topic ||= begin
        params.require(:title)

        opts = {
          category_id: category.id
        }

        if params[:topic_id]
          opts[:id] = params[:topic_id]
        else
          opts[:title] = params[:title]
        end

        Topic.find_by(opts)
      end
    end

    def category
      @category ||= begin
        params.require(:slug)
        category = Category.find_by(slug: params[:slug])

        unless @guardian.can_see_category?(category)
          raise Discourse::InvalidAccess.new
        end

        category
      end
    end

    def post
      @post ||= @topic.first_post
    end
  end
end
