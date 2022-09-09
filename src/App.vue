<template>
  <v-app id="app">
    <v-app-bar class="green lighten-2" dark>
      <div class="centriraj">
        <v-row>
          <router-link style="text-decoration: none; color: blue" to="/">
            <h1 class="blue--text">REGISTAR GOVEDA NA GOSPODARSTVU</h1>
          </router-link>
        </v-row>
      </div>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
};
</script>

<style lang="scss">
.centriraj {
  margin: 0 auto;
  float: none;
}

* {
  margin: 0;
  padding: 0;
}

#app {
  background-image: url("./assets/krave.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
