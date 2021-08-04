<template>
    <div style="background-color: #ddd">
        <v-row class='mx-4'>
            <v-col
                id='col'
                cols='12'
                class='text-center mt-6'
                :style="'background-color: ' + solicitacao.corStatus"
            >
                <span :style="'color:' + corFonte" class='display-1 font-weight-black'>
                    SOLICITAÇÃO Nº {{ solicitacao.idSolicitacao }}
                </span>
            </v-col>
        </v-row>
        <div class="d-flex justify-space-between align-center mr-10 ml-4 mt-7 mb-n1">
            <div class="d-flex">
                <div id="colGuia" class="pt-4 pb-3 pl-3 pr-3">
                    DATA DA SOLICITAÇÃO:
                </div>
                <div id="col" class="pa-4">
                    <input style="width: 100%; padding: 2px 0px 2px 5px;" class="text-center" type="tel" v-mask="'##/##/####'" readonly v-model="solicitacao.dataSolicitacao">
                </div>
            </div>
            <v-btn
                v-if="showRollback"
                color="indigo"
                dark
                large
                outlined
                @click="encerrarSolicitacao"
            >
                Encerrar solicitação
            </v-btn>
            <NPS v-if="showRollback" ref="nps" :idSolicitacao='solicitacao.idSolicitacao' @npsRespondido='solicitacaoFinalizadaPrestador' />
            <VoltarStatus v-if="showRollback" :idSolicitacao='solicitacao.idSolicitacao' @recarregarGuias='recarregarGuias' />
            <TransferenciaSolicitacao :solicitacao='solicitacao' @transferenciaEfetuada='atualizarExecutor' @statusAlterado='verificarStatus' v-if="solicitacaoAberta && !solicitante && interno" />
            <v-dialog
                v-if="interno && solicitacaoAberta"
                v-model="dialog"
                width="600"
                style="word-wrap: break-word;"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        text
                        color="#a41d1d"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            size="32"
                            class="mr-2"
                        >mdi mdi-close-octagon-outline</v-icon>
                        Cancelar solicitação
                    </v-btn>
                    
                </template>

                <div style="background-color: #ddd">
                    <div class="mx-10 pt-4">
                        <v-textarea
                            solo
                            v-model="motivoCancelamento"
                            label="Motivo de cancelamento é obrigatório**"
                        ></v-textarea>
                    </div>
                    <div class="text-center">
                        <v-btn
                            color="#a41d1d"
                            dark
                            x-large
                            class="mb-4 px-10"
                            @click="cancelar();"
                        >
                            CANCELAR SOLICITAÇÃO
                        </v-btn>
                    </div>
                </div>
            </v-dialog>
            <div v-if="showEdit" class="d-flex">
                <v-switch
                    v-model="edicao"
                    inset
                    color="success"
                    label="Habilitar edição"
                ></v-switch>
            </div>
        </div>
        <v-row class='mx-4'>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-3'>
                    SOLICITANTE:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='4'
                class="mt-4"
            >
                <input class="campo text-center" type="text" readonly v-model="nomeSolicitante">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-3'>
                    ATRIBUÍDO: 
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='4'
                class="mt-4"
            >
                <input class="campo text-center" type="text" readonly v-model="solicitacao.nomeUsuarioDestino">
            </v-col>
        </v-row>
        <v-row class='mx-4'>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-1"
            >
                <span class='ml-3'>
                    SETOR ATRIBUÍDO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='3'
                class="mt-1"
            >
                <input class="campo text-center" type="text" readonly v-model="solicitacao.nomeSetorDestino">
            </v-col>
            <v-col 
                id='colGuia'
                cols='3'
                class="mt-1"
            >
                <span class='ml-3'>
                    TIPO DE SOLICITAÇÃO: 
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='4'
                class="mt-1"
            >
                <input class="campo text-center" type="text" readonly v-model="solicitacao.tipoSolicitacao">
            </v-col>
        </v-row>
        <v-row v-if="solicitacao.emailSolicitanteSemLogin" class='mx-4'>
            <v-col
                id='colGuia'
                cols='2'
                class="mt-1"
            >
                <span class='ml-4'>
                    E-MAIL: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='10'
                class="mt-1"
            >
                <input class="campo" type="text" readonly v-model="solicitacao.emailSolicitanteSemLogin">
            </v-col>
        </v-row>
        <v-row class='mx-4'>
            <v-col
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    DESCRIÇÃO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='10'
                class="mt-2"
            >
                <textarea class="campo alterar" type="text" readonly v-model="descricao" @change="alteracaoFeita" rows="4" wrap="soft"> </textarea>
            </v-col>
        </v-row>
        <div v-if="editado" class="text-center mt-4">
            <v-btn
                color="#1da471"
                dark
                x-large
                class="mb-4"
                @click="editar"
            >
                SALVAR EDIÇÃO
            </v-btn>
        </div>
        <Historico :solicitacao='solicitacao' v-if="!editado" />
        <Status :idSolicitacao='solicitacao.idSolicitacao' v-if="interno && solicitacaoAberta" @solicitacaoFinalizada='recarregarGuias' />
    </div>
</template>

<script>

    import Historico from '../shared/Historico'
    import Status from '../shared/Status'
    import VoltarStatus from '../shared/VoltarStatus'

    import TransferenciaSolicitacao from '../shared/TransferenciaSolicitacao'

    import NPS from '../shared/NPS';

    import axios from '../../axios'
    import { getToken } from '../../config'

    import tinycolor from 'tinycolor2'

    export default {
        name: 'InfoSolicitacao',
        props: {
            solicitacao: { type: Object, required: true }
        },
        components: {
            Historico,
            Status,
            VoltarStatus,
            TransferenciaSolicitacao,
            NPS
        },
        data: () => ({
            dialog: false,
            edicao: false,
            editado: false,
            motivoCancelamento: '',
            descricao: '',
            nomeSolicitante: '',
        }),
        created() {

            this.descricao = this.solicitacao.descricao;
            this.nomeSolicitante = (this.solicitacao.nomeUsuarioSolicitante != null) ? this.solicitacao.nomeUsuarioSolicitante : this.solicitacao.nomeSolicitanteSemLogin;
        },
        watch: {
            edicao() {

                if (this.edicao)
                    this.habilitarEdicao();
                else
                    this.desabilitarEdicao();
            },
            solicitacao() {

                this.edicao = false;
                this.editado = false;
                this.descricao = this.solicitacao.descricao
                this.nomeSolicitante = (this.solicitacao.nomeUsuarioSolicitante != null) ? this.solicitacao.nomeUsuarioSolicitante : this.solicitacao.nomeSolicitanteSemLogin;
            }
        },
        computed: {

            corFonte() {
                
                if (tinycolor(this.solicitacao.corStatus).isLight()) 
                    return 'black';
                else
                    return 'white';
            },
            showEdit() {

                if (this.$store.getters.getUser.cdUsuario == this.solicitacao.cdUsuarioSolicitante && this.solicitacao.corStatus != '#4c4c4c' && this.solicitacao.corStatus != '#969696')
                    return true;

                return false;
            },
            showRollback() {

                if (this.$store.getters.getUser.cdUsuario == this.solicitacao.cdUsuarioSolicitante && this.solicitacao.corStatus == '#969696') 
                    return true;
                
                return false;
            },
            solicitante() {

                if (this.$store.getters.getUser.cdUsuario == this.solicitacao.cdUsuarioSolicitante)
                    return true;
                
                return false;
            },
            interno() {

                return this.$store.getters.getUser.interno;
            },
            solicitacaoAberta() {

                return this.solicitacao.corStatus != '#4c4c4c' && this.solicitacao.corStatus != '#969696';
            },
            usuarioAtribuido() {

                return this.solicitacao.cdUsuarioDestino == this.$store.getters.getUser.cdUsuario;
            }
        },
        methods: {

            async encerrarSolicitacao() {
                
                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.solicitacao.idSolicitacao,
                    corStatus: "PRETO"
                }

                await axios.post('/api/alteraStatus', aux, getToken())
                .then(() => {
                    
                    this.$refs.nps.showNps();
                    this.recarregarGuias();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else if (err.response.status === 401){
                        alert(err.response.data)
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            atualizarExecutor(assumiu) {

                /* if (obj.usuario) {

                    this.solicitacao.cdUsuarioDestino = obj.usuario;
                    this.solicitacao.nomeUsuarioDestino = obj.nome;
                    this.solicitacao.idSetorDestino = obj.idSetor;
                    this.solicitacao.nomeSetorDestino = obj.descricao;
                } else {

                    this.solicitacao.cdUsuarioDestino = null;
                    this.solicitacao.nomeUsuarioDestino = null;
                    this.solicitacao.idSetorDestino = obj.idSetor;
                    this.solicitacao.nomeSetorDestino = obj.descricao;
                }
                */
               
                this.$emit('refreshGuias'); 

                if (assumiu)
                    this.$router.push('/recebidas').catch(() => {});
            },
            async verificarStatus() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.solicitacao.idSolicitacao
                }

                await axios.post('/api/retornaStatusSolicitacao', aux, getToken())
                .then(res => {
                    
                    if (this.solicitacao.corStatus != res.data.status){

                        this.solicitacao.corStatus = res.data.status;
                        //this.$emit('novoStatus', this.solicitacao);
                    }
                    
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else if (err.response.status === 401){
                        alert(err.response.data)
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            alteracaoFeita() {

                if (this.edicao)
                    this.editado = true;
            },
            async editar() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    solic: {
                        idSolicitacao: this.solicitacao.idSolicitacao,
                        cdUsuarioDestino: this.solicitacao.cdUsuarioDestino,
                        idTipoSolicitacao: this.solicitacao.idTipoSolicitacao,
                        descricao: this.descricao
                    }
                }

                await axios.post('/api/alteraSolicitacao', aux, getToken())
                .then(() => {

                    this.edicao = false;
                    this.editado = false;

                    this.solicitacao.descricao = this.descricao;
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async cancelar() {

                if (this.motivoCancelamento === '')
                    return;

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.solicitacao.idSolicitacao,
                    motivoCancelamento: this.motivoCancelamento
                }

                await axios.post('/api/cancelarSolicitacao', aux, getToken())
                .then(() => {

                    this.$emit('solicitacaoDeletada', this.solicitacao.idSolicitacao);
                    alert('Excluído com sucesso!');
                    this.dialog = false;
                })
            },
            recarregarGuias() {

                this.$emit('refreshGuias');
            },
            solicitacaoFinalizadaPrestador() {

                this.recarregarGuias();
                this.$router.push('/solicitacaoFinalizada').catch(() => {});
            },
            desabilitarEdicao() {

                const campos = document.getElementsByClassName('alterar')

                for (let i = 0; i < campos.length; i++) {

                    campos[i].setAttribute('readonly', 'readonly')
                }
            },
            habilitarEdicao() {

                const campos = document.getElementsByClassName('alterar')

                for (let i = 0; i < campos.length; i++) {

                    campos[i].removeAttribute('readonly')
                }
            }
        }
    }
</script>

<style>

</style>