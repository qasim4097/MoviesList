const io = require('../server').io

/** socket callbacks for real-time update for user */
module.exports  = function(socket){
    socket.on('DELETED' , (id, )=>{
        io.emit('movie_deleted', id)
    })
    socket.on('ADDED' , (id, )=>{
        io.emit('movie_added', id)
    })
    socket.on('EDITED' , (data, id )=>{
        io.emit('movie_edited', data, id)
    })
    socket.on('RATED' , (data, id )=>{
        io.emit('movie_rated', data, id)
    })
}