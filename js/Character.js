//(function() {

window.game = window.game || { };

game.Character = function(pos, slotindex, iscorrect, character) {
    game.Thing.call(this, pos, [32,32], [0, 0]);
    this.slotindex = slotindex;
    this.iscorrect = iscorrect;
    this.character = character;
    
    // The character don't appear 3d so the reduced footprint looks odd.
    // Undo it.
    this.footprint = [this.size[0], this.size[1]];
}
game.Character.prototype = new game.Thing();
game.Character.prototype.constructor = game.Character;
 
game.Character.prototype.draw = function() {
    drawText(gContext, this.character, gWorld.textsize, 'yellow', this.pos[0], this.pos[1]);
};
game.Character.prototype.update = function(dt) {
};

//}());
