class HeadersRouter {
  onRegister(router) {
    router
      .get('/test-header', {
        headers: {
          set_response_headers: {
            ['x-test-header']: 'some value',
          }
        },
        response: {
          set_response_body: 'Test page'
        }
      })
  }
}

export default HeadersRouter
