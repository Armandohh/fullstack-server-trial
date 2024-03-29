const express = require('express');
const router = express.Router();
const { Users, Posts } = require('../models');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require('../middlewares//AuthMiddleware');

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        })
        res.json("Success!");
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
        res.json({ error: "User doesn't exist!" });
    }
    else {
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) {
                res.json({ error: "Wrong username and password combination!" });
            }
            else {
                const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");

                res.json({ token: accessToken, username: user.username, id: user.id });
            }
        })
    }
});

router.get('', validateToken, (req, res) => {
    res.json(req.user);
});

router.get('/basicinfo/:id', async (req, res) => {
    const id = req.params.id
    const basicInfo = await Users.findByPk(id, { attributes: { exclude: ['password'] } });
    const usersPosts = await Posts.findAll({ where: { UserId: id } });
    res.json({ basicInfo: basicInfo, usersPosts: usersPosts });
});

router.put('/changepassword/', validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });


    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) {
            res.json({ error: "Wrong password entered!" });
        }
        else {
            bcrypt.hash(newPassword, 10).then((hash) => {
                Users.update({password: hash}, {where: {username: req.user.username}});
                res.json("Success!");
            });
        }
    })
});

module.exports = router;