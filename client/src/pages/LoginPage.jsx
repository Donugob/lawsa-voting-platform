// client/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { VoterContext } from '../context/VoterContext.jsx';
import { PageContainer, FormContainer, FormTitle, FormSubtitle, StyledForm, StyledInput, PrimaryButton, Message } from '../components/common';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

function LoginPage() {
  const [matricNumber, setMatricNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setVoter } = useContext(VoterContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Verifying voter...');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        matricNumber: matricNumber,
      });

      const voterData = response.data.voter;
      setVoter(voterData);
      
      toast.success('Verification Successful!', { id: toastId });

      // Redirect based on voting status
      if (voterData.hasVoted) {
        navigate('/voted');
      } else {
        navigate('/vote');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <FormContainer>
        <FormTitle>Voter Authentication</FormTitle>
        <FormSubtitle>Please enter your Matriculation Number to proceed.</FormSubtitle>
        <StyledForm onSubmit={handleLogin}>
          <StyledInput
            type="text"
            placeholder="e.g., IMSU/LAW/21/1001"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
            required
          />
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify & Proceed'}
          </PrimaryButton>
        </StyledForm>
      </FormContainer>
    </PageContainer>
  );
}

export default LoginPage;