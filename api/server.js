const express = require("express");
const helmet = require("hemlet");
const cors = require("cors");

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