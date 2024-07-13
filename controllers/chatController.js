
const { sha256Hash } = require('../utility/helper.js');
const { message, user } = require('../models');
const sequelize = require('../config/db.js');
const commonRepo = require('../Repository/commonRepo.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config'); 
const crypto=require('crypto')
exports.controller = (io) => {
    try {
        io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            socket.on('chat message', async (msg) => {
                try {
                    io.emit('chat message', msg);
                    const usr = await user.findOne({ where: { username: msg.username, is_deleted: 0 } });
                    if (msg.isImage) {
                        await commonRepo.createRecord(message, {
                            user_id: usr.id,
                            message: msg.message,
                            is_image: true
                        });
                    } else {
                        await commonRepo.createRecord(message, {
                            user_id: usr.id,
                            message: msg.message,
                        });
                    }
                } catch (error) {
                    console.error("Error saving message:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error saving message:", error);
    }
};

exports.newUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = sha256Hash(password, salt);
        await commonRepo.createRecord(user, {
            username: username,
            password: hashedPassword,
            salt: salt
        });
        return res.redirect('/?alert=user-registered');
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.authenticate = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usr = await user.findOne({
            where: { username: username, is_deleted: 0 },
        });
        const users=await user.findAll();
        const messages = await message.findAll({
          include: { model: user, attributes: ['username'] },
          order: [['created_at', 'ASC']]
        });
        if (!usr) {
            return res.redirect('/?alert=invalid-user');
        }
        const hashedPassword = sha256Hash(password, usr.salt);
        if (usr.password !== hashedPassword) {
            return res.redirect('/?alert=login-unsuccessful');
        }
        const token = jwt.sign({ username: usr.username }, JWT_SECRET, { expiresIn: '1h' });
        req.session.user={username :usr.username, token: token}
        if (usr.username === "admin") {
            return res.render('data', { data: users, token:token });
        }
        return res.render('chat', {
            username: username,
            messages: messages,
            user: usr,
            token:token
        });
    } catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.update = async (req, res) => {
    try {
        const { username, old_password, new_password } = req.body;
        if (!username || !old_password || !new_password) {
            return res.status(400).send("Invalid Request");
        }
        const usr = await user.findOne({ where: { username: username, is_deleted: 0 } });
        if (!usr) {
            return res.redirect('/password?alert=invalid-user');
        }
        const hashedPassword = sha256Hash(old_password, usr.salt);
        if (usr.password !== hashedPassword) {
            return res.redirect('/password?alert=login-unsuccessful');
        }
        const new_salt = crypto.randomBytes(16).toString('hex');
        const new_hash = sha256Hash(new_password, new_salt);
        await commonRepo.updateRecord(user, usr.id, { password: new_hash, salt: new_salt });
        return res.redirect('/?alert=password-changed');
    } catch (error) {
        console.error("Error updating record:", error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.delete = async (req, res) => {
    try {
        const usr=await user.findOne({
            where:{username:req.body.username}
        });
        if(!usr){
            return res.redirect('/delete?alert=invalid-user');
        }
        const password=req.body.password
        const hashedPassword = sha256Hash(password, usr.salt);
        if (usr.password !== hashedPassword) {
            return res.redirect('/delete?alert=login-unsuccessful');
        }
        const id = usr.id;
        await commonRepo.deleteRecord(user, id);
        return res.redirect('/?alert=user-deleted');
    } catch (error) {
        console.error("Error deleting record:", error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.view = async (req, res) => {
    if(req.session.user){
    try {
        if(req.session.user.username==='admin'){
        const id = req.params.id;
        const usr = await user.findOne({
            where: { id: id }
        });
        const admin = await user.findOne({
            where: { username: 'admin' }
        });
        const username = usr.username;
        const messages = await message.findAll({
            where: { user_id: id },
            include: { model: user, attributes: ['username'] },
            order: [['created_at', 'ASC']]
        });
        req.session.user = { id: admin.id,token:req.session.user.token,username:'admin'};
        return res.render('messages', {
            username: username,
            messages: messages,
            User: req.session.user
        });
    }else{
        res.redirect('/');
    }
    } catch (error) {
        console.error("Error deleting record:", error);
        return res.status(500).send("Internal Server Error");
    }
  }else{
    res.redirect('/');
  }

};

exports.updateUserStatus = async (req, res) => {
    try {
    const userId = req.query.userId;
    const is_deleted = req.query.is_deleted;
    const username=req.user.username;
    const usr = await user.findOne({
      where: { username: username, is_deleted: 0 },
    });
      const token = jwt.sign({ username: usr.username }, JWT_SECRET, { expiresIn: '1h' });
        await commonRepo.updateRecord(user, userId, { is_deleted: is_deleted });
        const users = await user.findAll();
        return res.render('data', { data: users,token:req.session.user.token });
    } catch (error) {
        console.error('Error updating user status:', error);
        return res.status(500).send('Internal Server Error');
    }
};

exports.verifyUser=async(req,res)=>{
    try{
      if(req.session.user){
        const usr = await user.findOne({
        where: { username: req.session.user.username, is_deleted: 0 },
        })
        const users=await user.findAll();
        if (usr.username === "admin") {
            return res.render('data', { data: users, token:req.session.user.token });
        }
        const messages = await message.findAll({
        include: { model: user, attributes: ['username'] },
        order: [['created_at', 'ASC']]
        });
        res.render('chat', {
        username: req.session.user.username,
        messages: messages,
        user:usr,
        token:req.session.user.token
        });
    }
     else{
        res.redirect('/');
     }
   }catch(error){
        console.error('Error updating user status:', error);
        return res.status(500).send('Internal Server Error');
    }
}
