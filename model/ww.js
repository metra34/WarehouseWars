// Stage
// Note: Yet another way to declare a class, using .prototype.

function Stage(width, height, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player

	// the logical width and height of the stage
	this.width=width;
	this.height=height;
        this.numMonster = 0;

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	
	// Create a table of blank images, give each image an ID so we can reference it later
	var s='<table cellspacing=0 cellpadding=0>';
        //s+='<canvas>';
	
	for (i = 0; i<this.height; i++){
		s+=('<tr>');
		for (j = 0; j<this.width; j++){
                    
                        if (i===0 || j===0 || i===this.height-1 || j===this.width-1){
                            s+=('<td><img id="'+i+','+j+'" width="25" height="20" src="'+this.wallImageSrc+'"</td>');
                        } else {
                            s+=('<td><img id="'+i+','+j+'" width="25" height="20" src="'+this.blankImageSrc+'"</td>');
                        }
		}
		s+=('</tr>');
	}
	// YOUR CODE GOES HERE
        //s+='</canvas>';
	s+="</table>";
	// Put it in the stageElementID (innerHTML)
	document.getElementById("stage").innerHTML= s;
	// Add the player to the center of the stage
	this.player= new Actor(Math.floor(this.width/2), Math.floor(this.height/2), "player", null);
	this.actors.push(this.player);
	document.getElementById(this.player.getX()+","+this.player.getY()).src= this.playerImageSrc;
	
	// Add walls around the outside of the stage, so actors can't leave the stage
        
        this.numMonster = 0;
        var boxes = Math.round(this.height*this.width/4);
//        for (i=0;i<this.height;i++){
//            for (j=0;j<this.width;j++){
//                if (i===0 || j===0 || i===this.height-1 || j===this.width-1){
//                    document.getElementById(i+","+j).src= this.wallImageSrc;
//                } 
//                else if (i!==this.player.getY() && j!==this.player.getX()){
//                    var rand = Math.random() * 400;
//                    if (rand < 30 && this.numMonster < 10) {
//                        //monster
//                        var level = 1;
//                        if (this.numMonster%2===0){
//                            level = 2;
//                        } else if (this.numMonster%3===0){
//                            level = 3;
//                        }
//                        var k = new Actor(i, j, "monster", level);
//                        this.actors.push(k);
//                        document.getElementById(i+","+j).src= this.monsterImageSrc;
//                        this.numMonster++;
//                    } else if (rand < 170 && walls<101) {
//                        //box
//                        var k = new Actor(i, j, "box", null);
//                        this.actors.push(k);
//                        document.getElementById(i+","+j).src= this.boxImageSrc;
//                        walls++;
//                    }
//                }
//            }
//        }

	// Add some Boxes to the stage
        while (boxes>0){
            var x = Math.floor(Math.random()*this.width);
            var y = Math.floor(Math.random()*this.height);
            if (document.getElementById(x+","+y).src=== this.blankImageSrc){
                var k = new Actor(x, y, "box", null);
                this.actors.push(k);
                document.getElementById(x+","+y).src= this.boxImageSrc;
                boxes--;
            }
        }

	// Add in [12] Monsters
        while (this.numMonster<12){
            var x = Math.floor(Math.random()*this.width);
            var y = Math.floor(Math.random()*this.height);
            if (document.getElementById(x+","+y).src=== this.blankImageSrc){
                        var level = 1;
                        if (this.numMonster%2===0){
                            level = 2;
                        } else if (this.numMonster%3===0){
                            level = 3;
                        }
                        var k = new Actor(x, y, "monster", level);
                        this.actors.push(k);
                        document.getElementById(x+","+y).src= this.monsterImageSrc;
                        this.numMonster++;
            }
        }

};
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){ 
	return document.getElementById(x+","+y); 
};

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
};

Stage.prototype.getNumMonsters=function(){
    return this.numMonster;
};

Stage.prototype.alivePlayer= function(){
    if (this.player===null){
        return false;
    } else {
        return true;
    }
};

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
        document.getElementById(actor.getX()+","+actor.getY()).src=this.blankImageSrc;
        if (actor === this.player){
            this.player =null;
        } else if (actor.getType()==="monster"){
            this.numMonster--;
        }
	var remove = this.actors.indexOf(actor);
        if (remove > -1) {
            //console.log("remove: "+remove);
            this.actors.splice(remove, 1);
        }
};

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	return document.getElementById(x+","+y).src=src;
};

Stage.prototype.winCondition=function(){
    if (this.numMonster>0){
        return false;
    } else {
        return true;
    }
};

// Take one step in the animation of the game.  
Stage.prototype.step=function(){
    var dead = [];
    for (k = 0; k<this.actors.length; k++) {
        // each actor takes a single step in the game
        if (this.actors[k].getType() === "monster") {
            var i = 0;
            var chance = Math.random();
            if (chance < .75 && this.actors[k].getLevel === 2){
                //monster moves towards player
                if (!this.moveActor(this.actors[k], this.player.getX()-this.actors[k].getX(), this.player.getY()-this.actors[k].getY())){
                    if (!this.moveActor(this.actors[k], this.player.getX()-this.actors[k].getX(), 0)){
                        if (!this.moveActor(this.actors[k], 0, this.player.getY()-this.actors[k].getY())){
                            //console.log("couldn't move towards player");
                            if (this.isDead(this.actors[k])){
                                //console.log("adding to dead: "+this.actors[k]);
                                dead.push(this.actors[k]);
                            }
                        }
                    }
                }
                
            } else if (chance <.75 && this.actors[k].getLevel === 3){
                //monster moves away from player
                if (!this.moveActor(this.actors[k], this.actors[k].getX()-this.player.getX(), this.actors[k].getY()-this.player.getY())){
                    if (!this.moveActor(this.actors[k], 0, this.actors[k].getY()-this.player.getY())){
                        if (!this.moveActor(this.actors[k], this.actors[k].getX()-this.player.getX(), 0)){
                            //console.log("couldn't move away from player");
                            if (this.isDead(this.actors[k])){
                                dead.push(this.actors[k]);
                            }
                        }
                    }
                }
            }else {
                //random move
                while (i < 3) {
                var dx = Math.round(Math.random() * 2 - 1);
                var dy = Math.round(Math.random() * 2 - 1);
//                console.log("dx: "+ dx);
//                console.log("dy: "+ dy);
                if (this.moveActor(this.actors[k], dx, dy)) {
                    break;
                }
                i++;
                }
                if (i=== 3) {
                    //check if monster is trapped
                    if (this.isDead(this.actors[k])){
                         dead.push(this.actors[k]);
                    }              
                }
            }
            
        }
    }
    var c = dead.pop();
    while (c!==null && c!==undefined){
        this.removeActor(c);
        c=dead.pop();
    }
};

Stage.prototype.isDead=function(actor){
    //console.log("isDead called");
    var x = actor.getX();
    var y = actor.getY();
    
    for (i=-1;i<2;i++){
        for (j=-1;j<2;j++){
            if (i!==0 || j!==0){
                var xi = x+i;
                var yj = y+j
                var space = this.getStageId(x+i, y+j);
                //console.log("space.src: "+space.src);
                if (space.src !== this.wallImageSrc && space.src !== this.boxImageSrc && space.src!== this.monsterImageSrc){
                    return false;
                }
            }
            
        }
    }
    //console.log("isDead returns true");
    return true;
};

Stage.prototype.getImage2=function(){
     return this.boxImageSrc;
};

Stage.prototype.getImage=function(){
    return this.wallImageSrc;
};

Stage.prototype.movePlayer=function(dx, dy){
    this.moveActor(this.player, dx, dy);
};

Stage.prototype.moveActor=function(actor, dx, dy){
    var x = actor.getX()+dx;
    var y = actor.getY()+dy;
//    console.log("moveActor x: "+x);
//    console.log("moveActor y: "+y);
    if (this.isValidMove(x, y, actor)){
       
        oldX = actor.getX();
        oldY = actor.getY();
        if (actor.getType()==="monster"){
            this.setImage(x, y, this.monsterImageSrc);
//            console.log("image at: "+x+","+y+" before change: "+document.getElementById(x+","+y).src);
            //document.getElementById(x+","+y).src=this.monsterImageSrc;
//            console.log("Image should change to monster: "+ document.getElementById(x+","+y).src);
        } else if (actor.getType()==="box"){
            this.setImage(x, y, this.boxImageSrc);
        } else {
            this.setImage(x, y, this.playerImageSrc);
        }
//        console.log(consoleoldX+","+oldY+" old coor: should be blank now: ");
        this.setImage(oldX, oldY, this.blankImageSrc);
//        console.log(document.getElementById(oldX+","+oldY).src);
        actor.move(x,y);
        return true;
    }
    return false;
};

Stage.prototype.isValidMove = function(nX, nY, oldAct){
    //if box is moving
    // -> recursively call on other box
    // -> monster -> invalid
    // > white -> valid
    // -> wall -> invalid
    // if monster -> box -> invalid 
     //             -> monster -> invalid
     //              -> valid -> game over
     //if player -> box -> recursive call on box
     //          -> monster -> valid -> game over
     if ((nX===0 || nX===this.width-1 || nY===0 || nY===this.height-1)){
         //hit a wall
         //if a box hits a wall, it switches places with the player pushing it
         if (oldAct.getType()==="box"){
             var x = oldAct.getX();
             var y = oldAct.getY();
             var xplay = this.player.getX();
             var yplay = this.player.getY();
             oldAct.move(xplay, yplay);
             this.player.move(x,y);
             this.setImage(x,y,this.playerImageSrc);
             this.setImage(xplay,yplay,this.boxImageSrc);
             
         }
         return false;
     }
     var dest = this.getActor(nX, nY);
     if (dest===null){
         //empty space
         return true;
     } else if (oldAct.getType()==="box"){
         if (dest.getType()==="box"){
             //recursive call move
             this.moveActor(dest, dest.getX()-oldAct.getX(), dest.getY()-oldAct.getY());
         } else{
             //monster there
             return false;
         } 
     } else if (oldAct.getType()==="player"){
         if (dest.getType()==="box"){
             //recursive call box
             this.moveActor(dest, dest.getX()-oldAct.getX(), dest.getY()-oldAct.getY());
         } else if (dest.getType()==="monster"){
            //valid, game over 
            this.removeActor(this.player);
            //console.log("player is now: "+this.player);
            return true;
         }
     } else {
         // monster
         if (dest.getType()==="monster"){
             //this.moveActor(oldAct, oldAct.getX()-dest.getX(), oldAct.getY()-dest.getY());
             return false;
         } else if (dest.getType()==="box"){
             return false;
         } else if (dest.getType()==="player"){
             this.removeActor(this.player);
             return true;
         }
         
     }
     return false;
};

// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
        for (i=0; i<this.actors.length; i++){
            if (this.actors[i].getX()===x && this.actors[i].getY()===y){
                return this.actors[i];
            }
        }
	return null;
};

// End Class Stage

//actor class
function Actor(x, y, type, level){
	this.ActorX=x;
	this.ActorY=y;
	this.type = type;
        this.level = level;
}

Actor.prototype.getX=function(){
    return this.ActorX;
};

Actor.prototype.getY=function(){
    return this.ActorY;
};

Actor.prototype.getType=function(){
    return this.type;
};

Actor.prototype.toString=function(){
    return (this.type + " at ("+this.ActorX+","+this.ActorY+")");
};

Actor.prototype.move = function(newX, newY){
    this.ActorX = newX;
    this.ActorY = newY;
};

Actor.prototype.getLevel=function(){
    return this.level;
};
