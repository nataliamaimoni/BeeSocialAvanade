const Hapi = require('hapi')
const DatabasePosts = require('./databaseBeeSocial')
const Boom = require('boom')
const Joi = require('joi')


async function main() {
  try {

    const conn = DatabasePosts.conectar();
    const posts = new DatabasePosts(conn);

    const app = new Hapi.Server({
      port: 3000,
      routes: {
        cors: {
          origin: ['*']
        }
      }
    })

    app.route([
      {
        method: 'GET',
        path: '/posts',
        handler: async (req, han) => {
          try {
            const { limitar, ignorar } = req.query;
            const resultado = await posts
              .listar({}, {
                limitar: 100,
                ignorar: parseInt(ignorar)
              })
            return resultado;
          }
          catch (error) {
            return Boom.internal();
          }
        },
        config: {
          validate: {
            failAction: (request, h, err) => {
              throw err
            },
            query: {
              ignorar: Joi.number().integer().default(0),
              limitar: Joi.number().integer().default(10)
            }
          }
        }
      }, {
        method: 'POST',
        path: '/posts',
        handler: async (request, h) => {
          try {
            const item = request.payload;
            const resultado = await posts.cadastrar(item)
            return resultado
          }
          catch (error) {
            console.error(error);
            return Boom.internal();
          }
        },
        config: {
          validate: {
            failAction: (request, h, err) => {
              throw err
            },
            //payload: validatePostPayload(),

          }
        }
      }, {
        path: '/posts/{groupName}',
        method: 'GET',
        handler: async (request, h) => {
          try {
            const { groupName } = request.params;
            const result = await posts.listar({
              groupName: groupName,
            });
            return result;
          }
          catch (error) {
            console.error(error);
            return Boom.internal();
          }
        },
        config: {
          validate: {
            params: {
              groupName: Joi.string()
                .max(200)
                .required(),
            }
          }
        }
      },
    ])
    await app.start()
    console.log(`Servidor rodando em: ${app.info.port}`)
  }
  catch (error) {
    console.error(error)
  }
}

main()
