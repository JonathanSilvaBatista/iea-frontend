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
            <v-col cols="12" md="4">
              <v-select
                v-model="conversion.experience"
                :rules="experienceRules"
                :items="items"
                label="Qual sua experiência com Jesus"
                required
               ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="conversion.name"
                :rules="nameRules"
                label="Nos conte seu nome"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="conversion.telephone"
                label="Deixa seu telefone"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="conversion.email"
                :rules="emailRules"
                label="Ou se preferir seu email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
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
        experience:''
      },

      experienceRules: [
        //v => !!v || 'O campo experiência é obrigatório',
      ],

      nameRules: [
        //v => !!v || 'O campo nome é obrigatório',
      ],
      
      emailRules: [
        // v => !!v || 'O campo email é obrigatório',
        // v => /.+@.+/.test(v) || 'Email inválido',
      ],

      items: ['Primeira vez que aceito Jesus', 'Estou me reconciliando'],

    }),

    methods:{
      limpaForm () {
          this.conversion.name = "";
          this.conversion.email = "";
          this.conversion.telephone = "";
          this.conversion.experience = "";
        },
      
      async submit(){
        alert(this.conversion.name)
        await axios.post('http://localhost:3333/conversion', this.conversion)
                .then(() => {

                   alert('Usuário salvo com sucesso!')
                  this.limpaForm();               
                }).catch(err => {
                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                   
                })
      }
    }
  }
</script>

<style>

</style>