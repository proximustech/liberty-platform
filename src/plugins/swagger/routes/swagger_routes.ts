import Router from "koa-router"
import { koaSwagger } from 'koa2-swagger-ui';
const yamljs = require('yamljs');

const spec = yamljs.load('./src/plugins/swagger/openapi.yaml');

let getRouter = (viewVars: any) => {

    viewVars = {}

    const router = new Router({ prefix: '/api' });
    router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec }}));

    return router
}

export default getRouter