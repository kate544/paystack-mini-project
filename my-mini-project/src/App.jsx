import React from 'react';
import PaystackPayment from './PaystackPayment/PaystackPayment';

function App() {
  const roomPrice = 0; 
  
  const userEmail = "kathryntokoli@gmail.com"; 

  return (
    <div className="App">
      <PaystackPayment 
        amount={roomPrice} 
        email={userEmail} 
      />
    </div>
  );
}

export default App;