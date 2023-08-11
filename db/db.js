const mysql = require("mysql2");

// Create a connection pool
let options = {
  host: "172.25.160.6",
  user: "root",
  password: `Orange;sl;`,
  port: "3306",
  database: "loan_cdrdb",
  waitForConnections: true
};
const connection = mysql.createPool(options);

// Retrieve a connection from the pool
connection.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  } else {
    console.log("Connected");
  }
});

const dbObject = {};

/*
This method gets all users in our database
*/
dbObject.GetAllUsers = () => {
  const sql =
    "SELECT userId, firstName, lastName, username,email, levelName, number FROM users Inner Join userLevelGroup ON users.userLevel = userLevelGroup.levelId";
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.CreateNewUser = user => {
  const {
    firstname,
    lastname,
    username,
    email,
    userLevel,
    number,
    password
  } = user;
  const sql =
    "INSERT INTO users (firstName, lastName, username, email, userLevel, number, password) values (?,?,?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      [firstname, lastname, username, email, userLevel, number, password],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};
// This method is used to get user by ID
dbObject.GetUserById = id => {
  const sqlQuery = "SELECT * FROM users WHERE userId = ?";
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to get user by email
dbObject.GetUserByEmail = email => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?;`;
    connection.query(sql, [email], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to get user by username
dbObject.GetUserByUsername = username => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username=?;`;
    connection.query(sql, [username], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//This method is used to update a user by ID
dbObject.UpdateUserById = (id, user) => {
  const sql = `UPDATE users SET firstName = ?, lastName = ?, username = ?, email = ? ,number = ?, userLevel = ?, WHERE userId = ?`;
  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      [
        user.firstName,
        user.lastName,
        user.username,
        user.email,
        user.msisdn,
        user.userLevel,
        id
      ],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};
//This method is used to delete a user by ID
dbObject.DeleteUserById = id => {
  const sqlQuery = "DELETE FROM users WHERE userId = ?";

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};
//END OF USERS

//System logs
dbObject.InsertIntoSysLog = (userId, logDetails) => {
  const sql = "INSERT INTO sys_log( userId, detail) VALUES (?, ?);";
  return new Promise((resolve, reject) => {
    connection.query(sql, [userId, logDetails], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//User levels
dbObject.GetAllLevels = () => {
  const sql = "SELECT * FROM userLevelGroup";
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

//Device logs
dbObject.GetVoiceLoanInfo = msisdn => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT SUB_ID, PRI_IDENTITY,  date_format(OPER_DATE, '%a, %b %D %l:%S %p') as OPER_DATE, OPER_TYPE, (INIT_LOAN_AMT/10000) as INIT_LOAN_AMT, (INIT_LOAN_POUNDAGE/10000) as INIT_LOAN_POUNDAGE, (LOAN_AMT/10000) as LOAN_AMT, (LOAN_POUNDAGE/10000) as LOAN_POUNDAGE, (REPAY_AMT/10000) as REPAY_AMT, (REPAY_POUNDAGE/10000) as REPAY_POUNDAGE,((LOAN_AMT + LOAN_POUNDAGE)/ 10000) as UNPAID_AMT, ETU_GRACE_DATE, FORCE_REPAY_DATE, ADD_INFO_AMOUNT FROM loan_cdrTB WHERE PRI_IDENTITY = ? and ADD_INFO_AMOUNT in(12,45,65,150,500,1025,2050,4100,10250,15375) order by date_format(OPER_DATE, '%a, %b %D %l:%S %p') asc;`;
    connection.query(sql, [msisdn], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetDataLoanInfo = msisdn => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT SUB_ID, PRI_IDENTITY, date_format(OPER_DATE, '%d/%m/%Y') as OPER_DATE, OPER_TYPE, INIT_LOAN_AMT, INIT_LOAN_POUNDAGE, LOAN_AMT, LOAN_POUNDAGE, REPAY_AMT, REPAY_POUNDAGE,((LOAN_AMT + LOAN_POUNDAGE)/ 10000) as UNPAID_AMT, ETU_GRACE_DATE, FORCE_REPAY_DATE, ADD_INFO_AMOUNT FROM loan_cdrTB WHERE PRI_IDENTITY = ?;`;
    connection.query(sql, [msisdn], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetFilterResult = (startDate, endDate) => {
  const sql = `SELECT SUB_ID, PRI_IDENTITY, date_format(OPER_DATE, '%a, %b %D %l:%S %p') 
    as OPER_DATE, OPER_TYPE, (INIT_LOAN_AMT/10000) as INIT_LOAN_AMT, (INIT_LOAN_POUNDAGE/10000) 
    as INIT_LOAN_POUNDAGE, (LOAN_AMT/10000) as LOAN_AMT, (LOAN_POUNDAGE/10000) 
    as LOAN_POUNDAGE, (REPAY_AMT/10000) as REPAY_AMT, (REPAY_POUNDAGE/10000) 
    as REPAY_POUNDAGE, ((LOAN_AMT + LOAN_POUNDAGE)/ 10000) as UNPAID_AMT, ETU_GRACE_DATE, FORCE_REPAY_DATE, ADD_INFO_AMOUNT FROM loan_cdrTB WHERE (OPER_DATE between ? and ?) 
    and ADD_INFO_AMOUNT in(12,45,65,150,500,1025,2050,4100,10250,15375) order by date_format(OPER_DATE, '%a, %b %D %l:%S %p') desc`;
  return new Promise((resolve, reject) => {
    connection.query(sql, [startDate, endDate], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetSingleFilterResult = (startDate, endDate, msisdn) => {
  const sql = `SELECT SUB_ID, PRI_IDENTITY, date_format(OPER_DATE, '%a, %b %D %l:%S %p') 
    as OPER_DATE, OPER_TYPE, (INIT_LOAN_AMT/10000) as INIT_LOAN_AMT, (INIT_LOAN_POUNDAGE/10000) 
    as INIT_LOAN_POUNDAGE, (LOAN_AMT/10000) as LOAN_AMT, (LOAN_POUNDAGE/10000) 
    as LOAN_POUNDAGE, (REPAY_AMT/10000) as REPAY_AMT, (REPAY_POUNDAGE/10000) 
    as REPAY_POUNDAGE, ((LOAN_AMT + LOAN_POUNDAGE)/ 10000) as UNPAID_AMT, ETU_GRACE_DATE, FORCE_REPAY_DATE, ADD_INFO_AMOUNT FROM loan_cdrTB WHERE (OPER_DATE between ? and ?) and PRI_IDENTITY = ?
    and ADD_INFO_AMOUNT in(12,45,65,150,500,1025,2050,4100,10250,15375) order by date_format(OPER_DATE, '%a, %b %D %l:%S %p') desc`;
  return new Promise((resolve, reject) => {
    connection.query(sql, [startDate, endDate, msisdn], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

module.exports = { dbObject, options, connection };
