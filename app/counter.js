// tracks how many people are in reach room

var counts = {};

module.exports = {
  incr: room => {
    if (counts[room]) {
      counts[room] += 1;    
    }
    else {
      counts[room] = 1;
    }
    return counts[room];
  },
  decr: room => {
    if (counts[room]) {
      counts[room] -= 1;    
      return counts[room];
    }
    else {
      throw new Error(`Room ${room} doesn't exist`);
    }
  },
  count: room => {
    return counts[room] || 0;
  }
};