import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransctionsStatistics.css';

const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TransctionsStatistics = ({ selectedMonth }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://roxiler-assignment-apis.vercel.app/api/statistics?month=${monthsArray.indexOf(selectedMonth) + 1}`);
                setData(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, [selectedMonth]);

    // Function to get month name from month number
    const getMonthName = (monthNumber) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNumber - 1];
    };

    return (
        <div className='statisticsContainer'>
            <h1>{`Statistics - ${data ? getMonthName(selectedMonth) : 'Loading...'}`}</h1>
            <div>
                <p>{`Total sale           ${data ? data.totalSaleAmount : 'Loading...'}`}</p>
                <p>{`Total sold items   ${data ? data.totalSoldItems : 'Loading...'}`}</p>
                <p>{`Total not sold items ${data ? data.totalNotSoldItems : 'Loading...'}`}</p>
            </div>
        </div>
    );
};

export default TransctionsStatistics;
