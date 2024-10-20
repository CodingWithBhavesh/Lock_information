const generateUsername = (fullName) => {

    // Split the full name into parts
    const nameParts = fullName.trim().split(' ');

    // If no name parts are found, return an empty string
    if (nameParts.length === 0) return "";

    // Create a base username using the first letter of the first name and the last name
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    // Create a username in the format: first letter of first name + last name
    let username = `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`;

    // Generate a random number to ensure uniqueness
    const randomNumber = Math.floor(Math.random() * 100);
    username += randomNumber;

    return username;
};

export default generateUsername;
