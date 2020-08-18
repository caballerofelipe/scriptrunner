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
