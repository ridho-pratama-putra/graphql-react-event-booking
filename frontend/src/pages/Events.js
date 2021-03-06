import React, {Component} from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';
import AuthContext from '../context/auth-context';
import EventList from "../components/Event/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import {CREATE_EVENT} from "../constants/utils";

class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.titleElementReference = React.createRef();
    this.dateElementReference = React.createRef();
    this.priceElementReference = React.createRef();
    this.descriptionElementReference = React.createRef();
    this.state = {
      creating: false,
      events: [],
      isLoading: false,
      selectedEvent: null
    };
  }

  static contextType = AuthContext;

  startCreateEVentHandler = () => {
    this.setState({creating: true});
  };

  modalConfirmHandler = () => {
    this.setState({creating: false});
    const title = this.titleElementReference.current.value;
    const date = this.dateElementReference.current.value;
    const description = this.descriptionElementReference.current.value;
    const price = +this.priceElementReference.current.value;

    if (title.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0 ||
      price <= 0
    ) {
      return;
    }

    const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(CREATE_EVENT),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(responseData => {
      const {_id, title, description, date, price} = responseData.data.createEvent;
      this.setState(previousState => {
        const updatedEvents = [...previousState.events];
        updatedEvents.push({
          _id: _id,
          title: title,
          description: description,
          date: new Date(date),
          price: price,
          creator: {
            _id: this.context.userId,
          }
        });
        return {events: updatedEvents};
      });
    }).catch(error => {
      console.log('error: ', error);
    })
  };

  modalCancelHandler = () => {
    this.setState({creating: false, selectedEvent: null});
  };

  fetchEvents() {
    this.setState({isLoading: true});
    const requestBody = {
      query: `query {
                events {
                    _id
                    title
                    description
                    date
                    price
                    creator{
                        _id
                        email
                    }
                }
            }`
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(responseData => {
      this.setState({events: responseData.data.events, isLoading: false});
    }).catch(error => {
      console.log('error: ', error);
    })
  }

  componentDidMount() {
    this.fetchEvents();
  }

  handleOnViewDetails = (eventId) => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return {selectedEvent: selectedEvent};
    });
  };

  handleOnBookEvent = () => {
  };

  render() {
    const {creating, selectedEvent, isLoading, events} = this.state;

    return (
      <React.Fragment>
        {(creating || selectedEvent) && <Backdrop/>}
        {creating &&
        <Modal title='Add Event' canCancel canConfirm onCancel={this.modalCancelHandler}
               onConfirm={this.modalConfirmHandler}>
          <form>
            <div className='form-control'>
              <label htmlFor='title'>Title</label>
              <input type='text' id='title' ref={this.titleElementReference} autoFocus/>
            </div>
            <div className='form-control'>
              <label htmlFor='price'>Price</label>
              <input type='number' id='price' ref={this.priceElementReference}/>
            </div>
            <div className='form-control'>
              <label htmlFor='date'>Date</label>
              <input type='datetime-local' id='date' ref={this.dateElementReference}/>
            </div>
            <div className='form-control'>
              <label htmlFor='desctiption'>Description</label>
              <textarea id='description' rows='4' ref={this.descriptionElementReference}/>
            </div>
          </form>
        </Modal>
        }
        {selectedEvent &&
        <Modal title={selectedEvent.title}
               canCancel
               canConfirm
               onCancel={this.modalCancelHandler}
               onConfirm={this.handleOnBookEvent}>
          <h1>{selectedEvent.title}</h1>
          <h3>{selectedEvent.price}</h3>
          <h4>{selectedEvent.description}</h4>
        </Modal>
        }
        {this.context.token && <div className={'event-control'}>
          <p>Share your own events</p>
          <button className={'btn'} onClick={this.startCreateEVentHandler}>Create event</button>
        </div>}

        {isLoading && <Spinner/>}
        {isLoading ||
        <EventList events={events} authUserId={this.context.userId} onViewDetail={this.handleOnViewDetails}/>}
      </React.Fragment>
    );
  }
}

export default EventsPage;
