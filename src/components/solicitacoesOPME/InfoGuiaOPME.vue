<template>
    <div id="solicitacao" style="background-color: #ddd">
        <v-row class='mx-4'>
            <v-col
                id='col'
                cols='12'
                class='text-center mt-6'
                :style="'background-color: ' + guia.corStatus"
            >
                <span :style="'color:' + corFonte" class='display-1 font-weight-black'>
                    SOLICITAÇÃO Nº {{ guia.idSolicitacao }}
                </span>
            </v-col>
        </v-row>
        <div class="d-flex justify-space-between align-center mr-10 ml-10 mt-4 mb-n1">
            <GerarCI v-if="interno" :idSolicitacao='guia.idSolicitacao'/>
            <VoltarStatus v-if="interno && guia.corStatus == '#4c4c4c'" :idSolicitacao='guia.idSolicitacao' @recarregarGuias='recarregarGuias' />
            <div v-if="interno && solicitacaoAberta" class="d-flex">
                <v-dialog
                    v-if="edicao"
                    v-model="dialog"
                    width="420"
                    style="word-wrap: break-word;"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon 
                            color="#a41d1d" 
                            class="mr-10"
                            v-bind="attrs"
                            v-on="on"
                        >mdi mdi-delete</v-icon>
                    </template>

                    <v-card>
                        <v-card-title class="grey lighten-2">
                            Tem certeza que deseja excluir essa solicitação ?
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
                <span class='ml-4'>
                    NÚMERO GUIA:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-4"
            >
                <input class="campo text-center" type="number" @change="alteracaoFeita" readonly v-model="guia.numeroGuia">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-4'>
                    DATA SOLICITAÇÃO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-4"
            >
                <input style="width: 100%; padding: 3px 0px 3px 5px;" class="text-center" type="tel" v-mask="'##/##/####'" readonly v-model="guia.dataSolicitacao">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-4'>
                    DATA DA CIRURGIA:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-4"
            >
                <input class="campo text-center" type="tel" v-mask="'##/##/####'" @change="alteracaoFeita" readonly v-model="guia.data_cirurgia">
            </v-col>
        </v-row>
        <v-row class="mx-4">
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    PRAZO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="campo text-center" type="tel" v-mask="'##/##/####'" @change="alteracaoFeita" readonly v-model="guia.dataPrazo">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    VENCIMENTO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="campo text-center" type="tel" v-mask="'##/##/####'" @change="alteracaoFeita" readonly v-model="guia.data_vencimento">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    TIPO DE CONTA:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="campo text-center" type="text" @change="alteracaoFeita" readonly v-model="guia.tipoConta">
            </v-col>
        </v-row>
        <v-row class='mx-4'>
            <v-col
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    FORNECEDOR:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='6'
                class="mt-2"
            >
                <input class="campo" type="text" @change="alteracaoFeita" readonly v-model="guia.nomeUsuarioDestino">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    CÓDIGO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="text-center campo" type="number" @change="alteracaoFeita" readonly v-model="guia.cdUsuarioDestino">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    BENEFICIÁRIO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='6'
            >
                <input class="campo" type="text" @change="alteracaoFeita" readonly v-model="guia.nomeBeneficiario">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    CÓDIGO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campo" type="text" @change="alteracaoFeita" readonly v-model="guia.cdBeneficiario">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    MÉDICO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='6'
            >
                <input class="campo" type="text" @change="alteracaoFeita" readonly v-model="guia.nomeMedico">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-2'>
                    CÓDIGO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campo" type="number" @change="alteracaoFeita" readonly v-model="guia.cdMedico">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col 
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    HOSPITAL:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='6'
            >
                <input class="campo" type="text" @change="alteracaoFeita" readonly v-model="guia.hospital">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-2'>
                    CÓDIGO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campo" type="number" @change="alteracaoFeita" readonly v-model="guia.cdHospital">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col 
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    SOLICITANTE: 
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='6'
            >
                <input class="campo" type="text" @change="alteracaoFeita" readonly v-model="guia.nomeUsuarioSolicitante">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-2'>
                    CÓDIGO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campo" type="number" @change="alteracaoFeita" readonly v-model="guia.cdUsuarioSolicitante">
            </v-col>
        </v-row>
        <Materiais ref="materiais" :edicao='edicao' :solicitacao='guia.idSolicitacao' @alteracaoMaterial='editadoMaterial = true' @carregarMateriais='carregarMateriais' />
        <div v-if="editado || editadoMaterial" class="text-center mt-4">
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
        <Historico :solicitacao='guia' :opme='true' v-if="!editado && !editadoMaterial" />
        <Status :idSolicitacao='guia.idSolicitacao' :opme='true' v-if="verificaStatus" @solicitacaoFinalizada='recarregarGuias' />
    </div>
</template>

<script>

    import Materiais from './Materiais'
    import Historico from '../shared/Historico'
    import Status from '../shared/Status'

    import GerarCI from '../shared/GerarCI'
    import VoltarStatus from '../shared/VoltarStatus'

    import axios from '../../axios'
    import { getToken } from '../../config'

    import tinycolor from 'tinycolor2'

    export default {
        name: 'InfoGuiaOPME',
        components: {
            Materiais,
            Historico,
            Status,
            GerarCI,
            VoltarStatus,
        },
        props: {
            guia: { type: Object, required: true }
        },
        data: () => ({
            edicao: false,
            editado: false,
            editadoMaterial: false,
            dialog: false,
            materiais: [],
        }),
        mounted() {

            this.desabilitarEdicao();
            this.$refs.materiais.desabilitarEdicao();
        },
        watch: {
            edicao() {

                if (this.edicao)
                    this.habilitarEdicao();
                else
                    this.desabilitarEdicao();
            },
            guia() {

                this.edicao = false;
                this.editado = false;
                this.editadoMaterial = false;
            }
        },
        computed: {

            verificaStatus() {

                if (!this.editado && !this.editadoMaterial && this.guia.corStatus != '#ffffff' && this.interno && this.guia.corStatus != '#4c4c4c' && this.guia.corStatus != '#fff745' && this.guia.corStatus != '#969696') 
                    return true;

                return false;
            },
            corFonte() {

                if (tinycolor(this.guia.corStatus).isLight()) 
                    return 'black';
                else
                    return 'white';
            },
            solicitacaoAberta() {

                if (this.guia.corStatus != '#4c4c4c' && this.guia.corStatus != '#969696')
                    return true;

                return false;
            },
            interno() {

                return this.$store.getters.getUser.interno;
            }
        },
        methods: {
            
            recarregarGuias() {

                this.$emit('recarregarGuias');
            },
            solicitacaoFinalizadaPrestador() {

                this.recarregarGuias();
                this.$router.push('/finalizado').catch(() => {});
            },
            carregarMateriais(materiais) {

                this.materiais = materiais;
            },
            async excluir() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.guia.idSolicitacao
                }

                await axios.post('/api/excluiSolicitacaoNF', aux, getToken())
                .then(() => {

                    this.$emit('solicitacaoDeletada', this.guia.idSolicitacao);
                })
            },
            async editar() {

                this.edicao = false;

                if (this.editadoMaterial){

                    let aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        itemLista: this.$refs.materiais.getMateriais(),
                        idSolicitacao: this.guia.idSolicitacao
                    }

                    this.materiais = this.$refs.materiais.getMateriais()

                    await axios.post('/api/alteraItemSolicitacaoNF', aux, getToken())
                    .then(() => {

                        this.editadoMaterial = false;
                    })
                }

                if (this.editado){

                    let objAux = JSON.parse(JSON.stringify(this.guia));

                    objAux.data_solicitacao = objAux.dataSolicitacao;
                    objAux.data_prazo = objAux.dataPrazo;

                    delete objAux.dataSolicitacao;
                    delete objAux.dataPrazo;

                    let aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        solicitacao: objAux
                    }

                    await axios.post('/api/alteraSolicitacaoNF', aux, getToken())
                    .then(() => {

                        this.editado = false;
                    }).catch(err => {

                        if(err.response.status === 403){
                            alert('Sua sessão expirou, por favor faça o login.')
                            this.$router.push('/redirect-me');
                        } else {
                            alert('Ocorreu um erro, por favor, contate o suporte.')
                        }
                    })
                }
            },
            alteracaoFeita() {

                if (this.edicao)
                    this.editado = true;
            },
            desabilitarEdicao() {

                const campos = document.getElementsByClassName('campo')

                for (let i = 0; i < campos.length; i++) {

                    campos[i].setAttribute('readonly', 'readonly')
                }
            },
            habilitarEdicao() {

                const campos = document.getElementsByClassName('campo')

                for (let i = 0; i < campos.length; i++) {

                    campos[i].removeAttribute('readonly')
                }
            }
        }
    };
</script>