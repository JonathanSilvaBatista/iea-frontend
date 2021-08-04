<template>
    <v-dialog
        v-model="dialog"
        width="1250"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                color="#1da471"
                dark
                v-bind="attrs" 
                v-on="on"
            >
                <v-icon>mdi mdi-plus</v-icon>
                <span class="ml-2">Nova Solicitação OPME</span>
            </v-btn>
        </template>
        <CriarSolicitacao @close='dialog = false' @refreshGuias='refreshGuias' />
    </v-dialog>
</template>

<script>

    import CriarSolicitacao from './CriarSolicitacaoOPME'

    export default {
        name: 'NovaSolicitacaoOPME',
        components: {
            CriarSolicitacao
        },
        data: () => ({
            dialog: false
        }),
        methods: {

            refreshGuias(){

                this.$emit('refreshGuias')
            }
        }
    }
</script>

<style>

</style>