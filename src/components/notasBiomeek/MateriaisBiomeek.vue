<template>
    <div class='text-center mx-10 mt-2'>
        <v-row >
            <v-col
                id='colGuia'
                cols='1'
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
            persistent
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
                <input class="campoCriar text-center" type="number" v-model="material.codigo">
            </v-col>
            <v-col
                id='col'
                :cols='colsDescricao'
            >
                <input class="campoCriar text-center" type="text" v-model="material.descricao">
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="campoCriar text-center" type="number" min='1' step="0.1" @change="refazerCalculos" v-model="material.valorUnitario">
            </v-col>
            <v-col
                id='col'
                cols='1'
            >
                <input class="campoCriar text-center" type="number" min='1' @change="refazerCalculos" v-model="material.quantidade">
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
            guia: { type: String, default: () => null},
            fornecedor: { type: String, default: () => null},
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
            colsDescricao: 4,
            totais: [],
            total: 0
        }),
        async created() {

            if (this.fornecedor)
                await this.getMateriaisGuia();
        },
        watch: {
            guia() {
                
                if (this.fornecedor)
                    this.getMateriaisGuia();
            },
            materiais: {
                deep: true,
                handler: 'refazerCalculos'
            }
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

                for (let i = 0; i < this.materiais.length; i++){

                    this.totais.push((this.materiais[i].valorUnitario * this.materiais[i].quantidade))
                }
            },
            calcularTotal() {

                let total = 0

                for (let i = 0; i < this.materiais.length; i++){

                    total += (this.materiais[i].valorUnitario * this.materiais[i].quantidade )
                }

                this.total = total.toFixed(2).toString().replace('.', ',')
            },
            getMateriais() {

                return this.materiais;
            },
            async getMateriaisGuia() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    guia: this.guia,
                    fornecedor: this.fornecedor
                }

                await axios.post('/api/retornaItensPorGuiaFornecedor', aux, getToken())
                .then(res => {
                    
                    this.materiais = res.data.itemLista

                    this.refazerCalculos();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
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
                }
            },
            deleteMaterial() {

                let i = this.materiais.findIndex(item => item.codigo == this.excluir.codigo);
                
                this.materiais.splice(i, 1);
            }
        }
    };
</script>