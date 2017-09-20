import { appson } from '@onemarket/appson'
import Simple from './'

const app = appson(Simple)

app.render('#root')
