// const pool = require("../config/database");

// module.exports = {
//   receivePayment: (data, callBack) => {
//     pool.query(
//       `INSERT INTO transactions (user_id, code, reedem_amount)
//        values (?, ?, ?)`,
//       [data.user_id, data.code, data.reedem_amount],
//       (error, results) => {
//         if (error) {
//           return callBack(error);
//         }
//         return callBack(null, results);
//       }
//     );
//   },
// };
