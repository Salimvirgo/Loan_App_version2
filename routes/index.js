const express = require("express");
const indexRouter = express.Router();
const bcrypt = require("bcryptjs");
const { dbObject } = require("../db/db");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const moment = require("moment");
const { ensureAuthenticated } = require("../auth/authenticate");
const router = require("./admin");
const excel = require("exceljs");
const fs = require("fs");
var rfs = require("rotating-file-stream"); // version 2.x
const path = require("path");
const xl = require("excel4node");
var toExcel = require("to-excel").toExcel;
const XLSX = require("xlsx");
let { PythonShell } = require("python-shell");
let Tuple = require("tuple");
var http = require("http");
const multer = require("multer");
const IP = require("ip");
const MacAddress = require("get-mac-address");
const UserAgent = require("user-agents");
const requestIp = require("request-ip");
const { zip } = require("zip-a-folder");
var hostname = require("hostname");
const os = require("os");

//app.use(fileUpload());
const isAudit = 3;
let auditName = "";

router.use(async (req, res, next) => {
  auditName = typeof req.user != "undefined" ? req.user.firstName : "";
  levels = await dbObject.GetAllLevels();
  users = await dbObject.GetAllUsers();
  //audits = await dbObject.GetAllUserLogs();
  //requestAudits = await dbObject.GetAllRequestLogs();
  //filterResults = await dbObject.GetFilterResult();
  next();
});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./outputFile/ClientSide/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + moment());
  }
});

var upload = multer({ storage: storage });

let logs = [];

router.use(async (req, res, next) => {
  levels = await dbObject.GetAllLevels();
  users = await dbObject.GetAllUsers();
  next();
});

router.get("/", async (req, res) => {
  res.status(200).render("login");
});

router.get("/login", async (req, res) => {
  res.status(200).render("login");
});

// router.get("/dashboard", (req, res) => {
//     res.render('dashboard')
// });

router.get("/loan-logs", (req, res) => {
  // let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  const { userId, userLevel, username } = req.user;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const hostName = os.hostname();
  // console.log(hostname());
  // console.log(hostName);
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  // console.log(req.user);
  const presentDateTime = moment().format("LLLL");
  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };

  //const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail)
  //console.log(CreatedAuditTrail);
  res.render("loan-logs", { logs });
});

router.get("/audit-dashboard", ensureAuthenticated, async (req, res) => {
  const { userId, userLevel, username } = req.user;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data
  const useragent = JSON.stringify(userAgent)
  const method = req.method;
  const endpoint = req.originalUrl;
  const presentDateTime = moment().format('LLLL');
  const newLoginTrail = { 
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  }
  //const CreatedAuditTrail = await dbObject.CreateNewTrail(newLoginTrail)

  //console.log(requestAudits);
  res.render("audit/audit-dashboard", {
    //requestAudits,
    isAudit,
    pageTitle: "Request Statistics",
    auditName,
  });
});

router.get("/single-audit-dashboard", ensureAuthenticated, async (req, res) => {
  const { userId, userLevel, username } = req.user;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data
  const useragent = JSON.stringify(userAgent)
  const method = req.method;
  const endpoint = req.originalUrl;
  const presentDateTime = moment().format('LLLL');
  const newLoginTrail = { 
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  }
  //const CreatedAuditTrail = await dbObject.CreateNewTrail(newLoginTrail)

  //console.log(requestAudits);
  res.render("audit/single-audit-dashboard", {
    //requestAudits,
    isAudit,
    pageTitle: "Request Statistics",
    auditName,
  });
});

router.get("/imei-check", (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  const { userId, userLevel, username } = req.user;
  const presentDateTime = moment().format("LLLL");
  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };

  const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail);
  res.render("imei-check", { logs });
});

router.get("/bulkCall-logs", (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  const { userId, userLevel, username } = req.user;
  const presentDateTime = moment().format("LLLL");
  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };

  //const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail)
  res.render("oldCall-log", { logs });
});

router.get("/bulkImei-check", (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  const { userId, userLevel, username } = req.user;
  const presentDateTime = moment().format("LLLL");
  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };

  const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail);
  res.render("oldImei-check", { logs });
});

router.get("/msisdn", (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  const { userId, userLevel, username } = req.user;
  const presentDateTime = moment().format("LLLL");
  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };

  const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail);
  res.render("msisdn-check");
});

//router for logging users in to their account after validation
router.post(
  "/login",
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Please Provide a username")
      .trim()
      .escape(),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Please provide your password.")
  ],
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const { userId, userLevel } = req.user[0];
    const { username, password } = req.body;
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgents = new UserAgent();
    const { userAgent } = userAgents.data;
    const useragent = JSON.stringify(userAgent);
    const method = req.method;
    const endpoint = req.originalUrl;
    const presentDateTime = moment().format("LLLL");
    const newLoginTrail = {
      UserID: userId,
      UserName: username,
      IPAddress: ipAddress,
      Useragent: useragent,
      Method: method,
      URL: endpoint,
      UserLevel: userLevel
    };
    // const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail);
    //console.log(CreatedAuditTrail);

    if (errors.length > 0) {
      console.log("There was an error ");
      return res.render("login", { errors, username, password });
    } else {
      const { userLevel } = req.user[0];
      if (userLevel === 1) {
        return res.redirect("admin/admin-dashboard");
      }else if (userLevel === 3) {
        return res.redirect("audit-dashboard");
      } else {
        req.flash("success", "Successfully Logged In");
        return res.redirect("/loan-logs");
      }
    }
  }
);

//Router for single request
router.post(
  "/loan-logs",
  [
    check("msisdn")
      .not()
      .isEmpty()
      .withMessage("Please Provide a valid MSISDN")
      .trim()
      .escape()
  ],
  async (req, res) => {
    const errors = validationResult(req).array();
    const { msisdn } = req.body;
    const fullNumber = msisdn;
    let logs = await dbObject.GetVoiceLoanInfo(fullNumber);

    for (let object of logs) {
      
      // const nwparsedDate = moment.utc(object.OPER_DATE).format('YYYY-MM-DD HH:mm:ss')
      const parsedDate = moment(object.FORCE_REPAY_DATE, "YYYYMMDD");
      const nparsedDate = moment(object.ETU_GRACE_DATE, "YYYYMMDD");

      // Format the date to year-month-day (YYYY-MM-DD) format
      const formattedDate = parsedDate.format("DD/MM/YYYY");
      const nformattedDate = nparsedDate.format("DD/MM/YYYY");
      
      //iterate and append
      // if (object.OPER_DATE.length > 0) {
      //   object.OPER_DATE = nwparsedDate;
      // }
      if (object.ETU_GRACE_DATE.length > 0) {
        object.ETU_GRACE_DATE = nformattedDate;
      }
      if (object.FORCE_REPAY_DATE.length > 0) {
        object.FORCE_REPAY_DATE = formattedDate;
      }
      //Iterate and add loan type
      if (object.ADD_INFO_AMOUNT > 1000){
        object.ADD_INFO_AMOUNT = "Voice"
      }else object.ADD_INFO_AMOUNT = "Data";
      //Iterate for operation Type
      if (object.OPER_TYPE === "L") {
        object.OPER_TYPE = "Loan";
      } else if (object.OPER_TYPE === "R") {
        object.OPER_TYPE = "Recovery";
      } else object.OPER_TYPE = "Force Recovery";
    }
    const results = logs;
    console.log(results);
    res.json(results)
    //return res.status(200).render("loan-logs", { logs });
  }
);

router.post("/audit-dashboard", ensureAuthenticated, async (req,res) => {
  const { startDate, endDate } = req.body; 
 
  const logs = await dbObject.GetFilterResult(startDate,endDate)
  
  for (let object of logs) {
    const parsedDate = moment(object.FORCE_REPAY_DATE, "YYYYMMDD");
    const nparsedDate = moment(object.ETU_GRACE_DATE, "YYYYMMDD");

    // Format the date to year-month-day (YYYY-MM-DD) format
    const formattedDate = parsedDate.format("DD/MM/YYYY");
    const nformattedDate = nparsedDate.format("DD/MM/YYYY");

    //iterate and append
    if (object.ETU_GRACE_DATE.length > 0) {
      object.ETU_GRACE_DATE = nformattedDate;
    }
    if (object.FORCE_REPAY_DATE.length > 0) {
      object.FORCE_REPAY_DATE = formattedDate;
    }
    //Iterate for operation Type
    if (object.OPER_TYPE === "L") {
      object.OPER_TYPE = "Loan";
    } else if (object.OPER_TYPE === "R") {
      object.OPER_TYPE = "Recovery";
    } else object.OPER_TYPE = "Force Recovery";
  }
  const filterFinal = logs;
  console.log(filterFinal);
  // res.end(JSON.stringify(filterFinal, null, 3));
  res.json(filterFinal)
 
})

router.post("/single-audit-dashboard", ensureAuthenticated, async (req,res) => {
  const { startDate, endDate, msisdn } = req.body; 
 
  
  const logs = await dbObject.GetSingleFilterResult(startDate,endDate,msisdn)
  //console.log(Singlelogs);
  
  for (let object of logs) {
    const parsedDate = moment(object.FORCE_REPAY_DATE, "YYYYMMDD");
    const nparsedDate = moment(object.ETU_GRACE_DATE, "YYYYMMDD");

    // Format the date to year-month-day (YYYY-MM-DD) format
    const formattedDate = parsedDate.format("DD/MM/YYYY");
    const nformattedDate = nparsedDate.format("DD/MM/YYYY");

    //iterate and append
    if (object.ETU_GRACE_DATE.length > 0) {
      object.ETU_GRACE_DATE = nformattedDate;
    }
    if (object.FORCE_REPAY_DATE.length > 0) {
      object.FORCE_REPAY_DATE = formattedDate;
    }
    //Iterate for operation Type
    if (object.OPER_TYPE === "L") {
      object.OPER_TYPE = "Loan";
    } else if (object.OPER_TYPE === "R") {
      object.OPER_TYPE = "Recovery";
    } else object.OPER_TYPE = "Force Recovery";
  }
  const filterFinal = logs;
  console.log(filterFinal);
  // res.end(JSON.stringify(filterFinal, null, 3));
  res.json(filterFinal)
 
})

//  });

// Method to Post bulk upload for MSISDN
router.post("/oldCall-logs", upload.single("bulkmsisdn"), async (req, res) => {
  const { startDate, endDate, formattedStartDate, formattedEndDate } = req.body;
  const { path } = req.file;
  var newObject = [];

  const { userId, userLevel } = req.user;
  const { username, password, origin } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  const presentDateTime = moment().format("LLLL");

  const user = username;

  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };
  const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail);
  // read client input
  fs.readFile(path, "utf-8", async (err, file) => {
    // parse the file you just read to number data type
    const lines = file.split(/\r?\n/);
    var result = lines.map(function(x) {
      console.log("Files processed");
      return parseInt(x, 10);
    });

    // collect the result, append comma and dates

    for (val of result) {
      //Request Trail
      const newRequestTrail = {
        UserID: userId,
        MSISDN: val.toString(),
        StartDate: startDate,
        EndDate: endDate,
        Origin: origin
      };
      console.log("iteration completed, data passed");
      const CreatedAuditRequestTrail = await dbObject.CreateRequestTrail(
        newRequestTrail
      );
      //console.log(CreatedAuditRequestTrail);
      var comma = ",";
      val += comma + startDate + comma + endDate;
      newObject.push(val);
      console.log("Dates appended");
    }
    //write to file
    var file = fs.createWriteStream("/home/sftpcdr/sera_lion_search/number");
    file.on("error", function(err) {
      console.log(err);
    });
    newObject.forEach(value => file.write(`${value}\r`));
    file.end();
    console.log("Processed file pushed to Number");

    //implement the python module
    PythonShell.defaultOptions = {
      scriptPath: "/home/sftpcdr/sera_lion_search/"
    };

    PythonShell.run("search_historic_trafic.py", null, function(err, data) {
      if (err) {
        console.log(err);
        throw err;
      }

      fs.readdir("/home/sftpcdr/MSC_CDR_output/", async (err, files) => {
        if (err) {
          console.log(err);
          throw err;
        }
        //

        res.status(200).send({ success: "Success" });
      });
    });
  });
});

// Method to logout
router.get("/logout", (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgents = new UserAgent();
  const { userAgent } = userAgents.data;
  const useragent = JSON.stringify(userAgent);
  const method = req.method;
  const endpoint = req.originalUrl;
  const { userId, userLevel, username } = req.user;
  const presentDateTime = moment().format("LLLL");
  const newLoginTrail = {
    UserID: userId,
    UserName: username,
    IPAddress: ipAddress,
    Useragent: useragent,
    Method: method,
    URL: endpoint,
    UserLevel: userLevel
  };
  //const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail);
  req.logOut(function(err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully Logged Out");
    res.redirect("/login");
  });
});

module.exports = router;
