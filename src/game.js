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

   extend : function(preObject) {
      var object = Object.create(this);

      for(var index in preObject) {
         object[index] = preObject[index];
      }

      return object;
   }

};

var Player = Gamepiece.extend({
   type : 'player',
   src : "night.min.gif"
});

Game.add(Player);

var Wall = Gamepiece.extend({
   src : 'wall.min.gif'
});

Mousetrap.bind(["left", "h"], function() {
   Player.fliped = true;
   Player.moveRel(-32, 0);
}, 'keyup');

Mousetrap.bind(["right", "l"], function() {
   Player.fliped = false;
   Player.moveRel(32, 0);
}, 'keyup');

Mousetrap.bind(["up", "k"], function() {
   Player.moveRel(0, -32);
}, 'keyup');

Mousetrap.bind(["down", "j"], function() {
   Player.moveRel(0, 32);
}, 'keyup');

Mousetrap.bind(["y"], function() {
   Player.fliped = true;
   Player.moveRel(-32, -32);
}, 'keyup');

Mousetrap.bind(["u"], function() {
   Player.fliped = false;
   Player.moveRel(32, -32);
}, 'keyup');

Mousetrap.bind(["n"], function() {
   Player.fliped = true;
   Player.moveRel(-32, 32);
}, 'keyup');

Mousetrap.bind(["m"], function() {
   Player.fliped = false;
   Player.moveRel(32, 32);
}, 'keyup');

Mousetrap.bind(["?"], function() {

   help = [
      "---Controls---",
      "arrow keys - move",
      "~ or ~",
      "h - left",
      "j - down",
      "k - up",
      "l - right",
      "y - up-left",
      "u - up-right",
      "n - down-left",
      "m - down-right",
      "",
      "---GamePlay---",
      "move twards an enemy to attack"];

   TextBox.push(help.join("<br />"));
}, 'keyup');
