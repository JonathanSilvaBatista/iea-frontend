<template>
    <div>
        <v-dialog
            v-model="dialog"
            width="410"
            style="word-wrap: break-word;"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="error"
                    dark
                    large
                    outlined
                    v-bind="attrs"
                    v-on="on"
                >
                    Reabrir solicitação
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="grey lighten-2">
                    Tem certeza que deseja restaurar essa solicitação ?
                </v-card-title>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    text
                    @click="dialog = false"
                >
                    Não
                </v-btn>
                <v-btn
                    color="success"
                    text
                    @click="restaurarSolicitacao(); dialog = false"
                >
                    Sim
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    import { isFuture } from 'date-fns'

    export default {
        name: 'VoltarStatus',
        props: {
            idSolicitacao: { type: Number, required: true }
        },
        data: () => ({
            dialog: false,
        }),
        methods: {

            async restaurarSolicitacao() {
                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.idSolicitacao
                }

                await axios.post('/api/reabreSolicitacao', aux, getToken())
                .then(res => {

                    if (res.data.dtPrazo) {
                        let [day, month, year] = res.data.dtPrazo.split('/')
                
                        if (isFuture(new Date(year, (month-1), day)))
                            this.$router.push('/andamento').catch(() => {});
                        else
                            this.$router.push('/prazoVencido').catch(() => {});
                    } else
                        this.$router.push('/abertas').catch(() => {});

                    this.$emit('recarregarGuias');
                })
                .catch(err => {

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