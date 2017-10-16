import { appson } from '@onemarket/appson'
import Simple from './'

const app = appson(Simple)

app.render('#root')

if (module.hot) {
  module.hot.accept('./', () => app.updateRootModule(Simple))
}
