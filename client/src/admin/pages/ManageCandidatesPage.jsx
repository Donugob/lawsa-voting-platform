// client/src/admin/pages/ManageCandidatesPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PrimaryButton } from '../../components/common';
import { FaTrash } from 'react-icons/fa';

// --- Page Layout & Containers ---

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

// THIS WAS THE MISSING PIECE. It reuses the FormContainer style for the list.
const ListContainer = styled(FormContainer)``;

// --- Form Elements ---

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

  &::placeholder {
    color: #b2bec3;
  }

  &:focus {
    outline: none;
    border-color: #1ABC9C;
    box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.2);
  }
`;

const AdminStyledSelect = styled.select`
  font-family: 'Montserrat', sans-serif;
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  background-color: #f4f7f6;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  color: #2c3e50;
`;

// --- Table Elements ---

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
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const CandidateImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
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

function ManageCandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');

    const fetchData = async () => {
        // No need to set isLoading(true) here as it's handled in the initial load
        try {
            const positionsRes = await api.get('/admin/positions');
            const candidatesRes = await api.get('/admin/candidates');
            
            setPositions(positionsRes.data);
            setCandidates(candidatesRes.data);

            // Set default selected position only if there isn't one and positions exist
            if (!selectedPosition && positionsRes.data.length > 0) {
                setSelectedPosition(positionsRes.data[0]._id);
            }
        } catch (error) {
            toast.error("Failed to fetch data. Please refresh the page.");
        } finally {
            setIsLoading(false); // Only set loading to false after all data is fetched
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        if (!selectedPosition) {
            toast.error("Please select a position.");
            return;
        }
        const toastId = toast.loading('Adding candidate...');
        try {
            await api.post('/admin/candidates', { name, imageUrl, positionId: selectedPosition });
            toast.success('Candidate added!', { id: toastId });
            setName('');
            setImageUrl('');
            // No need to reset selectedPosition, keep the user's choice
            await fetchData(); // Refresh all data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add candidate.', { id: toastId });
        }
    };

    const handleDeleteCandidate = async (id) => {
        if (window.confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
            const toastId = toast.loading('Deleting...');
            try {
                await api.delete(`/admin/candidates/${id}`);
                toast.success('Candidate deleted.', { id: toastId });
                await fetchData(); // Refresh all data
            } catch (error) {
                toast.error('Failed to delete candidate.', { id: toastId });
            }
        }
    };
    
    if (isLoading) return <div>Loading candidate management...</div>;

    return (
        <div>
            <PageHeader>Manage Candidates</PageHeader>
            <ContentGrid>
                <FormContainer>
                    <FormHeader>Add New Candidate</FormHeader>
                    <Form onSubmit={handleAddCandidate}>
                        <AdminStyledInput type="text" placeholder="Candidate Name" value={name} onChange={e => setName(e.target.value)} required />
                        <AdminStyledInput type="text" placeholder="Image URL (e.g., /img/candidate.jpg)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
                        <AdminStyledSelect value={selectedPosition} onChange={e => setSelectedPosition(e.target.value)} required>
                            <option value="" disabled>Select a Position</option>
                            {positions.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </AdminStyledSelect>
                        <PrimaryButton type="submit">Add Candidate</PrimaryButton>
                    </Form>
                </FormContainer>

                <ListContainer>
                    <FormHeader>Current Candidates</FormHeader>
                    <StyledTable>
                        <thead>
                            <tr>
                                <Th>Photo</Th>
                                <Th>Name</Th>
                                <Th>Position</Th>
                                <Th>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.length > 0 ? candidates.map(candidate => (
                                <Tr key={candidate._id}>
                                    <Td><CandidateImage src={candidate.imageUrl} alt={candidate.name} /></Td>
                                    <Td>{candidate.name}</Td>
                                    <Td>{candidate.position ? candidate.position.title : 'N/A'}</Td>
                                    <Td>
                                        <DeleteButton onClick={() => handleDeleteCandidate(candidate._id)}>
                                            <FaTrash />
                                        </DeleteButton>
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr><Td colSpan="4" style={{textAlign: 'center'}}>No candidates have been added yet.</Td></Tr>
                            )}
                        </tbody>
                    </StyledTable>
                </ListContainer>
            </ContentGrid>
        </div>
    );
}

export default ManageCandidatesPage;