import { fullWhite } from 'material-ui/styles/colors';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        minWidth: 300,
    },
    avatar: {
        margin: '1em',
        textAlign: 'center ',
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        display: 'flex',
    },
    button: {
        backgroundColor: "#9ecbe4",
        labelColor: fullWhite
    },
    underlineStyle: {
        borderColor: '#9ecbe4',
    },
    floatingLabelStyle: {
        color: '#9ecbe4',
        fontSize: '16px'
    },
    floatingLabelFocusStyle: {
        color: '#9ecbe4'
    }
};

export default styles;