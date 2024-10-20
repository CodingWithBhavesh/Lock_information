// src/App.js

import React, { useState, useEffect } from 'react';
import supabase from './components/supabaseClient'; // Import the Supabase client
import NotesForm from './components/notesForm';
import AccessNotes from './components/AccessNotes'; // Import the AccessNotes component
import './App.css'; // Import CSS

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
        <div className="app-container">
            <h1>Notes Locker</h1>
            <NotesForm onNoteSaved={handleNoteSaved} />
            <h2>Saved Notes</h2>
            <div className="notes-list">
                {notes.map((note) => (
                    <div key={note.id} className="note-item">
                        <strong>{note.name}</strong>: {note.note}
                    </div>
                ))}
            </div>

            {/* Add AccessNotes component and pass notes as prop */}
            <AccessNotes notes={notes} />
        </div>
    );
};

export default App;
