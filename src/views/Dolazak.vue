<template>
  <v-app>
    <v-data-table :headers="headers" :items="dolazak" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title color="green lighten-2"
            >Dolazak na gospodarstvo</v-toolbar-title
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="green lighten-2"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Novi dolazak
              </v-btn>
            </template>
            <v-card>
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
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.predsjednik"
                        label="Ime i prezime prijašnjeg predsjednika"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.sifra"
                        label="Šifra predsjednika"
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
                <v-btn color="blue darken-1" text @click="save"> Spremi </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="900px">
            <v-card>
              <v-card-title class="text-h4"
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Živ. broj goveda",
        align: "start",
        sortable: false,
        value: "zivbroj",
      },
      {
        text: "Ime i prezime prijašnjeg predsjednika",
        value: "predsjednik",
        sortable: false,
      },
      { text: "Šifra predsjednika", value: "sifra", sortable: false },
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
