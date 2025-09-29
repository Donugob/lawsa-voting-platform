// client/src/admin/pages/VotersPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';

const PageHeader = styled.h1`
  font-size: 2.5rem;
  color: #0D1B2A;
  margin-bottom: 2rem;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 20px;
  text-align: left;
  background-color: #F4F7F6;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
`;

const Td = styled.td`
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
`;

const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
  color: white;
  background-color: ${props => (props.voted ? '#1ABC9C' : '#f39c12')};
`;

function VotersPage() {
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const { data } = await api.get('/admin/voters');
        setVoters(data);
      } catch (error) {
        console.error("Failed to fetch voters", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVoters();
  }, []);

  if (isLoading) return <div>Loading voters list...</div>;

  return (
    <div>
      <PageHeader>Manage Eligible Voters</PageHeader>
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <Th>Matriculation Number</Th>
              <Th>Voting Status</Th>
              <Th>Registered At</Th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter) => (
              <Tr key={voter._id}>
                <Td>{voter.matricNumber}</Td>
                <Td>
                  <StatusBadge voted={voter.hasVoted}>
                    {voter.hasVoted ? 'Voted' : 'Pending'}
                  </StatusBadge>
                </Td>
                <Td>{new Date(voter.createdAt).toLocaleString()}</Td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </div>
  );
}

export default VotersPage;