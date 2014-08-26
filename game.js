var Room = {
   nextId : 0,
   peices : [],
   el : document.getElementById("room"),
   add : function(object) {
      object.create();
      this.el.appendChild(object.el);
      if(object.id === null) {
         object.id = this.nextId;
         this.nextId++;
      }
      this.peices[this.nextId] = object;
   },
   remove : function(object) {
      this.el.removeChild(object.el);
      delete peices[object.id];
   }
};



var Block = {
   x : 0,
   y : 0,
   id : null,
   className : "fixed trans",
   create: function() {
      this.el = document.createElement("img");
      this.el.className = this.el.className;
      this.step();
   },

   step: function () {
      this.el.style.left = this.x +"px";
      this.el.style.top = this.y + "px";
      var fliped =  this.fliped ? " fliped" : "";
      this.el.className = this.className + fliped;
   },

   move : function (x,y) {
      this.x = x;
      this.y = y;
      this.step();
   },

   moveRel : function (x,y) {
      this.x += x;
      this.y += y;
      this.step();
   },

   setSprite : function (src) {
      this.el.src = src;
   }

};

var Night = Object.create(Block);


Mousetrap.bind("left", function() {
   Night.fliped = true;
   Night.moveRel(-32, 0);
});

Mousetrap.bind("right", function() {
   Night.fliped = false;
   Night.moveRel(32, 0);
});

Mousetrap.bind("up", function() {
   Night.moveRel(0, -32);
});

Mousetrap.bind("down", function() {
   Night.moveRel(0, 32);
});

Room.add(Night);
Night.setSprite("night.gif");


var GamePeice = function () {

};


