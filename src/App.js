// src/App.js

import React, { useState, useEffect } from 'react';
import supabase from './components/supabaseClient'; // Import the Supabase client
import NotesForm from './components/notesForm';
import AccessNotes from './components/AccessNotes'; // Import the AccessNotes component
import Note from './components/Notes'; // Import the AccessNotes component

import './App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
// import LiveChat from './components/LiveChat';
import Access from './components/Access';
import PokemonQuiz from './components/pokimon';
import { MdMargin } from 'react-icons/md';
import { messaging } from './firebase-config'; // Adjust the path as needed
import { getToken, onMessage } from 'firebase/messaging';


const App = () => {

    useEffect(() => {
        // Request permission to send notifications
        const requestPermission = async () => {
          try {
            const token = await getToken(messaging, {
              vapidKey: "AIzaSyBUr1mzLde8O7uSdpBzGZXP7PrcCNyq4Vo",
            });
            if (token) {
              console.log("Notification Token:", token);
              // Save the token to your database
            }
          } catch (error) {
            console.error("Permission denied or error:", error);
          }
        };
    
        requestPermission();
    
        // Handle incoming messages
        onMessage(messaging, (payload) => {
          console.log("Message received:", payload);
          // Show notification or update UI here
        });
      }, []);   

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

    const [currentView, setCurrentView] = useState('notesForm'); // State to manage current view
       // Function to switch views
       const switchView = (view) => {
        setCurrentView(view);
    };

    return (
        <div className="container mt-4 my-4 ">
            <h1 style={{fontSize:"5rem",color:"grey",fontFamily:"cursive"}}>Notes Locker</h1>
            {/* <NotesForm onNoteSaved={handleNoteSaved} /> */}
            <div className="mb-3">
                {/* Conditionally render the Add Note button */}
                {currentView !== 'notesForm' && (
                    <button className="btn btn-primary mx-2"  onClick={() => switchView('notesForm')}>
                        Add Note
                    </button>
                )}
                {/* Conditionally render the Access Notes button */}
                {currentView !== 'accessNotes' && (
                    <button className="btn btn-primary mx-2" onClick={() => switchView('accessNotes')}>
                        Access Notes
                    </button>
                )}  
                {currentView !== 'PokemonQuiz' && (
                    <button className="btn btn-primary mx-2" onClick={() => switchView('PokemonQuiz')}>
                        PokemonQuiz
                    </button>
                )}          
            </div>

            


            {/* Conditional rendering based on currentView state */}
            {currentView === 'accessNotes' && <Access notes={notes}  />}
            {currentView === 'notesForm' && <Note onNoteSaved={handleNoteSaved}   />}
            {currentView === 'PokemonQuiz' && <PokemonQuiz />}

            

            {/* Add AccessNotes component and pass notes as prop */}
            {/* <div className='mb-5'>

            <AccessNotes notes={notes} />
            </div>*/}
        </div> 
    );
};


export default App;
