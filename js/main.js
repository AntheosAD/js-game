let maps = [];
let game = {running: false, seqOver: false, level:1,delay: 500, startPos:{x:0, y:0}, endPos:{x:0, y:0}, size:{x:0, y:0}}
let player = {position:{x: 0, y: 0}, isDead: false, lives: 3}
let sequence = [];

document.addEventListener('DOMContentLoaded', async () => {

    //Get maps file from server
    //await GetMaps('http://localhost/game/maps.json');

    // Check if maps were loaded
    if(maps=[] || maps==null){
        console.log('No maps found!');

        //Set test maps if fetching failed
        maps=[ 
            [  
                [1,1,1,1,1,1,1],
                [1,0,0,0,1,2,1],
                [1,0,1,0,1,0,1],
                [1,3,1,0,0,0,1],
                [1,1,1,1,1,1,1]
            ],
            [  
                [1,1,1,1,1,1,1,1,1],
                [1,0,1,0,0,0,1,1,1],
                [1,2,0,0,1,0,0,0,1],
                [1,0,1,0,0,0,1,0,1],
                [1,1,1,1,1,1,1,0,1],
                [1,1,1,1,0,0,0,0,1],
                [1,0,0,0,0,1,0,1,1],
                [1,0,1,1,1,1,0,1,1],
                [1,3,0,0,0,0,0,1,1],
                [1,1,1,1,1,1,1,1,1]
            ],
            [
                [1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,2,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,3,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
        ];
    }

    //Initiate the first level
    Init(game.level);

    //Handle play/stop button
    document.querySelector('.controll-play').addEventListener("click", ()=>{
       togglePlay();
    });

    //Play/Stop game
    const togglePlay = ()=>{
        if(!player.isDead){
            if(!game.running)InitiateSequence(sequence);
            document.querySelector('.controll-play').classList.toggle('running');
            
            let playIco = document.querySelector('.controll-play i');
            
            playIco.classList.toggle('fa-stop-circle');
            playIco.classList.toggle('fa-chevron-circle-right');

            document.querySelectorAll('.sequence-item').forEach(item => item.style.color = '#aaa')
            
            if(game.running && game.seqOver){ResetLevel()}
            game.running = !game.running;
        }
    }

    //Handle keyboard input
    let seqElem = document.querySelector('.sequence-items');

    document.addEventListener("keydown", e => {
        switch(e.keyCode){
            //Enter
            case 13:
                togglePlay();
                break;

            //Left
            case 37:
                if(!game.running && !player.isDead){
                    AddSequence(3);
                    seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-left"></i></div>';
                }
                break;

            //Up
            case 38:
                if(!game.running && !player.isDead){
                    AddSequence(2);
                    seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-up"></i></div>';
                }
                break;

            //Right
            case 39:
                if(!game.running && !player.isDead){
                    AddSequence(1);
                    seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-right"></i></div>';
                }
                break;

            //Down
            case 40:
                if(!game.running && !player.isDead){
                    AddSequence(4);
                    seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-down"></i></div>';
                }
                break;
            //R
            case 82:
                NewGame()
                break;
        }
    });

    //Handle arrow keys input
    //Left 
    document.querySelector('.controll-left').addEventListener('click', ()=>{
        if(!game.running && !player.isDead){
            AddSequence(3);
            seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-left"></i></div>';
        }
    });

    //Up
    document.querySelector('.controll-up').addEventListener('click', ()=>{
        if(!game.running && !player.isDead){
            AddSequence(2);
            seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-up"></i></div>';
        }
    });

    //Right
    document.querySelector('.controll-right').addEventListener('click', ()=>{
        if(!game.running && !player.isDead){
            AddSequence(1);
            seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-right"></i></div>';
        }
    });

    //Down
    document.querySelector('.controll-down').addEventListener('click', ()=>{
        if(!game.running && !player.isDead){
            AddSequence(4);
            seqElem.innerHTML += '<div class="sequence-item"><i class="fas fa-chevron-circle-down"></i></div>';
        }
    });
});

//Initiate a new level
function Init(_level){
    if(_level==null)_level=1;
    
    levelMap = maps[_level-1]
    sequence=[];
    document.querySelector('.level').innerHTML = '';
    document.querySelector('.sequence-items').innerHTML='';
    document.querySelector('.lives').innerHTML= '';

    //Loop through map to generate blocks
    game.size.y=levelMap.length;
    for(let x = 0; x < levelMap.length; x++){
        document.querySelector('.level').innerHTML+=`<div class="row row-${x}"></div>`;
        if(levelMap[x].length>game.size.x)game.size.x=levelMap[x].length;
        for(let y = 0; y < levelMap[x].length; y++){
            document.querySelector(`.row-${x}`).innerHTML += generateBlock(levelMap[x][y], {x, y});
            if(levelMap[x][y]==2){ player.position.x=y; player.position.y=x;game.startPos={x:y, y:x};}
            if(levelMap[x][y]==3){game.endPos={y,x}}
        }
    }

    //Add heart icons
    for(let i=0; i<3;i++){
        document.querySelector('.lives').innerHTML += '<div class="live"><i class="fas fa-heart"></i></div>';
    } 
}

//Add item to the sequence
function AddSequence(s){
    sequence.push(s)
}

//Clear the sequence
function ClearSequence(){
    sequence = [];
}

// Move the player based on
// the sequence of inputs.
function InitiateSequence(sequence){
    let nextBlock;
    let arr = new Array(sequence.length)
     sequence.forEach((move, i)=>{
        arr[i] = setTimeout(()=>{
            if(!game.running) {move = 0;Stop(i, arr); ResetLevel();return}
            switch(move){
                //Right
                case 1:
                    player.position.x++;
                    break;

                //Up
                case 2:
                    player.position.y--;
                    break;

                //Left
                case 3:
                    player.position.x--;
                    break;

                //Down
                case 4:
                    player.position.y++;
                    break;
                    
                default:
                    player.position = game.startPos;
                    break;
            }
            nextBlock = getBlock(player.position);

            //Check if player is outside the map
            if(player.position.x<0 || player.position.x>game.size.x-1){EndGame(i, arr, false);move = 0;return}
            if(player.position.y<0 || player.position.y>game.size.y-1){EndGame(i, arr, false);move = 0;return}

            //Check if the player found the exit or hit a wall
            if(nextBlock!=null && nextBlock.classList.contains('exit')) {EndGame(i, arr, true);move = 0;return}
            if(nextBlock!=null && nextBlock.classList.contains('wall')) {EndGame(i, arr, false);move = 0;return}
    
            document.querySelector('.player').classList.remove('player');
            if(nextBlock!=null) nextBlock.classList.add('player');            
            
            document.querySelectorAll('.sequence-item')[i].style.color = '#333';

            if(i>=sequence.length-1){
                game.seqOver = true;
            }
        }, i * game.delay);
    });
}

//Stop timers
function Stop(idx, timers){
    for (let i = idx; i <= timers.length; i++) {
        clearTimeout(timers[i])
    }
}

//Generate block based on block type
function generateBlock(typeId, pos){
    let type = '';
    let img = '';
    switch(typeId){
        case 1:
            type = 'wall';
            img = '<img src="./img/blocks/wall.png">'
            break;
        case 2:
            type = 'player';
            break;
        case 3:
            type = 'exit';
            img = '<img src="./img/blocks/exit.gif">'
            break;
    }
    return(`<div class="block ${type}" x="${pos.y}" y="${pos.x}" type="${type}">${img}</div>`);
}

//Gets a block element based on coordinates
function getBlock({x, y}){
    let blocks = document.querySelectorAll('.block');

    for (const [_, block] of Object.entries(blocks)) {
        if(block.getAttribute('x')==x && block.getAttribute('y')==y){
            return block;
        }
    }
}

//Check if the player won or lost
function EndGame(i, arr, win){
    game.running = false;
    Stop(i, arr); 
    ResetLevel()
    document.querySelector('.controll-play').classList.toggle('running');

    let playIco = document.querySelector('.controll-play i');            
    playIco.classList.toggle('fa-stop-circle');
    playIco.classList.toggle('fa-chevron-circle-right');


    //Handle win/lose cases
    if(win==true) {
        console.log(`Level ${game.level} completed.`);
        sequence = [];
        document.querySelector('.sequence-items').innerHTML='';
        game.level++;
        if(game.level<=maps.length){
            Init(game.level);
        }else{
            game.level=1;
            Init(game.level);
            document.querySelector('.overlay').classList.remove('overlay-hidden');
            document.querySelector('.overlay-title').innerHTML = 'You won!';
        }        
    }else{
        player.lives--;
        console.log('You have '+player.lives+' lives left!');
        document.querySelectorAll('.lives i')[2-player.lives].style.color = '#333';
        sequence=[];
        document.querySelector('.sequence-items').innerHTML='';
        if(player.lives==0){
            player.isDead = true;
            sequence = [];
            document.querySelector('.sequence-items').innerHTML='';
            document.querySelector('.overlay').classList.remove('overlay-hidden');
            document.querySelector('.overlay-title').innerHTML = 'Game Over!';
        }
    }    
}

//Reset player staus and lives, and start first level
function NewGame(){
    player.isDead = false
    player.lives = 3;
    game.level=1;
    Init(game.level)
    document.querySelectorAll('.lives i').forEach(life => life.style.color = '#ff4d4d');
    document.querySelector('.overlay').classList.add('overlay-hidden');
}

//Resets player position
function ResetLevel(){
    player.position.x = game.startPos.x;
    player.position.y = game.startPos.y;
    let startingBlock = getBlock(game.startPos);
    document.querySelector('.player').classList.remove('player');
    startingBlock.classList.add('player');
}

//Get maps from server
async function GetMaps(url){
    try{
    await fetch(url)
        .then((res)=>res.json())
        .then((data)=>{
            Object.values(data).forEach(map => {
                maps.push(map);
            }); 
        });
    }catch(e){
        console.log(e)
    }    
}