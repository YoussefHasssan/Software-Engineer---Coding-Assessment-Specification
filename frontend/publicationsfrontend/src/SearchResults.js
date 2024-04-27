// SearchResults.js
import React from 'react';

function SearchResults({ results, onResultClick, totalCount, perPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalCount / perPage);
  
    const handlePageChange = (newPage) => {
      onPageChange(newPage);
    };
  
    return (
      <div className="search-results">
        <h2>Search Results</h2>
        {results && results.length > 0 && (  // Add null check for results
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
                <th>Publication Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.PMID}>
                  <td>{result.Title}</td>
                  <td>{result.AuthorList}</td>
                  <td>{result.PublicationYear}</td>
                  <td>
                    <button className='details-button' onClick={() => onResultClick(result)}>Details</button>
                    <button className="external-link-button" onClick={() => window.open(`https://pubmed.ncbi.nlm.nih.gov/${result.PMID}`, '_blank')}>
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
    );
  }
  
export default SearchResults;
