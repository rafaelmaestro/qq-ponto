const porta = 8081
const express = require("express")
const app = express()
var passport = require("passport")
const passwordUtils = require("./passwordUtils")
const isAuth = require('./authMiddleware').isAuth
const haveAccess = require("./authMiddleware").haveAccess
const isAdmin = require("./authMiddleware").isAdmin
const bcrypt = require('bcryptjs')
const fastcsv = require("fast-csv");
const fs = require("fs");
const objectstocsv = require('objects-to-csv')
require('./auth')







// CONFIG
    //SESSÃO
    const session = require("express-session")
    app.use(session({
        secret: "projetofinal",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60
        }

    }))
    app.use(passport.initialize())
    app.use(passport.session())

    app.use((req, res, next) => {
        console.log(req.session)
        console.log(req.user)
        next()
    })

    // Conexão Banco de Dados
    const database = require('./data/db')
    const Funcionario = require('./data/models/funcionario')
    const Ponto = require('./data/models/ponto')

    async(req, res) => {
        return (await database.sync())
    }


    //BODY PARSER 
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    // ARQUIVOS ESTÁTICOS
    app.use('/css', express.static(__dirname + '/css'))
    app.use('/js', express.static(__dirname + '/js'))
    app.use('/cc', express.static(__dirname + '/cc'))
    app.use('/projeto', express.static(__dirname))

// FUNÇÕES

async function getNumeroPontos(user) {
    return database.query(`
    select count(id) from projeto.pontos where funcionario_id = ${user}`)
}

async function getUserPontos2(user, data) {
    return database.query(`select
    id, data_ponto, "tipoPonto", observacao
    from projeto.pontos 
    where funcionario_id = ${user} and to_char (data_ponto, 'YYYY-MM') = '${data}'
    order by data_ponto desc;`)
}

async function getUserPontos(user) {
    return database.query('select  id, data_ponto, "tipoPonto", observacao from projeto.pontos where funcionario_id = ' + user + ' order by data_ponto desc')

}

async function getUserName(user) {
    return database.query("select nome from projeto.funcionarios where id = " + user)
}

async function getUserDados(user) {
    return database.query("select nome, matricula, id, isadm, temacesso from projeto.funcionarios where id = " + user)
}

async function getMonthHours(user) {
    return database.query(`select 
    (select sum(data_ponto::time) from projeto.pontos p where "tipoPonto" = 'Saida'
    and funcionario_id = ${user}
    and EXTRACT('MONTH' FROM data_ponto) = EXTRACT('MONTH' FROM CURRENT_DATE)  and EXTRACT('YEAR' FROM data_ponto) = EXTRACT('YEAR' FROM CURRENT_DATE)) - (select sum(data_ponto::time) from projeto.pontos p where "tipoPonto" = 'Entrada'
    and funcionario_id = ${user}
    and EXTRACT('MONTH' FROM data_ponto) = EXTRACT('MONTH' FROM CURRENT_DATE)  and EXTRACT('YEAR' FROM data_ponto) = EXTRACT('YEAR' FROM CURRENT_DATE)) as "totalHoras"
    from projeto.pontos
    where funcionario_id = ${user}`)
}
// ROTAS

app.get('/dados', async function (req, res) {
    res.json(await getUserDados(req.user.id))
})

app.get('/teste', async function (req, res) {
    res.json(await getUserPontos2())
})

app.get('/inicial/exportar',isAuth, async function (req, res) {
    res.sendFile(__dirname + "/html/exportar.html")
})

app.post('/inicial/exportar',isAuth, async function (req, res) {
    res.json = await getUserPontos2(req.user.id, req.body.mes)
    console.log(req.body.mes)

    const csv = new objectstocsv(res.json[0])
    await csv.toDisk('./PontosRegistrados.csv')

    res.download('./PontosRegistrados.csv', () => {
        fs.unlinkSync("./PontosRegistrados.csv")
    })
})

app.get('/horas', isAuth, async function (req, res) {
    res.json(await getMonthHours(req.user.id))
})

app.get('/pontosreg' , isAuth, async (req, res) => {
    res.json(await getUserPontos(req.user.id))
})

app.get('/nome', async (req, res) => {
    res.json(await getUserName(req.user.id))
})

app.get('/login', (req, res, next) => {
    res.sendFile(__dirname + "/html/login.html")
})

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err)}
        if (!user) { return res.redirect('/login')}

        req.logIn(user, function (err) {
            if (err) { return next(err)} 
            return res.redirect('/inicial')
        })
    })(req, res, next)
});

app.get("/inicial", isAuth, haveAccess, function(req, res) {
        res.sendFile(__dirname + "/html/inicial.html")
})

app.post('/inicial/', function(req, res) {
    Ponto.create({
        funcionario_id: req.user.id,
        data_ponto: req.body.data,
        observacao: req.body.obs,
        tipoPonto: req.body.radio
    }).then(function(){console.log('Formulario enviado!')}).catch(function(e) { console.log('Erro ao enviar formulario ' + e)})
    res.sendFile(__dirname + "/html/inicial.html")
})

app.get("/inicial/pontos", isAuth, haveAccess, async function(req, res) {
    if(req.user) {
        res.sendFile(__dirname + "/html/pontos.html")
    } else {
        res.sendFile(__dirname + "/html/login.html")
        console.log('Usuário não está em uma sessão! Redirecionando para página de LOGIN!')
    }
})

app.post("/inicial/pontos", isAuth, function(req, res) {
    database.query("delete from projeto.pontos where id =" + req.body.idPontoExcluir + " and funcionario_id = " + req.user.id)
    .then(function(){console.log('Ponto excluido com sucesso!')}).catch(function(e) { console.log('Erro ao enviar formulario ' + e)})
    res.sendFile(__dirname + "/html/pontos.html")
})

app.get("/inicial/retirar-acesso", isAuth, haveAccess, isAdmin, function(req, res) {
    res.sendFile(__dirname + "/html/acesso.html")
})

app.post("/inicial/retirar-acesso", isAuth, haveAccess, isAdmin, function(req, res) {
    if (req.body.matriculaRetiraAcesso === req.user.matricula) {
        res.redirect('/inicial/retirar-acesso')
    } else {
        database.query("update projeto.funcionarios set temacesso = false where matricula = " + req.body.matriculaRetiraAcesso)
        .then(function() {console.log('Acesso Revogado!')}).catch(function(e) {console.log('Erro ao enviar formulário!' + e)})
    res.sendFile(__dirname + "/html/acesso.html")}
})

app.get("/inicial/cadastro", isAuth, haveAccess, isAdmin, function(req, res) {
    res.sendFile(__dirname + "/html/cadastro.html")
})

app.post("/inicial/cadastro", isAuth, haveAccess, isAdmin, function(req, res) {
    Funcionario.create({
        matricula: req.body.matriculaCadastro,
        temacesso: true,
        nome: req.body.nomeCadastro,
        senha: bcrypt.hashSync(req.body.senhaCadastro),
        isadm: false
    }).then(function(){console.log('Usuario cadastrado!')}).catch(function(e) { console.log('Erro ao enviar formulario ' + e)})
    res.sendFile(__dirname + "/html/inicial.html")
})

app.get("/inicial/alterar-senha", isAuth, haveAccess, function(req, res) {
    res.sendFile(__dirname + "/html/senha.html")
})

app.post("/inicial/alterar-senha", isAuth, haveAccess, function(req, res) {
    database.query("update projeto.funcionarios set senha = " + "'" + bcrypt.hashSync(req.body.senhaNova)+ "'" + " where id = " + req.user.id)
    .then(function() {console.log('Senha Alterada com Sucesso!')}).catch(function(e) {console.log('Erro ao enviar formulário!' + e)})
    res.sendFile(__dirname + "/html/senha.html")
})


app.listen(porta, () => {
    console.log(`Servidor está executando na porta ${porta}`)
})