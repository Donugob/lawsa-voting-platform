// client/src/admin/pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// --- Styled Components ---

const PageHeader = styled.h1`
  font-size: 2.5rem;
  color: #0D1B2A;
  margin-bottom: 2rem;
`;

const PositionResultCard = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  margin-bottom: 30px;
`;

const PositionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #0D1B2A;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const CandidateResult = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: space-between;
`;

const CandidateInfo = styled.div`
  flex-basis: 30%;
  display: flex;
  align-items: center;
`;

const CandidateImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
`;

const CandidateName = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const WinnerBadge = styled.span`
  background-color: #FFC107; /* Gold for the winner */
  color: #0D1B2A;
  font-size: 0.8em;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 5px;
  margin-left: 10px;
`;

const ProgressBarContainer = styled.div`
  flex-basis: 55%;
  background-color: #ecf0f1;
  border-radius: 20px;
  height: 25px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  background-color: #1ABC9C;
  width: ${props => props.percentage}%;
  height: 100%;
  transition: width 0.5s ease-in-out;
`;

const VoteCount = styled.div`
  flex-basis: 10%;
  text-align: right;
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
`;

// --- Main Component ---

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get('/admin/detailed-results');
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch detailed results.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (isLoading) return <div>Loading results...</div>;

  return (
    <div>
      <PageHeader>Live Election Results</PageHeader>
      {results.map((position) => {
        const totalVotesForPosition = position.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
        return (
          <PositionResultCard key={position._id}>
            <PositionTitle>{position.title}</PositionTitle>
            {position.candidates.map((candidate, index) => {
              const percentage = totalVotesForPosition > 0 ? (candidate.votes / totalVotesForPosition) * 100 : 0;
              const isWinner = index === 0 && candidate.votes > 0; // The list is pre-sorted by votes from the backend

              return (
                <CandidateResult key={candidate._id}>
                  <CandidateInfo>
                    <CandidateImage src={candidate.imageUrl} alt={candidate.name} />
                    <CandidateName>{candidate.name}</CandidateName>
                    {isWinner && <WinnerBadge>WINNER</WinnerBadge>}
                  </CandidateInfo>
                  <ProgressBarContainer>
                    <ProgressBar percentage={percentage} />
                  </ProgressBarContainer>
                  <VoteCount>{candidate.votes} Votes</VoteCount>
                </CandidateResult>
              );
            })}
          </PositionResultCard>
        );
      })}
    </div>
  );
}

export default ResultsPage;