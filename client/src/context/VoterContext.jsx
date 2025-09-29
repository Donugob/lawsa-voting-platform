// client/src/context/VoterContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const VoterContext = createContext(null);

// Create the provider component
export const VoterProvider = ({ children }) => {
  const [voter, setVoter] = useState(null);

  return (
    <VoterContext.Provider value={{ voter, setVoter }}>
      {children}
    </VoterContext.Provider>
  );
};