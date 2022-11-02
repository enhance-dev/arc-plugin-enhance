export async function get (req) {
  const rand = Math.random().toString() // Make sure the new session value will change for every request
  const sessionExiting = rand
    return {
      session: sessionExiting,
      json: { 
        // This is overwritten and should not pass through
        session: "This should be overwritten",    
        // This is the session that was set in the API which should be passed on
        sessionExiting,                          
        // This is the entering session which should only pass thought if not set in the API
        sessionEntering: req.session              
      }
    }
  }
