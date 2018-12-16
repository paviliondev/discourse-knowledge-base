class DiscourseKnowledgeBase::KnowledgeBaseController < ::ApplicationController
  skip_before_action :check_xhr, only: [:show, :section]
  prepend_view_path(Rails.root.join('plugins', 'discourse-knowledge-base', 'app', 'views'))
  before_action :init_guardian
  before_action :ensure_admin, only: [:sort]
  layout :set_layout

  helper_method :page_title
  helper_method :topic
  helper_method :post

  def index
    topic_lists = {}

    knowledge_base_categories.each do |c|
      if topic_list = TopicQuery.new(current_user, category: c.id).list_kb
        topic_lists[c.id] = ActiveModel::ArraySerializer.new(topic_list.topics, each_serializer: BasicTopicSerializer).as_json
      end
    end

    render json: topic_lists
  end

  def section
    respond_to do |format|
      format.html do
        render :show
      end

      format.json do
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
    end
  end

  def show
    respond_to do |format|
      format.html do
        render :show
      end

      format.json do
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
    end
  end

  def sort
    opts = params.permit(sorted_ids: [])

    TopicCustomField.where(name: 'knowledge_base_index', topic_id: opts[:sorted_ids]).destroy_all

    Topic.where(id: opts[:sorted_ids]).each do |topic|
      topic.custom_fields['knowledge_base_index'] = opts[:sorted_ids].find_index(topic.id.to_s)
      topic.save_custom_fields(true)
    end

    render json: success_json
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
      opts = {
        category_id: category.id
      }

      if params[:action] == "show"
        if params[:topic_id]
          opts[:id] = params[:topic_id]
        else
          opts[:title] = params[:title]
        end
      elsif params[:action] == "section"
        opts[:id] = category.topic_id
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

  def page_title
    if params[:action] == "show"
      topic.title
    elsif params[:action] == "section"
      category.name
    end
  end

  def post
    @post ||= @topic.first_post
  end

  def knowledge_base_categories
    categories = Category.where("id IN (
      SELECT category_id FROM category_custom_fields
      WHERE name = 'knowledge_base'
      AND value::boolean IS TRUE
    )")

    categories.select { |c| @guardian.can_see_category?(c) }
  end
end
