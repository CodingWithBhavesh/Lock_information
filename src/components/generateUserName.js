
const generateUsername = (fullName) => {

    // Split the full name into parts
    const nameParts = fullName.trim().split(' ');

    // If the name is empty or only contains spaces, return an empty string
    if (nameParts === "") {
        return ""; // Or you can handle it in another way, like throwing an error
    }


    // If no name parts are found, return an empty string
    if (nameParts.length === 0) return "";

    // Create a base username using the first letter of the first name and the last name
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Handle single name case  

    // Create a username in the format: first letter of first name + last name
    let username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

   // Calculate the length of the full name
    const nameLength = nameParts.length;

    // Generate a random number between 1 and 10, then multiply it by the length of the name
    const randomMultiplier = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 10
    const randomNumber = randomMultiplier * nameLength; // Make the random number a multiple of the name length
    username += `@${randomNumber}`;

    return username;
};

export default generateUsername;
