module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendFile(__dirname + "/html/login.html") + res.status(500).send({ error: 'Algo falhou!'})
    }
}

module.exports.haveAccess = (req, res, next) => {
    if (req.isAuthenticated() && req.user.temacesso) {
        next()
    } else {
        res.send(`<link rel="stylesheet" href="../css/erro.css">
        <div class="imagem"><img src="../cc/erro.png"/></div>
        <div class="texto"><h1>O seu acesso foi revogado!</h1><br>
        <h3>Caso se trate de um erro, entre em contato com o suporte imediatamente pelo número de WhatsApp +55 (51) 9978-0780.</h3>
        <p class="erro">d27e5150c64dd500108a9c79ed14796a841f35cbd27e5150c64dd500108a9c79ed14796a841f35cbd27e5150c64dd500108a9c79ed14796a841f35cbd27e5150c64dd500108a9c79ed14796a841f</p></div>`)
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.temacesso && req.user.isadm) {
        next()
    } else {
        res.redirect("/inicial") + res.status(400).send({ error: 'Você não tem acesso à isso!'})
    }
}