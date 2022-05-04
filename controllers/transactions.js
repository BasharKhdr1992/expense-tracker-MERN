const Transaction = require('../models/Transaction');

// @desc Get all transactions
// @route GET /api/v1/transactions
// @access public
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    res.send(500).json({
      success: false,
      err: 'Server Error',
    });
  }
};

// @desc Add transaction
// @route POST /api/v1/transactions
// @access public
exports.addTransaction = async (req, res, next) => {
  const { title, amount } = req.body;
  try {
    const transaction = await Transaction.create(req.body);

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((value) => value.message);
      return res.status(400).json({
        success: false,
        err: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        err: 'Server Error',
      });
    }
  }
};

// @desc Delete transaction
// @route DELETE /api/v1/transactions/:id
// @access public
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found',
      });
    }

    await transaction.remove();
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      err: 'server error',
    });
  }
};
