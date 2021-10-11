const Sequelize = require('sequelize')
const database = require('../db')
const Funcionario = require('./funcionario')

const Ponto = database.define('ponto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    funcionario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    data_ponto: {
        type: 'TIMESTAMP',
        allowNull: false
    },
    observacao: {
        type: Sequelize.STRING,
    },
    tipoPonto: {
        type: Sequelize.ENUM('Entrada', 'Saida'),
        allowNull: false
    }
})

Ponto.belongsTo(Funcionario, {
    constraint: true,
    foreignKey: 'funcionario_id'
})

module.exports = Ponto