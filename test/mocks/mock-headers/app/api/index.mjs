// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
 * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
 */

/**
 * @type {EnhanceApiFn}
 *
 * testing a custom header
 */
export async function get () {
  return {
    headers: {
      'x-custom-header': 'custom-header-value',
    },
    json: { data: [ 'sutro', 'turtle', 'mae mae' ] }
  }
}

/**
 * @type {EnhanceApiFn}
 *
 * testing a custom header in midddleware
 */
export let post = [ async function fn () {
  return {
    headers: {
      'x-custom-header': 'custom-header-value',
    },
    json: { data: [ 'sutro', 'turtle', 'mae mae' ] }
  }
} ]
