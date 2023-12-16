export default function Preflight ({ req }) {
  return {
    pageTitle: getPageTitle(req.path),
    account: {
      username: 'bobsyouruncle',
      id: '23jk24h24'
    }
  }
}

function getPageTitle (path) {
  const titleMap = {
    '/': 'Home',
    '/about': 'About',
    '/account': 'My Account'
  }

  return titleMap[path] || 'My App Name'
}
