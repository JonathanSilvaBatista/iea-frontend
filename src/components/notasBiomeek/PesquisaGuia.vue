<template>
     <div class="text-center">
        <v-dialog
            v-model="dialog"
            width="500"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="secondary"
                dark
                v-bind="attrs"
                v-on="on"
                x-large
                width="250"
            >
                Pesquisar Guia
            </v-btn>
        </template>

        <v-card>
            <v-card-title style="background-color:  #ddd;" class="justify-center">
                <b>Pesquisar Guia do Biomeek</b>
            </v-card-title>
            <v-divider></v-divider>
            <div style="width: 100%; background-color:  #f2f2f2;" class="d-flex flex-column flex-container">
                <v-text-field
                    filled
                    color='#1da471'
                    background-color="white"
                    v-model="guia"
                    class="input-group--focused mx-4 mt-4"
                    v-mask='"############"'
                ></v-text-field>
                <v-btn dark color="secondary" class="rounded-0" @click="getGuia">
                    Buscar <v-icon class="ml-2">fas fa-search</v-icon> 
                </v-btn>
            </div>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>

    import axios from '../../axios'
    import {getToken} from '../../config'

    export default {
        name: 'PesquisaGuia',
        data: () => ({
            dialog: false,
            guia: ''
        }),
        watch: {

            dialog() {

                this.guia = ''
            }
        },
        methods: {

            async getGuia(){
            
                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    guia: this.guia
                }

                await axios.post('/api/retornaGuiaOpmeBiomeek', aux, getToken())
                .then(res => {

                    this.$emit('pesquisaGuia', res.data);
                    this.dialog = false;
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