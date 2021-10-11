const Sequelize = require('sequelize')
const database = require('../db')

const Funcionario = database.define('funcionario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    matricula: {
        type: Sequelize.NUMERIC(8),
        allowNull: false,
        unique: true
    },
    temacesso: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isadm: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    }
    
})

// const createNewUser = Funcionario.create({
//     matricula: '111111',
//     temacesso: true,
//     nome: 'admin',
//     senha: '123',
//     isadm: true
// })

//  console.log(createNewUser)

module.exports = Funcionario

