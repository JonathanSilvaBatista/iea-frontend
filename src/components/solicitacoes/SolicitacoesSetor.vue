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
        name: 'SolicitacoesSetor',
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

            this.$store.dispatch('setTab', 3);
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

                    if (solicitacao.cdUsuarioDestino == null && solicitacao.cdUsuarioSolicitante != this.$store.getters.getUser.cdUsuario)
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