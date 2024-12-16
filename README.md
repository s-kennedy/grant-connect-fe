## Project Requirements

- Node (latest version)
- npm (latest version)
- Alternatively, you can use yarn to install, run and build the project, you can ignore this step if you're comfortable with npm

## Starting the project

- Whenever you clone and / or change branches, run `npm install`
- Then, start the project `npm start`
- The project will open automatically on your primary browser, it's going to be available at `http://localhost:3000`

## Building the project

The `/build` folder is not being ignored and every time the project needs to be build, you will need to run `npm run build && git add . && git commit -a -m "Production build scripts" && git pull && git push origin [branch-name]`

## Compiling SASS

- To see your changes locally on the CSS files, run `npm run watch-css`

## The stack

The project was separated into the app main concepts.

- Assets: Images and documents used on the app (logo, background images, etc...)
- Components: Core concept of React. All the generic components live inside this folders and they're separated by their names, which are also folders.
- Config: The environment configuration related to the domains. If the domains change, this configuration needs to be updated. All the app config should live inside this folder.
- Controllers: This is the brain of the app. All the heavy calculations and formatting is happening inside those files.
- Actions / Reducers: The redux part of the application. We're using the redux store to manage some sharable states. Every state that needs to be used in more that one component should use the redux store.
- Locale: Language functions
- Pages: There are 4 pages in total for this application. Every page will have a folder with the page name and its internal / specific components.
- Styles: All the SASS and CSS files are being included from this folder. If you create a new SASS file, by running `npm run watch-css`, it will create automatically a new CSS file.
- Utils: The API functions and helpers live inside this folder.

## External libraries

A lot of external libraries were used, the main ones are.

- https://redux.js.org/
- https://material-ui.com/

## Environment variables

Environment variables are stored in `.env` file and all variables need to be prefixed with `REACT_APP_` so they can be picked up by react-scripts

REACT_APP_SERVER_BASE_URL - server base URL

Refer to `.env.sample` for an example of the env file

## Production build

Run the following command from root directory:

```sh
sh .ci/build_prod.sh
```

It will build and tag docker image, and run `.ci/deploy_prod.sh` inside the container. All assets needed for deployment are in `/build` folder

## Local Development with Docker

Run the following command from root directory:

```sh
docker-compose up
```

## Deployment
