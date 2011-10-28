"use strict"

APP.init = -> 
  APP.instances.list = new collections.list
  APP.instances.messages = new collections.messages
  
  # XXXX (todo) messy...
  # maybe put the abstract behaviour somewhere seperate, 
  # ex: always do x when y happens on a
  APP.instances.messages.bind "inserted", =>
    console.log "Inserted messages"
    messages = document.getElementById "messages"
    messages.scrollTop = messages.scrollHeight
    
    pageAntimator.slide("left")

models = {}
collections = {}

############################################

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
    
############################################

class models.row extends Backbone.Model
  convertTime : (time) ->
    t = new Date time
    padDate = (n) -> (if n < 10 then '0' else '') + n
    date = "#{ t.getFullYear() }-#{ padDate t.getMonth() + 1 }-#{ padDate t.getDate() }"
  initialize : ->
    time = @get "time"
    @set "time" : @convertTime time
  open : ->
    # open/load @id record or something
    unless APP.instances.messages.models.length
      APP.instances.messages.fetch()
    else
      APP.instances.messages.reset().fetch()

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

############################################
############################################

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
  parse : (response) ->
    response.length = 10
    response
      
