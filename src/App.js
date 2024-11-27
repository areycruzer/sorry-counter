import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const Container = styled.div`
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Counter = styled.div`
  font-size: 4rem;
  margin: 2rem 0;
  color: #ff69b4;
`;

const AddButton = styled.button`
  background-color: #ff69b4;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SorryList = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 600px;
`;

const SorryItem = styled.div`
  background-color: #2a2a2a;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
`;

function App() {
  const [sorries, setSorries] = useState([]);

  useEffect(() => {
    loadSorries();
  }, []);

  const loadSorries = async () => {
    const sorryQuery = query(collection(db, 'sorries'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(sorryQuery);
    const sorryList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSorries(sorryList);
  };

  const addSorry = async () => {
    const timestamp = new Date();
    await addDoc(collection(db, 'sorries'), {
      timestamp,
      formattedDate: timestamp.toLocaleString()
    });
    loadSorries();
  };

  return (
    <Container>
      <Title>Sorry Counter</Title>
      <Counter>{sorries.length}</Counter>
      <AddButton onClick={addSorry}>+</AddButton>
      
      <SorryList>
        {sorries.map(sorry => (
          <SorryItem key={sorry.id}>
            <span>Sorry #{sorries.length - sorries.indexOf(sorry)}</span>
            <span>{sorry.formattedDate}</span>
          </SorryItem>
        ))}
      </SorryList>
    </Container>
  );
}

export default App; 