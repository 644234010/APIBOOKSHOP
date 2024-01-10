const db = require("../config/db");

//Get All Books
const getBooks = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    db.query(
      `
    SELECT 
      bookid,title,isbn,pageCount,
      publishedDate,
      shortDescription,authors.name as 'author',
      category,price
    FROM books,authors 
    WHERE books.author=authors.authorid`,
      function (error, results, fields) {
        if (error) throw error;

        return res
          .status(200)
          .send({ error: false, message: "books list", data: results });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//Get Book by Id
const getBookById = async function (req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    var bookid = Number(req.params.bookid);

    db.query(
      `
    SELECT 
      bookid,title,isbn,pageCount,
      publishedDate,
      shortDescription,authors.name as 'author',
      authors.authorid as 'authorid',
      category,price
    FROM books,authors 
    WHERE books.author=authors.authorid AND books.bookid=?`,
      bookid.toString(),
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "book id =" + bookid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};



//Update Book by Id
const updateBookById = async function (req, res) {
  /* 
  Steps:

  1. Update book record
    1.1 get book from req.body.book (use JSON.parse to convert to object)
    1.2 get bookid from req.params.bookid
    1.3 get all book fields from book object
    1.4 use db.query to update book record

  2. Upload book cover

  */

  try {

    //1.1 get book from req.body.book (use JSON.parse to convert to object)
    const book=JSON.parse(req.body.book);

    //1.2 get bookid from req.params.bookid
    var bookid = Number(req.params.bookid);

    //1.3 get all book fields from book object
    var title = book.title.replace(/'/g, "\\'");
    var price = book.price;
    var isbn = book.isbn;
    var pageCount = book.pageCount;
    var publishedDate = book.publishedDate;
    var shortDescription = book.shortDescription.replace(/'/g, "\\'");
    var author = book.authorid;
    var category = book.category;

    res.setHeader("Content-Type", "application/json");

    //1.4 use db.query to update book record
    db.query(
      `UPDATE books 
              SET 
                    title='${title}', 
                    price=${price},
                    isbn= '${isbn}', 
                    pageCount=${pageCount}, 
                    publishedDate='${publishedDate}',  
                    shortDescription='${shortDescription}', 
                    author=${author}, 
                    category= '${category}'
              WHERE bookid=?`,
      bookid,
      async function (error, results, fields) {
        
        if (error) throw error;


        if (req.files!=null)
        {
          //2. Upload book cover
          const bookCoverPath = process.env.BOOKSHOP_PICTURE_PATH;
          await uploadBookCover(bookCoverPath,bookid,req.files);

        }


        return res.send({
          error: false,
          message: "Edit book id =" + bookid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};




//Add new Book
const addBook = async function(req,res){
  /*
  steps:
  1. Add book record
    1.1 get book from req.body.book (use JSON.parse to convert to object)
    1.2 get all book fields from book object
    1.3 use db.query to add book record

  2. Upload book cover
  */
  try
  {
    //1.1 get book from req.body.book (use JSON.parse to convert to object)
    // Add Code : 1.1 get book from req.body.book (use JSON.parse to convert to object)
    const book=JSON.parse(req.body.book);

    //1.2 get bookid from req.params.bookid
    // Add Code : 1.2 get bookid from req.params.bookid
    var title = book.title.replace(/'/g, "\\'"); 	
var price=book.price;
var isbn = book.isbn;
var pageCount = book.pageCount;
var publishedDate=book.publishedDate;
var shortDescription=book.shortDescription.replace(/'/g, "\\'");
var author=book.author;
var category=book.category;
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
   
    //1.3 use db.query to add book record
    // Add Code : 1.3 use db.query to add book record
    db.query(`INSERT INTO books 
    (title,price, isbn, pageCount, publishedDate, 
    shortDescription, author, category) 
    VALUES ( '${title}',${price}, '${isbn}', ${pageCount}, '${publishedDate}',
    '${shortDescription}', '${author}', '${category}');`,async function (error, results, fields) {
    if (error) throw error;

    // 2. Upload book cover 
    // Add Code : 2. Upload book cover
    const bookCoverPath = process.env.BOOKSHOP_PICTURE_PATH;
    var bookid = results.insertId;
    await uploadBookCover(bookCoverPath,bookid,req.files);
    
    return res.send({ error: false, message: 'Insert new book' });
    
});


    
  } catch {

    return res.status(401).send()

  }
}

//Delete Book by Id
const deleteBookById = async function (req, res) {
  /*
  Steps:
  1. Get bookid from req.params.bookid
  2. Use db.query to delete book record
  */
  try {
    res.setHeader("Content-Type", "application/json");

    //1. Get bookid from req.params.bookid
    var bookid = Number(req.params.bookid);

    //2. Use db.query to delete book record
    db.query(
      "DELETE FROM books where bookid=?",
      bookid,
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          message: "Delete book id =" + bookid.toString(),
          data: results,
        });
      }
    );
  } catch {
    return res.status(401).send();
  }
};

//get book picture
const getBookCover = async function (req, res) {
  const bookCoverPath = process.env.BOOKSHOP_PICTURE_PATH;
  var bookid = Number(req.params.bookid);
  try {

    var {resolve} = require('path');
    var fullPath=resolve(`${bookCoverPath}${bookid}.jpg`)
    var fs = require('fs');
    
    if (fs.existsSync(`${bookCoverPath}${bookid}.jpg`))
      fullPath=resolve(`${bookCoverPath}${bookid}.jpg`)
    else if (fs.existsSync(`${bookCoverPath}${bookid}.jpeg`))
      fullPath=resolve(`${bookCoverPath}${bookid}.jpeg`)
    else if (fs.existsSync(`${bookCoverPath}${bookid}.png`))
      fullPath=resolve(`${bookCoverPath}${bookid}.png`)
    else
      fullPath=resolve(`${bookCoverPath}nocover.jpg`)
    
    res.sendFile(fullPath, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "file is not found" });
      }
    });

  } catch (err){
    console.log(err);
    return res.status(401).send();
  }
};

//Upload book picture
const uploadBookCover = async function (bookCoverPath, bookid, req_files) {
  
  /*
  Steps:
  1. Check if req_files is null
  2. Get bookPictureFile from req_files.files
  3. Get bookPictureFile extension
  4. Delete old book cover
  5. Save new book cover
  */

  try {
    //1. Check if req_files is null
    if (!req_files) {
      return res.status(500).send({ msg: "file is not found" });
    }

    //2. Get bookPictureFile from req_files.files
    const bookPictureFile = req_files.files;

    //3. Get bookPictureFile extension
    var path = require("path");
    var pictureEx = path.extname(bookPictureFile.name);
    

    //4. Delete old book cover
    var fs = require('fs');

    var filePath = `${bookCoverPath}${bookid}.jpg`;
    if (pictureEx!='.jpg'){
      if (fs.existsSync(filePath))
      await fs.unlinkSync(filePath);
    }


    if (pictureEx!='.jpeg'){
      filePath = `${bookCoverPath}${bookid}.jpeg`;
      if (fs.existsSync(filePath))
        await fs.unlinkSync(filePath);
    }
  

    if (pictureEx!='.png'){
      filePath = `${bookCoverPath}${bookid}.png`;
      if (fs.existsSync(filePath))
        await fs.unlinkSync(filePath);
    }
    
    //5. Save new book cover
    bookPictureFile.mv(`${bookCoverPath}${bookid}${pictureEx}`, function (err) {
      if (err) {
        console.log(err);
        return err
      }

      return {
        name: `${bookid}${pictureEx}`,
        path: `${bookCoverPath}${bookid}${pictureEx}`,
      };
    });



  } catch (err) {
    return err;
  }
};



module.exports = {
  getBooks,
  getBookById,
  deleteBookById,
  getBookCover,
  addBook,
  updateBookById
};
