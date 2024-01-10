api_version=process.env.API_VERSION

module.exports = (app)=>{

    app.use(api_version +'/books', require('./books'));
    app.use(api_version + '/orders', require('./orders'));
    app.use(api_version + '/users', require('./users'));
    app.use(api_version + '/authors', require('./authors'));
   

    app.get('*', (req,res)=> {
        return res.status(404).send('Not Found !')
    });

}