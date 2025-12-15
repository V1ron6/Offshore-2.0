const defaultUser = require("../Models/user.model.js");

const verUser = (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: 'empty credentials' });
	}

	const verify = defaultUser.find((t) => t.username === username && t.password === password);
	if (verify) {
		return res.status(200).json({ message: `welcome ${username}`, success: true });
	}

	return res.status(404).json({ message: `${username} not found`, success: false });
};

module.exports = verUser;