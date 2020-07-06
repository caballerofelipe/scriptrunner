<template>
<div id="app">
    <!-- Navigation not used, uncomment below if needed -->
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
</div>
</template>

<style lang="scss">
@import '@/sass/config.scss';

#app,
body,
html {
    height: 100%;
    margin: 0;
}

#app {
    font-family: $app_font_family;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

// Navigation not used, uncomment below if needed
// #nav {
//   padding: 30px;
//
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
