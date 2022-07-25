<template>
  <div>
    <v-app>
      <div class="d-flex justify-space-around align-center fill-height mx-auto">
        <div>
          <v-btn
            rounded="lg"
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
        </div>
        <div>
          <v-btn
            rounded="lg"
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
        </div>
        <div>
          <v-btn
            rounded="lg"
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
        </div>
      </div>
    </v-app>
  </div>
</template>
