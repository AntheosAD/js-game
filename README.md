# js-game
#### A javascript puzzle game in which the player creates a sequence of moves used by the character to navigete through the map. The player starts with 3 lives, and loses one everytime he hits a wall. If the player runs out of lives or completes all maps, an overlay apperas allowing the user to start again. You can play the game [here](https://antheosad.github.io/js-game/ "here").
#### The map itself is a 2 dimensional array, the values of which represent the block type:
- ##### 1: Air
- ##### 2: Wall
- ##### 3: Player's starting position
- ##### 4: Exit
#### By defaul there are 3 test maps, but the user has the option to get more using the `GetMaps()` function. To do this, uncomment line 9 and pass the url of your maps.json file. Example: `GetMaps('http://example.com/maps.json')`
 
