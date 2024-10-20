const generateUsername = (name) => {
    // Generate a unique suffix (could be based on the current timestamp or random number)
    const uniqueSuffix = Date.now(); // or Math.floor(Math.random() * 1000);
    return `${name.replace(/\s+/g, '_')}_${uniqueSuffix}`; // Replace spaces with underscores
};
