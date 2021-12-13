import React, { useEffect, useState, useRef } from 'react';

import './Column.scss';
import { mapOrder } from '../../utilities/sorts';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { Container, Draggable } from 'react-smooth-dnd';
import { cloneDeep } from 'lodash';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constants';
import Card from '../Card/Card';
import { saveContentAfterPressEnter, selectAllInlineText } from '../../utilities/contentEdit';
import ConfirmModal from '../Common/ConfirmModal';
const Column = (props) => {
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, 'id');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [columnTitle, setColumnTitle] = useState('');
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);

  const [openNewCardFrom, setOpenNewCardFrom] = useState(false);
  const tonggleOpenNewCardFrom = () => setOpenNewCardFrom(!openNewCardFrom);

  const newCardTextareaRef = useRef(null);

  const [newCardTitle, setNewCardTitle] = useState('');
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value);

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    // check newCardTextareaRef equal Null?
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openNewCardFrom]);

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      // Remove Card
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
    toggleShowConfirmModal();
  };

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  };

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus();
      return;
    }

    const newCardToAdd = {
      // random 1 string gom 5 ki tu
      // will remove when we implement codo api
      id: Math.random().toString(36).substr(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null,
    };
    console.log(column);
    // clone ra gan bien moi la newColumn
    let newColumn = cloneDeep(column);
    newColumn.cards.push(newCardToAdd);
    newColumn.cardOrder.push(newCardToAdd.id);

    onUpdateColumn(newColumn);
    setNewCardTitle('');
    tonggleOpenNewCardFrom();
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="notes-app"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKetDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={(e) => e.preventDefault()}
            spellCheck={false} //bo dau gach do default cua chrome
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />

            <Dropdown.Menu>
              <Dropdown.Item>Add card ...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove card ...</Dropdown.Item>
              <Dropdown.Item>Something times out</Dropdown.Item>
              <Dropdown.Item>Actions </Dropdown.Item>
              <Dropdown.Item>Something else are you ok ok ok ok </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="vtan-columns"
          orientation="vertical" // default
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview',
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardFrom && (
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card ..."
              className="textarea-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              // event Enter change click addNewColumn
              onKeyDown={(event) => event.key === 'Enter' && addNewCard()}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCardFrom && (
          <div className="add-new-card-actions">
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add card
            </Button>
            <span className="cancel-icon" onClick={tonggleOpenNewCardFrom}>
              <i className="fa fa-times icon" />
            </span>
          </div>
        )}
        {!openNewCardFrom && (
          <div className="footer-actions" onClick={tonggleOpenNewCardFrom}>
            <i className="fa fa-plus icon" />
            Add another card
          </div>
        )}
      </footer>

      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove card"
        content={`Are you sure you want to remove <strong>${column.title}</strong>. <br /> All related cards will also be removed!`}
      />
    </div>
  );
};

export default Column;
