import React, { useEffect, useState } from 'react';
import { fetchLetterPoints } from '../services/api';
import { TableBody, TableCell, TableRow } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';

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
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Letters</TableCell>
                        <TableCell align="left">Points</TableCell>
                        </TableRow>
                </TableHead>
                <TableBody>
                        {data.letterPoints.map((item, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="left">{item.letters.join(', ')}</TableCell>
                                <TableCell align="left">{item.points}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default LetterPointsAppendix;