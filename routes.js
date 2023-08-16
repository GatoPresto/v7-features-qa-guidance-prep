// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core'

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

  // Compress Content Types
  // https://docs.edg.io/guides/v7/performance/rules/features#compress-content-types
  .match({}, { response: { compress_content_types: ["text/plain"] } })

  // Optimize Images
  // https://docs.edg.io/guides/v7/performance/rules/features#optimize-images
  // https://docs.edg.io/guides/v7/performance/image_optimization#enabling-image-optimization
  .match({}, { response: { optimize_images: true } })
