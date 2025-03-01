import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Content from './pages/Content';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' Component={Content} />
        <Route path='*' Component={NotFound} /> {/*nu prea isi are sensul momentan*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
