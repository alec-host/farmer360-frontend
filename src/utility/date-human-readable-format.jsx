const humanReadableDate = (dateString) => {
    // Convert the input string to a Date object
    const date = new Date(dateString);

    // Format the date to "MM/DD/YYYY"
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return formattedDate;
};

export default humanReadableDate;