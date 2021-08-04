<template>
    <v-dialog
        v-model="show"
        persistent
        width="700"
    >
        <div style="background-color: #ddd">
            <div class="d-flex justify-center">
                <div class="nps-titulo rounded-pill text-center my-5">
                    Por favor, avalie nosso atendimento nessa solicitação.
                </div>
            </div>
            <div class="d-flex justify-center">
                <v-hover
                    v-for="(color, i) in colors"
                    :key="i"
                    class="mb-5"
                >
                    <template v-slot="{ hover }">
                        <v-card 
                            :id="'card' + i"
                            class="d-flex justify-center align-center ma-2"
                            dark
                            width="40" 
                            height="40"
                            :color='color'
                            :elevation="hover ? 24 : 6"
                            @click="select(i)"
                        >
                            <span class="">{{ i+1 }}</span>
                        </v-card>
                    </template>
                </v-hover>
            </div>
            <div class="mx-8 mt-3">
                <v-textarea
                    rows="4"
                    solo
                    v-model="suggestion"
                    label="*Sugestões/Comentários são opcionais"
                ></v-textarea>
            </div>
            <div class="d-flex justify-center">
                <v-btn 
                    dark 
                    x-large 
                    width="150"
                    color="#1da471" 
                    @click="salvarNps"
                >
                    ENVIAR
                </v-btn>
            </div>
            <div style="color: #7c7c7c" class="d-flex justify-end mr-2">
                **pesquisa obrigatória
            </div>
        </div>
    </v-dialog>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'NPS',
        props: {
            idSolicitacao: { type: Number, required: true }
        },
        data: () => ({
            show: false,
            selected: '',
            suggestion: '',
            colors: [
                '#d52127', 
                '#e85324', 
                '#eb6f25', 
                '#f6a725', 
                '#fec829', 
                '#ebdb0d', 
                '#e5e145', 
                '#c2d234', 
                '#aec93e', 
                '#65b34e'
            ]
        }),
        methods: {

            showNps() {

                this.show = true;
            },
            async salvarNps() {

                if (this.selected == '') {

                    alert('Por favor, selecione uma nota.');
                    return;
                }

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.idSolicitacao,
                    resposta1: this.selected,
                    comentario: this.suggestion
                }


                await axios.post('/api/salvaRespostasPesquisa', aux, getToken())
                .then(() => {
                    
                    alert('Solicitação encerrada.');
                    this.show = false;
                    this.$emit('npsRespondido');
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            select(note) {

                this.clearSelection()

                document.getElementById(`card${note}`).style.backgroundColor = '#484848'
                this.selected = note + 1
            },
            clearSelection() {
                for (let i = 0; i < this.colors.length; i++) 
                    document.getElementById(`card${i}`).style.backgroundColor = this.colors[i];

                this.selected = ''
            },
        }
    }
</script>

<style>
    .nps-titulo {
        background-color: #1da471;
        width: 85%;
        height: 34px;
        border: 1px solid #4e4e4e;
        color: #fff;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>