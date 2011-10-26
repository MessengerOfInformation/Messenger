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
  events : 
    "tapInstant" : "open"
    "swipeLeft"  : "delete"
  open : ->
    @collection.open()
  delete : ->
    alert "delete"

class APP.views.message extends view
  tagName : "article"
  className : "message"
  template : templates.message
  render : ->
    super()

##################################
