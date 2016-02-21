// functions for generating color pairs

module.exports = {
  // ffffff
  max: 16777215,
  random_number: function() {
    return Math.floor(Math.random() * this.max);
  },
  inverse: function(i) {
    return this.max - i;
  },
  color: function(i) {
    return '#'+i.toString(16);
  },
  color_pair: function() {
    var c = this.random_number();
    return {
      color: this.color(c), 
      "background-color": this.color(this.inverse(c))
    };
  }
};
