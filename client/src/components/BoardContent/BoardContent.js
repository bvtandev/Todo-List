import React, { useEffect, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from 'lodash';
import './BoardContent.scss';
import Column from '../Column/Column';
import { mapOrder } from '../../utilities/sorts';
import { applyDrag } from '../../utilities/dragDrop';
import { initialData } from '../../actions/InitialData';

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});

  useEffect(() => {
    // board tham số truyền vào
    const boardFromDB = initialData.boards.find((board) => board.id === 'board-1');
    if (boardFromDB) {
      setBoard(boardFromDB);

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: '10px', color: 'white' }}>
        Not found
      </div>
    );
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i.id);

      setColumns(newColumns);
    }
  };
  return (
    <div className="board">
      <Container
        // horizontal: width
        orientation="horizontal"
        onDrop={onColumnDrop}
        dragHandleSelector=".column-drag-handle"
        getChildPayload={(index) => columns[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview',
        }}
      >
        {columns.map((column, index) => (
          // trien khai mang du lieu dau ra react luon co key
          // column={column} : do du lieu ra
          // column(props)
          // key cua vong lap
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon" />
        Add another column
      </div>
    </div>
  );
};

export default BoardContent;
