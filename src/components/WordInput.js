import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { saveScore, viewTopScores, calculateScore } from '../services/api';
import { amber, blueGrey, brown } from '@mui/material/colors';
import Card from '@mui/joy/Card';

function WordInput() {
  const inputRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
  ]);
  const [displaySavedNotif, isDisplaySavedNotif] = useState(false);
  const [characters, setCharacters] = useState(['', '', '', '', '', '', '', '', '', '']);
  const [savedScores, setSavedScores] = useState([]);
  const [showScores, setShowScores] = useState(false);
  const [curScore, setCurScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleWordInput = async (index, value) => {
    console.log(index);
    let uppercaseValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    let newCharacters = [...characters];
    newCharacters[index] = uppercaseValue;
    const word = newCharacters.join('');
    setCurScore(await calculateScore(word));
    console.log("the score : ", curScore);
    setCharacters(newCharacters);
    if (uppercaseValue && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = async (index, event) => {
    if (event.key === 'Backspace' && characters[index] === '' && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const resetTiles = () => {
    setCharacters(['', '', '', '', '', '', '', '', '', '']);
        const word = characters.join('');
        console.log(word, " >> reset letters setCurScore");
        setCurScore(0);
  }

  const handleButtonAction = async (action) => {
    console.log(`Action ${action} called`);
    if(action === 'reset') {
        resetTiles();
    } else if(action === 'save') {
        const word = characters.join('');
        try {
          await saveScore(word);
        } catch(error) {
          console.error('Error ', error.response.data.errorMessage)
          setErrorMessage(error.response.data.errorMessage)
          console.log("check " + errorMessage)
        }
        isDisplaySavedNotif(true);
        //added the below to refresh saved scores
        const scores = await viewTopScores();
        setSavedScores(scores);
        resetTiles();
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
    setErrorMessage(null);
  };

  // styles

  const highlightTopRows = (index) => {
    if(index === 0) {
      return { backgroundColor : amber[100] };
    } else if(index === 1) {
      return {backgroundColor : blueGrey[100] };
    } else if(index === 2) {
      return {backgroundColor : brown[100] };
    }
  }

  const tableHeaderStyle = () => {
    return {
      fontWeight: 'bold', 
      textAlign: 'center',
      fontSize: 16
    };
  }

  const tableBodyStyle = () => {
    return { textAlign: 'center' };
  }

  //end styles

  return (
    <Card 
      color="neutral"
      invertedColors={false}
      orientation="vertical"
      size="lg"
      variant="soft"
      sx ={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minWidth: 600
    }}>
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
          <Button variant="contained" onClick={() => handleButtonAction('view')}>
            {showScores ? 'Hide Top Scores' : 'View Top Scores'}</Button>
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
            {errorMessage === null ? 
              <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{minWidth: '100%'}}
                >
                    Successfully Saved Score!
                </Alert> 
                  :
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{minWidth: '100%'}}
                >
                    {errorMessage}
                </Alert>
            }
          </Snackbar>
        </Box>
        {showScores && (
          <Box sx={{ mt: 4, width: '100%', maxWidth: '600px' }}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell sx={ tableHeaderStyle }>Score</TableCell>
                    <TableCell sx={ tableHeaderStyle }>Word</TableCell>
                    <TableCell sx={ tableHeaderStyle }>Saved Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedScores.map((score, index) => (
                    <TableRow key={index} sx = {highlightTopRows(index)}>
                      <TableCell sx={ tableBodyStyle }>{score.score}</TableCell>
                      <TableCell sx={ tableBodyStyle }>{score.word}</TableCell>
                      <TableCell sx={ tableBodyStyle }>{score.createdDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}
    </Card>
  );
}

export default WordInput;