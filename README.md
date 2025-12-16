# City Row front end web page [www.go.cityrow.com](https://go.cityrow.com/us-en).

## Front End.

### Libraries.
This is a gatsby application but with a builder implementation. We are using the MVP pattern (Model-View-Presenter) to organize our code.
For the Model, we are using Clean Architecture for its great advantages:
- organized
- easy to test
- easy to grow
- easy to change libraries/services implementations.

### Styles rules.

We use _SCSS_ and the _BEM_ convention for the class name.

### Builder

We use the CMS Builder to generate the static data

### Swell

We use Swell to host the commerce product data.

### Project structure

- assets (static assets)
- builderComponents (components shared in builder)
- components (react reusable components)
- core (where the domain/business logic lives. Clean Architecture)
  - domain (here we have the domain models)
  - infrastructure (here lives the implementation of each domain service/repository)
  - useCases (all the actions that happens in the application. Highly reusable.)
- hooks (react hooks needed in the React components. UI logic)
- layouts (some layouts used in the builder/gatsby implementation)
- pages (pages that are static, they don't live in swell)
- presenters (where all the presenters lives. Presentational logic.)
- utils (some utils needed throughout the whole app)

### Running on a Macbook with M1 chip (Using NVM recommended)


```
// Uninstall previous version of node 14 with NVM
nvm uninstall 14
// Switch to x86_64 architecture
arch -x86_64 zsh 
// if the nvm command isn't found, make sure you have it correctly configured in your ~/.zprofile.
// You may have to run `source ~/.zprofile` if it isn't found
// This will install node 14 compiled as x86_64
nvm install 14
nvm alias default 14
exit
```

```
// Verify your node version and architecture of the node binary as follow
node 
// This should print the following and execute node as CLI
// Welcome to Node.js v14.18.1.
// Type ".help" for more information.
// > 
process.arch
// this should print 'x64'
```
```
// Make sure you are using nvm 14
nvm use 14
// remove previous node_modules
rm -rf node_modules/
// install everything again and run
npm install
npm start
```

