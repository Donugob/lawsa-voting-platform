// client/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Import all our page components
import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import ProtectedRoute from './components/ProtectedRoute';
import AlreadyVotedPage from './pages/AlreadyVotedPage';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import VotersPage from './admin/pages/VotersPage';
import ManageCandidatesPage from './admin/pages/ManageCandidatesPage';
import ResultsPage from './admin/pages/ResultsPage';


// --- STYLED COMPONENTS FOR THE HOMEPAGE ---
const HomePageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(rgba(13, 27, 42, 0.8), rgba(13, 27, 42, 0.8)), url('/law-bg.jpg'); // Add a background image
  background-size: cover;
  background-position: center;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #bdc3c7; /* Light grey for subtitle */
  margin-bottom: 0.5rem;
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem); /* Responsive font size */
  color: #FFFFFF;
  margin-bottom: 1rem;
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  max-width: 600px;
  color: #ecf0f1;
  margin-bottom: 2.5rem;
`;

const VoteButton = styled(Link)`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 15px 40px;
  background-color: #1ABC9C; /* Teal Accent */
  color: #FFFFFF;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(26, 188, 156, 0.3);
  }
`;

// --- NEW HOMEPAGE COMPONENT ---
function HomePage() {
  return (
    <HomePageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Subtitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Independent Lawsa Electoral Commission (ILEC) Presents
      </Subtitle>
      <MainTitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        LAWSA DECIDES 2025
      </MainTitle>
      <Description
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        Your Voice, Your Legacy. Participate in the official Imo State University Law Students' Association Election.
      </Description>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: 1 }}
      >
        <VoteButton to="/login">Proceed to Vote</VoteButton>
      </motion.div>
    </HomePageContainer>
  );
}

// --- MAIN APP ROUTER (Remains the same) ---
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/vote" element={<ProtectedRoute><VotingPage /></ProtectedRoute>} />
      <Route path="/voted" element={<ProtectedRoute><AlreadyVotedPage /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="voters" element={<VotersPage />} />
        <Route path="candidates" element={<ManageCandidatesPage />} />
        <Route path="results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}

export default App;