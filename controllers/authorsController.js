const db = require("../config/db");

//Get All Authors
const getAuthors = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    db.query("SELECT * FROM authors", function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "author list", data: results });
    });
  } catch {
    return res.status(401).send();
  }
};

//Get Author by Id
const getAuthorById = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    var authorid = Number(req.params.authorid);

    db.query(
      "SELECT * FROM authors where authorid=?",
      authorid.toString(),
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "author id =" + authorid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Update Author by Id
const updateAuthorById = async function (res, req) {
  try {
    var name = req.body.name;

    res.setHeader("Content-Type", "application/json");
    var authorid = Number(req.params.authorid);

    db.query(
      `UPDATE authors 
                SET 
                      name='${name}'                    
                WHERE authorid=?`,
      authorid,
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "Edit author id =" + authorid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Add New Author
const addAuthor = async function(req , res){
  try
  {
      res.setHeader('Content-Type', 'application/json');
      var authorName=req.body.name;

      db.query(`INSERT INTO authors(name) values(?)`,authorName,function (error, results, fields) {
          if (error) throw error;
          return res.send({ error: false, message: 'Add new author' });
      });

    } catch {

      return res.status(401).send()

    }
}

//Delete Author by Id
const deleteAuthorById = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    var authorid = Number(req.params.authorid);

    db.query(
      "DELETE FROM authors where authorid=?",
      authorid,
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "Delete author id =" + authorid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthorById,
  deleteAuthorById,
};
