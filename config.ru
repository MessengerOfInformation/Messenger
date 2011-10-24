require 'rubygems'
require 'rack'
require 'rack/contrib'
#require 'rack-offline'

use Rack::ETag

#match "/manifest.appcache" => Rails::Offline
run Rack::Directory.new('.')