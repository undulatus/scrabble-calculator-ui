import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { saveScore, viewTopScores, calculateScore } from '../services/api';

function WordInput() {
  const [characters, setCharacters] = useState(['', '', '', '', '', '', '', '', '', '']);
  const inputRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
  ]);
  const [displaySavedNotif, isDisplaySavedNotif] = useState(false);

  const [savedScores, setSavedScores] = useState([]);
  const [showScores, setShowScores] = useState(false);
  const [curScore, setCurScore] = useState(0);

  const handleWordInput = async (index, value) => {
    console.log(index);
    const uppercaseValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    const newCharacters = [...characters];
    newCharacters[index] = uppercaseValue;
    setCharacters(newCharacters);
    if(index === 1) {
        setCurScore(await calculateScore(uppercaseValue));
        console.log(uppercaseValue, " >> THIS setCurScore");
    } else {
        const word = characters.join('') + uppercaseValue;
        console.log(word, " >> THIS word setCurScore");
        setCurScore(await calculateScore(word));
    }
    console.log("the score : ", curScore);
    if (uppercaseValue && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && characters[index] === '' && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleButtonAction = async (action) => {
    console.log(`Action ${action} called`);
    if(action === 'reset') {
        setCharacters(['', '', '', '', '', '', '', '', '', '']);
    } else if(action === 'save') {
        const word = characters.join('');
        await saveScore(word);
        isDisplaySavedNotif(true);
        //added the below to refresh saved scores
        const scores = await viewTopScores();
        setSavedScores(scores)
    } else if(action === 'view') {
        const scores = await viewTopScores();
        console.log("trying to view top " + scores);
        setSavedScores(scores)
        if(showScores === false) {
            setShowScores(true);
        } else {
            setShowScores(false);
        }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    isDisplaySavedNotif(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {characters.map((char, index) => (
          <TextField
            key={index}
            value={char}
            onChange={(e) => handleWordInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputProps={{ maxLength: 1 }}
            sx={{ width: '50px', textAlign: 'center' }}
            inputRef={inputRefs.current[index]}
          />
        ))}
      </Box>
      <Box>
        Score: {curScore}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={() => handleButtonAction('reset')}>Reset Tiles</Button>
        <Button variant="contained" onClick={() => handleButtonAction('save')}>Save Score</Button>
        <Button variant="contained" onClick={() => handleButtonAction('view')}>View Top Scores</Button>
        <Snackbar open={displaySavedNotif} autoHideDuration={6000} onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            ContentProps={{
              sx: {
                position: 'fixed',
                left: '50%',
                bottom: '50%',
                transform: 'translate(-50%, 50%)',
                minWidth: '300px'
              }
            }}
        >
            <Alert
                onClose={handleSnackbarClose}
                severity="success"
                variant="filled"
                sx={{minWidth: '100%'}}
            >
                Successfully Saved Score!
            </Alert>
        </Snackbar>
      </Box>
      {showScores && (
        <Box sx={{ mt: 4, width: '100%', maxWidth: '600px' }}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Word</TableCell>
                  <TableCell align="center">Saved Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedScores.map((score, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{score.score}</TableCell>
                    <TableCell align="center">{score.word}</TableCell>
                    <TableCell align="center">{score.createdDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default WordInput;