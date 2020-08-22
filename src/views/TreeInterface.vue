<template>
<div id="treeInterface">
    <controls />
    <input type="button" id="debug_button" value="showStoreState" @click='showStoreState = !showStoreState'><!-- FCG: WARNING/REMOVE for debugging. -->
    <pre id="debug_pre" v-if='showStoreState'>{{wholeState}}</pre><!-- FCG: WARNING/REMOVE for debugging. -->
    <div>
        <input type="button" value="breadthExecute" @click='breadthExecute'>
        <input type="button" value="depthExecute" @click='depthExecute'>
        <input type="button" value="runnerDo" @click='runnerDo'>
    </div>
    <div id="treeContainer">
        <subTreesRow v-bind:subTreesRow='subTreesRow' v-bind:style="{ transform: 'scale('+treeZoom+')', transformOrigin: 'left top', width: 'calc(100%/'+treeZoom+')', height: 'calc(100%/'+treeZoom+')' }" />
    </div>
</div>
</template>

<script>
import controls from '@/components/controls.vue';
import subTreesRow from '@/components/subTreesRow.vue';
import treeTools from '@/lib/treeTools.js';

function runQueue(queue) {
    console.log('preparation')
    let node = queue.shift();
    let PythonShellLibrary = window.PythonShellLibrary;
    let {
        PythonShell
    } = PythonShellLibrary;
    // console.log(node)
    if (typeof(node) != 'undefined') {
        console.log(node.id)
        try {
            PythonShell.run(node.nodeValue, null, function(err, results) {
                // console.log('executing');
                if (err) {
                    console.log('err', err)
                    // throw 'PYTHON ERROR: ' + err;
                }
                if (results) {
                    console.log('results', results);
                }
                console.log('cleanup');
                runQueue(queue);
            });
        } catch (e) {
            console.log('Error:', e.message);
            console.log('cleanup');
            runQueue(queue);
        }
    }
}

export default {
    name: 'TreeInterface',
    components: {
        controls,
        subTreesRow
    },
    props: [],
    computed: {
        subTreesRow() {
            return this.$store.state.processTree;
        },
        treeZoom() {
            return this.$store.state.processTreeZoom;
        },
        wholeState() {
            return this.$store.state;
        }
    },
    methods: {
        breadthExecute() {
            let nodesList = treeTools.listNodes(this.$store.state.processTree, 'processTree', 'breadth');
            console.log('node.id list breadth')
            for (let node of nodesList) {
                console.log(node.id)
            }
            runQueue(nodesList);
        },
        depthExecute() {
            let nodesList = treeTools.listNodes(this.$store.state.processTree, 'processTree', 'depth');
            console.log('node.id list depth')
            for (let node of nodesList) {
                console.log(node.id)
            }
            runQueue(nodesList);
        },
        runnerDo() {
            console.log('runnerDo')
            window.console.log("go man - ", new Date())
            // let PythonShellLibrary = require('python-shell');

            // Using second method in https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
            console.log('window.PythonShellLibrary')
            console.log(window.PythonShellLibrary)
            let PythonShellLibrary = window.PythonShellLibrary;

            // window.PythonShellLibrary = PythonShellLibrary;
            // console.log(PythonShellLibrary);
            let {
                PythonShell
            } = PythonShellLibrary;
            // console.log(126)
            PythonShell.run('/Users/felipe/Downloads/showRandom.py', null, function(err, results) {
                // console.log('executing');
                if (err) {
                    // console.log('err', err)
                    throw err;
                }
                if (results) {
                    console.log('results', results);
                }
                console.log('finished');
            });

            // let shell = new PythonShell('/Users/felipe/Downloads/showRandomWithSleep.py', {
            // 	pythonOptions: ['-u'] // Outputs stdout results as soon as they are printed
            // });
            // window.pythonShell_shell = shell;
            // shell.on('message', function(message){
            // 	window.console.log('message', message);
            // 	window.console.log(new Date())
            // })

            // // From https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js
            // // The path to your python script
            // var myPythonScript = "/Users/felipe/Downloads/showRandomWithSleep.py";
            // // Provide the path of the python executable, if python is available as environment variable then you can use only "python"
            // var pythonExecutable = "python";
            // // Function to convert an Uint8Array to a string
            // var uint8arrayToString = function(data) {
            //     return String.fromCharCode.apply(null, data);
            // };
            // // const spawn = require('child_process').spawn;
            // console.log(spawn)
            // const scriptExecution = spawn(pythonExecutable, ['-u', myPythonScript]);
            // // Handle normal output
            // scriptExecution.stdout.on('data', (data) => {
            //     console.log(uint8arrayToString(data));
            //     window.console.log(new Date())
            // });
            // // Handle error output
            // scriptExecution.stderr.on('data', (data) => {
            //     // As said before, convert the Uint8Array to a readable string.
            //     console.log(uint8arrayToString(data));
            // });
            // scriptExecution.on('exit', (code) => {
            //     console.log("Process quit with code : " + code);
            // });
        }
    },
    watch: {},
    data() {
        return {
            showStoreState: false /* FCG: WARNING/REMOVE To show a <pre> processTree. */
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/config.scss';

#treeInterface {
    font-family: $treeInterface_font_family;
    text-align: center;

    // Used to make the interface fixed to that nothing moves from its place
    display: flex;
    flex-direction: column;
    height: 100%;
}

#treeContainer {
    font-size: $treeContainer_font_size;
    overflow: hidden; // Used to make the interface fixed to that nothing moves from its place and for zoom.
    flex-grow: 2; // When the content is small this allows the block to grow and take al available space.

    // When displaying hierarchy lines this hides the lines for the first row elements and removes unnecessary space before.
    > .subTreesRow {
        padding: 0;
        &:after,
        &:before {
            border: 0;
        }
        > .subTree {
            &:after,
            &:before {
                border: 0;
            }
        }
    }
}

button,
input[type=button] {
    border: 1px solid lightgray;
    border-radius: 3px;
    background: white;
    margin: 1px;
    color: #333;
    outline: 0;

    &:hover {
        background: #eee;
        // color: white;
    }
    &:active {
        background: lightgray;
        color: black;
    }
}

#debug_button {
    display: block;
    margin: 0 auto;
}

#debug_pre {
    overflow: auto;
    text-align: left;
    font-size: 8px;
    flex-shrink: 2;
}
</style>
