<template>
    <div>
        <v-card style="background-color: #f2f2f2;">
            <div class="text-center mb-2 pt-4">
                    <span style="font-size: 150%; font-weight: bold;">Adicionar um material</span>
            </div>
            <div class="d-flex" style="background-color: #323232;">
                <div class="ml-2 d-flex mt-2">
                    <v-text-field
                        filled
                        color='secondary'
                        background-color="white"
                        v-model="codigo"
                        placeholder="Código item"
                        class="rounded-0"
                        @keyup.enter='buscarMateriais(true)'
                    ></v-text-field>
                    <v-btn class="secondary rounded-0" dark height="57" @click="buscarMateriais(true)">
                        <v-icon>mdi mdi-magnify</v-icon>
                    </v-btn>
                </div>
                <div class="mr-2 d-flex flex-grow-1 mt-2">
                    <v-text-field
                        filled
                        color='secondary'
                        background-color="white"
                        v-model="descricao"
                        placeholder="Descrição item"
                        class="rounded-0"
                        @keyup.enter='buscarMateriais(false)'
                    ></v-text-field>
                    <v-btn class="secondary rounded-0" dark height="57" @click="buscarMateriais(false)">
                        <v-icon>mdi mdi-magnify</v-icon>
                    </v-btn>
                </div>
            </div>
            <CadastroMaterial @addMaterial='add' />
            <div class="mx-2 mt-4 pb-4">
                <dx-data-grid
                    v-if="!loading"
                    :allow-column-reordering="true"
                    :data-source="materiais"
                    :show-borders="true"
                    :two-way-data-bind="false"
                    :show-row-lines='true'
                    :hover-state-enabled='true'
                >
                    <dx-column
                        data-field="codigo"
                        caption="Cód. Material"
                        alignment="center"
                        width="140"
                    >
                    </dx-column>
                    <dx-column
                        data-field="descricao"
                        caption="Descrição"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="valorUnitario"
                        caption="Valor"
                        alignment="center"
                        width="140"
                    >
                    </dx-column>
                    <dx-column
                        caption="Adicionar"
                        alignment="center"
                        width="100"
                        cell-template="grid-cell-creation"
                    >
                    </dx-column>
                    <dx-filter-row
                        :visible="true"
                        :apply-filter="'auto'"
                        css-class="colunaStatus"
                    />
                    <dx-group-panel :visible="false"/>
                    <dx-grouping :auto-expand-all="true"/>
                    <dx-paging :page-size="5"/>
                    <template  #grid-cell-creation="{ data }">
                        <v-icon color="success" @click="add(data.data);">mdi mdi-plus</v-icon>
                    </template>
                </dx-data-grid>
                <div class="d-flex justify-center">
                    <v-progress-circular
                        v-if="loading"
                        indeterminate
                        :size="80"
                        color="#1da471"
                    ></v-progress-circular>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    import CadastroMaterial from './CadastroMaterial'

    import {
        DxDataGrid,
        //DxHeaderFilter,
        DxFilterRow,
        DxGrouping,
        DxGroupPanel,
        DxColumn,
        DxPaging,
        //DxButton
    } from 'devextreme-vue/data-grid';

    export default {
        name:'AdicionarMateriais',
        components:{
            DxDataGrid,
            DxFilterRow,
            DxGrouping,
            DxGroupPanel,
            DxColumn,
            DxPaging,
            CadastroMaterial
        },
        data: () => ({
            materiais: null,
            codigo: null,
            descricao: null,
            loading: false,
        }),
        methods: {
            add(item) {
                
                item.quantidade = 1;
                this.$emit('add', item)

                this.codigo = null
                this.descricao = null
                this.materiais = null
            },
            async buscarMateriais(flag) {

                let aux;

                this.loading = true;

                if (flag) {
                    
                    aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        cdMaterial: this.codigo
                    }

                    this.descricao = null;
                } else {

                    aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        descMaterial: this.descricao
                    }

                    this.codigo = null;
                }

                await axios.post('/api/retornaMateriaisOpme', aux, getToken())
                .then(res => {
                    
                    this.materiais = res.data
                    this.loading = false;
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

</style>