/* BEER LIST */
var Beer = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  handleClick: function(e) {
    e.preventDefault();
    this.props.onBeerSelect(this.props.data);
  },
  render: function() {
    return (
      <a className="beer" onClick={this.handleClick}>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </a>
    );
  }
});

var BeerForm = React.createClass({
  getInitialState: function() {
    return {name: ''};
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    if (!name) {
      return;
    }
    this.props.onBeerSubmit({name: name});
    this.setState({name: ''});
  },
  render: function() {
    return (
      <form className="beer-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Beer name"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input type="submit" value="Add" disabled={this.state.name.length === 0}/>
      </form>
    );
  }
});

var BeerList = React.createClass({
  render: function() {
    var obs = this.props.onBeerSelect;
    var beerNodes = this.props.data.map(function(beer){
      return (
        <Beer key={beer.id} data={beer} onBeerSelect={obs}>
          {beer.name}
        </Beer>
      );
    });
    return (
      <div className="beer-list">
        <BeerForm onBeerSubmit={this.props.onBeerSubmit}/>
        {beerNodes}
      </div>
    );
  }
});

/* BEER RATING */
var RatingTable = React.createClass({
  render: function() {
    var ratingNodes = this.props.data.map(function(rating){
      return (
        <tr key={rating.id}>
          <td>{rating.author}</td>
          <td className="text-center">{rating.rating}</td>
          <td>{rating.comment}</td>
        </tr>
      );
    });
    return (
      <table className="rating-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
         {ratingNodes}
        </tbody>
      </table>
    );
  }
});

var RatingForm = React.createClass({
  getInitialState: function() {
    return {author: '', rating: 0, comment: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleRatingChange: function(e) {
    this.setState({rating: e.target.value});
  },
  handleCommentChange: function(e) {
    this.setState({comment: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var comment = this.state.comment.trim();
    var rating = parseInt(this.state.rating);
    if(!author || rating <= 0){
      return;
    }
    this.props.onRatingSubmit({author: author, rating: rating, comment: comment});
    this.setState({author: '', rating: 0, comment: ''});
  },
  render: function() {
    return (
      <form className="beer-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <br/>
        <select 
          value={this.state.rating}
          onChange={this.handleRatingChange}
        >
          <option value="0">Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <br/>
        <textarea
          placeholder="Comment"
          value={this.state.comment}
          onChange={this.handleCommentChange}
        />
        <br/>
        <input type="submit" value="Add" disabled={this.state.author.length === 0 || this.state.rating < 1}/>
      </form>
    );
  }
});

var BeerRating = React.createClass({
  handleRatingSubmit: function(rating) {
    this.props.onRatingSubmit(this.props.beer, rating);
  },
  render: function() {
    return (
      <div className="beer-rating">
        <h2>{this.props.beer.name}</h2>
        <RatingTable data={this.props.ratings}/>
        <br/>
        <h4>Rate this beer</h4>
        <RatingForm onRatingSubmit={this.handleRatingSubmit}/>
      </div>
    );
  }
});

/* APP */
var BeerRatingApp = React.createClass({
  handleBeerSubmit: function(beer) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: beer,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },  
  handleBeerSelect: function(beer) {
    var url = '/api/beers/' + beer.id + '/ratings.json'
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({selected_beer: beer, ratings: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  handleRatingSubmit: function(beer, rating) {
    var url = '/api/beers/' + beer.id + '/ratings.json'
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: rating,
      success: function(data) {
        this.setState({ratings: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },  
  getInitialState: function() {
    return {data: [], selected_beer: {name: ''}, ratings: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data, selected_beer: data[0]});
        this.handleBeerSelect(data[0]);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="beer-rating-app">
        <h1>Beer Ratings</h1>
        <BeerList data={this.state.data} onBeerSubmit={this.handleBeerSubmit} onBeerSelect={this.handleBeerSelect}/>
        <BeerRating beer={this.state.selected_beer} ratings={this.state.ratings} onRatingSubmit={this.handleRatingSubmit}/>
      </div>
    );
  }
});

ReactDOM.render(
  <BeerRatingApp url="/api/beers.json" />,
  document.getElementById('content')
);