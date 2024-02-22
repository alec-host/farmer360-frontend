import { Bar} from "react-chartjs-2";
import moment from 'moment';

import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, plugins } from 'chart.js';

const  BarGraph = ({ data }) => {

    Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, plugins);

    const chartData =  {
        labels: data.map((entry) => moment(entry.date, 'M/D/YY').format('MMM D, YYYY')),
        datasets: [
            {
                label: 'Count',
                data: data.map((entry) => entry.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust color as needed
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
            type: 'category',
            position: 'bottom',
            },
            y: {
            beginAtZero: true,
            },
        },
        plugins: {
            legend: {
            display: true,
            position: 'top', // You can adjust the position as needed
            },
            title: {
            display: true,
            text: 'Bar Chart',
            font: { size: 16 }, // You can adjust the font size as needed
            },
        },
        maintainAspectRatio: true,
        responsive: true,
        height: 400, 
        width: 600,
    };

    return (
        <Bar data={chartData} options={options} /> 
    );
};

export default BarGraph;