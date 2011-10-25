(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<button class=\"";
  stack1 = helpers.type || depth0.type
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "type", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  stack1 = helpers.scope_button || depth0.scope_button
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "scope_button", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</button>\n<h1>";
  stack1 = helpers.header || depth0.header
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h1>\n<button class=\"";
  stack1 = helpers.type || depth0.type
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "type", { hash: {} }); }
  buffer += escapeExpression(stack1) + " ";
  stack1 = helpers.variant || depth0.variant
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "variant", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  stack1 = helpers.action_button || depth0.action_button
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "action_button", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</button>";
  return buffer;});
templates['list_search'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", self=this;


  return buffer;});
templates['message'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<footer>\n  <time>";
  stack1 = helpers.time || depth0.time
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "time", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</time>\n</footer>\n\n<div class=\"content ";
  stack1 = helpers.messenger || depth0.messenger
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "messenger", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n  <p>";
  stack1 = helpers.message || depth0.message
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "message", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n</div>";
  return buffer;});
templates['message_footer'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var self=this;


  return "<form class=\"footer\" id=\"slideform\">\n  <button tabindex=\"-1\" class=\"icon camera\">C</button>\n  <textarea placeholder=\"Message\" type=\"text\" tabindex=\"-1\" class=\"sms_input search_style\"></textarea>\n  <button tabindex=\"-1\" class=\"green\" type=\"submit\">Send</button>\n</form>\n";});
templates['row'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"box vertical flex\">\n  <header class=\"box\">\n    <h1>";
  stack1 = helpers.header || depth0.header
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h1>\n    <time>";
  stack1 = helpers.time || depth0.time
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "time", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</time>\n  </header>\n  <p>";
  stack1 = helpers.message || depth0.message
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "message", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n</div>\n<div class=\"box center arrow\">A</div>";
  return buffer;});
})()