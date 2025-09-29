// client/src/components/common.js
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

export const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

export const FormTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

export const FormSubtitle = styled.p`
  color: #bdc3c7;
  margin-bottom: 2.5rem;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StyledInput = styled.input`
  font-family: 'Montserrat', sans-serif;
  width: 100%;
  padding: 15px 20px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;
  border-radius: 8px;
  color: #FFFFFF;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #bdc3c7;
  }

  &:focus {
    outline: none;
    border-color: #1ABC9C;
  }
`;

export const PrimaryButton = styled.button`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 15px 30px;
  background-color: #1ABC9C; /* Teal Accent */
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #16a085;
  }

  &:disabled {
    background-color: #7f8c8d;
    cursor: not-allowed;
  }
`;

export const Message = styled.p`
    margin-top: 1.5rem;
    font-weight: bold;
    color: ${props => props.type === 'error' ? '#e74c3c' : '#1ABC9C'};
`;