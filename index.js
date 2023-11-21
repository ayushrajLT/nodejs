const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = process.env.PORT || 7777;
const cors = require("cors");

//if you want in every domain then
app.use(cors());

// Configure Cloudinary
cloudinary.config({
	cloud_name: "dwk9ejbnb",
	api_key: "893853551469614",
	api_secret: "1AArDmcGXE8oeolTHpjskqh5NMQ",
});

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function handleUpload(file) {
	const res = await cloudinary.uploader.upload(file, {
		resource_type: "auto",
	});
	return res;
}

app.post("/upload", upload.single("file"), async (req, res) => {
	try {
		const b64 = Buffer.from(req.file.buffer).toString("base64");
		let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
		const cldRes = await handleUpload(dataURI);
		res.json(cldRes);
	} catch (error) {
		console.log(error);
		res.send({
			message: error.message,
		});
	}
});

const dummyContent = {
	hello: "Some Hello **mdx** text, with a component <Audio />",
	suraasa: "Suraasa **mdx** text, with a component <Audio />",
	mdx: "**mdx** text, with a component <Audio />",
};

app.get("/article/:id", async (req, res) => {
	try {
		res.json({ data: dummyContent[req.params.id] });
	} catch (error) {
		res.send({
			message: error.message,
		});
	}
});

app.get("/articles", async (req, res) => {
	try {
		res.json({
			data: [
				{
					id: "hello",
				},
				{
					id: "suraasa",
				},
				{
					id: "mdx",
				},
			],
		});
	} catch (error) {
		res.send({
			message: error.message,
		});
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
