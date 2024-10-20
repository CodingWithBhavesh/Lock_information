import React, { useState } from 'react';
import supabase from './supabaseClient';
import generateUsername from './generateUserName'; // Import your username generation function
import 'bootstrap/dist/css/bootstrap.min.css';

const NotesForm = () => {
    const [fullName, setFullName] = useState(''); // State for full name
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to handle full name input and generate username
    const handleFullNameChange = (e) => {
        const name = e.target.value;
        setFullName(name);
        if (name) {
            const generated = generateUsername(name); // Call the username generator
            setUsername(generated); // Set the generated username
        } else {
            setUsername(''); // Clear the username if name is empty
        }
    };

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
            setFullName(''); // Clear full name
            setUsername(''); // Clear generated username
            setPassword('');
            alert('Note saved successfully!');
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center" style={{ fontVariantCaps: "unicase",color:"cadetblue" }}>Lock Your Note</h2>
            <form onSubmit={saveNote} className="p-3 border rounded shadow">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={handleFullNameChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        readOnly // Make this read-only since it's auto-generated
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
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Your note here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        required
                        style={{ height: '200px' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Lock Info'}
                </button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
        </div>
    );
};

export default NotesForm;
