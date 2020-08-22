module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js' // See Notes #preload below
        }
    }
}

/*
Notes:

#preload
    - See preload.js file.
    - https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
    - https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#preload-files
 */
