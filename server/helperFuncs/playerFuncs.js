const getNextPlayer = (allPlayers, curPlayer) => {
    let playerIdx = allPlayers.findIndex(player => curPlayer.name === player.name);
    playerIdx++;
    if (playerIdx >= allPlayers.length) {
      playerIdx = 0;
    }
    return allPlayers[playerIdx]
}

module.exports = getNextPlayer
