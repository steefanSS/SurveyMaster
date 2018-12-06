//figure what credintials to return (development or production)
if(process.env.NODE_ENV === 'production'){
    //in production - return prod set of keys
    module.exports = require('./prod')
}else {
    //in development - return dev set of keys
    module.exports = require('./dev')
}