King of the Jungle

King of the Jungle is a web application inspired by the classic board game Carcassone, built as a capstone project by four students at Fullstack Academy's Grace Hopper Program: Alizah Lalani, Hannah Rogers, Micaela O'Herron and Summer Deehan.

To play the deployed version of this app, visit: https://king-of-the-jungle.herokuapp.com/

To see this game on your terminal, clone this repository and run the commands:

npm install
npm run start

## Technology

This game was built in JavaScript, using React, Redux, React-Redux, Socket.io, and Three.js. It is deployed via Heroku.

## Rules

PLAY:

The jungle is home to the world’s wildest animals all looking to claim their territory.

To play King of the Jungle, players take turn placing tiles in valid positions on the game board. Valid positions appear as gray tiles, and a player can rotate their tile to see additional valid positions. Positions are valid if the region on its edges – either a forest, field, or leafy trail – match the corresponding region on the board position.

Each player begins the game with 7 animal pieces they can place on an unclaimed region to claim it. A region is considered claimed if there is an animal piece connected to that region, no matter how many tiles away.

A player cannot place an animal piece on a region that has been claimed
-- however, if two separate regions may eventually be joined, a player
can place a piece on a region that may potentially join another. If the
regions do join later in the game, scoring will depend on how many
pieces are placed on this region: if each player has one piece on the
region, they will each receive the total points. However, a player who
already has a claim to this region may place additional pieces on this
region, and if one player has more pieces on the region, they will
recieve all the points for the region and the other player will receive
none.

Some tiles are marked with a bright flame. Fire may be a sign of humans,
and so having these tiles in a region requires extra bravery from a
jungle animal and is worth extra points (see Points below).

Pools are regions that do not have edges; pools need a basin to fill
itself, and so pools must be surrounded by land.

After placing a tile and optionally placing an animal piece, a player must hit ‘End turn’ to move to the next player.

You can't dominate a region in the jungle if you don't know who else is in your territory!

Regions are closed when:

- A forest is closed off on all edges.
- A road is closed when both sides are ended, or by a loop.
- A pool is closed when all its edge tiles (adjacent and diagonal) are filled.

When a claimed region is closed, the animal piece will be returned to its player.

POINTS:

Players gain points during the game when regions they have claimed are closed, and at the end of the game for regions they have claimed that are not closed. Each region is worth the following:

Closed:

- Forest: 2 points per tile
- Road: 1 point per tile
- Pool: 9 points (when all surrounding spaces filled)
- Fire: 2 points per file on a closed region

Unclosed at end of game:

- Forest: 1 point per tile
- Road: 1 point per tile
- Pool: 1 point per surrounding tile
- Fire: 1 point

If a region has multiple pieces placed on it, the player with the most pieces will gain all the points, and if players have equal amounts of pieces on the region, both players will receive the full points of that region.

The score board reflects the current score – based on how many regions have been closed – as well as the number of animal pieces each player has left. Note that the current score does not reflect the points each player will gain at the game end from unclosed regions, and so the winner will not necessarily be the player with the highest current score displayed.

The game ends when all tiles have been placed. The player with the highest score – after all additional points have been added – is the King of the Jungle.
