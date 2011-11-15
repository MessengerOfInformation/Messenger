# © WTFPL @ harrison

(($) ->
  "use strict"
  # zepto has no trim (native in targeted browsers), fall-back to jQuery
  trim = (str) -> if ''.trim then str.trim() else $.trim str

  $.fn.autogrow = ( fn, opts = {} ) ->
    # if fn is a func, stick it in the options
    # else we presume there is no callback, and the first argument is options
    if typeof fn is "function" then opts.fn = fn else opts = fn

    # default options (opts)
    # set to false on mobile
    # prevents sending when hitting the enter key
    defaults =
      allowEnter : true
      
    # create a new autogrow instance for each matched selector element
    @each (i, el) ->
      new Autogrow $(el), $.extend defaults, opts
  
  class Autogrow
    constructor : ( @$el, @options ) ->
      # pointer to the pure dom node
      @el = @$el[0]
      # set css, shouldn't be resiable, set transition and hide overflow y
      @el.style["resize"] = "none"
      @el.style["webkitTransition"] = "height .3s"
      @el.style["overflowY"] = "hidden"
      
      @$form = @$el.parent("form")
      @$submit = @$form.find("[type=submit]")
      
      # bind events
      @$el.bind "keypress", ( e ) =>
        input = e.target.value
        @setHeight trim input
        @handleInput e, input
      # submit on the parent form, if there is such a thing
      @$form.bind "submit", ( e ) =>
        input = @el.value
        @handleInput e, input
      
      # display triggered event from @triggerOutput
      # @$el.bind "onMessage", ( e ) -> console.log e.data
      
      # store max-height as integer, we wan't to track if we exceed this, 
      # if we do, make overflow y visible
      @maxHeight = parseInt @$el.css("max-height"), 10
      # store the current element height for reference
      @elHeight = 0
    
    # setheight takes input, if falsy, remove height
    # if scrollTop is above 0, ->
    # set height to outer element height + scrollTop
    # handle overflow
    setHeight : ( input ) ->
      unless input
        @el.style["height"] = ""
        return @elHeight = 0

      scrollHeight = @el.scrollHeight
      height = @el.getBoundingClientRect().height or @$el.outerHeight()
      # some shit.. need to look into this
      unless @heightDiff
        @heightDiff = (scrollHeight - height) or 0
      if scrollHeight > height
        @elHeight = scrollHeight - @heightDiff
        @el.style["height"] = @elHeight + "px"
      
      # handle overflow state
      # if maxheigt is set, and we exceed it
      # show overflow (scroll)
      if @maxHeight and @elHeight > @maxHeight
        @el.style["overflowY"] = "visible"
      # hide it if it's visible
      else if @maxHeight and @el.style["overflowY"] is "visible"
        @el.style["overflowY"] = "hidden"
    
    # takes a event and input
    # if enter was pressed, or submit triggerd, proceeed
    # prevent def. behaviour. if input, triggerOutput
    # empty the dom element value, focus input, and setHeight (reset)
    handleInput : ( e, input ) ->
      if e.keyCode is 13 or e.type is "submit"
        e.preventDefault()
        trimmed = trim input        
        submitAllowed = (e.type is "submit" or @options.allowEnter)
        if trimmed and submitAllowed
          @triggerOutput input
          @el.value = ""
          @el.focus()
          @setHeight false
        
        if trimmed and submitAllowed is false
          @el.value += "\r"
          @setHeight true
    # takes a input and creates a obj with time and value
    # triggers "onMessage" on the bound element
    # if we had a callback function, send the message there too
    triggerOutput : ( input ) ->
      message =
        time : + new Date()
        value : input
      @$el.trigger "onMessage", message
      @options.fn message if @options.fn
      message
    
) @Zepto or @jQuery