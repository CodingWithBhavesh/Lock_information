import React, { useState } from 'react';
import supabase from './supabaseClient'; // Ensure you have the Supabase client imported
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="container mt-4">
            <h2 className="text-center" style={{ fontVariantCaps: "unicase",color:"cadetblue" }}>Access Your Note</h2>
            <form onSubmit={fetchNote} className="p-3 border rounded shadow">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Loading...' : 'Access Note'}
                </button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            {note && (
                <div className="mt-4">
                    <h3>Your Note:</h3>
                    <textarea
                        value={note}
                        readOnly
                        className="form-control"
                        style={{ height: '200px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default AccessNotes;
