### Node Token Autenticação
  
 
 Este repositório usa JSON Web Tokens e o pacote [jsonwebtoken] (https://github.com/auth0/node-jsonwebtoken) para implementar a autenticação baseada em token em uma simples API Node.js.
 Este é um ponto de partida para demonstrar o método de autenticação, verificando um token usando o middleware da rota Express.
 
 
 ### Requerimentos
 
  node e npm
  
 ## Uso
 
 1. Clone o repositório: `https://github.com/PatrickNascimento/NodeJs-AuthJsonWebToken.git`
 2. Instalar dependencias: `npm install`
 3. Mudar Palavra Chave em `config.js`
 4. Adicionar seu MongoDB em  `config.js`
 5. iniciar o servidor: `node server.js`
 6. Criar um usuario visitante: `http://localhost:8080/setup`
 
 Uma vez que tudo esteja configurado, podemos começar a usar nosso aplicativo para criar e verificar tokens.
 
 ### Obtendo um Token
 
 Envie uma requisição  `POST` para `http://localhost:8080/api/authenticate` com os parâmetros do usuário teste as `x-www-form-urlencoded`. 
 
 ```
   {
     name: 'Patrick Nascimento',
     password: '123456'
   }
 ```
 
 ### Verificando o token e a lista de usuários
 
 envie uma requisição  `GET` para `http://localhost:8080/api/users` com os parametros `x-access-token` e o token.
 
 você também pode enviar o token como um parâmetro de URL:: `http://localhost:8080/api/users?token=SEUTOKENAQUI`
 
