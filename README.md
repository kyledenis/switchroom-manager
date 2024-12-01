# Switchroom Manager

A web application for managing and documenting switchroom locations and equipment. This application allows electricians to:

- View an interactive map of the workplace
- Draw and mark areas on the map
- Attach photos and descriptions to specific locations
- Document and track switchboard locations and details

## Tech Stack

- **Frontend**: React.js with Leaflet.js for mapping
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Version Control**: GitHub

## Project Structure

```plaintext
switchroom-manager/
├── frontend/          # React application
├── backend/          # Django application
├── docker/           # Docker configuration files
├── docker-compose.yml # Docker compose for local development
└── README.md         # Project documentation
```

## Development Setup

1. Clone the repository:

    ```bash
    git clone git@github.com:kyledenis/switchroom-manager.git
    cd switchroom-manager
    ```

2. Start the development environment:

    ```bash
    docker-compose up --build
    ```

3. Access the applications:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000>
- Admin interface: <http://localhost:8000/admin>

## Features

- Interactive map interface
- Draw and edit areas on the map
- Upload and attach photos to locations
- Add detailed descriptions and notes
- User authentication and authorization
- Responsive design for mobile use

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Your chosen license]
