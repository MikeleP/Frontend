<template>
  <div>
    <v-app>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="odlazak"
        class="elevation-1 green lighten-4"
      >
        <template v-slot:top>
          <v-toolbar flat>
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
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green lighten-2"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon color="blue" x-large>mdi-plus</v-icon>
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
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.zivbroj"
                          label="Životni broj goveda"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.datum"
                          label="YYYY-MM-DD"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.vrsta"
                          label="Vrsta odlaska"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.predsjednik"
                          label="Ime i prezime novog predsjednika"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
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
                  <v-btn color="blue darken-1" text @click="save">
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
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
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
      datum: "",
      vrsta: "",
      predsjednik: "",
      sifra: "",
    },
    defaultItem: {
      zivbroj: 0,
      datum: "",
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

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.odlazak = [
        {
          zivbroj: 4609765268,
          datum: "2018-12-5",
          vrsta: "Uginuće",
          predsjednik: "/",
          sifra: "/",
        },
        {
          zivbroj: 6489032302,
          datum: "2018-12-5",
          vrsta: "Krađa",
          predsjednik: "/",
          sifra: "/",
        },
        {
          zivbroj: 4645210686,
          datum: "2018-12-5",
          vrsta: "Prodaja",
          predsjednik: "Željko Knjaz",
          sifra: "51147520",
        },
        {
          zivbroj: 8468713127,
          datum: "2018-12-5",
          vrsta: "Prodaja",
          predsjednik: "Marko Ivić",
          sifra: "96055041",
        },
        {
          zivbroj: 4311224504,
          datum: "2018-12-5",
          vrsta: "Uginuće",
          predsjednik: "/",
          sifra: "/",
        },
        {
          zivbroj: 8689205866,
          datum: "2018-12-5",
          vrsta: "Uginuće",
          predsjednik: "/",
          sifra: "/",
        },
      ];
      this.indeksirajOdlaske();
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
      }
      this.close();
    },
  },
};
</script>
