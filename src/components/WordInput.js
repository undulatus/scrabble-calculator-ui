import React, { useState, useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { saveScore, viewTopScores } from '../services/api';

function WordInput() {
  const [characters, setCharacters] = useState(['', '', '', '', '', '', '', '', '', '']);
  const inputRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
  ]);

  const handleWordInput = (index, value) => {
    const uppercaseValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    const newCharacters = [...characters];
    newCharacters[index] = uppercaseValue;
    setCharacters(newCharacters);
    console.log(characters);

    if (uppercaseValue && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && characters[index] === '' && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleButtonAction = (action) => {
    console.log(`Action ${action} called`);
    if(action === 'reset') {
        setCharacters(['', '', '', '', '', '', '', '', '', '']);
    } else if(action === 'save') {
        const word = characters.join('');
        alert('save ' + word);
        saveScore(word);
    } else if(action === 'view') {
        prompt('view');
    }
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
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={() => handleButtonAction('reset')}>Reset Tiles</Button>
        <Button variant="contained" onClick={() => handleButtonAction('save')}>Save Score</Button>
        <Button variant="contained" onClick={() => handleButtonAction('view')}>View Top Scores</Button>
      </Box>
    </Box>
  );
}

export default WordInput;