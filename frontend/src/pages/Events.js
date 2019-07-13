import React, {Component} from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

class EventsPage extends Component {
    state = {
        createing: false
    };

    startCreateEVentHandler = () => {
        this.setState({creating: true});
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
    };

    modalCancelHandler = () => {
        this.setState({creating: false});
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
                    <p>Modal content</p>
                </Modal>
                }
                <div className={'event-control'}>
                    <p>Share your own events</p>
                    <button className={'btn'} onClick={this.startCreateEVentHandler}>Create event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;
