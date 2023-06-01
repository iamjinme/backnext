import { useState, useEffect } from 'react'; //Se importa desde react
import axios from 'axios'; //Con axios vamos a realizar las peticiones

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);

  async function fetchData() {
    const res = await axios.get(endpoint);
    setData(res.data);
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [endpoint]);

  return data;
};

export default useFetch;
