# /bin/bash
set -euo pipefail

yarn install
yarn --cwd ./packages/common-types/ build
yarn --cwd ./packages/common-utils/ build
yarn --cwd ./packages/client-mobile/ build
yarn --cwd ./packages/client-screen/ build
