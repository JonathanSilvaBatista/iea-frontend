<template>
    <div class='text-center mt-4 pb-3'>
        <v-dialog
            persistent
            v-model='dialog'
            width="800"
        >
            <template v-slot:activator="{ on, attrs }">
                <div>
                    <v-btn
                        color="#1da471"
                        dark
                        v-if="!solicitacao.nomeSolicitanteSemLogin"
                        x-large
                        v-bind="attrs"
                        v-on="on"
                        @click="interno = false"
                    >
                        VISUALIZAR HISTÓRICO
                    </v-btn>
                    <v-btn
                        v-if="colaboradorUnimed && !opme"
                        color="indigo"
                        dark
                        x-large
                        class="ml-8"
                        v-bind="attrs"
                        v-on="on"
                        @click="interno = true"
                    >
                        CHAT INTERNO UNIMED
                    </v-btn>
                </div>
            </template>
            <Chat :solicitacao='solicitacao' :interno='interno' @close='dialog = false' />
        </v-dialog>
    </div>
</template>

<script>

    import Chat from './Chat'

    export default {
        name: 'Historico',
        components: {
            Chat
        },
        props: {
            solicitacao: { type: Object, required: true },
            opme: { type: Boolean, default: () => false }
        },
        data: () => ({
            dialog: false,
            interno: false,
        }),
        computed: {

            colaboradorUnimed() {
                
                return this.$store.getters.getUser.interno;
            }
        },
    };
</script>