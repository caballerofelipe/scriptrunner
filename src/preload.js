/**
Why this file:
    - Prior to VCPEB 2.0 requiring packages was possible, not anymore. For instance python-shell could be used with
    `let PythonShellLibrary = require('python-shell');` not anymore.
    - https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/986#issue-681556462
    - https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
*/

// Used to execute Python code
// Configuration can be done her for global behavior
import * as PythonShellLibrary from 'python-shell';
window.PythonShellLibrary = PythonShellLibrary;
