import React from 'react';
import Notification from './components/Notification';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 style={{textAlign:"center",marginTop:"150px"}}>Firebase Notification System</h1>
      <Notification />
    </div>
  );
}

export default App;
