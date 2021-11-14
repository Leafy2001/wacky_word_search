var map = {};

var SolveManager = {
  initialize: function() {
    // Map dictionary words.
    for (var i = 0; i < words.length; i++) {
      // Map the first 3 letters, then the rest.
      var word = words[i].toUpperCase();
      if (word.length >= 3) {
        // The first entry to the map is the first 3 letters of a word.
        var key = word.slice(0, 3).toUpperCase();
        map[key] = map[key] || {};

        // The full dictionary words are organized under their 3 letter starting phrase.
        map[key][word] = i;
      }
    }
  },

  // Returns all valid words in a Boggle game.
  solve: function(board, callback) {
    var result = [];

    // Initialize the dictionary map.
    SolveManager.initialize();

    for (var y=0; y<board.length; y++) {
      for (var x=0; x<board[0].length; x++) {
        if (callback) {
          callback({ status: 'Solving position ' + x + ', ' + y + ' (' + board[y][x] + ')', results: result.sort(function(a, b) { return b.score - a.score }) });
        }

        var words = SolveManager.solvePosition(board, x, y, callback);
        result = result.concat(words);
      }
    }
  
    self.postMessage({ status: 'Complete!', done: true, results: result.sort(function(a, b) { return b.score - a.score }) });
    self.close();
  },

  // Returns all valid words from a starting point on the board.
  solvePosition: function(board, x, y, callback) {
    var result = [];
    var iteration = 0;

    // Create a root node for our starting letter.
    var root = { val: board[y][x], x: x, y: y, children: [], used: [], length: 1, string: board[y][x] };
    root.used[y + ',' + x] = 1;

    // Add the root to the fringe.
    var fringe = [ root ];

    // Loop over the fringe for as long as there are child paths to explore.  
    var current = fringe.pop();
    while (current) {
      // Find all adjacent tiles.
      current = SolveManager.adjacent(board, current.x, current.y, current);

      // Go through each child path and check if it's valid, a solution, or should stop exploring further on this path.
      for (var i=0; i<current.children.length; i++) {
        var node = current.children[i];

        // Check if the path is at least 3 letters long.
        if (node.key) {
          // Check if the first 3 letters form a valid word.
          if (map[node.key]) {
            // Check if the entire word is a dictionary term.
            var word = current.children[i].string;

            if (map[node.key][word]) {
              // Found a word, calculate its score.
              var score = 1;
              if (word.length > 4) {
                switch(word.length) {
                  case 5: score = 2; break;
                  case 6: score = 3; break;
                  case 7: score = 5; break;
                  default: score = 11; break;
                };
              }

              result.push({ word: word, score: score });
              
              if (callback) {
                callback({ status: 'Found ' + current.children[i].string, result: { word: word, score: score } });
              }
            }
          }
          else {
            // This is an invalid word, not present in the dictionary. Do not search any further down this path.
            continue;
          }
        }

        // Add this node to be explored.
        fringe.push(node);
      }
      
      current = fringe.pop();
    }
      
    return result;
  },

  copy: function(used) {
    var copy = [];

    for (var prop in used) {
      // Make sure the object has this value, and not its prototype.
      if (used.hasOwnProperty(prop)) {
        copy[prop] = used[prop];
      }
    }

    return copy;
  },

  createNode: function(board, x, y, head) {
    // Create a new node for this letter.
    var node = { val: board[y][x], x: x, y: y, children: [], used: SolveManager.copy(head.used), length: head.length + 1, key: head.key }

    // Set this letter as visited for this path.
    node.used[y + ',' + x] = 1;

    // Set the chain of letters (word) up to this point.
    node.string = head.string + node.val;

    // If we've reached at least 3 letters, assign it as a key into the dictionary.
    if (node.string.length === 3) {
      node.key = node.string;
    }

    return node;
  },

  // Returns adjacent letters of the specific letter.
  adjacent: function(board, x, y, head) {
    var width = board[0].length;
    var height = board.length;
    
    // Add all adjacent letters as child nodes.
    if (x-1 > -1 && !head.used[y + ',' + (x-1)]) {
      head.children.push(SolveManager.createNode(board, x-1, y, head));
    }
    if (x+1 < width && !head.used[y + ',' + (x+1)]) {
      head.children.push(SolveManager.createNode(board, x+1, y, head));
    }
    if (y-1 > -1 && !head.used[(y-1) + ',' + x]) {
      head.children.push(SolveManager.createNode(board, x, y-1, head));
    }
    if (y+1 < height && !head.used[(y+1) + ',' + x]) {
      head.children.push(SolveManager.createNode(board, x, y+1, head));
    }
    if (x-1 > -1 && y-1 > -1 && !head.used[(y-1) + ',' + (x-1)]) {
      head.children.push(SolveManager.createNode(board, x-1, y-1, head));
    }
    if (x-1 > -1 && y+1 < height && !head.used[(y+1) + ',' + (x-1)]) {
      head.children.push(SolveManager.createNode(board, x-1, y+1, head));
    }
    if (x+1 < width && y-1 > -1 && !head.used[(y-1) + ',' + (x+1)]) {
      head.children.push(SolveManager.createNode(board, x+1, y-1, head));
    }
    if (x+1 < width && y+1 < height && !head.used[(y+1) + ',' + (x+1)]) {
      head.children.push(SolveManager.createNode(board, x+1, y+1, head));
    }
    
    return head;
  }
};

// Listen for web worker messages.
addEventListener('message', function(event) {
  if (event.data.board) {
    SolveManager.solve(event.data.board, function(data) {
      postMessage(data);
    });
  }
});