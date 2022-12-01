#!/bin/bash
set -eu # throw if things go bad

echo "Booting Sandbox"
npm run start &
sandboxPid=$!

sleep 2 # a smarter script would ping Sandbox

echo -e "\nRunning Hurl tests\n"
npx hurl --test test/integration/*.hurl

echo -e "Stopping Sandbox <${sandboxPid}>"
kill $sandboxPid
