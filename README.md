# Simple Invoicing App

Simple Invoicing App is a browser-based progressive web application (PWA) that designed to helps you track expenses, payments & create professional invoices & estimates. The app built using common web technologies including HTML, CSS and TypeScript on top of Facebook's [React][react] library, [Wijmo FlexGrid](https://www.grapecity.com/en/wijmo-flexgrid), [Wijmo FlexChart](https://www.grapecity.com/en/wijmo-flexchart) and Material UI. Currently, the app doesn't involve a server, all data is stored in IndexedDB.

### Tech Stack

* [Node.js][node], [Yarn][yarn], [TypeScript][ts], [Babel][babel], [Prettier][prettier] — core platform and dev tools
* [Wijmo](https://www.npmjs.com/package/wijmo) - Enterprise UI controls.
* [Jest][jest] - unit and snapshot testing

### Prerequisites

* [Node.js][node] v12 or higher + [Yarn][yarn] package manager
* Optionally [VS Code][code] editor with [Project Snippets][vcsnippets],
  [EditorConfig][vceditconfig], [ESLint][vceslint], and [Prettier][vcprettier]
  plug-ins.

### Getting Started

Just clone the repo, install the packages with `yarn` and run `yarn start`:

```bash
$ yarn install                  # Install Node.js dependencies
$ yarn start                    # Launch application.
```

Now you can open your web app in a browser and start hacking.
Whenever you modify any of the source files inside the /src folder, the module bundler (Webpack)
will recompile the app on the fly and refresh all the connected browsers.

Note that the npm start command launches the app in development mode, the compiled output files are not optimized
and minimized in this case.

### How to Build

If you need just to build the app (without running a dev server), simply run:

```shell
$ npm run build
```

This command builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
By default, it also includes a service worker so that your app loads from local cache on future visits.

Your app is ready to be deployed.

### References

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and powered by Wijmo components:
* [FlexGrid](https://www.grapecity.com/en/wijmo-flexgrid) - Fast, high-performance grid.
* [FlexChart](https://www.grapecity.com/en/wijmo-flexchart) - A Flexible JavaScript Chart Control.
* [node]: https://nodejs.org
* [react]: https://github.com/facebook/react
* [ts]: https://typescriptlang.org/
* [babel]: http://babeljs.io/
* [prettier]: https://prettier.io/
* [yarn]: https://yarnpkg.com
* [code]: https://code.visualstudio.com/
* [vcsnippets]: https://marketplace.visualstudio.com/items?itemName=rebornix.project-snippets
* [vceditconfig]: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
* [vceslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
* [vcprettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
* [jest]: http://facebook.github.io/jest/
