// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Profile } from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
