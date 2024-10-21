import React, { useState } from 'react';
import supabase from './supabaseClient'; // Ensure you have the Supabase client imported
import 'bootstrap/dist/css/bootstrap.min.css';

const AccessNotes = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false); // State to track edit mode

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
            setEditing(true);
        }
        setLoading(false);
    };

    const saveEditedNote = async () => {
        setLoading(true);
        setError('');

        const { data, error } = await supabase
            .from('notes')
            .update({ note }) // Update the note
            .eq('username', username)
            .eq('password', password);

        if (error) {
            setError('Error saving note: ' + error.message);
        } else {
            alert('Note updated successfully!');
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
            {note && editing && (
                <div className='mb-4'>
                    <h3>Your Note:</h3>
                    <textarea 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} // Add this to make the field editable
                        style={{ width: '100%', height: '200px',margin:"29px" }} 
                    />
                    <button onClick={saveEditedNote} style={{marginBottom:"20px"}} className='btn btn-primary' disabled={loading}>
                        {loading ? 'Saving...' : 'Save Note'}
                    </button>   
                </div>
            )}
        </div>
    );
};

export default AccessNotes;
