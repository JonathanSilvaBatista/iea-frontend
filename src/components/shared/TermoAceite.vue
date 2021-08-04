<template>
    <v-dialog
        v-model="show"
        persistent
        width="500"
    >
        <div style="background-color: #ddd" v-if="termo">
            <div class="d-flex justify-center">
                <div class="termo-titulo rounded-pill text-center my-5">
                    TERMO DE ACEITE
                </div>
            </div>
            <div class="mx-6 text-center">
                {{ termo.descricao }}
            </div>
            <div class="d-flex justify-center">
                <v-btn
                    color="#1da471"
                    dark
                    x-large
                    width="200"
                    class="my-5"
                    @click="aceiteTermo"
                >
                    ACEITO
                </v-btn>
            </div>
        </div>
    </v-dialog>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'TermoAceite',
        data: () => ({
            show: false
        }),
        created() {

            if (this.termo){
                
                this.$store.dispatch('setSideMenu', false);
                this.show = true;
            } else {
                
                this.$store.dispatch('setSideMenu', true);
                this.show = false;
            }
        },
        computed: {

            termo() {

                return this.$store.getters.getTermo;
            },
            user() {

                return this.$store.getters.getUser;
            }
        }, 
        watch: {

            termo() {

                if (this.termo){
                
                    this.$store.dispatch('setSideMenu', false);
                    this.show = true;
                } else {
                    
                    this.$store.dispatch('setSideMenu', true);
                    this.show = false;
                }
            }
        },
        methods: {

            async aceiteTermo() {

                let aux = {
                    cdUsuario: await this.user.cdUsuario,
                    idUsuario: await this.user.id,
                    idTermo: await this.termo.id,
                    aceita: true
                }

                await axios.post('/api/salvaRespostaTermo', aux, getToken())
                .then(() => {

                    this.$store.dispatch('setTermo', null);
                    this.show = false;
                }).catch(err => {

                    if(err.response.status === 403) {
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                })
            }
        }
    }
</script>

<style>

    .termo-titulo {
        background-color: #fff;
        width: 80%;
        height: 33px;
        border: 1px solid #4e4e4e;
        color: #4e4e4e;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>