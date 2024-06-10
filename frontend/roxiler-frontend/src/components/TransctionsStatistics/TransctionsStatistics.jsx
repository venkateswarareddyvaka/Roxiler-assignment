// import React, { useEffect,useState } from 'react'
// import axios from 'axios';
// import './TransctionsStatistics.css'

// const TransctionsStatistics = () => {

//     const [data, setData] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(()=>{
//         const fetchData = async () => {
//             try {
//               const response = await axios.get('https://roxiler-assignment-apis.vercel.app/api/statistics?month=8');
//               setData(response.data);
//             } catch (error) {
//               setError(error);
//             }
//           };
      
//           fetchData();
//     },[])

//     // console.log(data)

//   return (
//     <div>
//         <h1>{`Statistics - June`}</h1>
//         <div>
//             {/* <p>{`Total sale  ${data.totalSaleAmount}`}</p>
//             <p>{`Total sold item    ${data.totalSoldItems}`}</p>
//             <p>{`Total not sold item  ${data.totalNotSoldItems}`}</p> */}
//         </div>
//     </div>
//   )
// }

// export default TransctionsStatistics;

import React from 'react';

const Table = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Doe', age: 22 },
    { id: 3, name: 'Bob Smith', age: 30 },
    { id: 4, name: 'Alice Johnson', age: 27 },
    { id: 5, name: 'Mike Brown', age: 29 },
  ];

  return (
    <div style={{ height: '300px', overflow: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, name, age }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;