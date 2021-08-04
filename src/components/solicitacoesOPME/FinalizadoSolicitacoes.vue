<template>
    <div>  
        <div class="text-center mb-6">
            <v-avatar
                color="#4c4c4c"
                size="30"
            >
            </v-avatar>
            <span class="ml-3">Solicitação finalizada</span>
        </div>
        <div class="d-flex justify-space-between mb-3 mt-6 mx-10">
            <v-btn
                dark
                color="indigo"
                rounded
                @click="recarregar"
            >
                <v-icon size="25">mdi mdi-cached</v-icon>
            </v-btn>
        </div>
        <GuiasOPME :guias='guiasFiltradas' @refreshGuias='recarregar' />
    </div>
</template>

<script>

    import GuiasOPME from './GuiasOPME'

    export default {
        name: 'PrazoVencido',
        props: {
            solicitacoesOPME: { type: Array, required: true }
        },
        components: {
            GuiasOPME,
        },
        inject: ['getSolicitacoesNF'],
        data: () => ({
            guiasFiltradas: [],
        }),
        created() {

            this.$store.dispatch('setTab', 2);
            this.filtrarSolicitacoes();
        },
        watch: {

            solicitacoesOPME: {
                deep: true,
                handler: 'filtrarSolicitacoes'
            }
        },
        methods: {

            filtrarSolicitacoes() {

                let aux = [];

                this.solicitacoesOPME.forEach(solicitacao => {

                    if (solicitacao.corStatus == '#4c4c4c')
                        aux.push(solicitacao);
                });

                this.guiasFiltradas = aux;
            },
            recarregar() {

                this.getSolicitacoesNF();
            }
        }
    }
</script>