const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Authentification : 
exports.authenticate = async(req,res,next)=>{
    const {email, password} = req.body;

    try{
        const user = await userModel.findOne({ email: email }).select('-__v -createdAt -updatedAt');

        if(user){
            bcrypt.compare(password, user.password, (err, response)=>{
                if(err){
                    throw new Error(err);
                }
                if(response){
                    delete user._doc.password;
                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                    SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });
                    res.header('Authorization', 'Bearer' + token);
                    return res.status(200).json('authenticate_succeed');
                }
                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch(error){
        return res.status(501).json(error);
    }
};

// Ajout d'un ustilisateur avec son id :
exports.getById = async(req,res,next)=>{
    const id = req.params.id;

    try{
        let user = await userModel.findById(id);
        if(user){
            return res.status(200).json(user);
        }
        return res.status(404).json('user not found');
    } catch(err){
        return res.status(501).json(err);
    }
};

// Ajout d'un utilisateur :
exports.add = async(req,res,next)=>{
    const temp = ({
        name : req.body.name,
        firstname : req.body.firstname,
        email : req.body.email,
        password : req.body.password,
    });
    try{
        let user = await userModel.create(temp);
        return res.status(201).json(user);
    } catch(err){
        return res.status(501).json(err);
    }
};


// Modifier un utilisateur :
exports.update = async(req,res,next)=>{
    const id = req.params.id;
    const temp = ({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password,
    });
    
    try{
        let user = await userModel.findOne({_id : id});
        if(user){
            Object.keys(temp).forEach((key)=>{
                if(!!temp[key]){
                    user[key] = temp[key];
                }
            });
            await user.save();
            return res.status(201).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch(err){
        return res.status(501).json(err);
    }
};

// Supprimer un utilisateur :
exports.delete = async(req,res,next)=>{
    const id = req.params.id;

    try{
        await userModel.deleteOne({_id: id});
        
        return res.status(204).json('Delete OK');
    } catch(err){
        return res.status(501).json(err);
    }
};

