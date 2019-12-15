import React from 'react';
import './EventItem.css';

const EventItem = (props) => {
    const onClickDetail = () => {
        props.onClickDetail(props.eventId);
    };
    return (
        <li key={props._id} className='events__list--item'>
            <div>
                <h1>
                    {props.title}
                </h1>
                <h2>
                    Rp. {props.price} - {new Date(props.date).toLocaleDateString('id-ID')}
                </h2>
            </div>
            <div>
                {props.userId === props.creator ? <p>Your own events</p> :
                    <button className='btn' onClick={onClickDetail}>View Details</button>}
            </div>
        </li>
    );
};

EventItem.propTypes = {};

EventItem.defaultProps = {};

export default EventItem;
