call yarn install
call yarn --cwd ./packages/common-types/ build
call yarn --cwd ./packages/common-utils/ build
call yarn --cwd ./packages/server/ build
call yarn --cwd ./packages/client-mobile/ build
call yarn --cwd ./packages/client-screen/ build
call yarn --cwd ./packages/playground/ build
