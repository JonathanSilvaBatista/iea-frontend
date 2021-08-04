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
            <NovaSolicitacao @refreshGuias='recarregar' />
        </div>
        <GridSolicitacoes :solicitacoes='solicitacoesFiltradas' @refreshGuias='recarregar'/>
    </div>
</template>

<script>

    import NovaSolicitacao from './NovaSolicitacao'

    import GridSolicitacoes from './GridSolicitacoes'

    export default {
        name: 'SolicitacoesAbertas',
        props: {
            solicitacoes: { type: Array, required: true }
        },
        components: {
            GridSolicitacoes,
            NovaSolicitacao
        },
        data: () => ({
            solicitacoesFiltradas: []
        }),
        inject: ['getSolicitacoes'],
        created() {

            this.$store.dispatch('setTab', 1);
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

                    if (solicitacao.cdUsuarioSolicitante == this.$store.getters.getUser.cdUsuario && solicitacao.corStatus != "#4c4c4c")
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