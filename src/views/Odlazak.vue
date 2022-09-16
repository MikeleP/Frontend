<template>
  <div>
    <v-app class="yellow lighten-3">
      <div
        class="d-flex justify-space-around align-center flex-column flex-md-row my-4"
      >
        <v-card
          class="d-flex green lighten-2 rounded-xl align-center justify-center purple--text"
          height="80px"
          width="1200"
        >
          <h1>Odlazak s gospodarstva</h1>
        </v-card>
      </div>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="odlazak"
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
                  to="/podaci"
                >
                  <v-icon color="purple">mdi-file-document</v-icon>
                  Podaci o govedima
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
                  Novi odlazak
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
                          v-model="editedItem.zivbroj"
                          :rules="zivbrojRules"
                          label="Životni broj goveda"
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
                              v-model="editedItem.datum"
                              label="Datum odlaska"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              filled
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.datum"
                            @input="menu2 = false"
                            color="green darken-2"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-select
                          v-model="editedItem.vrsta"
                          :items="odlasci"
                          :rules="vrstaRules"
                          label="Vrsta odlaska"
                          required
                          filled
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.predsjednik"
                          :rules="predsjednikRules"
                          label="Ime i prezime novog predsjednika"
                          required
                          filled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.sifra"
                          :rules="sifraRules"
                          label="Šifra predsjednika"
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
                    :disabled="MissingValues"
                    @click="
                      formTitle === 'Novi odlazak'
                        ? postOdlazak()
                        : putOdlazak(editedItem._id)
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
                  >Jeste li sigurni da želite izbrisati ovaj
                  odlazak?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Odustani</v-btn
                  >
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="removeOdlazak(editedItem._id)"
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
    valid: true,
    headers: [
      {
        text: "Rb.",
        align: "start",
        value: "index",
        class: "green lighten-2",
      },
      {
        text: "Životni broj goveda",
        value: "zivbroj",
        sortable: false,
        class: "green lighten-2",
      },
      { text: "Datum odlaska", value: "datum", class: "green lighten-2" },
      {
        text: "Vrsta odlaska",
        value: "vrsta",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Ime i prezime novog predsjednika",
        value: "predsjednik",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Šifra predjsednika",
        value: "sifra",
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
    odlazak: [],
    editedIndex: -1,
    editedItem: {
      zivbroj: 0,
      datum: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      vrsta: null,
      predsjednik: "",
      sifra: "",
    },
    defaultItem: {
      zivbroj: 0,
      datum: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      vrsta: null,
      predsjednik: "",
      sifra: "",
    },

    zivbrojRules: [(v) => !!v || "Niste unijeli životni broj goveda."],

    vrstaRules: [(v) => !!v || "Niste odabrali vrstu odlaska."],

    predsjednikRules: [
      (v) => !!v || "Niste unijeli ime i prezime novog predsjednika.",
    ],

    sifraRules: [(v) => !!v || "Niste unijeli šifru predsjednika."],

    odlasci: ["Prodaja", "Klaonica", "Uginuće", "Ostalo"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novi odlazak" : "Uredi odlazak";
    },

    MissingValues() {
      return (
        this.editedItem.zivbroj == 0 ||
        this.editedItem.vrsta == null ||
        this.editedItem.predsjednik == "" ||
        this.editedItem.sifra == ""
      );
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
    this.odlazak = await this.getOdlazak();

    this.indeksirajOdlaske();
  },

  methods: {
    async getOdlazak() {
      let response = await fetch(
        "https://registar-goveda.herokuapp.com/odlazak"
      );
      let odlazak = await response.json();
      return odlazak;
    },

    async postOdlazak() {
      let ob = {
        zivbroj: this.editedItem.zivbroj,
        datum: this.editedItem.datum,
        vrsta: this.editedItem.vrsta,
        predsjednik: this.editedItem.predsjednik,
        sifra: this.editedItem.sifra,
      };
      console.log(ob);
      fetch("https://registar-goveda.herokuapp.com/odlazak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ob),
      });
      this.$router.go();
    },

    async putOdlazak(idOdlaska) {
      let noviPodaciOOdlasku = {
        zivbroj: this.editedItem.zivbroj,
        datum: this.editedItem.datum,
        vrsta: this.editedItem.vrsta,
        predsjednik: this.editedItem.predsjednik,
        sifra: this.editedItem.sifra,
      };
      let response = await fetch(
        `https://registar-goveda.herokuapp.com/odlazak/${idOdlaska}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noviPodaciOOdlasku),
        }
      );
      this.$router.go();
    },

    async removeOdlazak(idOdlaska) {
      let response = await fetch(
        `https://registar-goveda.herokuapp.com/odlazak/${idOdlaska}`,
        {
          method: "DELETE",
        }
      );
      this.$router.go();
    },

    indeksirajOdlaske() {
      let counter = 1;
      this.odlazak.forEach((gubitak) => {
        gubitak.index = counter;
        counter += 1;
      });
    },

    editItem(item) {
      this.editedIndex = this.odlazak.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.odlazak.indexOf(item);
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
