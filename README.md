# scriptrunner (or ScriptRunner 😉)

## Project setup
Using instructions from [Vue CLI Plugin Electron Builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) and from Vue.js.
``` bash
# To see the project in action, after getting the files on hard drive (git, download or whatever), run:
npm install

# To start a development server:
# ... If you use Yarn (strongly recommended by nklayman):
yarn electron:serve
# ... or if you use NPM:
npm run electron:serve

# To build your app:
# ... With Yarn:
yarn electron:build
# ... or with NPM:
npm run electron:build
```

## Initial Installation
This is what I did on the initial installation.

### Steps
1. Install Vue CLI.
1. Create a project.
1. Add `electron-builder`.

### Vue CLI install
Install Vue CLI ([Installation | Vue CLI](https://cli.vuejs.org/guide/installation.html)):
```
npm install -g @vue/cli
```

### Creating the project
This is how I created the Vue.js project ([Creating a Project | Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)):
```
vue create scriptrunner
```
And these are the selections made:
``` bash
Vue CLI v4.2.3
? Please pick a preset:
  default (babel, eslint)
❯ Manually select features
```
```
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
❯◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```
```
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
 n
```
```
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): (Use ar
row keys)
❯ Sass/SCSS (with dart-sass)
  Sass/SCSS (with node-sass)
  Less
  Stylus
```
```
? Pick a linter / formatter config: (Use arrow keys)
❯ ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
```
```
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selectio
n)
❯◉ Lint on save
 ◯ Lint and fix on commit
```
```
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
❯ In dedicated config files
  In package.json
```
```
? Save this as a preset for future projects? (y/N) N
```

### Adding electron-builder
For this project [Vue CLI Plugin Electron Builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) will be used.
```
vue add electron-builder
```
This is the selections made:
``` bash
📦  Installing vue-cli-plugin-electron-builder...
(...)
✔  Successfully installed plugin: vue-cli-plugin-electron-builder

? Choose Electron Version (Use arrow keys)
  ^4.0.0
  ^5.0.0
❯ ^6.0.0
```
