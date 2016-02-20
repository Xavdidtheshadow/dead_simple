// functions for generating color pairs

module.exports = {
  // ffffff
  max: 16777215,
  color_pair: function() {

  },
  random_color: function() {
    return '#'+Math.floor(Math.random() * this.max).toString(16);
  }
};