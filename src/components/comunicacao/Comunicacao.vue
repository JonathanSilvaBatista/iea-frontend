<template>
    <div>
        <div v-if="interno" class="d-flex justify-center mb-10">
            <div class="select flex-shrink-1">
                <v-select
                    v-model="tipoSelecionado"
                    :items="tipos"
                    item-text="descricao"
                    item-value="idTipoUsuario"
                    solo
                    hint="Escolha o tipo de usuário"
                    persistent-hint
                ></v-select>
            </div>
        </div>
        <v-divider></v-divider>
        <NovaComunicacao v-if="admin" @recarregarComunicados='getComunicados' />
        <div class="mt-8 d-flex align-start flex-wrap">
            <v-card
                class="mx-5 py-2 my-2 alerta flex-column"
                v-for="(alerta, i) in comunicados"
                :key="i"
            >
                <div class="d-flex">
                    <div class="tituloAlerta" style="word-wrap: break-word;">
                        {{ alerta.titulo }}
                    </div>
                    <div v-if="admin" class="d-flex mt-1 ml-auto">
                        <v-btn 
                            color="#a41d1d" 
                            @click="excluirIndice = i"
                            @click.stop="dialog2 = true"
                            icon
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn 
                            color="indigo"
                            @click="comunicadoSelecionado = alerta"
                            @click.stop="dialog = true"
                            icon
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </div>
                </div>
                <div class="mx-4 mt-2">
                    {{ alerta.descricao }}
                </div>

                <div class="rodape mx-2 mt-4 d-flex justify-end">
                    <span>
                        Data de criação: {{ alerta.dtCriacao }}
                    </span>
                    <span v-if="alerta.dtAlteracao && alerta.dtAlteracao != alerta.dtCriacao">
                        Data de atualização: {{ alerta.dtAlteracao }}
                    </span>
                </div>
            </v-card>
        </div>
        <v-dialog
            v-model="dialog"
            width="1000"
        >
            <EditarComunicacao :comunicado='comunicadoSelecionado' :alvos='tipos' @recarregarComunicados='dialog = false; getComunicados();' />
        </v-dialog>
        <v-dialog
            v-model="dialog2"
            width="420"
        >
            <v-card>
                <v-card-title class="grey lighten-2">
                    Tem certeza que deseja excluir esse comunicado ?
                </v-card-title>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        text
                        @click="dialog2 = false"
                    >
                        Não
                    </v-btn>
                    <v-btn
                        color="error"
                        text
                        @click="excluir(); dialog2 = false"
                    >
                        Sim
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        
    </div>
</template>

<script>

    import NovaComunicacao from './NovaComunicacao'
    import EditarComunicacao from './EditarComunicacao'

    import axios from '../../axios';
    import { getToken } from '../../config';

    export default {
        name: 'Comunicacao',
        components: {
            NovaComunicacao,
            EditarComunicacao
        },
        data: () => ({
            comunicados: [],
            dialog: false,
            dialog2: false,
            comunicadoSelecionado: null,
            tipoSelecionado: null,
            excluirIndice: null,
        }),
        created() {

            this.$store.dispatch('setPagina', 'Mural de Comunicados')

            this.getComunicados();
        },
        watch: {

            tipoSelecionado: {
                deep: true,
                handler: 'getComunicados'
            }
        },
        computed: {

            admin() {
              
                return this.$store.getters.getUser.tipoUsuario == 'ADMIN' || this.$store.getters.getUser.tipoUsuario == 'RESPONSAVEL_SETOR';
            },
            tipos() {

                let aux = this.$store.getters.getTiposUsuario.filter(e => e.interno == false);
                aux.unshift({ idTipoUsuario: null, descricao: 'TODOS' });
                
                return aux;
            },
            interno() {

                return this.$store.getters.getUser.interno;
            }
        },
        methods: {

            async getComunicados() {

                let tipoUsuario;

                if (!this.interno)
                    tipoUsuario = this.$store.getters.getUser.idTipoUsuario;
                else
                    tipoUsuario = this.tipoSelecionado;

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idTipoUsuarioDestino: tipoUsuario
                }

                await axios.post('/api/retornaComunicacoes', aux, getToken())
                .then(res => {

                    this.comunicados = [];

                    this.comunicados = res.data;
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                }) 
            },
            async excluir() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idUsuarioExclusao: await this.$store.getters.getUser.id,
                    idComunicacao: this.comunicados[this.excluirIndice].idComunicacao
                }

                await axios.post('/api/excluiComunicacao', aux, getToken())
                .then(() => {
                    
                    this.comunicados.splice(this.excluirIndice, 1);
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            }
        }
    }
</script>

<style>
    .alerta {
        width: 347px;
    }

    .tituloAlerta {
        padding: 4px;
        margin-left: 8px;
        font-size: 1.2em;
        font-weight: bold;
    }

    .rodape {
        font-size: 0.8em;
        font-weight: inherit;
        /* position: absolute; */
        /* bottom: 0; */
        /* left: 0; */
    }
</style>