<template>
  <div>
    <v-app>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="dolazak"
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
                  Novi dolazak
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
                          label="Živ. broj goveda"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.predsjednik"
                          label="Ime i prezime prijašnjeg predsjednika"
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
                  dolazak?</v-card-title
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
        text: "Živ. broj goveda",
        sortable: false,
        value: "zivbroj",
        class: "green lighten-2",
      },
      {
        text: "Ime i prezime prijašnjeg predsjednika",
        value: "predsjednik",
        sortable: false,
        class: "green lighten-2",
      },
      {
        text: "Šifra predsjednika",
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
    dolazak: [],
    editedIndex: -1,
    editedItem: {
      zivbroj: 0,
      predsjednik: "",
      sifra: 0,
    },
    defaultItem: {
      zivbroj: 0,
      predsjednik: "",
      sifra: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novi dolazak" : "Uredi dolazak";
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
      this.dolazak = [
        {
          zivbroj: 1440352494,
          predsjednik: "Marko Juric",
          sifra: 54464051,
        },
        {
          zivbroj: 2512573320,
          predsjednik: "Ivan Horvat",
          sifra: 44188632,
        },
        {
          zivbroj: 2457993093,
          predsjednik: "Luka Marković",
          sifra: 41863809,
        },
        {
          zivbroj: 5249945677,
          predsjednik: "Ivan Vuković",
          sifra: 64837587,
        },
        {
          zivbroj: 8979759252,
          predsjednik: "Ivana Modrić",
          sifra: 20041062,
        },
        {
          zivbroj: 6908656687,
          predsjednik: "Lana Markić",
          sifra: 80241767,
        },
        {
          zivbroj: 4395150005,
          predsjednik: "Zdravko Kovačević",
          sifra: 68671128,
        },
      ];
      this.indeksirajDolaske();
    },

    indeksirajDolaske() {
      let counter = 1;
      this.dolazak.forEach((dobitak) => {
        dobitak.index = counter;
        counter += 1;
      });
    },

    editItem(item) {
      this.editedIndex = this.dolazak.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.dolazak.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.dolazak.splice(this.editedIndex, 1);
      this.closeDelete();
      this.indeksirajDolaske();
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
        Object.assign(this.dolazak[this.editedIndex], this.editedItem);
      } else {
        this.dolazak.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
