This repository contains the source code for a web application consisting of a backend built with FastAPI and a frontend built with React.

Directories

1. Backend
The backend directory contains the source code for the backend of the web application, which is built using FastAPI. FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.

2. Frontend
The frontend directory contains the source code for the frontend of the web application, which is built using React. React is a JavaScript library for building user interfaces.

Features
Backend Features:
API endpoints to search for publications

Frontend Features:
User-friendly interface built using React components.
Implements features such as search functionality, pagination, and more to provide a seamless user experience.

Installation
To run the application locally, follow these steps:

Clone the repository:
git clone https://github.com/your-username/repository-name.git

Navigate to the backend directory and install the dependencies:
cd backend
pip install -r requirements.txt

Start the backend server:
uvicorn main:app --reload

Open another terminal window, navigate to the frontend directory, and install the dependencies:
cd ../frontend/publicationsfrontend
npm install

Start the frontend development server:
npm start

Access the application by visiting http://localhost:3000 in your web browser.