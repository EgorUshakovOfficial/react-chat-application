import { Provider, connect} from 'react-redux';
import Presentational from './Presentational'; 
import '../styles/App.css';
import { store } from '../state/store';
import { mapStateToProps } from '../state/mapstatetoprops'; 
import { mapDispatchToProps } from '../state/mapdispatchtoprops';

// Wrapper
const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

const App = (props) => {
    return (
        <Provider store={store}>
            <Container />
        </Provider>
    );
}

export default App;
