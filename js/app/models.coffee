"use strict"

APP.init = -> new collections.list

models = {}
collections = {}

#################################

class collection extends Backbone.Collection
  initialize : (models, options) ->
    elem = document.getElementById @el
    @$el = $ "#" + @el
    @bind "reset", (collection, options) ->
      container = document.createDocumentFragment()
      for model in collection.models
        container.appendChild @render model
      elem.appendChild container
    @bind "add", (model, options) ->
      elem.appendChild @render model
    @$el.bind "DOMSubtreeModified", (e) => 
      @trigger "inserted"
  render : (model) ->
    (new APP.views[@view]
      model: model
      collection: @
    ).el
    
##################################

class models.row extends Backbone.Model
  convertTime : (time) ->
    t = new Date time
    date = "#{ t.getFullYear() }-#{ t.getMonth() + 1 }-#{ _dx = t.getDate(); if _dx < 10 then '0' + _dx else _dx }"
  initialize : ->
    time = @get "time"
    @set "time" : @convertTime time
    
class collections.list extends collection
  view : "row"
  model : models.row
  url : "data/list.json"
  el : "list"
  initialize : (models, options) ->
    super()
    @fetch()
  comparator : (row) ->
    -row.get "time"
  open : ->
    messages = new collections.messages
    $pages_wrapper = $(".pages_wrapper")
    $pages_wrapper.bind "webkitTransitionEnd", ->
    messages.bind "inserted", ->
      console.log "locked and loaded"
      $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight
      pageAntimator.goRight()

class models.message extends Backbone.Model
  convertSMSTime : (time) ->
    t = new Date time
    months = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "okt", "nov", "dec" ]
    date = "#{t.getDate()} #{months[t.getMonth()]} #{t.getFullYear()} #{t.getHours()}:#{t.getMinutes()}"
  initialize : ->
    time = @get "time"
    @set "time" : @convertSMSTime time
    
class collections.messages extends collection
  view : "message"
  model : models.message
  url : "data/list.json"
  el : "messages"
  initialize : (models, options) ->
    super()
    @fetch()
  parse : (response) ->
    response.length = 50
    response
      
