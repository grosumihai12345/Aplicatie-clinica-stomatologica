function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Europe/Bucharest", // Adjust the time zone as needed
  };

  return date.toLocaleString("en-US", options);
}

function convertToCamelCase(str) {
  // Replace special characters with white spaces
  const cleanStr = str.replace(/[^A-Z0-9]/gi, " ");

  // Split the string into an array of words
  const words = cleanStr.split(/\s+/);

  // Capitalize the first letter of the first word
  const firstWord =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

  // Convert the remaining words to lowercase
  const remainingWords = words.slice(1).map((word) => word.toLowerCase());

  // Join the first word and the remaining words with spaces and return the result
  return [firstWord, ...remainingWords].join(" ");
}

module.exports = {
  formatDate: formatDate,
  convertToCamelCase: convertToCamelCase,
};
