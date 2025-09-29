// client/src/pages/VotingPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { VoterContext } from '../context/VoterContext.jsx';
import { PageContainer, PrimaryButton } from '../components/common';
import Modal from '../components/Modal';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

// --- STYLED COMPONENTS FOR THE VOTING PAGE ---

const BallotHeader = styled.div`
  width: 100%;
  max-width: 900px;
  text-align: center;
  margin-bottom: 3rem;
`;

const PositionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 900px;
`;

const PositionTitle = styled.h3`
  font-size: 2rem;
  border-bottom: 2px solid #1ABC9C;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const CandidateCard = styled.div`
  background: #0D1B2A;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid ${props => props.isSelected ? '#1ABC9C' : 'transparent'};
  position: relative;
  transition: transform 0.3s ease, border-color 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CandidateImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
`;

const CandidateInfo = styled.div`
  padding: 1rem;
`;

const CandidateName = styled.h4`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const SelectedBadge = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #1ABC9C;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// --- MAIN VOTING PAGE COMPONENT ---

function VotingPage() {
  const { voter, setVoter } = useContext(VoterContext);
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [votes, setVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleVote = (positionId, candidateId) => {
    setVotes(prev => ({ ...prev, [positionId]: candidateId }));
  };
  
  const handleSubmitVote = async () => {
    if (Object.keys(votes).length !== positions.length) {
      toast.error('You must select a candidate for every position.');
      return;
    }
    
    const toastId = toast.loading('Casting your vote...');
    try {
      const payload = { voterId: voter.id, votes };
      const response = await api.post('/election/vote', payload);
      toast.success(response.data.message, { id: toastId });
      navigate('/voted'); // Navigate to the final "already voted" page
    } catch (err) {
      toast.error(err.response?.data?.message || 'Vote submission failed.', { id: toastId });
    }
  };

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const { data } = await api.get('/election');
        setPositions(data);
      } catch (err) {
        toast.error('Failed to load election data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchElectionData();
  }, []);

  if (isLoading) return <PageContainer><h2>Loading Election Ballot...</h2></PageContainer>;

  return (
    <PageContainer>
      <BallotHeader>
        <h1>LAWSA DECIDES 2025</h1>
        <p>Select one candidate for each position. Your choice is final once submitted.</p>
      </BallotHeader>

      {positions.map((position, index) => (
        <PositionCard 
          key={position._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <PositionTitle>{position.title}</PositionTitle>
          <CandidatesGrid>
            {position.candidates.map(candidate => (
              <CandidateCard
                key={candidate._id}
                isSelected={votes[position._id] === candidate._id}
                onClick={() => handleVote(position._id, candidate._id)}
              >
                <AnimatePresence>
                  {votes[position._id] === candidate._id && (
                    <SelectedBadge
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <FaCheckCircle />
                    </SelectedBadge>
                  )}
                </AnimatePresence>
                <CandidateImage src={candidate.imageUrl} alt={candidate.name} />
                <CandidateInfo>
                  <CandidateName>{candidate.name}</CandidateName>
                  {/* We'll add a 'View Manifesto' button here later */}
                </CandidateInfo>
              </CandidateCard>
            ))}
          </CandidatesGrid>
        </PositionCard>
      ))}
      
      <PrimaryButton 
        style={{ marginTop: '2rem', padding: '15px 50px', fontSize: '1.2rem' }} 
        onClick={handleSubmitVote}
      >
        Cast Final Vote
      </PrimaryButton>
    </PageContainer>
  );
}

export default VotingPage;