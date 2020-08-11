import Route from '@ioc:Adonis/Core/Route'

const authMiddleware = 'auth:web,api'
const idPattern = new RegExp('^([1-9])[\\d*]{0,9}$')

Route.post('/login', 'AuthController.login').prefix('session')
Route.post('/login', 'AuthController.login').prefix('api')

Route.post('/logout', 'AuthController.logout')
  .prefix('session')
  .middleware('auth:web')
Route.post('/logout', 'AuthController.logout')
  .prefix('api')
  .middleware('auth:api')

Route.resource('freelancers', 'FreelancersController')
  .where('id', idPattern)
  .except(['index', 'show'])
  .middleware({
    destroy: authMiddleware,
    edit: authMiddleware,
    update: authMiddleware,
  })
  .apiOnly()

Route.resource('businesses/:businessId/freelancers', 'FreelancersController')
  .where('businessId', idPattern)
  .where('id', idPattern)
  .only(['index', 'show'])
  .middleware({
    '*': [authMiddleware, 'teamMember'],
  })
  .apiOnly()

Route.resource('businesses', 'BusinessesController')
  .where('id', idPattern)
  .middleware({
    '*': [authMiddleware],
  })
  .apiOnly()

Route.group(() => {
  Route.get('subscriptions', 'SubscriptionsController.show')
  Route.patch('subscriptions', 'SubscriptionsController.update')
  Route.delete('subscriptions', 'SubscriptionsController.delete')
})
  .prefix('businesses/:businessId/')
  .where('businessId', idPattern)
  .middleware([authMiddleware, 'teamMember'])

Route.resource('businesses/:businessId/clients', 'ClientsController')
  .where('businessId', idPattern)
  .where('id', idPattern)
  .middleware({
    '*': [authMiddleware, 'teamMember', 'features:clients'],
  })
  .apiOnly()
