// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, COMPANY_NAME, CLIENT_SECRET } from './config'; // Removed CLIENT_ID
import AllTrains from './AllTrains';
import SingleTrain from './SingleTrain';

function App() {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    
    const registerCompany = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          companyName: COMPANY_NAME,
          ownerName: 'Ram',
          ownerEmail: 'ram@abc.edu',
          accessCode: CLIENT_SECRET,
        });

        const { access_token } = response.data;
        setAccessToken(access_token);
      } catch (error) {
        console.error('Failed to register company:', error);
      }
    };

    registerCompany();
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/single-train/:trainNumber">
            <SingleTrain accessToken={accessToken} />
          </Route>
          <Route path="/">
            <AllTrains accessToken={accessToken} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// SingleTrain.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

function SingleTrain({ accessToken, match }) {
  const { trainNumber } = match.params;
  const [trainDetails, setTrainDetails] = useState(null);

  useEffect(() => {
    
    const fetchSingleTrain = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trains/${trainNumber}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const train = response.data;
        setTrainDetails(train);
      } catch (error) {
        console.error(`Failed to fetch train ${trainNumber} details:`, error);
      }
    };

    if (accessToken) {
      fetchSingleTrain();
    }
  }, [accessToken, trainNumber]);

  if (!trainDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render the single train's details */}
    </div>
  );
}

export default SingleTrain;
