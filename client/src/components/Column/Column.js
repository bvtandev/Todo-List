import React, { useCallback, useEffect, useState } from 'react';

import './Column.scss';
import { mapOrder } from '../../utilities/sorts';
import { Dropdown, Form } from 'react-bootstrap';
import { Container, Draggable } from 'react-smooth-dnd';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constants';
import Card from '../Card/Card';
import { saveContentAfterPressEnter, selectAllInlineText } from '../../utilities/contentEdit';
import ConfirmModal from '../Common/ConfirmModal';
const Column = (props) => {
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, 'id');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), []);

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = (type) => {
    console.log(type);

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
    console.log(columnTitle);
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
            onMouseDown={(e) => e.preventDefault()}
            onClick={selectAllInlineText}
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
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" />
          Add commit
        </div>
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
