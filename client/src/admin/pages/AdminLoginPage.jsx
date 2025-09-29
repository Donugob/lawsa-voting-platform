// client/src/admin/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PageContainer, FormContainer, FormTitle, FormSubtitle, StyledForm, StyledInput, PrimaryButton } from '../../components/common'; // Reusing our awesome common components
import { FaUserShield } from 'react-icons/fa'; // A nice "admin" icon

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.95 },
};

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Authenticating...');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password,
      });

      localStorage.setItem('adminToken', response.data.token);
      toast.success('Login Successful!', { id: toastId });
      navigate('/admin/dashboard');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Authentication failed.';
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
      transition={{ duration: 0.4 }}
    >
      <FormContainer>
        <FaUserShield size={60} color="#1ABC9C" style={{ marginBottom: '1.5rem' }} />
        <FormTitle>Admin Portal</FormTitle>
        <FormSubtitle>Please enter your ILEC administrator credentials to continue.</FormSubtitle>
        <StyledForm onSubmit={handleAdminLogin}>
          <StyledInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <StyledInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Secure Login'}
          </PrimaryButton>
        </StyledForm>
      </FormContainer>
    </PageContainer>
  );
}

export default AdminLoginPage;