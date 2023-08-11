"use strict";
const { dbObject } = require("../db/db");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const IP = require('ip');
const moment = require("moment");
const MacAddress = require('get-mac-address');
const UserAgent = require('user-agents'); 
const requestIp = require('request-ip');
const isAdmin = 1;
let adminName = "";
let users,
  levels = [];

//1. Get All Users
exports.GetAllUser = async (req, res, next) => {
  try {
    users = await dbObject.GetAllUsers().catch((err) => {
      throw err;
    });
    if (users.length > 0) {
      res.render("admin/create-user", {
        users,
        isAdmin,
        pageTitle: "Create Users",
        levels: await dbObject.GetAllLevels(),
        adminName: typeof req.user != "undefined" ? req.user.username : "",
      });
    } else {
      res.render("admin/create-user", {
        users,
        pageTitle: "Create Users",
      });
    }
  } catch (error) {
    next(error);
  }
};

//2. Get Single User by ID
exports.GetUserByID = async (req, res, next) => {
  try {
    let singleUser = await dbObject
      .GetUserById(req.params.userId)
      .catch((err) => {
        throw err;
      });
    if (users.length > 0) {
      res.render("admin/users", {
        users,
        isAdmin,
        pageTitle: "Users",
        depts: await dbObject.GetAllDepartments(),
        levels: await dbObject.GetAllLevels(),
        adminName: typeof req.user != "undefined" ? req.user.fullname : "",
      });
    } else {
      res.render("admin/users", {
        users,
        pageTitle: "Users",
      });
    }
  } catch (error) {
    next(error);
  }
};

//3. Add New Users
exports.AddNewUser = async (req, res, next) => {
  users = await dbObject.GetAllUsers();
  levels = await dbObject.GetAllLevels();
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
      //const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail)
  try {
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      number: req.body.msisdn,
      userLevel: req.body.userLevel,
      password: req.body.password,
    };
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.render("admin/create-user", {
        isAdmin,
        errors,
        user: newUser,
        users,
        levels,
        adminName: typeof req.user != "undefined" ? req.user.username : "",
      });
    } else {
      const EmailExist = await dbObject
        .GetUserByEmail(newUser.email)
        .catch((err) => {
          throw err;
        });
      if (EmailExist.length > 0) {
        res.render("admin/create-user", {
          isAdmin,
          user: newUser,
          err_msg: "Email already exists",
          users,
          levels,
          adminName: typeof req.user != "undefined" ? req.user.username : "",
        });
      } else {
        const UserNameExists = await dbObject.GetUserByUsername(
          newUser.username
        );
        if (UserNameExists.length > 0) {
          res.render("admin/create-user", {
            isAdmin,
            user: newUser,
            err_msg: "Username already taken",
            users,
            levels,
            adminName: typeof req.user != "undefined" ? req.user.username : "",
          });
        } else {
          const hashedPass = await bcrypt.hash(newUser.password, 10);
          newUser.password = hashedPass;
          const CreatedUser = dbObject.CreateNewUser(newUser).catch((err) => {
            throw err;
          });
          
          await dbObject.InsertIntoSysLog(
            req.user.userId,
            `Created a new user with id: ${CreatedUser.insertId}`
          );
          req.flash("success", "New user created Successfully");
          res.redirect("/admin/create-user");
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

//4. Update User

//5. Delete User
exports.DeleteUserById = async (req, res, next) => {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const method = req.method;
      const endpoint = req.originalUrl;
      const { userId, userLevel, username } = req.user;
      const presentDateTime = moment().format('LLLL');
      const newLoginTrail = { 
        UserID: userId,
        UserName: username,
        IPAddress: ipAddress,
        Method: method,
        URL: endpoint,
        UserLevel: userLevel
      }
      const CreatedAuditTrail = dbObject.CreateNewTrail(newLoginTrail)
  try {
    const id = req.params.id.normalize().trim();
    if (isNaN(id)) {
      res.redirect("/admin/admin-dashboard");
      req.flash("err_msg", "Error deleting user");
    } else {
      const DeletedUser = await dbObject.DeleteUserById(id).catch((err) => {
        throw err;
      });
      await dbObject.InsertIntoSysLog(
        req.user.userId,
        `Deleted User with ID: ${id}`
      );
      req.flash("success", "User Deleted Successfully");
      res.redirect("/admin/admin-dashboard");
    }
  } catch (err) {}
};

