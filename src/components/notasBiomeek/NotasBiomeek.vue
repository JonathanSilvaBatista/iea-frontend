<template>
    <div>
        <div class="d-flex justify-center mt-n8 mb-5">
            <div>
                <label class="d-flex justify-center" for="dateInitial"><b>Data Inicial</b></label>
                <v-datetime
                    id="dateInitial"
                    v-model="initialDate"
                    value-zone="local"
                    title="Data Inicial"
                    :week-start="weekStart"
                    input-class="global-input-date-time-class"
                    class="theme-green mt-1"></v-datetime>
            </div>
            <div class="ml-8">
                <label class="d-flex justify-center" for="dateFinal"><b>Data Final</b></label>
                <v-datetime
                    id="dateFinal"
                    v-model="finalDate"
                    value-zone="local"
                    title="Data Final"
                    :week-start="weekStart"
                    input-class="global-input-date-time-class"
                    class="theme-green mt-1"></v-datetime>
            </div>
        </div>
        <v-divider class="mx-16"></v-divider>
        <div class='d-flex my-4 justify-center'>
            <PesquisaGuia @pesquisaGuia='atribuirGuia' />
            <v-btn v-if="showReload" dark color="primary" x-large class="ml-4" @click="getGuiasBiomeek">
                <v-icon size="30">mdi mdi-cached</v-icon> 
            </v-btn>
        </div>
        
        <v-divider class="mx-16"></v-divider>
        <GuiasBiomeek v-if="!loading" :guias='guias' class="mt-6"/>
        <div class="d-flex justify-center mt-16">
            <v-progress-circular
                v-if="loading"
                indeterminate
                :size="80"
                color="#1da471"
                class="mt-16"
            ></v-progress-circular>
        </div>
    </div>
</template>

<script>
    
    import GuiasBiomeek from './GuiasBiomeek'
    import PesquisaGuia from './PesquisaGuia'

    import axios from '../../axios'
    import { getToken } from '../../config'

    import { Datetime } from 'vue-datetime'

    export default {
        name: 'NotasBiomeek',
        components: {
            GuiasBiomeek,
            'v-datetime': Datetime,
            PesquisaGuia
        },
        data: () => ({
            guias: [],
            initialDate: new Date().toISOString(),
            finalDate: new Date().toISOString(),
            weekStart: 7,
            loading: true,
            guiaEspecifica: '',
            showReload: false,
        }),
        created() {

            this.$store.dispatch('setPagina', 'Notas Biomeek')
        },
        watch: {
            initialDate: function() {
                this.getGuiasBiomeek()
            },
            finalDate: function() {
                this.getGuiasBiomeek()
            }
        },
        methods: {

            atribuirGuia(data) {

                this.guias = []

                this.guias.push(data);

                this.showReload = true;
            },
            async getGuiasBiomeek() {

                this.loading = true;
                this.showReload = false;
                let aux;

                if (this.initialDate == this.finalDate) {

                    aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    }
                } else {

                    aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        dtInicio: new Date(this.initialDate).toLocaleDateString().substr(0, 10),
                        dtFim: new Date(this.finalDate).toLocaleDateString().substr(0, 10)
                    }
                }

                await axios.post('/api/retornaGuiasOpmeBiomeek', aux, getToken())
                .then(res => {

                    this.guias = res.data
                    this.loading = false;
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