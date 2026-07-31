import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from '../features/home/HomePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
