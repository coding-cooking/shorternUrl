const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const ShortUrl = require("./models/shortUrl");

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
	const shortUrls = await ShortUrl.find();
	//the res.render function is used to render the index.ejs template, and it passes an object
	//containing data that can be used in the template.
	res.render("index", { shortUrls });
});

app.post("/shortUrls", async (req, res) => {
	await ShortUrl.create({ full: req.body.fullUrl });
	res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
	if (shortUrl === null) return res.sendStatus(404);

	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3008);
