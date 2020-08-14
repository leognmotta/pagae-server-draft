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
  .middleware({
    destroy: [authMiddleware, 'sentinel'],
    edit: [authMiddleware, 'sentinel'],
    update: [authMiddleware, 'sentinel'],
    index: [authMiddleware, 'sentinel'],
    show: [authMiddleware, 'sentinel'],
  })
  .apiOnly()

Route.resource('businesses', 'BusinessesController')
  .where('id', idPattern)
  .middleware({
    '*': [authMiddleware],
    destroy: 'sentinel',
    index: 'sentinel',
    show: 'sentinel',
    update: 'sentinel',
  })
  .apiOnly()

Route.group(() => {
  Route.get('subscriptions', 'SubscriptionsController.show')
  Route.patch('subscriptions', 'SubscriptionsController.update')
  Route.delete('subscriptions', 'SubscriptionsController.delete')
})
  .where('businessId', idPattern)
  .middleware([authMiddleware, 'sentinel'])

Route.resource('clients', 'ClientsController')
  .where('id', idPattern)
  .middleware({
    '*': [authMiddleware, 'sentinel'],
  })
  .apiOnly()

Route.resource('projects', 'ProjectsController')
  .where('id', idPattern)
  .middleware({
    '*': [authMiddleware, 'sentinel'],
  })
  .apiOnly()
