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

var Gamepiece = {
   x : 0,
   y : 0,
   id : null,
   className : "fixed trans",

   // create the dom element for this peice
   create: function() {
      this.el           = document.createElement("img");
      this.el.className = this.el.className;
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
   },

   setSprite : function (src) {
      this.src = src;
   }

};

var Player = Object.create(Gamepiece);
Player.setSprite("night.min.gif");

Game.add(Player);

var Wall = Object.create(Gamepiece);

Wall.setSprite('wall.min.gif');


Mousetrap.bind(["left", "h"], function() {
   Player.fliped = true;
   Player.moveRel(-32, 0);
});

Mousetrap.bind(["right", "l"], function() {
   Player.fliped = false;
   Player.moveRel(32, 0);
});

Mousetrap.bind(["up", "k"], function() {
   Player.moveRel(0, -32);
});

Mousetrap.bind(["down", "j"], function() {
   Player.moveRel(0, 32);
});

Mousetrap.bind(["y"], function() {
   Player.fliped = true;
   Player.moveRel(-32, -32);
});

Mousetrap.bind(["u"], function() {
   Player.fliped = false;
   Player.moveRel(32, -32);
});

Mousetrap.bind(["n"], function() {
   Player.fliped = true;
   Player.moveRel(-32, 32);
});

Mousetrap.bind(["m"], function() {
   Player.fliped = false;
   Player.moveRel(32, 32);
});
