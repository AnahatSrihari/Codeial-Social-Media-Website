//module.exports.posts = function(req ,res){
// return res.end('<h1> User Post - Controller </h1>');
//}

const Post = require('../models/post')

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){console.log('error in creating a post'); return;}

        return res.redirect('back');
    });
}
