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
server.use("/api/users", restricted, checkRole, usersRouter);

server.get("/", (req, res) => {
    res.send("it's working");
});

module.exports = server;

function checkRole(role) {
    return (req, res, next) => {
        if (
            req.decodedToken && 
            req.decodedToken.role && 
            req.decodedToken.role.toLowerCase() === role
        ) {
            next();
        } else {
            res.status(403).json({ message: "role is not authorized"})
        }
    };
}