export default function Preflight({ req }) {
  return {
    title: getPageTitle(req.path),
    account: {
      username: 'Bob Syouruncle',
      id: '23jk24h24'
    }
  }
}

function getPageTitle(path) {
  const titleMap = {
    '/': 'Home',
    '/about': 'About',
    '/account': 'My Account'
  }

  return titleMap[path] || 'My App Name'
}
