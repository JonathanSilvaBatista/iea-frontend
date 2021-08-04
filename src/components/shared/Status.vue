<template>
  <div class='mt-1 mx-8'>
      <v-row>
          <v-col
            id='colGuia'
            cols='3'
            class='d-flex align-center justify-center mb-1'
          >
            <span class="">
              STATUS
            </span>
          </v-col>
          <v-col
            id='col'
            cols='9'
            class="mb-1"
          >
            <v-radio-group
              v-model="status"
              row
            >
                <v-radio
                    label="Correto"
                    color="success"
                    :value="true"
                ></v-radio>
                <v-radio
                    label="Incorreto"
                    color="warning"
                    :value="false"
                ></v-radio>
            </v-radio-group>
          </v-col>
      </v-row>
      <v-row v-if="status">
        <v-col
          id='col'
          cols='12'
          class="mb-2"
        >
          <div class="d-flex justify-center align-center">
            <div v-if="opme" style="width: 400px;" class="mr-14">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    style="font-size: 125%;"
                    filled
                    label="DATA CONHECIMENTO:"
                    color="#1da471"
                    v-model="computedDateFormatted"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    class="mt-8"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </div>
            <v-btn dark x-large color="#1da471" @click="correto">
              CORRETA FINALIZADA
            </v-btn>
          </div>
        </v-col>
      </v-row>
  </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'Status',
        props: {
          idSolicitacao: { type: Number, required: true },
          opme: { type: Boolean, default: () => false }
        },
        data: vm => ({
            status: false,
            menu: false,
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        }),
        computed: {
          computedDateFormatted () {

            if (this.date)
              return this.formatDate(this.date)
            else
              return '';
          },
        },

        watch: {
          date () {
            this.dateFormatted = this.formatDate(this.date)
          },
        },

        methods: {
          async correto() {

            let aux = {
              cdUsuario: await this.$store.getters.getUser.cdUsuario,
              idSolicitacao: this.idSolicitacao,
            }

            if (this.opme)
              aux.dtConhecimento = this.computedDateFormatted;

            await axios.post('/api/finalizarSolicitacao', aux, getToken())
            .then(() => {

              this.solicitacaoFinalizada();
            }).catch(err => {

                if(err.response.status === 403){
                    alert('Sua sessão expirou, por favor faça o login.')
                    this.$router.push('/redirect-me');
                } else {
                    alert('Ocorreu um erro, por favor, contate o suporte.')
                }
            })
          },
          solicitacaoFinalizada() {

            this.$emit('solicitacaoFinalizada')
          },
          formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
          },
          parseDate (date) {
            if (!date) return null

            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          },
        },
    };
</script>