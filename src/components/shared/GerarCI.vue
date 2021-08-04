<template>
    <div>
        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="secondary"
                    dark
                    large
                    v-bind="attrs"
                    v-on="on"
                >
                    Gerar C.I.
                </v-btn>
            </template>
            <v-card id="ci" style="background-color: #f2f2f2" class="d-flex flex-column">
                <div class="d-flex">
                    <div id="quantNotas" class="d-flex align-center" style="width: 390px;">
                        <h2 class="mx-6">Quantas notas fiscais?</h2>
                        <v-overflow-btn
                            :auto-select-first='true'
                            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                            v-model="quantNotas"
                        ></v-overflow-btn>
                    </div>
                    <v-spacer></v-spacer>
                    <div class="align-self-center">
                        <v-btn id="btnImprimir" outlined class="mr-8" color="success" @click="imprimir">
                            <v-icon>fas fa-print</v-icon>
                        </v-btn>
                        <v-btn
                            id="fechar"
                            icon
                            outlined
                            @click="dialog = false"
                            class="mr-4"
                        >
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </div>
                </div>
                
                <div class="mx-6">
                    <v-row>
                        <v-col
                            id='col'
                            cols='12'
                            class='text-center mt-6'
                        >
                            <h1 class='font-weight-black'>
                                COMUNICAÇÃO INTERNA
                            </h1>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DE:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text" v-model="ci.nomeUsuario">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DEPTº/SETOR:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                PARA:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DEPTº/SETOR:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='3'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                SOLICITAÇÃO Nº:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='9'
                        >
                            <input class="campo" type="text" v-model="ci.idSolicitacao">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='3'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                ASSUNTO:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='9'
                        >
                            <input class="campo" type="text">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                Nº DA NOTA GUIA:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text" v-model="ci.numeroGuia">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                PREV.PGTO:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                BENEFICIÁRIO:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text" v-model="ci.nomeBeneficiario">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                VALOR:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="number" v-model="ci.valor">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                CÓDIGO PREST:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text" v-model="ci.cdFornecedor">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                Nº NOTA FISCAL:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input v-for="n in quantNotas" :key="n" class="campo text-center" type="text">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='3'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                PRESTADOR:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='9'
                        >
                            <input class="campo" type="text" v-model="ci.nomeFornecedor">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DATA CIRÚRGIA:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text" v-model="ci.dtCirurgia">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                CONTA:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text" v-model="ci.tipo_conta">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='3'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DATA CONHECIMENTO:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='3'
                        >
                            <input class="campo text-center" type="text" v-model="ci.dtConhecimento">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                        ></v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        ></v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='2'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DATA SISTEMA:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        >
                            <input class="campo text-center" type="text">
                        </v-col>
                        <v-col 
                            id='col'
                            cols='2'
                        ></v-col>
                        <v-col 
                            id='col'
                            cols='4'
                        ></v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='3'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                RECEBIDO EM:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='9'
                        >
                            <input class="campo" type="text">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col 
                            id='col'
                            cols='3'
                            class="text-end"
                        >
                            <span class="font-weight-black">
                                DIGITADO EM:
                            </span>
                        </v-col>
                        <v-col 
                            id='col'
                            cols='9'
                        >
                            <input class="campo" type="text">
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'GerarCI',
        props: {
            idSolicitacao: { type: Number, required: true }
        },
        data: () => ({
            dialog: false,
            quantNotas: 1,
            ci: {},
            flagErro: 1,
        }),
        created() {

            this.getDetalhesCi();
        },
        watch: {

            dialog() {

                if (this.dialog)
                    this.$store.dispatch('setSideMenu', false);
                else
                    this.$store.dispatch('setSideMenu', true);
            },
            idSolicitacao() {

                this.getDetalhesCi();
            }
        },
        methods: {
            imprimir() {

                window.print();
            },
            async getDetalhesCi() {

                let aux = {
                    idSolicitacao: this.idSolicitacao,
                    cdUsuario: await this.$store.getters.getUser.cdUsuario
                }

                await axios.post('/api/retornaDetalhesCI', aux, getToken())
                .then(res => {

                    this.ci = res.data

                    if (this.ci.idSolicitacao == null && this.flagErro > -1) {

                        this.flagErro--;
                        this.getDetalhesCi();
                    }
                }).catch(err => {

                    this.flagErro--;

                    if(err.response.status === 403){
                        if (this.flagErro > -1)
                            this.getDetalhesCi();
                        else {

                            alert('Sua sessão expirou, por favor faça o login.')
                            this.$router.push('/redirect-me');
                        }
                    } else if (err.response.status === 401){
                        alert(err.response.data)
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            }
        }
    }
</script>

<style >
    @media print{
        #btnImprimir, #fechar, #quantNotas{
            visibility: hidden;
        }
    }

    #ci {
        font-size: 70%;
    }

    #col {
        border: 1px solid #757575;
        background-color: white;
    }
</style>