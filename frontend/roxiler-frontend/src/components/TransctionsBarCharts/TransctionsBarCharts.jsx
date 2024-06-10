import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './TransactionsBarCharts.css';

const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TransactionsBarCharts = ({ selectedMonth }) => {
    const [data, setData] = useState(null);
    const [totalSoldItems, setTotalSoldItems] = useState(0);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://roxiler-assignment-apis.vercel.app/api/barcharts?month=${monthsArray.indexOf(selectedMonth) + 1}`);
                setData(response.data);

                const soldItemsCount = response.data.reduce((total, item) => total + item.count, 0);
                setTotalSoldItems(soldItemsCount);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, [selectedMonth]);

    useEffect(() => {
        if (data) {
            renderChart();
        }
    }, [data]);

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('transactionsBarChart');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.range),
                datasets: [{
                    label: 'Number of Items',
                    data: data.map(item => item.count),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Items'
                        },
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            callback: function(value) {
                                return value;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Price Range'
                        }
                    }
                }
            }
        });
    };

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

    return (
        <div className="transactions-bar-chart-container">
            <h2 className="chart-title">Bar Chart Stats - {monthNames[monthsArray.indexOf(selectedMonth)]}</h2>
            <div className="total-sold-items">Total Sold Items: {totalSoldItems}</div>
            <canvas id="transactionsBarChart" className="chart-canvas"></canvas>
        </div>
    );
};

export default TransactionsBarCharts;
