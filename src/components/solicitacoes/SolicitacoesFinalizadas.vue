<template>
    <div>
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
        <GridSolicitacoes :solicitacoes='solicitacoesFiltradas' @refreshGuias='recarregar'/>
    </div>
</template>

<script>

    import GridSolicitacoes from './GridSolicitacoes'

    export default {
        name: 'SolicitacoesFinalizadas',
        props: {
            solicitacoes: { type: Array, required: true }
        },
        components: {
            GridSolicitacoes,
        },
        data: () => ({
            solicitacoesFiltradas: []
        }),
        inject: ['getSolicitacoes'],
        created() {

            this.$store.dispatch('setTab', 2);
            this.filtrarSolicitacoes();
        },
        watch: {

            solicitacoes: {
                deep: true,
                handler: 'filtrarSolicitacoes'
            }
        },
        methods: {

            filtrarSolicitacoes() {

                let aux = [];

                this.solicitacoes.forEach(solicitacao => {

                    if (solicitacao.corStatus == '#4c4c4c')
                        aux.push(solicitacao);
                });

                this.solicitacoesFiltradas = aux;
            },
            recarregar() {

                this.getSolicitacoes();
            }
        }
    }
</script>

<style>

</style>