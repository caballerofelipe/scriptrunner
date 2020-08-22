# Insert elements programmatically
```javascript
// See this: https://css-tricks.com/creating-vue-js-component-instances-programmatically/
window.console.log('insertElement');
Vue
var subTree = () => import('@/components/subTree.vue') /* Read 'Circular reference note' above. */
// new Vue({render: h => h(subTree, {props: {node: {nodeValue: 'el valor', processTree: [{nodeValue: 'dos'},{nodeValue: 'tres'}]}}})}).$mount(this.$refs['testBlock'])
var subTreeVueElement = new Vue({render: h => h(subTree, {props: {node: {nodeValue: 'el valor', processTree: [{nodeValue: 'dos'},{nodeValue: 'tres'}]}}})});
var subTreeElement = subTreeVueElement.$mount().$el;
// window.theNow = this
// window.theNode = node
// this.$el.appendChild(subTreeElement)
this.$refs['ref_subTreesRow_subTree'][0].$el.appendChild(subTreeElement)
```

# Move from one array to another in an object with arrays
```javascript
tree = [{
  "nodeValue": "value",
  "processTree": [{
    "nodeValue": "value",
    "processTree": [{
      "nodeValue": "value",
      "processTree": [],
      "id": "_0_0_0"
    }],
    "id": "_0_0"
  }, {
    "nodeValue": "value",
    "processTree": [{
      "nodeValue": "value",
      "processTree": [{
        "nodeValue": "value",
        "processTree": [],
        "id": "_0_1_0_0"
      }, {
        "nodeValue": "value",
        "processTree": [],
        "id": "_0_1_0_1"
      }],
      "id": "_0_1_0"
    }],
    "id": "_0_1"
  }],
  "id": "_0"
}]

// Example
let removedElement = tree[0]['processTree'][1]['processTree'][0]['processTree'].splice(0,1);
tree[0]['processTree'][0]['processTree'].push(removedElement);

// Example, oneliner
tree[0]['processTree'][0]['processTree'].push(
	tree[0]['processTree'][1]['processTree'][0]['processTree'].splice(0,1)
)
```

# Make information reactive
- https://stackoverflow.com/a/55854009/1071459
- https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
```javascript
// Used in src/store/index.js, in function createNodeNextToNode
//
// Apparently this is false, I leave it here in case I find the problematic behavior
//
// I thought state.processTree cannot be written directly as new information won't be reactive
// The idea is to create a copy and rewrite the original object.
//
// * Option 1
// This rewrites processTree, idea taken from https://stackoverflow.com/a/55854009/1071459
// Also tried adding new reactive objects recursively in mapWithParent but that messes up history
// Vue.set(state, 'processTree', processTreeTMP);
//
// * Option 2
// state.processTree = processTreeTMP;
```

# Adding configuration

## Inside App.vue to allow following vue instances to have this config
See [6. Use \$config to access your environment variables (especially useful in templates)](https://www.telerik.com/blogs/10-good-practices-building-maintaining-large-vuejs-projects#6usedconfigtoaccessyourenvironmentvariablesespeciallyusefulintemplates)
```javascript
// To add global config from inside a file
import config from '@/config'
Vue.prototype.$config = config;

// To add global config from object
Vue.prototype.$config = {};
```

## Dynamically load the files
Similar to previous method but loads the file dinamically form server.
See https://stackoverflow.com/a/60114397/1071459 .
```javascript
// Config file (/public/config.json)
{
  "KEY": "value"
}
```
```javascript
// Load the config (/src/main.js)
fetch(process.env.BASE_URL + "config.json")
  .then((json) => {
    json().then((config) => {
       Vue.prototype.$config = config
       new Vue({
         router,
         store,
         render: (h) => h(App)
       }).$mount("#app")
    })
})
```

## Import a config file wherever you need it
See https://stackoverflow.com/a/44750035/1071459 .
```javascript
// Config file
module.exports = {
    API_LOCATION: 'http://localhost:8080/api/'
}
```
```javascript
// Import full object
import config from "../config"

// Import needed parts
import { API_LOCATION } from "../config"
```

## Using env files
See:
- https://stackoverflow.com/a/50831022/1071459
- [Modes and Environment Variables | Vue CLI](https://cli.vuejs.org/guide/mode-and-env.html#modes)

From [Modes and Environment Variables | Vue CLI](https://cli.vuejs.org/guide/mode-and-env.html#modes):
> You can specify env variables by placing the following files in your project root:
```bash
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```
An env file simply contains key=value pairs of environment variables:
```bash
FOO=bar
VUE_APP_NOT_SECRET_CODE=some_value
```

# Using node APIs
Prior to VCPEB (vue-cli-plugin-electron-builder) 2.0 requiring packages was possible, not anymore. For instance python-shell could be used with `let PythonShellLibrary = require('python-shell');` not anymore.

See
- https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/986#issue-681556462
- https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration

## Into preload.js
### (Prefered) Solution 1: import into window required packages
```javascript
// Example
// Used to execute Python code
import * as PythonShellLibrary from 'python-shell';
window.PythonShellLibrary = PythonShellLibrary;
```

### Solution 2: allow all APIs
```javascript
import {
    ipcRenderer
} from 'electron'
window.ipcRenderer = ipcRenderer
```
