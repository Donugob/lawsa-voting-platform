// client/src/admin/pages/VotersPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PrimaryButton } from '../../components/common';
import { FaTrash, FaPlus } from 'react-icons/fa';

// --- Styled Components (many are reused from ManageCandidatesPage) ---

const PageHeader = styled.h1`
  font-size: 2.5rem;
  color: #0D1B2A;
  margin-bottom: 2rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
`;

const FormHeader = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #0D1B2A;
  margin-bottom: 1.5rem;
`;

const ListContainer = styled(FormContainer)``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AdminStyledInput = styled.input`
  font-family: 'Montserrat', sans-serif;
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  background-color: #f4f7f6;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  color: #2c3e50;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &::placeholder { color: #b2bec3; }
  &:focus {
    outline: none;
    border-color: #1ABC9C;
    box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.2);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  background-color: #f4f7f6;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85em;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:last-child ${Td} { border-bottom: none; }
`;

const StatusBadge = styled.span`
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
  color: white;
  background-color: ${props => (props.voted ? '#1ABC9C' : '#f39c12')};
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;
  &:hover { color: #c0392b; }
`;

// --- Main Component ---

function VotersPage() {
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMatricNumber, setNewMatricNumber] = useState('');

  const fetchData = async () => {
    try {
      const { data } = await api.get('/admin/voters');
      setVoters(data);
    } catch (error) {
      toast.error("Failed to fetch voters list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVoter = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Adding new voter...');
    try {
      await api.post('/admin/voters', { matricNumber: newMatricNumber });
      toast.success('Voter added successfully!', { id: toastId });
      setNewMatricNumber('');
      await fetchData(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add voter.', { id: toastId });
    }
  };

  const handleDeleteVoter = async (id) => {
    if (window.confirm('Are you sure you want to remove this voter from the eligible list?')) {
      const toastId = toast.loading('Removing voter...');
      try {
        await api.delete(`/admin/voters/${id}`);
        toast.success('Voter removed.', { id: toastId });
        await fetchData(); // Refresh the list
      } catch (error) {
        toast.error('Failed to remove voter.', { id: toastId });
      }
    }
  };

  if (isLoading) return <div>Loading voter management...</div>;

  return (
    <div>
      <PageHeader>Manage Eligible Voters</PageHeader>
      <ContentGrid>
        <FormContainer>
          <FormHeader>Add New Voter</FormHeader>
          <Form onSubmit={handleAddVoter}>
            <AdminStyledInput
              type="text"
              placeholder="e.g., IMSU/LAW/25/5001"
              value={newMatricNumber}
              onChange={(e) => setNewMatricNumber(e.target.value)}
              required
            />
            <PrimaryButton type="submit">
              <FaPlus style={{ marginRight: '8px' }} />
              Add Voter
            </PrimaryButton>
          </Form>
        </FormContainer>

        <ListContainer>
          <FormHeader>Voter Roll</FormHeader>
          <StyledTable>
            <thead>
              <tr>
                <Th>Matriculation Number</Th>
                <Th>Voting Status</Th>
                <Th>Actions</Th>
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
                  <Td>
                    <DeleteButton onClick={() => handleDeleteVoter(voter._id)}>
                      <FaTrash />
                    </DeleteButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </StyledTable>
        </ListContainer>
      </ContentGrid>
    </div>
  );
}

export default VotersPage;