import React, { useEffect, useState } from 'react';

function App() {
  
  const [state, setState] = useState(null);

  const callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };
  
  // тест гет запрос
  useEffect(() => {
    callBackendAPI()
    .then(res => setState(res.express))
    .catch(err => console.log(err));
  }, [])

  return (
    <div>
      <h1>yapidor</h1>
      <div>
          <p>{state}</p>
      </div>
    </div>
  );
}

export default App;