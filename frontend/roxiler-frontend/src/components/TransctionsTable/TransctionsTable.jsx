import React, { useState, useEffect } from 'react';
import './TransctionsTable.css';

const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TransctionsTable = ({selectedMonth,onMonthChange}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Set perPage to a static value of 10
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (month, search = '', page = 1, perPage = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://roxiler-assignment-apis.vercel.app/api/transactions?month=${monthsArray.indexOf(month) + 1}&search=${search}&page=${page}&perPage=${perPage}`
      );
      const data = await response.json();
      setTransactions(data.transactions || []);
      setTotalPages(Math.ceil(data.totalTransactions / perPage));
    } catch (error) {
      setError('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedMonth, searchQuery, currentPage, perPage);
  }, [selectedMonth, searchQuery, currentPage]);

  const handleMonthChange = (e) => {
    onMonthChange(e.target.value)
    setTransactions([])
    setCurrentPage(1); // Reset to first page on month change
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='transcationContainer'>
      <div className='container'>
        <div className='header'>
          <input type="text" placeholder='Search transaction' onChange={handleSearchChange} />
          <select value={selectedMonth} onChange={handleMonthChange}>
            {monthsArray.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div className='table'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Sold</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction._id}</td>
                    <td>{transaction.title}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.price}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.sold ? 'Yes' : 'No'}</td>
                    <td><img src={transaction.image} alt={transaction.title} style={{ width: '100px', display: 'inline' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className='pagination'>
          <span>Page No : {currentPage}</span>
          <div>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span>-</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
          <span>Per Page : {10}</span>
        </div>
      </div>
    </div>
  );
};

export default TransctionsTable;
