const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const pool = require("./config");

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

router.get('/get/all', auth.required, (req, res, next) => {
  pool.getConnection((err, con) => {
    if (err) throw err;
    con.query(
      "SELECT * FROM 2BTeam.main",
       (error, result) => {
      if (error) throw error;
      let str = JSON.stringify(result);
      res.send(str);
    });
    con.release();
  });
});

router.post('/post/main', auth.optional, (req, res, next) => {
  let nameUser = req.body.nameUser;
  let secretInfo = req.body.secretInfo;
  console.log(nameUser);

  pool.getConnection((err, con) => {
    if (err) throw err;
    con.query(
      "INSERT INTO `2BTeam`.`main` (`name`, `secret_info`) VALUES (?, ?)",
      [nameUser, secretInfo],
      (error, result) => {
        if (error) throw error;
        res.send(result);
      }
    );
    con.release();
  });
});

module.exports = router;