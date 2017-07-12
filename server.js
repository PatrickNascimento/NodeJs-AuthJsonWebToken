// =================================================================
// 
// Obtenha os pacotes que necessários ==============================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // Usado para criar, assinar e verificar tokens
var config = require('./config'); // Pega o arquivo de configuração
var User   = require('./app/models/user'); // Pega o usuario da base de dados mongodb

// =================================================================
// configuração ===================================================
// =================================================================
var port = process.env.PORT || 8080; // Usado para criar, assinar e verificar tokens
mongoose.connect(config.database); // Conecta a Base de dados

app.set('superSecret', config.secret); // Pega a palavra chave.

// Use o BodyParser para que possamos obter informações de POST e / ou parâmetros de URL
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use morgan para registrar solicitações no console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// Criar um usuário Simples.
	var nick = new User({ 
		name: 'felix', 
		password: 'metasis',
		admin: true 
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('Usuário Salvo com sucesso.');
		res.json({ success: true });
	});
});

// Rota Home (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Bem vindo a http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// Obter uma instância do roteador para  as rotas da api
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// Autenticação (nenhum middleware necessário, uma vez que este não é autenticado)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate

apiRoutes.post('/authenticate', function(req, res) {

	// Buscar o usuário
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Falha na autenticação usuário não encontrado' });
		} else if (user) {

			// Checa se as senhas conferem
			if (user.password != req.body.password) {
				res.status(401);
				res.json({ success: false, message: 'Falha na autenticação senha é inválida' });
			} else {

				// 
				// Se o usuário for encontrado e a senha estiver correta
				// Cria o Token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 60 // Tempo para expirar o token {24h}
				});

				res.json({
					success: true,
					message: 'Aproveite o token!',
					token: token
				});
			}		

		}

	});
});

// ---------------------------------------------------------
// Middleware para autenticar e verificar token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// Verifica os parâmetros de cabeçalho ou url ou publique parâmetros para token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decodifica o  token
	if (token) {

		// Verifica a palavra chave.
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Falha no autenticar token.' });		
			} else {
				// Se tudo estiver ok, salva para poder solicitar o uso em outras rotas
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// Se não for um Token
		// Retorna o erro
		return res.status(403).send({ 
			success: false, 
			message: 'Nenhum token fornecido.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Bem vindo à API' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/clientes', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});


apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Conectador a http://localhost:' + port);
