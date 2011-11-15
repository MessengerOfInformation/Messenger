"use strict"

window.APP =
  views     : {}
  instances : {}

#############################################

$ ->
  
  APP.init()
  
  ScrollFix $(".list")[0]
  ScrollFix $(".messages")[0]
  
  # Bind slide screen actions
  $(".write").bind "fastTap", ->
    slideUpAntimator.slide("up")
  
  $(".close").bind "fastTap", ->
    slideUpAntimator.slide("down")
  
  # --------------
  
  # Prevent touchmove on footer and header
  $(".header").bind "touchmove", (e) ->
    e.preventDefault()
  $(".footer").bind "touchmove", (e) ->
    e.preventDefault()

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
  
  # message output event
  $(".sms_input").on "onMessage", (e, data) ->
    time = convertSMSTime data.time
    value = data.value
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
  