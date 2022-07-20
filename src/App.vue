<template>
  <v-app class="amber lighten-4">
    <v-app-bar class="green lighten-2" dark>
      <div class="centriraj">
        <v-row>
          <router-link
            style="text-decoration: none; color: inherit"
            to="/podaci"
          >
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

<style>
.centriraj {
  margin: 0 auto;
  float: none;
}
</style>
