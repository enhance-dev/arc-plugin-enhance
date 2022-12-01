#!/bin/bash
set -u

echo "Booting Sandbox"
npm run start &
sandboxPid=$!

sleep 2 # a smarter script would ping Sandbox

echo -e "\nRunning Hurl tests\n"
npx hurl --test --variable host=http://localhost:3333 test/integration/*.hurl
hurlCode=$?

echo -e "Hurl exited with ${hurlCode}"

echo -e "Stopping Sandbox <${sandboxPid}>"
kill $sandboxPid

exit $hurlCode
