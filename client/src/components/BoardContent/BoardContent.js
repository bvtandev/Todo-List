import React, { useEffect, useRef, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import './BoardContent.scss';
import Column from '../Column/Column';
import { mapOrder } from '../../utilities/sorts';
import { applyDrag } from '../../utilities/dragDrop';
import { initialData } from '../../actions/InitialData';

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnFrom, setOpenNewColumnFrom] = useState(false);
  const tonggleOpenNewColumnFrom = () => setOpenNewColumnFrom(!openNewColumnFrom);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

  // newColumnInputRef: chưa input
  const newColumnInputRef = useRef(null);

  useEffect(() => {
    // board tham số truyền vào
    const boardFromDB = initialData.boards.find((board) => board.id === 'board-1');
    if (boardFromDB) {
      setBoard(boardFromDB);

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  useEffect(() => {
    // check newColumnInputRef equal Null?
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnFrom]);

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

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      // random 1 string gom 5 ki tu
      // will remove when we implement codo api
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };

    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle('');
    tonggleOpenNewColumnFrom();
  };

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id;
    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex((i) => i.id === columnIdToUpdate);

    if (newColumnToUpdate._destroy) {
      //  Remove columns
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      //  Update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
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
            <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className="notes-container">
        {!openNewColumnFrom && (
          <Row>
            <Col className="add-new-column" onClick={tonggleOpenNewColumnFrom}>
              <i className="fa fa-plus icon" />
              Add another column
            </Col>
          </Row>
        )}

        {openNewColumnFrom && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title ..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                // event Enter change click addNewColumn
                onKeyDown={(event) => event.key === 'Enter' && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>
                Add table
              </Button>
              <span className="cancel-icon" onClick={tonggleOpenNewColumnFrom}>
                <i className="fa fa-times icon" />
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
};

export default BoardContent;
