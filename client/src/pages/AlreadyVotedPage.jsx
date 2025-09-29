// client/src/pages/AlreadyVotedPage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoterContext } from '../context/VoterContext.jsx';
import { PageContainer, FormContainer, FormTitle, FormSubtitle, PrimaryButton } from '../components/common';
import { FaCheckCircle } from 'react-icons/fa'; // Importing a checkmark icon

const pageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.9 },
};

function AlreadyVotedPage() {
  const { setVoter } = useContext(VoterContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setVoter(null);
    navigate('/');
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
        <FaCheckCircle size={70} color="#1ABC9C" style={{ marginBottom: '1.5rem' }} />
        <FormTitle>Vote Recorded</FormTitle>
        <FormSubtitle>
          Thank you for participating in the LAWSA DECIDES 2025 election. Your vote has been securely and successfully cast.
        </FormSubtitle>
        <PrimaryButton onClick={handleLogout}>
          Return to Homepage
        </PrimaryButton>
      </FormContainer>
    </PageContainer>
  );
}

export default AlreadyVotedPage;