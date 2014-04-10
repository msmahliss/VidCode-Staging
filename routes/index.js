﻿exports.index = function (req, res) {
	res.render('index', { title: 'VidCode' });
};

exports.demo = function (db, crypto) {
	return function (req, res) {
		var token = req.params.token;
		var doc = {};

		if (!token) {
			doc = get(db, token);
		}

		res.render('demo', { samples: doc });
	};
};

exports.save = function (db, crypto) {
	return function (req, res) {
		var code = req.body.codemirror;
		var token = req.body.token;

		if (!token) {
			token = generateToken(crypto);
			save(db, token, token, code);
		}
		
		res.redirect('/demo/' + token);
	};
};

exports.upload = function (req, res) {

	//get the file name
	console.log(req.files.length);
	var filename = req.files.file.name;
	var extensionAllowed = [".mp4", ".mov"];
	var maxSizeOfFile = 10000000;
	var msg = "";
	var i = filename.lastIndexOf('.');

	// get the temporary location of the file
	var tmp_path = req.files.file.path;

	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = __dirname + '/upload/' + req.files.file.name;

	var file_extension = (i < 0) ? '' : filename.substr(i);
	if ((file_extension in oc(extensionAllowed)) && ((req.files.file.size / 1024) < maxSizeOfFile)) {
		fs.rename(tmp_path, target_path, function (err) {
			if (err) throw err;
			// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			fs.unlink(tmp_path, function () {
				if (err) throw err;
			});
		});
	} else {
		// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function (err) {
			if (err) throw err;
		});
		msg = "File upload failed.File extension not allowed and size must be less than " + maxSizeOfFile;
	}
	res.status(302);
	res.setHeader("Location", "/");
	res.end();
};

function generateToken(crypto) {
	var tokenLength = 10;
	var buf = crypto.randomBytes(Math.ceil(tokenLength * 3 / 4));
	var token = buf.toString('base64').slice(0, tokenLength).replace(/\+/g, '0').replace(/\//g, '0');
	return token;
}

function save(db, token, video, code) {
	var vc = db.get('vidcode');
	var existing = vc.findOne({ token: token });
	if (existing) {
		if (video) {
			existing.video = video;
		}
		if (code) {
			existing.code = code;
		}
	}
}

function get(db, token) {
	var vc = db.get('vidcode');
	return vc.findOne({ token: token });
}


function oc(a) {
	var o = {};
	for (var i = 0; i < a.length; i++) {
		o[a[i]] = '';
	}
	return o;
}