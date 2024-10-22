// src/App.js

import React, { useState, useEffect } from 'react';
import supabase from './components/supabaseClient'; // Import the Supabase client
import NotesForm from './components/notesForm';
import AccessNotes from './components/AccessNotes'; // Import the AccessNotes component
// import './App.css'; // Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const [notes, setNotes] = useState([]);

    // Function to fetch notes from Supabase
    const fetchNotes = async () => {
        const { data, error } = await supabase.from('notes').select('*');
        if (error) {
            console.error('Error fetching notes:', error);
        } else {
            setNotes(data);
        }
    };

    // Fetch notes when the component mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    const handleNoteSaved = () => {
        // Refresh notes after saving
        fetchNotes();
    };

    return (
        <div className="container mt-4 ">
            <h1 style={{fontSize:"5rem",color:"grey",fontFamily:"cursive"}}>Notes Locker</h1>
            <NotesForm onNoteSaved={handleNoteSaved} />
            

            {/* Add AccessNotes component and pass notes as prop */}
            <div className='mb-5'>

            <AccessNotes notes={notes} />
            </div>
        </div>
    );
};

export default App;
