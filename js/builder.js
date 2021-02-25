let map = [];
let selectedBlock = '';
let selectedType = '';

let player = {x: -1, y: -1};
let exit = {x: -1, y: -1}

let mapWidth = 0;
let mapHeight = 0;

blocks =
    [
        "none",
        "wall",
        "player",
        "exit"
    ]

document.addEventListener('DOMContentLoaded', async () => {
    Init();

    document.querySelectorAll('.pallete-item').forEach(item => {
        item.addEventListener('click', function (e){
        selectedBlock = this.innerHTML;
        selectedType = this.getAttribute('type');
        document.querySelectorAll('.pallete-item').forEach(item=>item.classList.remove('selected'));
        this.classList.add('selected');
        });  
    });

    document.querySelector('.level').addEventListener('click', function(e){
        if(e.target.classList.contains('block')){
            if(e.target.innerHTML==''){
                SetBlock(e.target);
            }else{
                e.target.innerHTML= '';
                SetBlock(e.target);            
            }            
        }else if(e.target.tagName.toLowerCase()==='img'){
            let target = e.target.parentElement;
            if(target.innerHTML==''){
                SetBlock(target);
            }else{
                target.innerHTML= '';
                SetBlock(target);            
            }
        }
        
    });

    document.querySelectorAll('.input').forEach(input=>{
        input.addEventListener('change', function(){
            if(this.value<1)  this.value = 1;
            if(this.value>20) this.value = 20;
        });
    });

    document.querySelector('.button-create').addEventListener('click', function(){
        let width = document.querySelector('.input-width').value;
        let heigh = document.querySelector('.input-height').value;
        if(width > 0 && heigh > 0){
            GenerateMap(width, heigh);
            document.querySelector('.overlay').classList.add('overlay-hidden');
        }else{
            alert('Both values must be bigger than 0.')
        }
        
    });
    
});

//Initialize pallete
function Init(){
    let paletteData = '';
    blocks.forEach(block => {
        switch(block){
            case 'none':
                paletteData = `<div class="pallete-item pallete-${block}" type="${block}"></div>`;
                break;
            case 'exit':
                paletteData = `<div class="pallete-item pallete-${block}" type="${block}"><img src="../img/blocks/${block}.gif" ></div>`
                break;
            default:
                paletteData = `<div class="pallete-item pallete-${block}" type="${block}"><img src="../img/blocks/${block}.png"></div>`
                break;
        }
        document.querySelector('.pallete-items').innerHTML += paletteData;
    });
}

//Generate Empty Map
function GenerateMap(_width, _height){
    width = _width;
    height = _height;
    document.querySelector('.level').innerHTML = '';
    map = new Array(height);
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        document.querySelector('.level').innerHTML += `<div class="row row-${y}"></div>`;
        for (let x = 0; x < width; x++) {
                map[y][x] = 0;
                document.querySelector(`.row-${y}`).innerHTML +=`<div class="block" x="${x}" y="${y}" type="none"></div>`;
        }    
    }
}

//Get Block Id from Block Type
function getBlockId(type){
    return blocks.indexOf(type);
}

//Set selected block 
function SetBlock(block){
        CheckForDuplicates(block);
        block.innerHTML = selectedBlock;
        block.setAttribute('type', selectedType);

        map[block.getAttribute('y')][block.getAttribute('x')] = getBlockId(selectedType);

        if(selectedType=='player'){player.x = block.getAttribute('x');player.y = block.getAttribute('y')}
        if(selectedType=='exit'){exit.x = block.getAttribute('x');exit.y = block.getAttribute('y')}
        
}

//Check if player or exit alredy exists
function CheckForDuplicates(block){
    //Check for player
    if(selectedType=='player' && (player.x>=0 || player.y>=0)){
        let _player = document.querySelector('.block[type="player"]');
        _player.innerHTML = '';
        _player.setAttribute('type', 'none');
        map[_player.getAttribute('y')][_player.getAttribute('x')] = 0;
    }
    
    //Check for exit
    if(selectedType=='exit' && (exit.x>=0 || exit.y>=0)){
        let _exit = document.querySelector('.block[type="exit"]');
        _exit.innerHTML = '';
        _exit.setAttribute('type', 'none');
        map[_exit.getAttribute('y')][_exit.getAttribute('x')] = 0;
    }

    if(block.getAttribute('type')=='player') {player.x=-1;player.y=-1}
    if(block.getAttribute('type')=='exit') {exit.x=-1;exit.y=-1}
}

//Export the map
function Export(){
    //Check if map contains values other than the specified block values
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
                if(map[y][x]<0 || map[y][x]>blocks.lenght) map[y][x] = 0
        }    
    }
    console.log(JSON.stringify(map));
}