import React, { useEffect, useState } from 'react';
import { fetchLetterPoints } from '../services/api';

function LetterPointsAppendix() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataList = await fetchLetterPoints();
        setData(dataList);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

    if (loading) {
        return <p>Starting up...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.errorMessage}</p>;
    }

    return (
        <div>
            {data.letterPoints.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
                <p>{item.letters.join(', ')} = {item.points}</p>
            </div>
            ))}
        </div>
    );
}

export default LetterPointsAppendix;