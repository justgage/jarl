var Game = {
   // rooms data
   nextId : 0,
   pieces : [],
   el : document.getElementById("room"),

   // add an object to the room
   add : function(object) {

      object.create();

      if(object.id === null) {
         object.id = this.nextId;
         this.pieces[this.nextId] = object;
         this.nextId++;
      } else {
         this.pieces[object.id] = object;
      }

      this.show(object);
   },

   addAll : function(array) {
      for (var i = 0, len = array.length; i < len; i++) {
         this.add(array[i]);
      }
   },
   
   // remove piece from room
   remove : function(object) {
      this.el.removeChild(object.el);
      delete this.pieces[object.id]; 
   },

   // remove piece from dom
   hide : function(object) {
      this.el.removeChild(object.el);
   },

   // show piece in dom
   show : function(object) {
      this.el.appendChild(this.pieces[object.id].el);
   },

   step : function () {
      for (var i = 0, len = this.pieces.length; i < len; i++) {
         this.pieces[i].step();
      }
   },
};

var TextBox = {
   el : document.getElementById("text"),
   last : null, // the last element pushed
   push : function (text) {
      var message = document.createElement("div");
      message.innerHTML = text;
      message.className = "mess";

      this.el.insertBefore(message, this.last);
      this.last = message;
   }
};

TextBox.push('Wellcome to jarl <br> push "?" for instructions');
TextBox.push('You entered level 1');


var Extendable = {
   extend : function(preObject) {
      var object = Object.create(this);

      for(var index in preObject) {
         object[index] = preObject[index];
      }

      if ("construct" in object) {
         object.construct();
      }

      return object;
   }
};

var Gamepiece = Extendable.extend({
   x : 0,
   y : 0,
   id : null,
   className : "fixed trans",

   // create the dom element for this peice
   create: function() {
      this.el           = document.createElement("img");
      this.el.className = this.className;
      this.el.src       = this.src;
      this.step();
   },

   // this is called to update the Game Piece
   step: function () {
      var fliped         = this.fliped ? " fliped" : "";
      this.el.style.left = this.x +"px";
      this.el.style.top  = this.y + "px";
      this.el.className  = this.className + fliped;
   },

   move : function (x,y) {
      this.x = x;
      this.y = y;
      this.step();
   },

   // move relitive
   moveRel : function (x,y) {
      this.x += x;
      this.y += y;
      this.step();
   }
});

var Player = Gamepiece.extend({
   type : 'player',
   src : "night.min.gif"
});

Game.add(Player);

var Wall = Gamepiece.extend({
   src : 'wall.min.gif'
});

var Door = Gamepiece.extend({
   src : 'doorClosed.min.gif'
});

var Room = Extendable.extend({


   // grid : 2d array
   // grid[x][y]

   /**
    * doorObj = {
    *    left : door
    *    right : null
    *    top : "hidden" (invisible door)
    *    bottom : null
    * }
    *
    */
   init : function(height, width, doorObj) {
      this.x = 0;
      this.y = 0;
      this.height = height;
      this.width = width;

      this.grid = [];

      // populate grid with null
      for (var i = 0; i < width; i++) {
         this.grid[i] = [];
         for (var j = 0; j < height; j++) {
            this.grid[i][j] = null;
         }
      }

      this.doorObj = doorObj;

      this.createWalls();
   },

   createWalls : function() {
      //top
      this.createHozWall(0, this.doorObj.top)

      //bottom
      this.createHozWall(this.height-1, this.doorObj.bottom)

      //left
      this.createVertWall(0, this.doorObj.left)

      //right
      this.createVertWall(this.width-1, this.doorObj.right)
   },

   addObj : function(obj) {
      obj.currentRoom(this);
   },

   checkSpot : function(x,y) {
      this.grid[x][y];
   },

   createVertWall : function(x, door) {
      var i = this.height;

      while(i--) {
         this.grid[x][i] = "wall";
      }

      // add the door if needed
      if (door !== null) {
         this.grid[x][Math.floor(this.height/2)] = door;
      }
   },

   createHozWall : function(y, door) {
      var i = this.width;

      while(i--) {
         this.grid[i][y] = "wall";
      }

      // add the door if needed
      if (door !== null) {
         this.grid[Math.floor(this.width/2)][y] = door;
      }
   },

   create : function() {
      this.el = document.createElement("canvas");
   },

   log : function() {
      // populate grid with null

      var text = "";
      for (var i = 0; i < this.width; i++) {
         var line = "";
         for (var j = 0; j < this.height; j++) {
            var spot = this.grid[i][j];
            var letter;

            switch (spot) {
               case 'wall':
                  letter = "w"
                  break;
               case 'door':
                  letter = "d"
                  break;
               case 'hidden':
                  letter = "h"
                  break;
               case null:
                  letter = "."
                  break;
               default:
                  letter = "?"
            }

            line += letter;
         }
         text += line + "\n";
      }

      console.log(text);

   },

   /**
    * applys a function to all the objects 
    */
   apply : function(func) {

   }


});

function RoomTest() {

room = Room.extend({});

room.init(20, 20, {
   top : null,
   bottom : "door",
   left : "hidden",
   right : "door"
});

room.log();

}

/**
 * Generates a level
 */
var LevelGen = Extendable.extend({
   depth : 5,
   branchChanse : 0.5,
   begin : function() {

      var root = Room.extend({
         type : "begining",
         depth : this.depth
      });

      var parent = {
         placement : "bottom",
         ref : root
      };

      var firstRoom = this.roomGen(parent, true);

      var firstDoor = Door.extend( {
         ref : firstRoom
      });

      var width = Math.floor(Math.random()*50) + 5;
      var height = Math.floor(Math.random()*50) + 5;

      root.init(width, height, {
         top : Door.extend({
            ref : firstDoor
         })
      });

      return root;
   },
   // generates a random graph of rooms
   roomGen : function(parent, isRightPath) {
      var doors = { 
         up : null,
         down : null,
         left : null,
         right : null
      };

      var room = Room.extend({
         depth : parent.ref.depth - 1,
         isRightPath : isRightPath,
         type : "random"
      });

      console.log("generate room at depth: ", parent.ref.depth);

      // replace door with parent
      doors[parent.ref.placement] = Door.extend({
         ref : parent.ref
      });

      var directions = [
         "up",
         "down",
         "left",
         "right"
      ];

      // if we aren't too deep yet
      if (parent.ref.depth > 1) {

         // if this is the right path
         if (isRightPath) {

            // select a random direction
            var dirNum = Math.floor(Math.random() * 4);

            // check to make sure it's not ocupied
            while(doors[directions[dirNum]] !== null) {
               // select a different one
               dirNum = Math.floor(Math.random() * 4);
            }

            // place the right door path
            doors[directions[dirNum]] = 
               Door.extend({ ref : this.roomGen({
               placement : directions[(dirNum + 2) % 4],
               ref : room
            }, true)});
         };

         // go through the directions
         // and create other offshoots from the right path
         for(wayName in doors) {
            var make = Math.random() > 0.5;

            //if we should make it and it's not taken
            if (make && doors[wayName] === null) {
               // create the door and the room behind it
               doors[wayName] = 
                  Door.extend({ref :this.roomGen({
                  // opposite side
                  placement : directions[(directions.indexOf(wayName) + 2) % 4],
                  ref : room
               }, false)});
            }
         }
      } else if(isRightPath) { 
         room.type = "end";
      }

      var width = Math.floor(Math.random()*50) + 5;
      var height = Math.floor(Math.random()*50) + 5;

      room.init(height, width, doors);

      return room;
   }
})

var firstRoom = LevelGen.begin();

firstRoom.log();

