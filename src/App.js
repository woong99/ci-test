import { useAxiosInterceptor } from './hooks/useAxiosInterceptor';
import Router from './route/Router';
import Modal from 'react-modal';

function App() {
    useAxiosInterceptor();
    Modal.setAppElement('#root');

    return (
        <>
            <Router />
        </>
    );
}

export default App;
