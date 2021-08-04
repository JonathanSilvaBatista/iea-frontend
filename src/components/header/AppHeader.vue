<template>
    <v-app-bar
      app
      color="white"
      light
      height='85'
    >
      <div class="d-flex align-center">
        <v-img
          alt="Unimed Logo"
          class="shrink ml-14 mr-2"
          contain
          src="../../assets/imgs/logo-unimed.png"
          transition="scale-transition"
          width="130"
        />

        <span style="color: #1da471" class="title ml-6">
            <!-- <b>SISTEMA ADMINISTRADOR OPME</b> <br> -->
            <b>SISTEMA DE GESTÃO DE PRESTADORES</b> <br>
            UNIMED PONTA GROSSA
        </span>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <AlterarSenha v-if="user" :icon='true' />
        <v-btn
          text
          @click='logout()'
        >
          <span v-if="user" class="mr-2">Olá <b>{{ user.nome }}</b></span>
          <v-icon>mdi mdi-exit-to-app</v-icon>
        </v-btn>
      </div>

      <template v-slot:extension>
          <v-tabs 
              v-if='showMenu'
              height="90"
              class="mt-5 sombreamento"
              background-color="#f7f7f7"
              centered
              slider-size='1'
              slider-color="black"
              color="black"
              v-model="tab"
          >
            <v-tab 
              :id="'tab' + i" 
              v-for="(page, i) in pages" 
              :key="i" 
              class="subtitle-1 px-12 rounded-t-xl borda"
              @click="goingTo(i, page.route)"
              @mouseover="putColor(i)"
              @mouseleave="takeOutColor(i)"
          ><v-icon class="mr-5">{{ page.icon }}</v-icon> {{ page.page }}</v-tab>
          </v-tabs>
          <div style="width: 100%;" class="sombreamento" v-if='!showMenu'>
            <h3 class="ml-16 mb-1 mt-2">> {{ pagina }}</h3>
          </div>
      </template>
    </v-app-bar>
</template>

<script>
    import AlterarSenha from '../shared/AlterarSenha';

    export default {
        name: 'AppHeader',
        props: {
          showMenu: { type: Boolean, required: true },
          pages: { type: Array, required: false },
          rota: { type: String, required: false }
        },
        components: {
          AlterarSenha
        },
        data: () => ({
          tab: 0
        }),
        computed: {

          user() { 
            return this.$store.getters.getUser
          },
          pagina() {
            return this.$store.getters.getPagina
          },
          tabStore() {

            return this.$store.getters.getTab;
          }
        },
        watch: {

          tabStore() {

            this.tab = this.tabStore;
          }
        },
        methods: {
            putColor(i) {

              document.getElementById(`tab${i}`).style.backgroundColor = '#dddddd'
            },
            takeOutColor(i){

              document.getElementById(`tab${i}`).style.backgroundColor = '#f7f7f7'
            },
            goingTo(id, route) {

                //Estilo menu
                for (let i = 0; i < this.pages.length; i++) {

                    document.getElementById(`tab${i}`).style.backgroundColor = '#f7f7f7'
                }

                document.getElementById(`tab${id}`).style.backgroundColor = '#dddddd'

                this.$router.push(route).catch(() => {});
            },
            logout() {

                this.$store.dispatch('setUser', {})
                this.$store.dispatch('setTermo', null)

                this.$emit('logout')

                this.$router.push('/').catch(()=>{})
            }
        }
    }
</script>

<style scoped>
  .borda {
    margin-top: 25px;
    border: solid 1px #c9c9c9;
  }

  .sombreamento {
    -webkit-box-shadow: 0px -7px 13px 0px rgba(50, 50, 50, 0.11);
    -moz-box-shadow:    0px -7px 13px 0px rgba(50, 50, 50, 0.11);
    box-shadow:         0px -7px 13px 0px rgba(50, 50, 50, 0.11);
  }

  .v-tab::before {
    background-color: transparent;
  }
</style>