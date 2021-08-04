<template>
    <div class='text-center mx-10 mt-2'>
        <v-row >
            <v-col
                id='colGuia'
                cols='1'
                v-if="edicao"
            >
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                CÓDIGO
            </v-col>
            <v-col
                id='colGuia'
                :cols='colsDescricao'
            >
                DESCRIÇÃO
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                VALOR
            </v-col>
            <v-col
                id='colGuia'
                cols='1'
            >
                QTD
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                TOTAL
            </v-col>
        </v-row>
        <v-dialog
            v-model="dialog"
            width="500"
        >
            <v-card>
                <v-card-title class="grey lighten-2">
                    Tem certeza que deseja excluir ?
                </v-card-title>

                <v-card-text class="mt-5 overline font-weight-black text-center">
                    Item: {{ excluir.codigo }} - {{ excluir.descricao }}
                </v-card-text>

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
                        @click="deleteMaterial(); dialog = false;"
                    >
                        Sim
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row 
            v-for='(material, i) in materiais'
            :key='material.codigo'
            :id="'material' + i"
        >
            <v-col
                id='col'
                cols='1'
                v-if="edicao"
            >
                <v-icon 
                    color="#a41d1d" 
                    @click.stop="dialog = true"
                    @click="excluir = { codigo: material.codigo, descricao: material.descricao }"
                >mdi mdi-delete</v-icon>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="campoCriar text-center" type="number" @change="alteracaoFeita" readonly  v-model="material.codigo">
            </v-col>
            <v-col
                id='col'
                :cols='colsDescricao'
            >
                <input class="campoCriar text-center" type="text" @change="alteracaoFeita" readonly  v-model="material.descricao">
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="campoCriar text-center" type="number" @change="alteracaoFeita" min='1' step="0.1" readonly  v-model="material.valorUnitario">
            </v-col>
            <v-col
                id='col'
                cols='1'
            >
                <input class="campoCriar text-center" type="number" @change="alteracaoFeita" min='1' readonly v-model="material.quantidade">
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                {{ imprimirTotalUnitario(i) }}
            </v-col>
        </v-row>
        <v-row>
            <v-col
                id='col'
                cols='7'
                style="color: #4caf50"
            >
                <v-dialog
                    v-if="edicao"
                    v-model="dialogAdicionar"
                    width="700"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                            <v-icon color="success" >mdi mdi-plus</v-icon>
                            <span class="ml-4">Adicionar material</span>
                        </div>
                    </template>
                    <AdicionarMateriais @add='addMaterial' />
                </v-dialog>
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                TOTAL: 
            </v-col>
            <v-col
                id='col'
                cols='3'
            >
                {{ total }}
            </v-col>
        </v-row>
    </div>
</template>

<script>

    import AdicionarMateriais from '../shared/AdicionarMateriais'

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'Painel',
        props: {
            edicao: { type: Boolean, default: () => false },
            solicitacao: { type: Number, default: () => null},
        },
        components: {
            AdicionarMateriais
        },
        data: () => ({
            materiais: [],
            excluir: {
                codigo: -1,
                descricao: ''
            },
            dialog: false,
            dialogAdicionar: false,
            colsDescricao: 5,
            totais: [],
            total: 0,
            flagErro: 2
        }),
        async created() {

            await this.getMateriaisSolicitacao();
        },
        watch: {
            solicitacao() {

                this.getMateriaisSolicitacao()
                this.verificarEdicao();
            },
            edicao: {
                deep: true,
                handler: 'verificarEdicao'
            },
            materiais: {
                deep: true,
                handler: 'verificarEdicao'
            },
        },
        methods: {

            imprimirTotalUnitario(i) {

                return this.totais[i].toFixed(2).toString().replace('.', ',');
            },
            refazerCalculos() {

                this.totalUnitario();

                this.calcularTotal();
            },
            totalUnitario() {

                this.totais = [];

                if (this.materiais != null) {

                    for (let i = 0; i < this.materiais.length; i++){
    
                        this.totais.push((this.materiais[i].valorUnitario * this.materiais[i].quantidade))
                    }
                }
            },
            calcularTotal() {

                let total = 0

                if (this.materiais != null) {

                    for (let i = 0; i < this.materiais.length; i++){

                        total += (this.materiais[i].valorUnitario * this.materiais[i].quantidade )
                    }

                    this.total = total.toFixed(2).toString().replace('.', ',')
                } else
                    this.total = 0;
            },
            alteracaoFeita() {

                if (this.edicao)
                    this.$emit('alteracaoMaterial');

                this.refazerCalculos();
            },
            verificarEdicao() {
                
                if (this.edicao)
                    this.habilitarEdicao();
                else
                    this.desabilitarEdicao();

                this.refazerCalculos();
            },
            getMateriais() {

                return this.materiais;
            },
            async getMateriaisSolicitacao() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.solicitacao,
                }

                await axios.post('/api/retornaItensSolicitacaoNF', aux, getToken())
                .then(async res => {
                    
                    this.materiais = res.data;
                    this.verificarEdicao()
                    
                    if ((this.materias == null || this.materiais.length == 0) && this.flagErro > -1) {
                        
                        this.flagErro--;
                        await this.getMateriaisSolicitacao();
                    } else if(this.materiais.length > 0){
                        
                        this.flagErro = 2;
                        this.refazerCalculos();
                        this.$emit('carregarMateriais', this.materiais);
                    }
                }).catch(err => {

                    this.flagErro--;
                    
                    if(err.response.status === 403){

                        if (this.flagErro > -1)
                            this.getMateriaisSolicitacao();
                        else {

                            alert('Sua sessão expirou, por favor faça o login.')
                            this.$router.push('/redirect-me');
                        }
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            habilitarEdicao() {

                this.colsDescricao = 4;

                const campos = document.getElementsByClassName('campoCriar')

                for (let i = 0; i < campos.length; i++) {

                    campos[i].removeAttribute('readonly')
                }
            },
            desabilitarEdicao() {

                this.colsDescricao = 5;

                const campos = document.getElementsByClassName('campoCriar')

                for (let i = 0; i < campos.length; i++) {

                    campos[i].setAttribute('readonly', 'readonly')
                }
            },
            addMaterial(item) {

                this.dialogAdicionar = false;
                let i
                
                for (i = 0; i < this.materiais.length; i++) {

                    if (this.materiais[i].codigo == item.codigo)
                        break;
                }

                if (i == this.materiais.length){

                    this.materiais.push(item);

                    this.$emit('update');
                    this.$emit('alteracaoMaterial');
                }

                setTimeout(() => { this.habilitarEdicao(); }, 1000);
                
            },
            async deleteMaterial() {

                if (this.materiais.length < 2) {

                    alert('A solicitação não pode ser salva sem material.')
                    return;
                }

                let i = this.materiais.findIndex(item => item.codigo == this.excluir.codigo)

                if (this.edicao && this.materiais[i].idItem){

                    let aux =  {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        idItem: this.materiais[i].idItem
                    }

                    await axios.post('/api/excluiItemSolicitacaoNF', aux, getToken())
                }

                this.materiais.splice(i, 1);
            }
        }
    };
</script>

<style>

    .campo {
        width: 100%; 
        padding: 3px 0px 3px 5px;
    }
</style>