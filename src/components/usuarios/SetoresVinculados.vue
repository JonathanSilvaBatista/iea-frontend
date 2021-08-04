<template>
    <div class="d-flex flex-column align-center">
        <div class="d-flex mx-6">
            <v-select
                v-model="setorSelecionado"
                :items="setores"
                item-text="descricao"
                item-value="idSetor"
                solo
                persistent-hint
            ></v-select>
            <v-btn
                color="secondary"
                dark
                x-large
                width="250"
                height="50"
                @click="adicionarSetorUsuario"
            >
                Vincular setor
            </v-btn>
        </div>
        <div class="mx-10">
            <dx-data-grid
                :data-source="setoresUsuario"
                :two-way-data-bind="true"
                :show-column-lines='false'
                :hover-state-enabled='false'
            >
                <dx-column
                    data-field="centroCusto"
                    caption="Centro de Custo"
                    alignment="center"
                >
                </dx-column>
                <dx-column
                    data-field="descricao"
                    caption="Setor"
                    alignment="center"
                >
                </dx-column>
                <dx-column
                    caption="Desvincular"
                    cell-template="grid-cell-excluir"
                    alignment="center"
                    width="110"
                >
                </dx-column>
                <dx-group-panel :visible="false"/>
                <dx-grouping :auto-expand-all="true"/>
                <dx-paging :page-size="6"/>
                <template  #grid-cell-excluir="{ data }">
                    <v-btn 
                        block 
                        color="#a41d1d" 
                        height="40"
                        @click.stop="dialog = true"
                        @click="excluir = { id: data.data.idSetor, setor: data.data.descricao }"
                    >
                        <v-icon color="white" size="30">fas fa-times</v-icon>
                    </v-btn>
                </template>
            </dx-data-grid>
        </div>
        <v-dialog
            v-model="dialog"
            width="600"
        >
            <v-card>
                <v-card-title class="grey lighten-2">
                    Tem certeza que deseja desvincular esse setor ?
                </v-card-title>

                <v-card-text class="mt-5 overline font-weight-black text-center">
                    Setor: {{ excluir.setor }}
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
                        @click="excluirSetorUsuario(); dialog = false;"
                    >
                        Sim
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {
        DxDataGrid,
        DxGrouping,
        DxGroupPanel,
        DxColumn,
        DxPaging,
    } from 'devextreme-vue/data-grid';

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'SetoresVinculados',
        props: {
            user: { type: String, required: true }
        },
        components: {
            DxDataGrid,
            DxGrouping,
            DxGroupPanel,
            DxColumn,
            DxPaging,
        },
        data: () => ({
            setoresUsuario: [],
            excluir: {},
            dialog: false,
            setorSelecionado: null
        }),
        computed: {

            setores() {

                return this.$store.getters.getSetores;
            }
        },
        methods: {

            async excluirSetorUsuario() {

                let aux = {
                    cdUsuarioLogado: this.$store.getters.getUser.cdUsuario,
                    cdUsuario: this.user,
                    idSetor: this.excluir.id
                }

                await axios.post('/api/excluiSetorUsuario', aux, getToken())
                .then(() => {

                    this.getSetoresVinculados();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async adicionarSetorUsuario() {

                if (this.setorSelecionado === null){

                    alert('Por favor, selecione o setor que deseja vincular.');
                    return;
                }

                if (this.setoresUsuario.find( setor => setor.idSetor == this.setorSelecionado))
                    return;

                let aux = {
                    cdUsuarioLogado: this.$store.getters.getUser.cdUsuario,
                    cdUsuario: this.user,
                    idSetor: this.setorSelecionado
                }

                await axios.post('/api/adicionaSetorUsuario', aux, getToken())
                .then(() => {
                    
                    this.getSetoresVinculados();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async getSetoresVinculados(cod) {

                let aux = {
                    cdUsuarioLogado: this.$store.getters.getUser.cdUsuario,
                    codigoResponsavelSetor: (cod) ? cod : this.user
                }

                await axios.post('/api/retornaSetoresUsuario', aux, getToken())
                .then(res => {

                    this.setoresUsuario = res.data;
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