import React, { useState } from 'react';
import TransctionsTable from './components/TransctionsTable/TransctionsTable.jsx'
import TransctionsStatistics from './components/TransctionsStatistics/TransctionsStatistics';
import TransctionsBarCharts from './components/TransctionsBarCharts/TransctionsBarCharts.jsx';
import './App.css'



const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('Mar');

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  return (
    <div>
      <TransctionsTable selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
      <TransctionsStatistics selectedMonth={selectedMonth}/>
      <TransctionsBarCharts selectedMonth={selectedMonth}/>
    </div>
  );
};

export default App;

