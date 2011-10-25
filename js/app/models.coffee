"use strict"

# Create a new collection on init()
APP.init = -> new collections.list

models = {}
collections = {}

#################################

# Boilerplate collection with some nifty tricks
# Reset is called when fetch is complete
# Reset is set up to create a docFrag and append all the rendered model views
# When complete inserts it in one DOW draw, in @el
class collection extends Backbone.Collection
  model : models[@view]
  initialize : (models, options) ->
    elem = document.getElementById @el
    # collection is reset on fetch, or manually
    @bind "reset", (collection, options) ->
      # build the dom:
      container = document.createDocumentFragment()
      for model in collection.models
        container.appendChild @render model
      # inject rendered view into @el
      elem.appendChild container
      # if defined, call this func to do stuff after reset
      @post_render collection, options if @post_render
    @bind "add", (model, options) ->
      elem.appendChild @render model
  # collection render func
  render : (model) ->
    # @view name is set as a string on each collection
    # returns a html blob if the view has a self invoking render function
    (new APP.views[@view]
      model: model
      collection: @
    ).el
    
##################################

# model used in the collection
class models.row extends Backbone.Model

class collections.list extends collection
  # used for view, model and template name
  view : "row"
  # Collection url, fetch, save etc
  url : "data.json"
  # Element to render the collection in
  el : "albums"
  initialize : (models, options) ->
    super()
    #@fetch()
    