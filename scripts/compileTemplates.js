var exec   = require('child_process').exec
var sys    = require('sys')
child = exec('handlebars  js/templates/* -f js/compiled/templates.js')
child.stdout.on('data', function(data) { 
  sys.print(data) 
})