// Popup.js
import React from 'react';

function Popup({ result, onClose }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{result.Title}</h2>
        <p><strong>Authors:</strong> {result.AuthorList}</p>
        <p><strong>Journal:</strong> {result.Journal}</p>
        <p><strong>Publication Year:</strong> {result.PublicationYear}</p>
        <p><strong>Abstract:</strong> {result.Abstract}</p>
        <button className="external-link" onClick={() => window.open(`https://pubmed.ncbi.nlm.nih.gov/${result.PMID}`, '_blank')}>
          Go to Original Webpage
        </button>
      </div>
    </div>
  );
}

export default Popup;
