const bcrypt = require('bcryptjs')

function validPassword(password, senha) {
    var Verify = bcrypt.hashSync(password)
    return senha == Verify 

}

module.exports.validPassword = validPassword;
