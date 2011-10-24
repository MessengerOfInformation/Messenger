Rack::Mime::MIME_TYPES.merge!({ ".appcache" => "text/cache-manifest" })

use Rack::Static, 
  :urls => ["/js", "/css", "/img"],
  :root => "."

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('./index.html', File::RDONLY)
  ]
}