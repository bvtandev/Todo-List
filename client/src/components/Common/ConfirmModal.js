import react from 'react';
import { Modal, Button } from 'react-bootstrap';
import HTMLReactParser from 'html-react-parser';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constants';
const ConfirmModal = (props) => {
  const { title, content, show, onAction } = props;
  return (
    <Modal show={show} onHide={() => onAction(MODAL_ACTION_CLOSE)} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
      </Modal.Header>
      {/* className="line-height" */}
      <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onAction(MODAL_ACTION_CLOSE)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
