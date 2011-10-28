"use strict"

templates =
  header         : Handlebars.templates.header
  message_footer : Handlebars.templates.message_footer
  message        : Handlebars.templates.message
  row            : Handlebars.templates.row

##################################

class view extends Backbone.View
  initialize : ->
    @model.bind 'change' , @render, @
    @model.bind 'destroy', @remove, @
    @model.bind 'error'  , (model, response, options) =>
      @error model, response, options if @error
    @render()
  render : ->
    @el.innerHTML = @template @model.toJSON()
    @$el = $(@el)
    @
  remove : ->
    $(@el).remove()
  clear : ->
    @model.destroy()

##################################

class APP.views.header extends view
  tagName : "header"
  className : "app header"
  template : templates.header
  render : ->

class APP.views.message_footer extends view
  tagName : "footer"
  template : templates.header
  render : ->

##################################

class APP.views.row extends view
  tagName : "article"
  className : "row"
  template : templates.row
  render : ->
    super()
    @deleteButton = $(@el).find(".delete_m")[0]
    @$list = $ ".list"
  events :
    "tapInstant .delete .arrow" : "deleteRow"
    "swipeLeft"  : "deleteState"
    "swipeRight" : "deleteState"
    "tapInstant" : "open"
  open : -> @model.open()
  deleteState : ->
    if @deleting
      @deleting = false
      @$list.unbind("touchstart touchend")
      $(@deleteButton).anim {"translate3d" : "100%, 0 ,0"}, ".2", "ease-out", =>
        @$el.removeClass "delete"
    else
      @deleting = true
      @$el.addClass "delete"
      $(@deleteButton).anim {"translate3d" : "0, 0, 0"}, ".2", "ease-out", null
      $deleteWrapper = $(@el).find(".arrow")[0]
      @$list.bind( "touchstart", (e) =>
        unless e.target is $deleteWrapper or e.target is @deleteButton
          e.stopImmediatePropagation()
      ).bind( "touchend", (e) =>
        unless e.target is $deleteWrapper or e.target is @deleteButton
          e.stopImmediatePropagation()
          @deleteState()
      )
  deleteRow : (e) ->
    e.stopImmediatePropagation()
    @$el.fadeOut()
    @$el.removeClass "delete"

class APP.views.message extends view
  tagName : "article"
  className : "message"
  template : templates.message
  render : ->
    super()

##################################
