import React, {Component} from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';
import AuthContext from '../context/auth-context';
import EventList from "../components/Event/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

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

        const requestBody = {
            query: `
            mutation {
                createEvent(eventInput: {
                    title: "${title}", 
                    description: "${description}", 
                    price:${price}, 
                    date: "${date}" 
                }) {
                    _id
                    title
                    description
                    date
                    price
                }
            }`
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
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
            this.setState(previousState => {
                const updatedEvents = [...previousState.events];
                updatedEvents.push({
                    _id: responseData.data.createEvent._id,
                    title: responseData.data.createEvent.title,
                    description: responseData.data.createEvent.description,
                    date: new Date(responseData.data.createEvent.date),
                    price: responseData.data.createEvent.price,
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

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating &&
                <Modal title='Add Event'
                       canCancel
                       canConfirm
                       onCancel={this.modalCancelHandler}
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
                {this.state.selectedEvent &&
                <Modal title={this.state.selectedEvent.title}
                       canCancel
                       canConfirm
                       onCancel={this.modalCancelHandler}
                       onConfirm={this.handleOnBookEvent}>
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h3>{this.state.selectedEvent.price}</h3 >
                    <h4>{this.state.selectedEvent.description}</h4>
                </Modal>
                }
                {this.context.token && <div className={'event-control'}>
                    <p>Share your own events</p>
                    <button className={'btn'} onClick={this.startCreateEVentHandler}>Create event</button>
                </div>}

                {this.state.isLoading && <Spinner/>}
                {this.state.isLoading || <EventList events={this.state.events} authUserId={this.context.userId}
                                                    onViewDetail={this.handleOnViewDetails}/>}
            </React.Fragment>
        );
    }
}

export default EventsPage;
