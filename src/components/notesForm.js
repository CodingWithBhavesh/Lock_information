import React, { useState } from 'react';
import supabase from './supabaseClient';
import generateUsername from './generateUserName'; // Import your username generation function
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const NotesForm = () => {
    const [fullName, setFullName] = useState(''); // State for full name
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copyMessage, setCopyMessage] = useState(''); // State for copy message
    const [saveMessage, setSaveMessage] = useState(''); // State for save success message

    // Function to handle copying the username to clipboard
    const handleCopy = () => {
        if (fullName.length !== 0) {
            navigator.clipboard.writeText(username);
            setCopyMessage('Username copied!'); // Set message when username is copied
        } else {
            setCopyMessage(''); // Clear message if no full name
        }
    };

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
        setSaveMessage(''); // Clear save message

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            setLoading(false);
            return;
        }

        // Save note to Supabase
        const { data, error } = await supabase
            .from('notes')
            .insert([{ full_name: fullName, username, password, note }]); // Include full_name

        if (error) {
            setError('Error saving note: ' + error.message);
        } else {
            setNote('');
            setFullName(''); // Clear full name
            setUsername(''); // Clear generated username
            setPassword('');
            setConfirmPassword(''); // Clear confirm password
            setSaveMessage('Note saved successfully!'); // Show success message
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center" style={{ fontVariantCaps: "unicase" }}>Lock Your Note</h2>
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
                <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        readOnly // Make this read-only since it's auto-generated
                    />
                    <button type="button" className="btn btn-primary" onClick={handleCopy}>
                        Copy
                    </button>
                </div>

                {/* Display copy message */}
                {copyMessage && <p className="text-success">{copyMessage}</p>}

                {/* Password fields */}
                <div className="mb-3" style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'} // Toggle confirm password visibility
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                        }}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </div>
                <div className="mb-3" style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'} // Toggle confirm password visibility
                        className="form-control"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                        }}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
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

            {/* Display error or save success messages */}
            {error && <p className="text-danger mt-3">{error}</p>}
            {saveMessage && <p className="text-success mt-3">{saveMessage}</p>}
        </div>
    );
};

export default NotesForm;
