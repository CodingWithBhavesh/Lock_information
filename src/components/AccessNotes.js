import React, { useState } from 'react';
import supabase from './supabaseClient'; // Ensure you have the Supabase client imported

const AccessNotes = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single(); // Fetch single note

        if (error) {
            setError('Error fetching note: ' + error.message);
            setNote('');
        } else {
            setNote(data.note);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Access Your Note</h2>
            <form onSubmit={fetchNote}>
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Access Note'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {note && (
                <div>
                    <h3>Your Note:</h3>
                    <textarea value={note} readOnly style={{ width: '100%', height: '200px' }} />
                </div>
            )}
        </div>
    );
};

export default AccessNotes;
