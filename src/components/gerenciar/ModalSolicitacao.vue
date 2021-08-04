<template>
    <div style="background-color: #ddd">
        <v-row class='mx-4' v-if="!novoTipo">
            <v-col
                cols="3"
                class="mt-4"
            >
                CÓDIGO:
            </v-col>
            <v-col
                cols="5"
                id="col"
                class="mt-4"
            >
                <input class="input-campo text-center" type="number" readonly v-model="tipo.idTipoSolicitacao">
            </v-col>
            <v-col
                cols="4"
            >
                <v-dialog
                    v-model="dialog"
                    width="420"
                    style="word-wrap: break-word;"
                >
                    <template v-slot:activator="{ on, attrs }">
                        
                        <div class="d-flex mt-3 justify-center" style="color: #a41d1d" v-bind="attrs" v-on="on">
                            <div>
                                <v-icon 
                                    color="#a41d1d"
                                >mdi mdi-delete</v-icon>
                                Excluir
                            </div>
                        </div>
                    </template>

                    <v-card>
                        <v-card-title class="grey lighten-2">
                            Tem certeza que deseja excluir esse tipo de solicitação ?
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="success"
                            text
                            @click="dialog = false"
                        >
                            Não
                        </v-btn>
                        <v-btn
                            color="error"
                            text
                            @click="excluir(); dialog = false"
                        >
                            Sim
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row class='mx-4'>
            <v-col
                cols="3"
                class="mt-4"
            >
                DESCRIÇÃO:
            </v-col>
            <v-col
                cols="9"
                id="col"
                class="mt-4"
            >
                <input class="input-campo text-center" type="text" v-model="tipo.descricao">
            </v-col>
        </v-row>
        <div class="mx-16 mt-6">
            <v-select
                v-model="setorSelecionado"
                :items="setores"
                :readonly='!novoTipo'
                item-text="descricao"
                item-value="idSetor"
                solo
                persistent-hint
                hint="Selecione o setor"
            ></v-select>
        </div>
        <div v-if="novoTipo" class="text-center mt-3">
            <v-btn
                color="#1da471"
                dark
                x-large
                class="mb-4"
                @click="salvarTipoSolicitacao"
            >
                NOVO TIPO DE SOLICITAÇÃO
            </v-btn>
        </div>
        <div v-if="!novoTipo" class="text-center mt-3">
            <v-btn
                color="#1da471"
                dark
                x-large
                class="mb-4"
                @click="alterarTipoSolicitacao"
            >
                SALVAR EDIÇÃO
            </v-btn>
        </div>
  </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'ModalSolicitacao',
        props: {
            tipo: { type: Object, required: true },
            novoTipo: { type: Boolean, required: true }
        },
        data: () => ({
            dialog: false,
            setorSelecionado: null,
        }),
        watch: {

            tipo() {
                
                this.setorSelecionado = (this.tipo.idSetor) ? this.tipo.idSetor : null;
            }
        },
        computed: {

            setores() {

                return this.$store.getters.getSetores;
            }
        },
        methods: {

            async excluir() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario,
                    tipoSolicitacao: {
                        idTipoSolicitacao: this.tipo.idTipoSolicitacao,
                    }
                }

                await axios.post('/api/excluiTipoSolicitacao', aux, getToken())
                .then(() => {

                    alert('Excluído com sucesso!');
                    this.$emit('recarregarTipos');
                    this.$emit('closeModal');
                }).catch(err => {

                    if(err.response.status === 403){

                        alert('Sua sessão expirou, por favor faça o login.');
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.');
                })
            },
            async alterarTipoSolicitacao() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario,
                    tipoSolicitacao: {
                        idTipoSolicitacao: this.tipo.idTipoSolicitacao,
                        idSetor: this.setorSelecionado,
                        descricao: this.tipo.descricao
                    }
                }

                await axios.post('/api/alteraTipoSolicitacao', aux, getToken())
                .then(() => {

                    alert('Editado com sucesso!');
                    this.dialog = false;
                    this.$emit('recarregarTipos');
                    this.$emit('closeModal');
                }).catch(err => {

                    if(err.response.status === 403){

                        alert('Sua sessão expirou, por favor faça o login.');
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.');
                })
            },
            async salvarTipoSolicitacao() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario,
                    tipoSolicitacao: {
                        idSetor: this.setorSelecionado,
                        descricao: this.tipo.descricao
                    }
                }

                await axios.post('/api/salvaTipoSolicitacao', aux, getToken())
                .then(() => {

                    alert('Salvo com sucesso!');
                    this.dialog = false;
                    this.$emit('recarregarTipos');
                    this.$emit('closeModal');
                }).catch(err => {

                    if(err.response.status === 403){

                        alert('Sua sessão expirou, por favor faça o login.');
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.');
                })
            }
        }
    }
</script>

<style>
    
    .input-campo {

        width: 100%;
    }
</style>