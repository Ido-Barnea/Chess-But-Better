import React, { useEffect, useState } from 'react';
import { Draggable } from '../other/draggable/draggable';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { DraggableType } from '../other/draggable/DraggableType';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { Player } from '../../../../controller-legacy/logic/players/Player';

export interface IPieceProps {
  piece: BasePiece;
  turnSwitcher: ITurnSwitcher;
}

export const Piece: React.FC<IPieceProps> = (props) => {
  const svgMarkup = { __html: props.piece.resource.resource };

  // Shouldn't pieces be undraggable until it is determined who's turn it is?
  const [isPieceDraggable, setIsPieceDraggable] = useState(true);

  // Why is this being done in a useEffect()?
  // Can the dependency props.turnSwitcher ever change?
  // All of the pieces on the board always seem to be draggable. even at the start...
  // what does this mean about the piece from props being used?
  // Perhaps you need to call here for the turnSwitcher to switch turns?
  const handleTurnChange = (currentPlayer: Player) => {
    const currentTurnPlayerColor = currentPlayer.color;
    const isPieceOfCurrentPlayer =
      props.piece.player.color === currentTurnPlayerColor;

    setIsPieceDraggable(isPieceOfCurrentPlayer);
    // props.turnSwitcher.nextTurn();
  };

  useEffect(() => {
    props.turnSwitcher.subscribeToTurnChanges({
      onTurnChange: handleTurnChange,
    });

    return () => {
      props.turnSwitcher.unsubscribeFromTurnChanges({
        onTurnChange: handleTurnChange,
      });
    };
  }, [props.turnSwitcher]);

  useEffect(() => {
    handleTurnChange(props.turnSwitcher.getCurrentPlayer());
  }, []);

  return (
    <Draggable
      type={DraggableType.PIECE}
      coordinates={props.piece.position?.coordinates}
      isDraggable={isPieceDraggable}
    >
      <div
        className={`piece ${props.piece.player.color}`}
        id={props.piece.resource.name}
        dangerouslySetInnerHTML={svgMarkup}
      ></div>
    </Draggable>
  );
};
