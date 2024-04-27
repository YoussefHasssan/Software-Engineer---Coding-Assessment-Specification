from fastapi import APIRouter, HTTPException, Query
import requests
import xmltodict

router = APIRouter()

# Third-party API base URL
API_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"


# Endpoint to retrieve publication IDs based on a query
@router.post('/')
async def get_publication_info(query: str = Query(..., description="Query string"),
                               page: int = Query(1, description="Page number"),
                               per_page: int = Query(10, description="Items per page")):
    # Calculate the start index for pagination
    retstart = (page - 1) * per_page
    
    try:
        # Make request to third-party API
        response = requests.get(API_BASE_URL+'esearch.fcgi', params={'term': query, 'retstart': retstart, 'retmax': per_page, 'retmode': 'json', 'db': 'pubmed'})
        response.raise_for_status()  # Raise an exception for non-200 status codes
        
        # Extract publication IDs from the response
        response_data = response.json()
        count = response_data['esearchresult']['count']
        
        # Prepare the response structure
        result = {
            "count": count,
            "results": []
        }
        
        # Check if there are any results
        if count == 0:
            return result
        
        id_list = response_data['esearchresult']['idlist']
        
        # Now, send a request to fetch details for these IDs
        details_response = requests.get(API_BASE_URL+'efetch.fcgi', params={'db': 'pubmed', 'id': ','.join(id_list), 'retmode': 'xml'})
        details_response.raise_for_status()  # Raise an exception for non-200 status codes
        
        # Convert XML response to JSON
        json_response = xmltodict.parse(details_response.content)
        
       # Extracting required information
        extracted_info = []
        if 'PubmedArticleSet' in json_response:
            for article in json_response['PubmedArticleSet']['PubmedArticle']:
                medline_citation = article['MedlineCitation']
                pmid = medline_citation.get('PMID', {}).get('#text', None)
                # Extract Title
                article_title_data = medline_citation['Article'].get('ArticleTitle', None)
                article_title = article_title_data.get('#text') if isinstance(article_title_data, dict) else article_title_data
                abstract_data = medline_citation['Article'].get('Abstract', {}).get('AbstractText', None)
                abstract = abstract_data if isinstance(abstract_data, str) else abstract_data[0].get('#text', None) if isinstance(abstract_data, list) else None
                author_list = ", ".join([f"{author['ForeName']} {author['LastName']}" for author in medline_citation['Article'].get('AuthorList', {}).get('Author', [])])
                journal = medline_citation['Article']['Journal'].get('Title', None)
                journal_year = medline_citation['Article']['Journal']['JournalIssue']['PubDate'].get('Year', None)
                mesh_heading_list = medline_citation.get('MeshHeadingList', {}).get('MeshHeading', [])
                mesh_terms = [mesh.get('#text', None) for mesh in mesh_heading_list]

                # Constructing the formatted response
                extracted_info.append({
                    "PMID": pmid,
                    "Title": article_title,
                    "Abstract": abstract,
                    "AuthorList": author_list,
                    "Journal": journal,
                    "PublicationYear": journal_year,
                    "MeSHTerms": mesh_terms
                })

        
        # Update the result field with the extracted information
        result["results"] = extracted_info
        
        return result
    
    except requests.RequestException as e:
        # Catch any request-related exceptions
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")



# Endpoint to fetch detailed information for a single publication by ID
@router.get('/details/{publication_id}')
async def get_publication_details(publication_id: str):
    try:
        # Make request to third-party API for detailed information
        response = requests.get(f"{API_BASE_URL}/efetch.fcgi", params={'db': 'pubmed', 'id': publication_id, 'retmode': 'xml'})
        response.raise_for_status()  # Raise an exception for non-200 status codes
        
        # Convert XML response to dictionary
        json_response = xmltodict.parse(response.content)
        
        return json_response
    
    except requests.RequestException as e:
        # Catch any request-related exceptions
        raise HTTPException(status_code=500, detail=f"Failed to fetch details for publication ID {publication_id}: {str(e)}")
