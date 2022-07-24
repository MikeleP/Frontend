<template>
  <div>
    <v-app>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="govedo"
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
                  Novo govedo
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
                          v-model="editedItem.drzava"
                          label="Kod drzave"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.zivbroj"
                          label="Ziv. broj goveda"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.ime"
                          label="Ime goveda"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
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
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.rodenje"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.spol"
                          label="Spol"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.pasmina"
                          label="Pasmina"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.majka"
                          label="Ziv. broj majke"
                          filled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.otac"
                          label="Hb broj oca"
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
                  >Jeste li sigurni da zelite izbrisati ovo
                  govedo?</v-card-title
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
    menu2: false,
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
      pasmina: "",
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
      pasmina: "",
      majka: 0,
      otac: 0,
    },
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

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.govedo = [
        {
          drzava: "HR",
          zivbroj: "3905619475",
          ime: "LISA",
          rodenje: "2018-07-05",
          spol: "Ž",
          pasmina: "01",
          majka: 22149874,
          otac: 4824520315,
        },
        {
          drzava: "IT",
          zivbroj: "4933078281",
          ime: "FORTI",
          rodenje: "2017-10-04",
          spol: "M",
          pasmina: "05",
          majka: 88342561,
          otac: 8645447210,
        },
        {
          drzava: "HR",
          zivbroj: "1114678668",
          ime: "SIVKA",
          rodenje: "2018-01-06",
          spol: "Ž",
          pasmina: "01",
          majka: 46073271,
          otac: 9657820151,
        },
        {
          drzava: "IT",
          zivbroj: "6484647447",
          ime: "VELI",
          rodenje: "2018-12-01",
          spol: "M",
          pasmina: "01",
          majka: 38907163,
          otac: 8509159542,
        },
        {
          drzava: "SI",
          zivbroj: "8688450510",
          ime: "SIVI",
          rodenje: "2016-04-12",
          spol: "M",
          pasmina: "01",
          majka: 59600039,
          otac: 2318416264,
        },
      ];
      this.indeksirajGoveda();
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

    deleteItemConfirm() {
      this.govedo.splice(this.editedIndex, 1);
      this.closeDelete();
      this.indeksirajGoveda();
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
        Object.assign(this.govedo[this.editedIndex], this.editedItem);
      } else {
        this.govedo.push(this.editedItem);
        this.indeksirajGoveda();
      }
      this.close();
    },
  },
};
</script>
