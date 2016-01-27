require 'webrick'
require 'json'

port = ENV['PORT'].nil? ? 3000 : ENV['PORT'].to_i

puts "Server started: http://localhost:#{port}/"

root = File.expand_path './public'
server = WEBrick::HTTPServer.new Port: port, DocumentRoot: root

class JsonHandler < WEBrick::HTTPServlet::AbstractServlet
  def json_prepare(str)
    str.encode("UTF-8", {:invalid => :replace, :undef => :replace})
  end
  
  def prevent_caching(res)
    res['ETag']          = nil
    res['Last-Modified'] = Time.now + 100**4
    res['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
    res['Pragma']        = 'no-cache'
    res['Expires']       = Time.now - 100**4
  end
  
  def do_GET(req, res)
    if req.path.end_with?('.json')
      res['Content-Type'] = 'application/json'
      if req.path == '/api/beers.json'
        beers = JSON.parse(File.read('./data/beers.json', encoding: 'UTF-8'))
        res.body = JSON.generate(beers)
      else
        pat = req.path.match '/api/beers/([a-zA-Z0-9_]*)/ratings.json'
        if pat && pat[1]
          ratings = JSON.parse(File.read("./data/ratings_#{pat[1]}.json", encoding: 'UTF-8'))
          res.body = JSON.generate(ratings)
        end
      end
    else
      super
    end
    prevent_caching(res)
  end

  def do_POST(req, res)
    if req.path.end_with?('.json')
      res['Content-Type'] = 'application/json'
      if req.path == '/api/beers.json'
        beers = JSON.parse(File.read('./data/beers.json', encoding: 'UTF-8'))
        data = req.query
        if data.empty?
          data = JSON.parse(req.body, encoding: 'UTF-8')
        end
        beer = {id: beers.size + 1, name: json_prepare(data['name'])}
        beers << beer
        File.write(
          './data/beers.json',
          JSON.pretty_generate(beers, indent: '  '),
          encoding: 'UTF-8'
        )
        File.write(
          "./data/ratings_#{beer[:id]}.json",
          JSON.pretty_generate([], indent: '  '),
          encoding: 'UTF-8'
        )
        res.body = JSON.generate(beers)
      else
        pat = req.path.match '/api/beers/([a-zA-Z0-9_]*)/ratings.json'
        if pat && pat[1]
          ratings = JSON.parse(File.read("./data/ratings_#{pat[1]}.json", encoding: 'UTF-8'))
          data = req.query
          if data.empty?
            data = JSON.parse(req.body, encoding: 'UTF-8')
          end
          rating = {id: ratings.size + 1, author: json_prepare(data['author']), rating: data['rating'] , comment: json_prepare(data['comment'])}
          ratings << rating
          File.write(
            "./data/ratings_#{pat[1]}.json",
            JSON.pretty_generate(ratings, indent: '  '),
            encoding: 'UTF-8'
          )
          res.body = JSON.generate(ratings)
        end
      end
    end
    prevent_caching(res)
  end
end

server.mount "/api", JsonHandler , './'
trap('INT') { server.stop }
server.start

