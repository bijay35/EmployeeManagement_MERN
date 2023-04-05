const Userdb = require("../model/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.CreateUser = (req, res) => {
  if (!req.body) {
    res.status(404).send({ message: "Fields cannot be Empty!" || err.message });
    return;
  }
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new Userdb({
      email: req.body.email,
      password: hash
    })
    newUser.save()
      .then((data) => {
        res.status(201)
          .json({ data });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error while creating User' || err.message });
      });
  });
}

exports.UserLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("test 1 : user controller");
  try {
    const foundUser = await Userdb.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log("test 2 : user controller");
    if (isMatch) {
      console.log("test 3 : user controller");
      res.status(200).json({ foundUser });
    } else {
      console.log("test 5 : user controller");
      res.status(401).json('Invalid credentials.');
    }
  } catch (error) {
    console.log("test 6 : user controller");
    res.status(500).json('Internal server error.' || error.message);
  }
};

exports.getUser = (req, res) => {
  Userdb.findById(req.user.id)
    .select('-password')
    .then((user) => { res.json(user) })
}
