# node-crud-api
## App description
Detailed description placed here: [app requirements link](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

## Launch
1) create `.env` file and copy `.env.sample` values into this file (replace values, if needed)
2) make sure that you are use correct version of node (`node -v` should return v18.\*\*.\*\*)
3) run app:
> - run script `npm run start:dev` for development
> - run script `npm run start:multi` for app in development mode with cluster
> - run script `npm run start:prod` for run production build locally

4) check that all works:
> - open `http://localhost:APP_PORT/api/users` in browser (replace `APP_PORT` with value from your local `.env` file)
> - page content should not contain connection errors

## .env file properties
- `APP_PORT` - port, that will be used for launch server. Default = `4000` 
- `USE_CLUSTER` - if `"true"` - will enable cluster mode. Default = `false` (except app run with `start:multi` script)
- `IS_LOG_ENABLED` - if `"true"` - will tranfer app messages into logger. Default = `false`

## More usefull npm scripts
- `npm test` - will run project tests
- `npm run lint` - will run linter check of codebase
