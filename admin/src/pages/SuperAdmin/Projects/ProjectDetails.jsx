import React from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
    const { id } = useParams(); // Get the 'id' from the route params

    return (
        <div>
            <h2>Project ID: {id}</h2>
        </div>
    );
}

export default ProjectDetails;
