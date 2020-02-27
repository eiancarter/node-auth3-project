const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/users-router");
const restricted = require("../auth/restricted-middleware");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/users", restricted, checkDepartment("12"), usersRouter);

server.get("/", (req, res) => {
    res.send("it's working");
});

module.exports = server;

function checkDepartment(department) {
    return (req, res, next) => {
        if (
            req.decodedToken && 
            req.decodedToken.department && 
            req.decodedToken.department.toLowerCase() === department
        ) {
            next();
        } else {
            res.status(403).json({ message: "department is not authorized"})
        }
    };
}