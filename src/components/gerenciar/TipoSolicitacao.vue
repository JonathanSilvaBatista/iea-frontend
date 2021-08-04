<template>
    <div class="d-flex flex-column align-center">
        <v-dialog
            v-model="dialog"
            width="650"
        >
            <template v-slot:activator="{ on, attrs }">
                <div class="mb-2">
                    <v-btn
                        rounded
                        color="#1da471"
                        dark
                        v-bind="attrs"   
                        v-on="on" 
                        @click="tipo = { idTipoSolicitacao: null }"
                    >
                        <v-icon>mdi mdi-plus</v-icon>
                        <span class="ml-2">Novo Tipo</span>
                    </v-btn>
                </div>
                <dx-data-grid
                    class="mt-5"
                    :allow-column-reordering="true"
                    :data-source="tipos"
                    :show-borders="true"
                    :two-way-data-bind="false"
                    :show-column-lines='false'
                    :hover-state-enabled='true'
                    :allow-column-resizing='true'
                    width="800"
                >
                    <dx-column
                        data-field="idTipoSolicitacao"
                        caption="Cód."
                        alignment="center"
                        width="100"
                    >
                    </dx-column>
                    <dx-column
                        data-field="descricao"
                        caption="Tipo"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        caption="Editar"
                        cell-template="grid-cell-alterar"
                        alignment="center"
                        width="110"
                    >
                    </dx-column>
                    <dx-filter-row
                        :visible="true"
                        :apply-filter="'auto'"
                    />
                    <dx-paging :page-size="6"/>
                    <template  #grid-cell-alterar="{ data }">
                        <v-btn 
                            block 
                            color="#3a89b6" 
                            height="40"
                            v-bind="attrs"   
                            v-on="on" 
                            @click="tipo = { idTipoSolicitacao: data.data.idTipoSolicitacao, descricao: data.data.descricao, idSetor: data.data.idSetor }"
                        >
                            <v-icon color="white" size="30">mdi mdi-pencil-outline</v-icon>
                        </v-btn>
                    </template>
                </dx-data-grid>
            </template>
            <ModalSolicitacao :tipo='tipo' :novoTipo='novoTipo' @closeModal='dialog = false' @recarregarTipos='getTiposSolicitacao' />
        </v-dialog>
    </div>
</template>

<script>

    import ModalSolicitacao from './ModalSolicitacao'

    import {
        DxDataGrid,
        DxColumn,
        DxFilterRow,
        DxPaging
    } from 'devextreme-vue/data-grid';

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'TipoSolicitacao',
        components: {
            DxDataGrid,
            DxColumn,
            DxFilterRow,
            DxPaging,
            ModalSolicitacao
        },
        data: () => ({
            tipos: [],
            dialog: false,
            tipo: null,
            novoTipo: false
        }),
        created() {

            this.$store.dispatch('setPagina', 'Gerenciar tipos de solicitação');
            this.getTiposSolicitacao();
        },
        watch: {

            tipo() {

                if (!this.tipo.idTipoSolicitacao)
                    this.novoTipo = true;
                else
                    this.novoTipo = false;
            }
        },
        methods: {

            async getTiposSolicitacao() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario
                }

                await axios.post('/api/retornaTiposSolicitacao', aux, getToken())
                .then(res => {

                    this.tipos = res.data;
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
        }
    }
</script>

<style>

</style>