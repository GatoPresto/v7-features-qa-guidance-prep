import { Router, edgioRoutes } from '@edgio/core'
import * as Routers from './routes/index.js'

const edgio = new Router()
  .use(edgioRoutes)

// Iterate over the values of the Routers object
Object.values(Routers).forEach((Router) => {
  edgio.use(new Router())
});

export default edgio

