// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes, HTTP_HEADERS } from '@edgio/core'

export default new Router()
  // Here is an example where we cache api/* at the edge but prevent caching in the browser
  // .match('/api/:path*', {
  //   caching: {
  //     max_age: '1d',
  //     stale_while_revalidate: '1h',
  //     bypass_client_cache: true,
  //     service_worker_max_age: '1d',
  //   },
  // })

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)

  // Allow Prefetching of Uncached Content
  // https://docs.edg.io/guides/v7/performance/rules/features#allow-prefetching-of-uncached-content
  // Otherwise user will see 412 status code
  // https://docs.edg.io/guides/v7/performance/traditional_sites#understanding-caching-and-prefetching
  .match({}, { response: { allow_prefetching_uncached_content: true } })
  // NOTE: old version of allow prefetching of cache miss
  // import { prefetch } from '@layer0/prefetch/window
  // prefetch('<some_url>', 'fetch', { includeCacheMisses: true })

  // Compress Content Types
  // https://docs.edg.io/guides/v7/performance/rules/features#compress-content-types
  .match({}, { response: { compress_content_types: ["text/plain", "text/html", "text/css"] } })
  // NOTE: In old version: need to limit by content-type
  .match({}, ({ setResponseHeader, setRequestHeader }) => {
    setRequestHeader('Accept-Encoding', 'gzip, compress')
    setResponseHeader(HTTP_HEADERS.contentEncoding, 'gzip, compress')
  })

  // Optimize Images
  // https://docs.edg.io/guides/v7/performance/rules/features#optimize-images
  // https://docs.edg.io/guides/v7/performance/image_optimization#enabling-image-optimization
  .match('/static-assets/:path*.(jpg|bmp)', { response: { optimize_images: true } })

  // Set Done, Set Status Code & Set Response Body
  // https://docs.edg.io/guides/v7/performance/rules/features#set-done - set done
  // https://docs.edg.io/guides/v7/performance/rules/features#set-status-code - set status code
  // https://docs.edg.io/guides/v7/performance/rules/features#set-response-body - set response body
  .match(
    {
      path: '/search',
      query: {
        q: 'test'
      }
    },
    {
      response: {
        set_done: true,
        set_status_code: 403,
        set_response_body: "Sorry, you can't see this page!",
      },
    }
  )
  .match(
    {
      path: '/search',
      query: {
        q: 'test'
      }
    },({ send }) => {
      send("Sorry, you can't see this page!", 403)
    }
  )
  .match(
    {
      path: '/search',
      query: {
        q: 'test'
      }
    },({ setResponseCode, setResponseBody }) => {
      setResponseCode(403)
      setResponseBody("Sorry, you can't see this page!")
    }
  )
  .match(
    {
      path: '/search',
      query: {
        q: 'test'
      }
    },({ setResponseBody }) => {
      // arguments: set_response_body, set_status_code, set_done
      setResponseBody("Sorry, you can't see this page!", 403, true)
    }
  )

  // Set Variables
  // https://docs.edg.io/guides/v7/performance/rules/features#set-variables
  .match(
    {},
    {
      set_variables: { test: "some value", another_variable: "another value" },
      headers: {
        set_response_headers: {
          'x-0-test': '%{usrvar_test}'
        }
      }
    },
  )

  // Follow Redirects
  // https://docs.edg.io/guides/v7/performance/rules/features#follow-redirects
  .match({}, { url: { follow_redirects: true } })
  .match({}, ({ proxy }) => {
    proxy('origin', {
      followRedirects: true
    })
  })


  // Rewrite URL
  // https://docs.edg.io/guides/v7/performance/rules/features#rewrite-url
  .match('/edgio-rewrite/:path*', {
    url: {
      url_rewrite: [
        {
          source: '/edgio-rewrite/:path*:optionalSlash(\\/?)?:optionalQuery(\\?.*)?',
          syntax: 'path-to-regexp',
          destination: '/:path*:optionalSlash:optionalQuery',
        },
      ],
    },
    origin: { set_origin: 'origin' },
  })
  .match('/edgio-rewrite/:path*', ({ rewritePath }) => {
    rewritePath('/edgio-rewrite/:path*:optionalSlash(\\/?)?:optionalQuery(\\?.*)?', '/:path*:optionalSlash:optionalQuery')
  })
  .match('/edgio-rewrite/:path*', ({ updatePath }) => {
    updatePath('/:path*')
  })

  // URL Redirect
  // https://docs.edg.io/guides/v7/performance/rules/features#url-redirect
  .match('/edgio-redirect/:path*', {
    url: {
      url_redirect: {
        source: '/edgio-redirect/:path*:optionalSlash(\\/?)?:optionalQuery(\\?.*)?',
        syntax: 'path-to-regexp',
        destination: '/:path*:optionalSlash:optionalQuery',
      },
    },
    origin: { set_origin: 'origin' },
  })
  .match('/edgio-redirect/:path*', ({ redirect }) => {
    redirect('/:path*', { statusCode: 301 })
  })
