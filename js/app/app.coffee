"use strict"

window.APP =
  views     : {}
  models    : {}
  instances : {}

#############################################

$ ->
  
  APP.init()
  
  ScrollFix $(".list")[0]
  ScrollFix $(".messages")[0]
  
  ################################
  ################################
  ################################
  
  $(".sms_input").autogrow (msg) ->
    console.log "callback msg", msg
  , allowEnter : false
  
  convertSMSTime = (date) ->
    t = new Date date
    months = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "okt", "nov", "dec" ]
    time = "#{t.getDate()} #{months[t.getMonth()]} #{t.getFullYear()} #{t.getHours()}:#{t.getMinutes()}"
  
  insertBr = ( input ) ->
    console.log input.indexOf(/\r/)
    inputy = input.replace /[\r]|[\n]/, "<br />"
    inputx = inputy.replace(/\s/, "&nbsp;")
    inputx
    
  # message output event
  $(".sms_input").on "onMessage", (e, data) ->
    time = convertSMSTime data.time
    value = insertBr data.value
    $(".messages").append "<article class='message cf'><footer><time>#{time}</time></footer><div class='content'><p>#{ value }</p></div></article>"
    
    $(".messages").forEach (el) ->
      el.scrollTop = el.scrollHeight
  
  
  # Attemt at resizing viewport when keyboard is visible
  updateBody = ->
    document.body.style.height = "#{window.innerHeight}px"
    window.scrollTo(0,0)
  $('textarea').bind 'focus', ->
    updateBody()
  $('textarea').bind 'blur', ->
    updateBody()
  