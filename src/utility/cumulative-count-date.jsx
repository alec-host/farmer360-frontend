const getCumulativeCounts = (dataArray,startDate,endDate) => {

    const filteredData = dataArray.filter((item) => {
      const currentDate = new Date(item.date_created);
      return currentDate >= new Date(startDate) && currentDate <= new Date(endDate);
    });

    const cumulativeCounts = filteredData.reduce((accumulator, currentItem) => {
      const dateCreatedKey = new Date(currentItem.date_created).toLocaleDateString('en-US',{
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
      });
      accumulator[dateCreatedKey] = (accumulator[dateCreatedKey] || 0) + 1;
      return accumulator;
    }, {});

    const resultArray = Object.entries(cumulativeCounts).map(([date, count]) => ({
        date,
        count,
      }));
  
    return resultArray;
};

export default getCumulativeCounts;