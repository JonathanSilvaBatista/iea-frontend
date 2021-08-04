<template>
    <div>
        <div class="d-flex justify-end mb-n3 mt-n6 mx-10">
            <v-btn
                rounded
                color="#1da471"
                dark
                @click="novoUsuario"
            >
                <v-icon>mdi mdi-plus</v-icon>
                <span class="ml-2">Novo Usuário</span>
            </v-btn>
        </div>
        <dx-data-grid
            class="mt-5"
            :allow-column-reordering="true"
            :data-source="usuarios"
            :show-borders="true"
            :two-way-data-bind="false"
            :show-column-lines='false'
            :hover-state-enabled='true'
            :allow-column-resizing='true'
        >
            <dx-export
                :enabled="true"
                file-name="Usuarios"/>
            <dx-column
                data-field="usuario"
                caption="Usuário"
                alignment="center"
            >
            </dx-column>
            <dx-column
                data-field="nome"
                caption="Nome"
                alignment="center"
            >
            </dx-column>
            <dx-column
                data-field="nomeFantasia"
                caption="Nome Fantasia"
                alignment="center"
            >
            </dx-column>
            <dx-column
                data-field="tipoUsuario"
                caption="Tipo"
                alignment="center"
            >
            </dx-column>
            <dx-column
                data-field="cnpj"
                caption="CNPJ"
                alignment="center"
                width="200"
            >
            </dx-column>
            <dx-column
                data-field="ativo"
                caption="Ativo?"
                data-type="boolean"
                cell-template="grid-cell-ativo"
                alignment="center"
                width="100"
            >
            </dx-column>
            <dx-column
                caption="Editar"
                width="100"
                cell-template="grid-cell-editar"
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
            <template  #grid-cell-ativo="{ data }">
                <v-icon :color="corAtivo(data.data.ativo)" size="25">{{ ativo(data.data.ativo) }}</v-icon>
            </template>
            <template  #grid-cell-editar="{ data }">
                <v-btn 
                    block 
                    color="#3a89b6" 
                    height="40"
                    @click="editarUsuario(data.data.usuario)"
                >
                    <v-icon color="white" size="30">mdi mdi-account-edit-outline</v-icon>
                </v-btn>
            </template>
        </dx-data-grid>
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
        name: 'Usuarios',
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
            usuarios: []
        }),
        created() {

            this.$store.dispatch('setPagina', 'Gerenciar usuários')

            this.getUsuarios()
        },
        methods: {

            editarUsuario(usuario) {

                this.$router.push(`/editarUsuario/${usuario}`).catch(() => {})
            },
            async getUsuarios() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                }

                await axios.post('/api/retornaUsuarios', aux, getToken())
                .then(res => {

                    this.usuarios = res.data;
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                }) 
            },
            novoUsuario () {

                this.$router.push(`/adicionarUsuario`).catch(() => {})
            },
            ativo(bool) {

                if (bool)
                    return 'fas fa-check';
                else 
                    return 'fas fa-times';
            },
            corAtivo(bool) {

                if (bool)
                    return '#1da471';
                else 
                    return 'red';
            }
        }
    };
</script>