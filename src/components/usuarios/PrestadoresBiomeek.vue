<template>
    <div>
        <div class="d-flex justify-center">
            <div class="select flex-shrink-1">
                <v-select
                    v-model="tipoSelecionado"
                    :items="tipos"
                    item-text="descricao"
                    item-value="idTipoUsuario"
                    solo
                    hint="Escolha o tipo de prestador"
                    persistent-hint
                ></v-select>
            </div>
        </div>
        <div v-if="tipoSelecionado != null">
            <dx-data-grid
                :allow-column-reordering="true"
                :data-source="fornecedores"
                :show-borders="true"
                :two-way-data-bind="false"
                :show-column-lines='false'
                :hover-state-enabled='true'
                :allow-column-resizing='true'
            >
                <dx-export
                    :enabled="true"
                    file-name="Prestadores"/>
                <dx-column
                    data-field="codigo"
                    caption="Código"
                    alignment="center"
                    width="120"
                >
                </dx-column>
                <dx-column
                    data-field="nome"
                    caption="Prestador"
                    alignment="center"
                >
                </dx-column>
                <dx-column
                    data-field="nomeFantasia"
                    caption="Nome fantasia"
                    alignment="center"
                >
                </dx-column>
                <dx-column
                    data-field="cpf_cnpj"
                    caption="CNPJ"
                    alignment="center"
                    cell-template="grid-cell-cnpj"
                    width="200"
                >
                </dx-column>
                <dx-column
                    caption="Adicionar"
                    width="100"
                    cell-template="grid-cell-status"
                    alignment="center"
                >
                </dx-column>
                <dx-filter-row
                    :visible="true"
                    :apply-filter="'auto'"
                />
                <dx-group-panel :visible="false"/>
                <dx-grouping :auto-expand-all="true"/>
                <dx-paging :page-size="6"/>
                <template  #grid-cell-cnpj="{ data }">
                    <span>{{ cnpjFormatado(data.data.cpf_cnpj) }}</span>
                </template>
                <template  #grid-cell-status="{ data }">
                    <v-btn 
                        block 
                        color="#1da471" 
                        height="40"
                        @click="editarFornecedor(data.data)"
                    >
                        <v-icon color="white" size="35">mdi mdi-plus</v-icon>
                    </v-btn>
                </template>
            </dx-data-grid>
        </div>
    </div>
</template>

<script>

    import {
        DxDataGrid,
        //DxHeaderFilter,
        DxFilterRow,
        DxGrouping,
        DxGroupPanel,
        DxColumn,
        DxPaging,
        DxExport,
        //DxButton
    } from 'devextreme-vue/data-grid';

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'PrestadoresBiomeek',
        components: {
            DxDataGrid,
            DxFilterRow,
            DxGrouping,
            DxGroupPanel,
            DxColumn,
            DxPaging,
            DxExport,
            //DxButton,
        },
        data: () => ({
            fornecedores: [],
            tipoSelecionado: null,
        }),
        created() {

            this.$store.dispatch('setPagina', 'Prestadores')
        },
        watch: {

            tipoSelecionado: {
                deep: true,
                handler: 'getPrestadores'
            }
        },
        computed: {

            tipos() {
                
                return this.$store.getters.getTiposUsuario.filter(e => e.interno == false);
            }
        },
        methods: {

            cnpjFormatado(cnpj) {

                let x = cnpj.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
                cnpj = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');

                return cnpj;
            },
            editarFornecedor (fornecedor) {

                this.$router.push(`/adicionarUsuario/${fornecedor.codigo}/${fornecedor.cdTipoPrestador}`).catch(() => {})
            },
            async getPrestadores() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idTipoPrestador: this.tipoSelecionado
                }

                await axios.post('/api/retornaPrestadoresBiomeek', aux, getToken())
                .then(res => {

                    this.fornecedores = res.data;
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
    };
</script>

<style>

    .select {
        width: 400px;
    }
</style>