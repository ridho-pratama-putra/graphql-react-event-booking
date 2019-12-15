import gql from "graphql-tag";

export const CREATE_EVENT = gql`
    mutation CreateEvent($input: EventInput!) {
        createEvent(eventInput: $input) {
            _id
            title
            description
            date
            price
        }
    }`;
