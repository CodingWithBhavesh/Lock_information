import React, { useState } from 'react';
import supabase from './supabaseClient';
import generateUsername from './generateUserName';// Import your Supabase client

const NotesForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const saveNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Save note to Supabase
        const { data, error } = await supabase
            .from('notes')
            .insert([{ username, password, note }]);

        if (error) {
            setError('Error saving note: ' + error.message);
        } else {
            setNote('');
            setUsername('');
            setPassword('');
            alert('Note saved successfully!');
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Lock Your Note</h2>
            <form onSubmit={saveNote}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Your note here..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    style={{ width: '100%', height: '200px' }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Lock Info'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default NotesForm;
