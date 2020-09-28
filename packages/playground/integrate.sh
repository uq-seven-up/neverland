# /bin/bash
set -euo pipefail

yarn build
rm ../client-screen/public/game/*
cp ./dist/* ../client-screen/public/game/
rm ../client-screen/public/game/index.html
