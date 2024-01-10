const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sign  = require('../middleware/jwtMiddleware').sign;

//New user Resister 
const register = async function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  let user = {
    username: req.body.username,
    role: req.body.role,
    password: hashedPassword,
  };

  res.setHeader("Content-Type", "application/json");

  try {
    db.query(
      `INSERT INTO users 
        (username,password,role) 
        VALUES ( '${user.username}','${hashedPassword}','${user.role}');`,
      function (error, results, fields) {
        if (error) throw error;
        return res
          .status(201)
          .send({ error: false, message: "created a user" });
      }
    );
  } catch (err) {
    return res.send(err);
  }
};

//User Sign In and get Token
const signin = async function (req, res) {
  
  const secretkey=process.env.SECRET
  db.query(
    "SELECT * FROM users where username=?",
    req.body.username,
    function (error, results, fields) {
      try {
        
        if (error) {
          throw error;
        } else {
          
          let hashedPassword = results[0].password;
          let userId = results[0].userId;
          const correct = bcrypt.compareSync(req.body.password, hashedPassword);
          if (correct) {
            let user = {
              username: req.body.username,
              role: results.role,
              password: hashedPassword,
            };

            // create a token
            let token = sign(user, secretkey);

            res.setHeader("Content-Type", "application/json");

            return res
              .status(201)
              .send({
                error: false,
                message: "user sigin",
                userId: userId,
                user_role: results[0].role,
                username: req.body.username,
                accessToken: token,
              });
          } else {
            return res.status(401).send("login fail");
          }
        }
      } catch (e) {
        return res.status(401).send("login fail");
      }
    }
  );
};

module.exports = {
  register,
  signin
};
