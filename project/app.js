var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose");


//config db (mongoDB)
mongoose.connect("mongodb://localhost:27017/twitterClone", {useNewUrlParser: true}); //change L8r
app.set("view engine", "ejs");
//to serve custom style sheet:
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//db structure (schema)
var postSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
//declare Post variable
var Post = mongoose.model("Post", postSchema);

//create ROOT route:
app.get("/", function(req, res){
	res.redirect("/posts");
});

app.get("/posts", function(req, res){
	Post.find({}, function(err. posts){
		if(err){
		console.log("error");
	} else {
		res.render("index", {posts: posts});
		}
	});
});

//after where it says res.render(“index", {posts: posts}): add this (line ~39):
app.get("/posts/new", function(req, res){
	res.render("new");
});

app.post(“/posts", function(req, res){
	//create blog
	req.body.post.body = req.sanitize(req.body.post.body)
	Post.create(req.body.blog, function(err, newPost){
	if(err){
		res.render(“new");
	} else {
	//then redirect to index page
	res.redirect(“/posts");
	}
      });
});
// furthur under that route in app.js, time for the show route:
app.get(“/posts/:id", function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			res.redirect(“/posts");
		} else {
			res.render(“show", {post: foundPost});
		}
	})
});

app.get(“/posts/:id/edit", function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			res.redirect(“/posts");
		} else {
			res.render(“edit", {post: foundPost});
		}
	});
});

app.put(“/posts/:id", function(req, res){
	req.body.post.body = req.sanitize(req.body.post.body)
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
	if(err){
		res.redirect(“/posts");
	} else {
		res.redirect(“/posts/" + req.params.id);
	}
     });
});

//delete route
app.delete(“/posts/:id", function(req, res){
	//destroy post
	Post.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect(“/posts");
		} else {
			res.redirect(“/posts");
		}
	})
	//redirect
});



//to run
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("server is up");
}) //to run: PORT=3000 node app.js
