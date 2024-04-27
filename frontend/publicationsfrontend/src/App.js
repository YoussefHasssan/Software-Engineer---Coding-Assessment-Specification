// App.js
import React, { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import Popup from './Popup';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = () => {
    setLoading(true);
    console.log("Finding data");
    fetch(`http://127.0.0.1:8000/publications/?query=${query}&page=${pageNumber}&per_page=${perPage}`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setResults(data.results);
      setTotalCount(data.count);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  
  const handleResultClick = (result) => {
    setSelectedResult(result);
  };

  const handleClosePopup = () => {
    setSelectedResult(null);
  };

  const handleClearResults = () => {
    setResults([]);
    setQuery('');
    setTotalCount(0);
    setPageNumber(1);
  };

  const handlePageChange = (newPageNumber) => {
    setLoading(true); // Set loading to true when changing pages
    setResults([]);
    setPageNumber(parseInt(newPageNumber));
    handleSearch();
  };
  

  return (
    <div className="app-container">
      <h1>Search Publications</h1>
      <div className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter search term"
        />
        <select value={perPage} onChange={e => setPerPage(e.target.value)}>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={handleSearch} disabled={loading} className='search-button'>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={handleClearResults} disabled={loading} className='clear-button'>
          Clear Results
        </button>
      </div>
      {loading && <div className="loader">Loading...</div>}
      <SearchResults
        results={results}
        onResultClick={handleResultClick}
        totalCount={totalCount}
        perPage={perPage}
        currentPage={pageNumber}
        onPageChange={handlePageChange}
      />
      {selectedResult && (
        <Popup result={selectedResult} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default App;
