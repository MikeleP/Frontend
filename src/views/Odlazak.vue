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
        class="elevation-1 green lighten-4"
      >
        <template v-slot:top>
          <v-toolbar flat class="yellow lighten-3">
            <v-toolbar-title>
              <v-text-field
                v-model="search"
                class="green lighten-4 blue--text"
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
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.zivbroj"
                          label="Životni broj goveda"
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
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.vrsta"
                          label="Vrsta odlaska"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.predsjednik"
                          label="Ime i prezime novog predsjednika"
                          filled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="15">
                        <v-text-field
                          v-model="editedItem.sifra"
                          label="Šifra predsjednika"
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
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
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
    headers: [
      {
        text: "Rb.",
        align: "start",
        value: "index",
        class: "green lighten-2",
      },
      {
        text: "Životni broj goveda",
        sortable: false,
        value: "zivbroj",
        class: "green lighten-2",
      },
      { text: "Datum odlaska", value: "datum", class: "green lighten-2" },
      { text: "Vrsta odlaska", value: "vrsta", class: "green lighten-2" },
      {
        text: "Ime i prezime novog predsjednika",
        value: "predsjednik",
        class: "green lighten-2",
      },
      { text: "Šifra predjsednika", value: "sifra", class: "green lighten-2" },
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
      vrsta: "",
      predsjednik: "",
      sifra: "",
    },
    defaultItem: {
      zivbroj: 0,
      datum: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      vrsta: "",
      predsjednik: "",
      sifra: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novi odlazak" : "Uredi odlazak";
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
      let response = await fetch("http://localhost:3000/odlazak");
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
      fetch("http://localhost:3000/odlazak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ob),
      });
      this.$router.go();
    },

    async putOdlazak(idOdlaska) {
      const noviPodaciOOdlasku = {
        zivbroj: this.editedItem.zivbroj,
        datum: this.editedItem.datum,
        vrsta: this.editedItem.vrsta,
        predsjednik: this.editedItem.predsjednik,
        sifra: this.editedItem.sifra,
      };
      const response = await fetch(
        `http://localhost:3000/odlazak/${idOdlaska}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noviPodaciOOdlasku),
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

    deleteItemConfirm() {
      this.odlazak.splice(this.editedIndex, 1);
      this.closeDelete();
      this.indeksirajOdlaske();
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.odlazak[this.editedIndex], this.editedItem);
      } else {
        this.odlazak.push(this.editedItem);
        this.indeksirajOdlaske();
      }
      this.close();
    },
  },
};
</script>
