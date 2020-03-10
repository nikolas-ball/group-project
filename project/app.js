var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

// APP CONFIG
mongoose.connect(process.env.DATABASEURL);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var postSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Post = mongoose.model("Post", postSchema);

// RESTFUL ROUTES!!!

app.get("/", function(req, res){
	res.redirect("/posts");
});

// INDEX route
app.get("/posts", function(req, res){
	Post.find({}, function(err, posts){
		if(err){
			console.log("error!");
		} else {
			res.render("index", {posts: posts});
		}
	});
});
// NEW route
app.get("/posts/new", function(req ,res){
	res.render("new");
});

//CREATE route
app.post("/posts", function(req, res){
	// create post
	req.body.post.body = req.sanitize(req.body.post.body)
	Post.create(req.body.post, function(err, newPost){
		if(err){
			res.render("new");
		} else {
		// then redirect to index
			res.redirect("/posts");
		}
	});
});

//SHOW route
app.get("/posts/:id", function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			res.redirect("/posts");
		} else {
			res.render("show", {post: foundPost});
		}
	});
});

//EDIT route
app.get("/posts/:id/edit", function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			res.redirect("/posts");
		} else {
			res.render("edit", {post: foundPost});
		}
	});
});

//UPDATE route
app.put("/posts/:id", function(req, res){
	req.body.post.body = req.sanitize(req.body.post.body)
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
		if(err){
			res.redirect("/posts");
		} else {
			res.redirect("/posts/" + req.params.id);
		}
	});
});

//DELETE route
app.delete("/posts/:id", function(req, res){
	//destroy post
	Post.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/posts");
		} else {
			res.redirect("/posts");
		}
	});
	//redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server is Running!");
})