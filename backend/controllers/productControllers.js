const Product = require('../models/productsModel.js');
const axios = require('axios');

const insertingData = async (req,res)=>{
    try{
        const dataUrl = process.env.DATA_URL
        const response = await axios.get(dataUrl);
        const data = await response.data;

        await Product.deleteMany({});

        await Product.insertMany(data);
        res.json({ message: 'Database initialized successfully.' });

    }catch(error){
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTransactions = async (req, res) => {
    try {
      const { page = 1, perPage = 10, search = '', month } = req.query;
  
      const searchQuery = {
        $or: [
          { productTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ]
      };
  
      // Add condition to search by month if provided
      if (month) {
        // Extract the numeric value of the month (1 for January, 2 for February, etc.)
        const monthNumber = parseInt(month, 10);
        // Construct query to search by month
        searchQuery.dateOfSale = {
          $gte: new Date(`${monthNumber}-01`),
          $lt: new Date(`${monthNumber + 1}-01`)
        };
      }
  
      // If search is a number, add it to the query for the price field
      if (!isNaN(search)) {
        searchQuery.$or.push({ price: Number(search) });
      }
  
      const transactions = await Product.find(search ? searchQuery : {})
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
  
      const totalTransactions = await Product.countDocuments(search ? searchQuery : {});
  
      res.json({
        transactions,
        totalTransactions,
        currentPage: Number(page),
        totalPages: Math.ceil(totalTransactions / perPage)
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }

        const monthInt = parseInt(month);
        if (monthInt < 1 || monthInt > 12) {
            return res.status(400).json({ message: 'Invalid month value' });
        }

        const totalSaleAmountResult = await Product.aggregate([
            {
                $match: {
                    sold: true,
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$price" }
                }
            }
        ]);

        const totalSaleAmount = totalSaleAmountResult.length > 0 ? totalSaleAmountResult[0].totalSales : 0;

        const totalSoldItems = await Product.countDocuments({
            sold: true,
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] }
        });

        const totalNotSoldItems = await Product.countDocuments({
            sold: false,
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] }
        });

        res.json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBarCharts = async (req, res) => {
  try {
      const { month } = req.query;

      if (!month) {
          return res.status(400).json({ message: 'Month is required' });
      }

      const monthInt = parseInt(month, 10);
      if (monthInt < 1 || monthInt > 12) {
          return res.status(400).json({ message: 'Invalid month value' });
      }

      const priceRanges = [
          { range: "0-100", min: 0, max: 100 },
          { range: "101-200", min: 101, max: 200 },
          { range: "201-300", min: 201, max: 300 },
          { range: "301-400", min: 301, max: 400 },
          { range: "401-500", min: 401, max: 500 },
          { range: "501-600", min: 501, max: 600 },
          { range: "601-700", min: 601, max: 700 },
          { range: "701-800", min: 701, max: 800 },
          { range: "801-900", min: 801, max: 900 },
          { range: "901-above", min: 901, max: Number.MAX_SAFE_INTEGER }
      ];

      const pipeline = [
          {
              $match: {
                  $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] }
              }
          },
          {
              $facet: priceRanges.reduce((acc, { range, min, max }) => {
                  acc[range] = [
                      { $match: { price: { $gte: min, $lt: max } } },
                      { $count: "count" }
                  ];
                  return acc;
              }, {})
          }
      ];

      const result = await Product.aggregate(pipeline);
      const response = priceRanges.map(({ range }) => ({
          range,
          count: result[0][range][0] ? result[0][range][0].count : 0
      }));

      res.json(response);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

  
module.exports = {insertingData,getTransactions,getStatistics,getBarCharts};