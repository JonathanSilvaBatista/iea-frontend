<template>
  <div>
    <v-toolbar color="#263238" dark height="100%">
      <v-container fluid>
        <v-layout row>
          <v-flex shrink pa-1>
            <v-row align="center" justify="center">
              <v-col>
                <v-img
                  alt="Unimed Logo"
                  class="shrink"
                  contain
                  src="../../assets/imgs/iea.png"
                  transition="scale-transition"
                  width="150"
                />
              </v-col>
            </v-row>
          </v-flex>
          <v-flex d-flex xs6 sm6 md10>
            <v-row align="center" justify="center">
              <v-col>
                <h3 class="text-center ">Você decidiu por Jesus?</h3>
              </v-col>
            </v-row>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
    <div>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="conversion.experience"
                :rules="[rules.experience]"
                :items="items"
                label="Qual sua experiência com Jesus"
                required
               ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="conversion.name"
                :rules="[rules.name]"
                label="Nos conte seu nome"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="conversion.telephone"
                label="Deixa seu telefone"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="conversion.email"
                :rules="[rules.email]"
                label="Ou se preferir seu email"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                name="opinion"
                v-model="conversion.opinion"
                label="Deixe seu comentário, sugestão ou pedido de oração"
                value=""
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <center><v-btn
                color="success"
                v-on:click="submit"
              >
                Enviar
              </v-btn></center>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
  import axios from '../../axios'
  export default {
    data: () => ({
      valid: false,
      conversion:{
        name: '',
        email: '',
        telephone:'',
        experience:'',
        opinion:''
      },

      rules: {
        experience: value => !!value || 'O campo experiência é obrigatório.',
        name: v => !!v || 'O campo nome é obrigatório',
        email: v => /.+@.+/.test(v) || 'Formato de e-mail incorreto.'
      },

      items: ['Primeira vez que aceito Jesus', 'Estou me reconciliando', 'Já tenho Jesus em minha vida'],

    }),

    methods:{
      async submit(){
        if(this.conversion.experience != "" && this.conversion.name != ""){
          await axios.post('https://iea-api.herokuapp.com/conversion', this.conversion)
                  .then(() => {
                    alert('Bem vindo(a) a Família de Cristo! Estaremos orando por você e em breve entraremos em contato!')
                    this.$router.go()
                  }).catch(err => {
                      if(err.response.status === 403){
                          alert('Sua sessão expirou.')
                          this.$router.push('/redirect-me');
                      } else {
                          alert('Ocorreu um erro, por favor, contate o suporte.')
                      }   
                  })
        }else{
          alert('Os campos "Experiência com Jesus" e "Nome" são de preenchimento obrigatório!')
        }
      }
    }
  }
</script>

<style>

</style>