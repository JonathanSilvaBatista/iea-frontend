<template>
    <div>  
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
        </div>
        <GuiasOPME :guias='guiasFiltradas' @refreshGuias='recarregar' />
    </div>
</template>

<script>

    import GuiasOPME from './GuiasOPME'
    import Legendas from '../shared/Legendas'

    import { isFuture, addDays } from 'date-fns'

    export default {
        name: 'PrazoVencido',
        props: {
            solicitacoesOPME: { type: Array, required: true }
        },
        components: {
            GuiasOPME,
            Legendas
        },
        inject: ['getSolicitacoesNF'],
        data: () => ({
            guiasFiltradas: [],
        }),
        created() {

            this.$store.dispatch('setTab', 1);
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
                    
                    let data = addDays(solicitacao.data_prazo, 1);
                    if (solicitacao.data_prazo != null && !isFuture(data) && solicitacao.status != 'Finalizado')
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