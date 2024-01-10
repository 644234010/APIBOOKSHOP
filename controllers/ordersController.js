const db = require("../config/db");

//Get All Orders
const getOrders = async function (req, res) {
    try
    {
        res.setHeader('Content-Type', 'application/json');
        
        db.query('SELECT * FROM orders', function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, message: 'Get all orders' , data: results });
        });
  
      } catch {
  
        return res.status(401).send()
  
      }
};

//Get Order by UserId
const getOrderByUserId = async function (req, res) {
    try
    {
  
  
        res.setHeader('Content-Type', 'application/json');
        var userId = Number(req.params.userid);

        
       
        db.query('SELECT * FROM orders where userId=? order by datetime DESC', userId.toString(),function (error, results, fields) {
            if (error) throw error;
            
            return res.send({ error: false, message: 'Get orders of user id =' + userId.toString(), data: results });
        });
  
      } catch {
  
        return res.status(401).send()
  
      }
};

//Get Order by Id
const getOrderById = async function (req, res) {
    try
    {
  
  
        res.setHeader('Content-Type', 'application/json');
        var orderid = Number(req.params.orderid);
        
    

        db.query('SELECT * FROM orders where orderId=?', orderid.toString(),function (error, results, fields) {
            if (error) throw error;

            db.query(`
            SELECT books.bookid,books.title,orderdetail.price,orderdetail.qty,
            (orderdetail.price*orderdetail.qty) AS Total 
            FROM orderdetail,books 
            WHERE orderdetail.bookid=books.bookid AND orderdetail.orderId=?`, orderid.toString(),function (error, detailResults, fields) {
                if (error) throw error;

                results[0].orderDetail=detailResults;
                
                return res.send({ error: false, message: 'Get order id : ' + orderid.toString(), data: results });
            });
            
            
        });

  
      } catch {
        
        return res.status(401).send()
  
      }
};

//Update Order by Id
const updateOrderById = async function (res, req) {

};

//Add new Order
const addOrder = async function(req,res){
  
    try
    {
     
      var userId =req.body.data.userId;
      var name = req.body.data.name; 	
      var address=req.body.data.address;
      var total =req.body.data.total;
      var details=req.body.data.details;
      var mapDetails= details


      res.setHeader('Content-Type', 'application/json');
      
      db.query(`INSERT INTO orders 
        (userId,name,address,total) 
        VALUES ( ${userId},'${name}', '${address}', ${total});`,  function (error, results, fields) {
          ;
          if (error) throw error;

          
  
          db.query('SELECT orderId as orderId FROM orders ORDER BY orderId DESC LIMIT 1',  function (error, results, fields) {
            
            if (error) throw error;
  
            var orderId= Number(JSON.parse(JSON.stringify(results))[0]["orderId"]) ;
            
  
            mapDetails.forEach(item => {
              
              db.query(`
                INSERT INTO orderdetail (orderId, bookid, price, qty)  
                VALUES(${orderId},${item.bookid}, ${item.price}, ${item.quantity});`,
                function (error, results, fields) {
                    if (error) throw error;
                });
            });   
  
          });
          
          return res.send({ error: false, message: 'Add new order' });
  
      });
      
      
    } catch(e) {
   
      return res.status(401).send()
  
    }
}

//Delete Order by Id
const deleteOrderById = async function (req, res) {

};


module.exports = {
  getOrders,
  getOrderByUserId,
  getOrderById,
  updateOrderById,
  addOrder,
  deleteOrderById,
};
