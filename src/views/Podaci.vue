<template>
  <div>
    <v-app>
      <div
        class="d-flex justify-space-around align-center flex-column flex-md-row my-4"
      >
        <v-card
          class="d-flex green lighten-2 rounded-xl align-center justify-center purple--text"
          height="80px"
          width="1200"
        >
          <h1>Podaci o govedima</h1>
        </v-card>
      </div>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="govedo"
        class="elevation-1 yellow lighten-3"
        hide-default-footer
        :page.sync="page"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
      >
        <template v-slot:top>
          <v-toolbar flat class="green lighten-3">
            <v-toolbar-title>
              <v-text-field
                v-model="search"
                class="yellow lighten-3 blue--text"
                filled
                rounded
                dense
                append-icon="mdi-magnify"
                label="Pretraživanje"
                hide-details
              ></v-text-field
            ></v-toolbar-title>

            <div
              class="d-flex justify-space-around align-center flex-column flex-md-row mx-auto"
            >
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
            </div>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green lighten-2"
                  dark
                  class="pa-6 elevation-5"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon color="purple" x-large>mdi-plus</v-icon>
                  Novo govedo
                </v-btn>
              </template>
              <v-card class="green lighten-4">
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.drzava"
                          :rules="drzavaRules"
                          label="Kod države"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.zivbroj"
                          :rules="zivbrojRules"
                          label="Živ. broj goveda"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.ime"
                          :rules="imeRules"
                          label="Ime goveda"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="15">
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.rodenje"
                              label="Datum rođenja"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              filled
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.rodenje"
                            @input="menu2 = false"
                            color="green darken-2"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.spol"
                          :rules="spolRules"
                          label="Spol"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="15">
                        <v-select
                          v-model="editedItem.pasmina"
                          :items="pasmine"
                          :rules="pasminaRules"
                          label="Pasmina"
                          required
                          filled
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.majka"
                          :rules="majkaRules"
                          label="Živ. broj majke"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.otac"
                          :rules="otacRules"
                          label="Hb broj oca"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Odustani
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="
                      formTitle === 'Novo govedo'
                        ? postGovedo()
                        : putGovedo(editedItem._id)
                    "
                  >
                    Spremi
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card class="green lighten-4">
                <v-card-title class="text-no-wrap"
                  >Jeste li sigurni da zelite izbrisati ovo
                  govedo?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Odustani</v-btn
                  >
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="removeGovedo(editedItem._id)"
                    >U redu</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.akcija`]="{ item }">
          <v-icon medium class="mr-2" @click="editItem(item)" color="blue">
            mdi-pencil
          </v-icon>
          <v-icon medium @click="deleteItem(item)" color="red">
            mdi-eraser-variant
          </v-icon>
        </template>
      </v-data-table>
      <div class="text-center pt-2 green lighten-2">
        <v-pagination
          v-model="page"
          :length="pageCount"
          color="purple"
          :total-visible="7"
        ></v-pagination>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    menu2: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 7,
    headers: [
      {
        text: "Rb.",
        align: "start",
        value: "index",
        class: "green lighten-2",
      },
      {
        text: "Kod države",
        sortable: false,
        value: "drzava",
        class: "green lighten-2",
      },
      {
        text: "Živ. broj goveda",
        value: "zivbroj",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Ime goveda",
        value: "ime",
        sortable: false,
        class: "green lighten-2",
      },
      { text: "Datum rođenja", value: "rodenje", class: "green lighten-2" },
      {
        text: "Spol",
        value: "spol",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Pasmina",
        value: "pasmina",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Živ. broj majke",
        value: "majka",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Hb broj oca",
        value: "otac",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Izmjena/Brisanje",
        value: "akcija",
        sortable: false,
        class: "green lighten-2",
      },
    ],
    govedo: [],
    editedIndex: -1,
    editedItem: {
      drzava: "",
      zivbroj: "",
      ime: "",
      rodenje: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      spol: "",
      pasmina: null,
      majka: 0,
      otac: 0,
    },
    defaultItem: {
      drzava: "",
      zivbroj: "",
      ime: "",
      rodenje: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      spol: "",
      pasmina: null,
      majka: 0,
      otac: 0,
    },

    drzavaRules: [(v) => !!v || "Niste unijeli kod države."],

    zivbrojRules: [(v) => !!v || "Niste unijeli životni broj goveda."],

    imeRules: [(v) => !!v || "Niste unijeli ime goveda."],

    spolRules: [(v) => !!v || "Niste unijeli spol goveda."],

    pasminaRules: [(v) => !!v || "Niste unijeli pasminu goveda."],

    majkaRules: [(v) => !!v || "Niste unijeli Živ. broj majke."],

    otacRules: [(v) => !!v || "Niste unijeli Hb broj oca."],

    pasmine: [
      "01",
      "02",
      "03",
      "06",
      "08",
      "09",
      "87",
      "90",
      "91",
      "92",
      "93",
      "94",
      "95",
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo govedo" : "Uredi podatke";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  async mounted() {
    this.govedo = await this.getGovedo();

    this.indeksirajGoveda();
  },

  methods: {
    async getGovedo() {
      let response = await fetch("http://localhost:3000/govedo");
      let govedo = await response.json();
      return govedo;
    },

    async postGovedo() {
      let ob = {
        drzava: this.editedItem.drzava,
        zivbroj: this.editedItem.zivbroj,
        ime: this.editedItem.ime,
        rodenje: this.editedItem.rodenje,
        spol: this.editedItem.spol,
        pasmina: this.editedItem.pasmina,
        majka: this.editedItem.majka,
        otac: this.editedItem.otac,
      };
      console.log(ob);
      fetch("http://localhost:3000/govedo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ob),
      });
      this.$router.go();
    },

    async putGovedo(idGoveda) {
      let noviPodaciOGovedu = {
        drzava: this.editedItem.drzava,
        zivbroj: this.editedItem.zivbroj,
        ime: this.editedItem.ime,
        rodenje: this.editedItem.rodenje,
        spol: this.editedItem.spol,
        pasmina: this.editedItem.pasmina,
        majka: this.editedItem.majka,
        otac: this.editedItem.otac,
      };
      let response = await fetch(`http://localhost:3000/govedo/${idGoveda}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noviPodaciOGovedu),
      });
      this.$router.go();
    },

    async removeGovedo(idGoveda) {
      let response = await fetch(`http://localhost:3000/govedo/${idGoveda}`, {
        method: "DELETE",
      });
      this.$router.go();
    },

    indeksirajGoveda() {
      let counter = 1;
      this.govedo.forEach((grlo) => {
        grlo.index = counter;
        counter += 1;
      });
    },

    editItem(item) {
      this.editedIndex = this.govedo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.govedo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
