import React from "react";

const Rules = props => {
  return (
    <div className="rules">
      <div>
        <strong>
          The jungle is home to the world’s wildest animals all looking to claim
          their territory.
        </strong>
      </div>
      <br />

      <div id="ruleHeader">Play:</div>
      <br />
      <div>
        To play King of the Jungle, players take turn placing tiles in valid
        positions on the game board. Valid positions appear as gray tiles, and a
        player can <strong>rotate</strong> their tile to see additional valid
        positions. Positions are valid if the region on its edges – either a
        forest, field, or leafy trail – match the corresponding region on the
        board position.
        {/* *** todo: INSERT IMAGE PLAYING WITH BOTS */}
        {/* TODO: meeple VALIDITY W/ IMAGE? */}
      </div>
      <br />
      <div>
        Each player begins the game with 7 animal pieces they can place on an
        unclaimed region to claim it. A region is considered claimed if there is
        an animal piece on that connected region, no matter how many tiles away.
      </div>
      <br />
      <div>
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
      </div>
      <br />
      <div>
        Some tiles are marked with a bright flame. Fire may be a sign of humans,
        and so having these tiles in a region requires extra bravery from a
        jungle animal and is worth extra points (see Points below).
      </div>
      <br />
      <div>
        Pools are regions that do not have edges; pools need a basin to fill
        itself, and so pools must be surrounded by land.
      </div>
      <br />
      <div>
        After placing a tile and optionally placing an animal piece, a player
        must hit <strong>End turn</strong> to move to the next player.
      </div>
      <div>
        <br />
        <div>
          You can't dominate a region in the jungle if you don't know who else
          is in your territory!
        </div>
        <ul>
          <strong>Regions are closed when:</strong>
          <li>A forest is closed off on all its edges.</li>
          <li>
            A leafy trail is closed when both sides are ended, or by a loop.
          </li>
          <li>
            A pool is closed when all its edge tiles (adjacent and diagonal) are
            filled.
          </li>
        </ul>
      </div>
      <div>
        When a claimed region is closed, the animal piece will be returned to
        its player.
      </div>
      <br />
      <div id="ruleHeader">Points:</div>
      <br />
      <div>
        Players gain points during the game when regions they have claimed are
        closed, and at the end of the game for regions they have claimed that
        are not closed. Each region is worth the following:
        <ul>
          <strong>Closed:</strong>
          <li>Forest: 2 points per tile</li>
          <li>Leafy trail: 1 point per tile</li>
          <li>Pool: 9 points when all surrounding spaces filled</li>
          <li>Fire: 2 points per file on a closed region</li>
        </ul>
        <ul>
          <strong>Unclosed, at end of game:</strong>
          <li>Forest: 1 point per tile</li>
          <li>Leafy trail: 1 point per tile</li>
          <li>Pool: 1 point per surrounding tile and 1 point for pool tile</li>
          <li>Fire: 1 point</li>
        </ul>
        <div>
          If a region has multiple pieces placed on it, the player with the most
          pieces will gain all the points, and if players have equal amounts of
          pieces on the region, both players will receive the full points of
          that region.
        </div>
        <br />
      </div>

      <div>
        The game ends when all tiles have been placed. The player with the
        highest score – after all additional points have been added – is the
        King of the Jungle.
      </div>
      <br />
      <div id="ruleHeader">Navigating the page:</div>
      <br />
      <div>
        Drag your mouse to move the board, and scroll in and out to zoom on the
        board. To see the jungle in 3D, click <strong>3D Board</strong> on the
        top left of the screen, and <strong>Flat Board</strong> to return to the
        2D view.
      </div>
      <br />
      <div>
        The <strong>Score Board</strong> reflects the current score – based on
        how many regions have been closed – as well as the number of animal
        pieces each player has left. Note that the current score does not
        reflect the points each player will gain at the game end from unclosed
        regions, and so the winner will not necessarily be the player with the
        highest current score displayed.
      </div>
      <br />
      <div>
        See the <strong>tiles remaining</strong> (out of a total of 72) on the
        top right corner, and chat with your fellow players on in the
        <strong>Chat</strong> box.
      </div>
      <div />
    </div>
  );
};

export default Rules;
