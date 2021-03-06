/*
 * This code does not come with any sort of warranty.
 * You are welcome to use it for whatever you like.
 */
(function() {

window.game = window.game || { };

var gQuestion = document.createElement("p");
var text = document.createTextNode("Questions will appear here");
gQuestion.appendChild(text);
document.body.appendChild(gQuestion);

gCanvas = document.createElement("canvas");
gContext = gCanvas.getContext("2d");
gCanvas.width = 512;
gCanvas.height = 480;
document.body.appendChild(gCanvas);

gWorld = {
    keyState: Array(),
    state: new game.StateManager(),
    images: new game.ImageManager(),
    sounds: new game.SoundManager(),
    player: new game.Player([gCanvas.width/2, gCanvas.height/2]),
    enemies: Array(),
    //projectiles: Array(),
    explosions: Array(),
    words: Array(),
    currentwords: Array(),
    currentquestion: '',
    characterpositions: Array([50, 80],
                              [50, 400],
                              [430, 80],
                              [430, 400]),
    loopCount: 0,
    score: 0,
    bestscore: 0,
    
    textcolor: 'White',
    textsize: '18pt Arial',
    
    then: Date.now(),
    now: 0,
    dt: 0
};
gWorld.state.setState(gWorld.state.states.LOADING);
gWorld.words['character'] = Array();
gWorld.words['pinyin'] = Array();
gWorld.words['english'] = Array();

function onKeyDown(event) {
    var state = gWorld.state.getState();
    if (state == gWorld.state.states.PREGAME || state == gWorld.state.states.END) {
        if (event.keyCode == 68) {
            newGame();
        }
    }
    gWorld.keyState[event.keyCode] = true;
}
function onKeyUp(event) {
    gWorld.keyState[event.keyCode] = false;
}
function onMouseClick(event) {
    /*var state = gWorld.state.getState();

    if (state == gWorld.state.states.INGAME) {
        var mouseX;
        var mouseY;
        if ( event.offsetX == null ) { // Firefox
            if (event.pageX || event.pageY) { 
              mouseX = event.pageX;
              mouseY = event.pageY;
            }
            else { 
              mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
              mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
            } 
            mouseX -= gCanvas.offsetLeft;
            mouseY -= gCanvas.offsetTop;
        } else {                       // Other browsers
           mouseX = event.offsetX;
           mouseY = event.offsetY;
        }
        target = [mouseX, mouseY];
        
        var playerX = gWorld.player.pos[0] + gWorld.player.size[0]/2;
        var playerY = gWorld.player.pos[1] + gWorld.player.size[1]/2;
        var vector = calcNormalVector(target, [playerX, playerY]);

        var pos = [gWorld.player.pos[0], gWorld.player.pos[1]];

        var projectile = new game.Projectile(pos, [vector[0]*100, vector[1]*100]);
        gWorld.projectiles.push(projectile);
    }*/
}
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);
gCanvas.addEventListener('click', onMouseClick);

function loadWords() {
	var traditionaloffset = 0;
	if (getParameterByName("traditional") == 1) {
		traditionaloffset = 1;
	}
	var files = ["./lang/HSK Official With Definitions 2012 L1.txt",
				 "./lang/HSK Official With Definitions 2012 L2.txt",
				 "./lang/HSK Official With Definitions 2012 L3.txt",
				 "./lang/HSK Official With Definitions 2012 L4.txt",
				 "./lang/HSK Official With Definitions 2012 L5.txt",
				 "./lang/HSK Official With Definitions 2012 L6.txt"];
	var filestouse = Array();
	for (var i in files) {
		var n = i;
		var name = "HSK"+(++n);
		if (getParameterByName(name)) {
			var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			/*xmlhttp.onreadystatechange = function() {
				if(xmlhttp.status==200 && xmlhttp.readyState==4) {
					console.log('response');
					//replace new lines with tabs then split on tabs.
				    var words = xmlhttp.responseText.replace(/(\r\n|\n|\r)/gm,"\t").split(/\t/g);
				    
				    var word = 0;
				    if (gWorld.words['character'].length > 0) {
				    	word = gWorld.words['character'].length;
					}
				    for (var i = 0; i < words.length; i += 5) {
				        gWorld.words['character'][word] = words[i];
				        gWorld.words['pinyin'][word] = words[i + 2];
				        gWorld.words['english'][word] = words[i + 4];
				        //console.log(gWorld.words['english'][word]);
				        word++;
				    }
				}
			}
			console.log('getting '+files[i]);
			xmlhttp.open("GET",files[i],true);
			xmlhttp.send();*/
			xmlhttp.onreadystatechange = function() {
				
			}
			xmlhttp.open("GET", files[i], false);
			xmlhttp.send();
			if(xmlhttp.status==200 && xmlhttp.readyState==4) {
				//replace new lines with tabs then split on tabs.
			    var words = xmlhttp.responseText.replace(/(\r\n|\n|\r)/gm,"\t").split(/\t/g);
			    
			    var word = 0;
			    if (gWorld.words['character'].length > 0) {
			    	word = gWorld.words['character'].length;
				}
			    for (var i = 0; i < words.length; i += 5) {
			    	if (words[i]) {
					    gWorld.words['character'][word] = words[i + traditionaloffset];
					    gWorld.words['pinyin'][word] = words[i + 2];
					    gWorld.words['english'][word] = words[i + 4];
					    //console.log(gWorld.words['character'][word]);
					    word++;
			        }
			    }
			}
		}
	}
}
loadWords();

function newGame() {
    gWorld.score = 0;
    gWorld.state.setState(gWorld.state.states.INGAME);
    nextCharacter();
    
    //gSounds.play("music", true);
}
function nextCharacter() {
    /*gWorld.currentword = getRandomInt(0, gWorld.words['english'].length);
    gWorld.wrongwords[0] = gWorld.wrongwords[1] = gWorld.wrongwords[2] = gWorld.currentword;
    
    for (var i = 0; i < gWorld.wrongwords.length; i++) {
        while (gWorld.wrongwords[i] == gWorld.currentword) {
            gWorld.wrongwords[i] = getRandomInt(0, gWorld.words['english'].length);
        }
    }*/
    var wordindex = 0;
    var correctslot = getRandomInt(0, 3);
    for (var i = 0; i < 4; i++) {
        wordindex = -1;
        while (wordindex == -1) {
            wordindex = getRandomInt(0, gWorld.words['english'].length - 1);
            if (gWorld.words['character'][wordindex] == "") {
                wordindex = -1;
            }
        }
        gWorld.currentwords[i] = new game.Character(gWorld.characterpositions[i],
                                                    i,
                                                    i == correctslot,
                                                    gWorld.words['character'][wordindex]);
        if (i == correctslot) {
            gWorld.currentquestion = gWorld.words['english'][wordindex];
            gQuestion.innerHTML = gWorld.words['english'][wordindex];
        }
    }

    gWorld.enemies = Array();
    //gWorld.projectiles = Array();
    //gWorld.explosions = Array();
    
    gWorld.player.pos = [gCanvas.width/2, gCanvas.height/2];
    
    spawnMonster();
}
function spawnMonster() {
    var n = 1;
    if (Math.random() < 0.4) {
        n = 2;
    }

    var door, pos, m;
    for (var i = 0;i< n;i++) {
        door = Math.floor(Math.random() * 4) + 1;

        if (door == 1) {
            pos = [-40, gCanvas.height/2];
        } else if (door == 2) {
            pos = [gCanvas.width/2, -40];
        } else if (door == 3) {
            pos = [gCanvas.width +10, gCanvas.height/2];
        } else if (door == 4) {
            pos = [gCanvas.width/2, gCanvas.height+10];
        }
        m = new game.Monster(pos);
        gWorld.enemies.push(m);
    }
}

function updateGame(dt) {
    if (gWorld.player) {
        gWorld.player.update(dt);
    }
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].update(dt);
    }
    /*for (var i = gWorld.projectiles.length - 1;i >= 0;i--) {
        if (gWorld.projectiles[i].update(dt) == false) {
            gWorld.projectiles.splice(i, 1);
        }
    }*/
    for (var i = gWorld.explosions.length - 1;i >= 0;i--) {
        if (gWorld.explosions[i].update(dt) == false) {
            gWorld.explosions.splice(i, 1);
        }
    }
}

function checkCollisions() {
    var m;
    for (var j = gWorld.enemies.length - 1; j >= 0;j--) {
        m = gWorld.enemies[j];
        
        if (m.collideThing(gWorld.player)) {
            gWorld.state.setState(gWorld.state.states.END);
            gQuestion.innerHTML = " ";
            gWorld.sounds.play("fail");
            return;
        }

        /*for (var i = gWorld.projectiles.length - 1;i >= 0;i--) {
            p = gWorld.projectiles[i];
        
            if (p.collideThing(m)) {
                //gWorld.sounds.play("explosion");
                gWorld.explosions.push(new game.Explosion(m.pos));
                gWorld.score++;
                gWorld.enemies.splice(j, 1);
                gWorld.projectiles.splice(i, 1);
                spawnMonster();
                continue;
            }
        }*/
    }
    var char, charexploder;
    for (var i in gWorld.currentwords) {
        char = gWorld.currentwords[i];
        if (char.collideThing(gWorld.player)) {
            //explode monsters
            for (var j = gWorld.enemies.length - 1; j >= 0;j--) {
                m = gWorld.enemies[j];
                gWorld.explosions.push(new game.Explosion(m.pos));
            }

            //explode the characters
            for (var j in gWorld.currentwords) {
                charexploder = gWorld.currentwords[j];
                gWorld.explosions.push(new game.Explosion(char.pos));
            }

            if (char.iscorrect) {
                gWorld.score++;
                nextCharacter();
                gWorld.sounds.play("success");
            } else {
                gWorld.state.setState(gWorld.state.states.END);
                gQuestion.innerHTML = " ";
                gWorld.sounds.play("fail");
            }
        }
    }
}

function drawInstructions(showImages) {
    drawText(gContext, "Chinese Character Challenge", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
    drawText(gContext, "Collect the correct character", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 200);
    drawText(gContext, "Avoid the goblins", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 240);
    drawText(gContext, "Press wasd to move", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 300);
    //drawText(gContext, "Use the mouse to aim and fire", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 350);
    if (showImages) {
        //gContext.drawImage(gImages.getImage('exit'), 40, gCanvas.height/2, gSettings.tilesize, gSettings.tilesize);
        //gContext.drawImage(gImages.getImage('starship'), gCanvas.width - 80, gCanvas.height/2, 30, 30);
    }
    drawText(gContext, "Press d to begin", gWorld.textsize, "white", gCanvas.width/3, 400);
}
function drawGame() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }
    
    var state = gWorld.state.getState();
    if (state == gWorld.state.states.LOADING) {
        drawInstructions(false);
        var total = gWorld.sounds.sounds.length + gWorld.images.images.length;
        var loaded = gWorld.sounds.numSoundsLoaded + gWorld.images.numImagesLoaded;
        if (loaded < total) {
            gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            var text = "Loading...    "+loaded+"/"+total;
            drawText(gContext, text, gWorld.textsize, gWorld.textcolor, gCanvas.width/5,400);
            //return;
        } else {
            gWorld.state.setState(gWorld.state.states.PREGAME);
        }
    } else if (state == gWorld.state.states.PREGAME) {
        drawInstructions(true);
    } else if (state == gWorld.state.states.INGAME) {
        gWorld.player.draw();
        /*for (var i in gWorld.projectiles) {
            gWorld.projectiles[i].draw();
        }*/
        for (var i in gWorld.enemies) {
            gWorld.enemies[i].draw();
        }
        for (var i in gWorld.explosions) {
            gWorld.explosions[i].draw();
        }
        drawText(gContext, gWorld.score, gWorld.textsize, gWorld.textcolor, 37, 55);

        for (var i in gWorld.currentwords) {
            gWorld.currentwords[i].draw();
        }
        
        //drawText(gContext, gWorld.currentquestion, gWorld.textsize, gWorld.textcolor, 200, 30);
    } else if (state == gWorld.state.states.END) {
        drawText(gContext, "Chinese Character Challenge", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
        drawText(gContext, "You got "+gWorld.score+" in a row.", gWorld.textsize, gWorld.textcolor, 150, 200);
        if (gWorld.score > gWorld.bestscore) {
            gWorld.bestscore = gWorld.score;
        }
        drawText(gContext, "Your best score is "+gWorld.bestscore, gWorld.textsize, gWorld.textcolor, 150, 240);
        drawText(gContext, "Press d to play again", gWorld.textsize, gWorld.textcolor, 150, 350);
        for (var i in gWorld.explosions) {
            gWorld.explosions[i].draw();
        }
    }
}

//executed 60/second
var mainloop = function() {
    state = gWorld.state.getState();
    //if (state == gWorld.state.states.INGAME) {
        gWorld.now = Date.now();
        if (gWorld.then != 0) {
            gWorld.dt = (gWorld.now - gWorld.then)/1000;
            
            gWorld.loopCount++;
            gWorld.loopCount %= 8; //stop it going to infinity

            updateGame(gWorld.dt);
            if (state == gWorld.state.states.INGAME) {
                checkCollisions();
            }
            drawGame();
        }
        gWorld.then = gWorld.now;
    //}
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );

}());
