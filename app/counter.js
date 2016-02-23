// tracks how many people are in reach room
// this should be persisted because it borks if the server restarts

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
    }
    else {
      counts[room] = 0;
      // throw new Error(`Room ${room} doesn't exist`);
    }
    return counts[room];
  },
  count: room => {
    return counts[room] || 0;
  }
};
