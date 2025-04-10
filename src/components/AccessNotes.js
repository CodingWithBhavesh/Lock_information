import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient'; // Ensure you have the Supabase client imported
import 'bootstrap/dist/css/bootstrap.min.css';

const AccessNotes = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false); // State to track edit mode

    // Debounce function
    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Handler to fetch the note
    const fetchNote = async () => {
        if (!username || !password) return; // Prevent fetching if fields are empty
        setLoading(true);
        setError(''); // Clear error message

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

    // Debounced function to call fetchNote
    const debouncedFetchNote = debounce(fetchNote, 300); // 300 ms debounce

    // UseEffect to trigger note fetching
    useEffect(() => {
        debouncedFetchNote();
    }, [username, password]); // Fetch when username or password changes

    const saveEditedNote = async () => {
        setLoading(true);
        setError(''); // Clear error message

        const { data, error } = await supabase
            .from('notes')
            .update({ note }) // Update the note
            .eq('username', username)
            .eq('password', password);

        if (error) {
            setError('Error saving note: ' + error.message);
        } else {
            // Optimistically show a success message
            alert('Note updated successfully!');
        }
        setLoading(false);
    };
    const [usernames, setUsernames] = useState([]);
    // Load usernames from localStorage on component mount
    useEffect(() => {
        const savedUsernames = JSON.parse(localStorage.getItem('usernames')) || [];
        setUsernames(savedUsernames);
    }, []);

    return (
        <div className="mt-4" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <h2 className="text-center" style={{ fontVariantCaps: "unicase", color: "cadetblue" }}>Access Your Note</h2>
            <form className="p-3 border rounded shadow">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        list="usernameSuggestions" // Links to the datalist
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        required
                    />
                     {/* Datalist for autocomplete */}
                     <datalist id="usernameSuggestions">
                        {usernames.map((user, index) => (
                            <option key={index} value={user} />
                        ))}
                    </datalist>
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
                <button type="button" onClick={debouncedFetchNote} className="btn btn-primary" disabled={loading}>
                    {/* {loading ? 'Loading...' : 'Access Note'} */}
                    {loading ? (
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                            <span className="ms-2">Loading...</span> {/* Text next to the spinner */}
                        </div>
                    ) : (
                        "Access Note"
                    )}
                </button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            {note && editing && (
                <div>
                    <h3>Your Note:</h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)} // Make the field editable
                        style={{ width: '100%', height: '200px', margin: "0px 0px 20px" }}
                    />
                    <button onClick={saveEditedNote} style={{ marginBottom: "20px" }} className='btn btn-primary' disabled={loading}>
                        {/* {loading ? 'Saving...' : 'Save Note'} */}
                        {loading ? (
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                            <span className="ms-2">Saving....</span> {/* Text next to the spinner */}
                        </div>
                    ) : (
                        "Save Note"
                    )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccessNotes;
