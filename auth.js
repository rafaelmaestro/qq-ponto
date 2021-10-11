const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const database = require('./data/db')
const Funcionario = require('./data/models/funcionario')
const validPassword = require('./passwordUtils').validPassword
const bcrypt = require('bcryptjs')


const customFields = {
    usernameField: 'matricula',
    passwordField: 'senha',
}

const verifyCallback = (username, password, done) => {
    Funcionario.findOne( {where: {matricula: username}})
                .then((user) => {
                    if(!user) { return done(null, false, {message: 'Usuário não encontrado!'}); }

                    const isValid = bcrypt.compareSync(password, user.senha)

                    if(isValid) {
                        return done(null, user)
                    } else {
                        return done(null ,false, {message: 'Invalid password'})
                    }
                })
                .catch((err) => {
                    done(err)
                })
}


 passport.serializeUser((user, done) => {
     done(null ,user.id)
 })

 passport.deserializeUser((userId, done) => {
     Funcionario.findByPk(userId)
                .then((user) => {
                    done(null, user)
                })
                .catch(err => done(err))
 })
 const strategy = new LocalStrategy(customFields, verifyCallback)
 passport.use(strategy)