import React, { useEffect, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from 'lodash';
import './BoardContent.scss';
import Column from '../Column/Column';
import { mapOrder } from '../../utilities/sorts';
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
    console.log(dropResult);
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
            <Column column={column} />
          </Draggable>
        ))}
      </Container>
    </div>
  );
};

export default BoardContent;
