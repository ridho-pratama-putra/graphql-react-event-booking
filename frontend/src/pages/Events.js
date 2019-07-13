import React, {Component} from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    };

    constructor(props) {
        super(props);
        this.titleElementReference = React.createRef();
        this.dateElementReference = React.createRef();
        this.priceElementReference = React.createRef();
        this.descriptionElementReference = React.createRef();
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
            query: `mutation {
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
                    creator {
                        _id
                        email
                    }
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
            this.fetchEvents();
        }).catch(error => {
            console.log('error: ', error);
        })
    };

    modalCancelHandler = () => {
        this.setState({creating: false});
    };

    fetchEvents() {
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
            this.setState({events: responseData.data.events});
        }).catch(error => {
            console.log('error: ', error);
        })
    }

    componentDidMount() {
        this.fetchEvents();
    }

    render() {
        const eventList = this.state.events.map(event => {
            return (
                <li key={event._id} className='events__list--item'>
                    {event.title}
                </li>);
        });
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
                {this.context.token && <div className={'event-control'}>
                    <p>Share your own events</p>
                    <button className={'btn'} onClick={this.startCreateEVentHandler}>Create event</button>
                </div>}

                <ul className='events__list'>
                    {eventList}
                </ul>
            </React.Fragment>
        );
    }
}

export default EventsPage;
