import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import ShowAllProducts from './ShowAllProducts';
const User= () => {
  
  return (
    
      <div>
        <Navbar  />
  
        <ShowAllProducts />
      </div>
    
    
  );
};

export default User;