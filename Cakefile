exec   = require('child_process').exec
sys    = require 'sys'
task 'w', 'watch all files and compile them as needed', (options) ->
  child = exec 'coffee -w -c -o js/compiled js/app'
  child.stdout.on 'data', (data) -> sys.print data