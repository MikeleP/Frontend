<template>
  <div>
    <v-app>
      <v-container fill-height>
        <v-col class="green lighten-3">
          <v-row class="pa-3 align-center justify-center">
            <v-btn
              rounded
              color="green lighten-1"
              class="mr-7 pa-6 elevation-5"
              width="310px"
              ><router-link
                style="text-decoration: none; color: white"
                to="/podaci"
              >
                <v-icon color="purple">mdi-file-document</v-icon>
                Podaci o govedima
              </router-link>
            </v-btn>
          </v-row>
          <v-row class="pa-3 align-center justify-center">
            <v-btn
              rounded
              color="green lighten-1"
              class="mr-7 pa-6 elevation-5"
              width="310px"
              ><router-link
                style="text-decoration: none; color: white"
                to="/dolazak"
              >
                <v-icon color="purple">mdi-emoticon-cool</v-icon>
                Dolazak na gospodarstvo
              </router-link>
            </v-btn>
          </v-row>
          <v-row class="pa-3 align-center justify-center">
            <v-btn
              rounded
              color="green lighten-1"
              class="mr-7 pa-6 elevation-5"
              width="310px"
              ><router-link
                style="text-decoration: none; color: white"
                to="/odlazak"
              >
                <v-icon color="purple">mdi-emoticon-sad</v-icon>
                Odlazak s gospodarstva
              </router-link>
            </v-btn>
          </v-row>
        </v-col>
      </v-container>
    </v-app>
  </div>
</template>
