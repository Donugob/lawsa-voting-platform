// client/src/admin/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';

const PageHeader = styled.h1`
  font-size: 2.5rem;
  color: #0D1B2A;
  margin-bottom: 2rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
`;

const StatValue = styled.h2`
  font-size: 3.5rem;
  color: #1ABC9C;
  margin: 0 0 10px 0;
`;

const StatLabel = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
`;

function DashboardPage() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get('/admin/results');
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <PageHeader>Election Overview</PageHeader>
      <StatsContainer>
        <StatCard>
          <StatValue>{results.totalVoters}</StatValue>
          <StatLabel>Total Eligible Voters</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{results.votedCount}</StatValue>
          <StatLabel>Voters Who Have Voted</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{results.turnout.toFixed(2)}%</StatValue>
          <StatLabel>Voter Turnout</StatLabel>
        </StatCard>
      </StatsContainer>
    </div>
  );
}

export default DashboardPage;