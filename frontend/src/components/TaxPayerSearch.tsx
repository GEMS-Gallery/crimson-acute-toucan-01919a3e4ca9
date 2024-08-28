import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const TaxPayerSearch: React.FC = () => {
  const [tid, setTid] = useState('');
  const [searchResult, setSearchResult] = useState<TaxPayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!tid) {
      setError('Please enter a TID');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const result = await backend.searchTaxPayerByTID(BigInt(tid));
      if (result.length > 0) {
        setSearchResult(result[0]);
      } else {
        setError('No TaxPayer found with the given TID');
      }
    } catch (error) {
      console.error('Error searching for TaxPayer:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Search TaxPayer by TID
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="TID"
          variant="outlined"
          value={tid}
          onChange={(e) => setTid(e.target.value)}
          type="number"
          error={!!error}
          helperText={error}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          Search
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {searchResult && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Search Result:</Typography>
          <Typography>TID: {Number(searchResult.tid)}</Typography>
          <Typography>First Name: {searchResult.firstName}</Typography>
          <Typography>Last Name: {searchResult.lastName}</Typography>
          <Typography>Address: {searchResult.address}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TaxPayerSearch;
