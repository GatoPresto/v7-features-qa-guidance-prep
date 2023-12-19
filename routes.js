import { Router, edgioRoutes } from '@edgio/core'
import Routers from './routes/index.js'

const edgio = new Router()
  .use(edgioRoutes)

// Iterate over the values of the Routers object
for (const Router of Routers) {
  edgio.use(new Router())
}

export default edgio

