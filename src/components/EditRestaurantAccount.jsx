import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';


const Restaurant = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    phoneNumber: '',
    address: {
      country: '',
      city: '',
      district: '',
      street: '',
      postalCode: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'restaurants'), formData);
      alert('Restaurant added successfully');
    } catch (error) {
      console.error('Error adding restaurant: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="restaurantName" placeholder="Restaurant Name" onChange={handleChange} required />
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
      <input type="text" name="city" placeholder="City" onChange={handleChange} required />
      <input type="text" name="district" placeholder="District" onChange={handleChange} required />
      <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
      <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
      <button type="submit">Add Restaurant</button>
    </form>
  );
};

export default Restaurant;