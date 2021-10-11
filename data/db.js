const Sequelize = require('sequelize')
const sequelize = new Sequelize('rmaestro', 'rmaestro', 'E79TkQ7w', {
    host: "qqtech-1.crqc50gxdjpu.sa-east-1.rds.amazonaws.com",
    dialect: 'postgresql',
    schema: 'projeto'
})

sequelize.authenticate().then(function() {
    console.log('Conectado com sucesso!')
}).catch(function(err) {
    res.redirect('/login')
})

async function sync(req, res) {
    const s = await sequelize.sync()
    return s
}


module.exports = sequelize
