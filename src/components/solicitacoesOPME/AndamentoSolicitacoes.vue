<template>
    <div >  
        <Legendas />
        <div class="d-flex justify-space-between mb-3 mt-6 mx-10">
            <v-btn
                dark
                color="indigo"
                rounded
                @click="recarregar"
            >
                <v-icon size="25">mdi mdi-cached</v-icon>
            </v-btn>
            <NovaSolicitacaoOPME v-if="interno" @refreshGuias='recarregar' />
        </div>
        <GuiasOPME :guias='guiasFiltradas' @refreshGuias='recarregar'/>
    </div>
</template>

<script>

    import GuiasOPME from './GuiasOPME'
    import Legendas from '../shared/Legendas'

    import NovaSolicitacaoOPME from './NovaSolicitacaoOPME'

    import { isFuture, addDays } from 'date-fns'

    export default {
        name: 'Andamento',
        props: {
            solicitacoesOPME: { type: Array, required: true }
        },
        components: {
            GuiasOPME,
            Legendas,
            NovaSolicitacaoOPME,
        },
        inject: ['getSolicitacoesNF'],
        data: () => ({
            guiasFiltradas: [],
        }),
        created() {

            this.$store.dispatch('setTab', 0);

            this.filtrarSolicitacoes();
        },
        watch: {

            solicitacoesOPME: {
                deep: true,
                handler: 'filtrarSolicitacoes'
            }
        },
        computed: {

            interno() {

                return this.$store.getters.getUser.interno;
            }
        },
        methods: {

            filtrarSolicitacoes() {

                let aux = [];

                this.solicitacoesOPME.forEach(solicitacao => {

                    let data = addDays(solicitacao.data_prazo, 1);
                    if ((isFuture(data) || solicitacao.data_prazo == null) && solicitacao.status != 'Finalizado')
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