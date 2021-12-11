import React from 'react';

import './Card.scss';
const Card = (props) => {
  const { card } = props;
  return (
    <div className="card-item">
      {/*  {card.cover: neu img = null  */}
      {card.cover && (
        <img
          src={card.cover}
          className="card-cover"
          alt="vantan-img"
          // preventDefault
          anMouseDown={(e) => e.preventDefault()}
        />
      )}
      {card.title}
    </div>
  );
};

export default Card;
