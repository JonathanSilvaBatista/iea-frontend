<template>
    <div class="justify-center">
        <v-dialog
            v-model="dialog"
            width="1250"
        >
            <template v-slot:activator="{ on, attrs }">
                <dx-data-grid
                    :allow-column-reordering="true"
                    :data-source="solicitacoes"
                    :show-borders="true"
                    :two-way-data-bind="false"
                    :show-column-lines='false'
                    :hover-state-enabled='true'
                    :allow-column-resizing='true'
                >
                    <dx-export
                        :enabled="true"
                        file-name="Solicitacoes"/>
                    <dx-column
                        data-field="idSolicitacao"
                        caption="Protocolo"
                        width="120"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="data_solicitacao"
                        caption="Data da Solicitação"
                        data-type="date"
                        format="d/M/yyyy"
                        cell-template="grid-cell-dataSolicitacao"
                        width="180"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="cdUsuarioDestino"
                        caption="Cód. Atribuído"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="nomeUsuarioDestino"
                        caption="Usuário Atribuído"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="tipoSolicitacao"
                        caption="Tipo de Solicitação"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        caption="Status"
                        width="150"
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
                    <DxScrolling mode="infinite"/>
                    <template #grid-cell-dataSolicitacao="{ data }">
                        <div>
                            <span>{{ data.data.dataSolicitacao }}</span>
                        </div>
                    </template>
                    <template  #grid-cell-status="{ data }">
                        <v-btn 
                            block 
                            :color="data.data.corStatus" 
                            height="60"
                            v-bind="attrs"   
                            v-on="on" 
                            @click="solicitacao = data.data;"
                        >   
                            <v-badge
                                color="#ff8400"
                                dot
                                icon
                                style="width: 90%;"
                                :value="verificarNotificacao(data.data)"
                            >
                                <v-icon :color="corIcone(data.data.corStatus)" size="35">mdi mdi-open-in-new</v-icon>
                            </v-badge>
                        </v-btn>
                    </template>
                </dx-data-grid>
            </template>
            <InfoSolicitacao :solicitacao='solicitacao' @solicitacaoDeletada='deleteSolicitacao' @refreshGuias='refreshGuias' />
        </v-dialog>
    </div>
</template>

<script>

    import InfoSolicitacao from './InfoSolicitacao'

    import {
        DxDataGrid,
        DxFilterRow,
        DxGrouping,
        DxGroupPanel,
        DxColumn,
        DxExport,
        DxScrolling
    } from 'devextreme-vue/data-grid';

    import tinycolor from 'tinycolor2';

    export default {
        name: 'GridSolicitacoes',
        props: {
            solicitacoes: { type: Array, required: true }
        },
        components: {
            DxDataGrid,
            DxFilterRow,
            DxGrouping,
            DxGroupPanel,
            DxColumn,
            DxExport,
            DxScrolling,
            InfoSolicitacao
        },
        data: () => ({
            dialog: false,
            solicitacao: {}
        }),
        methods: {
            
            verificarNotificacao(soli) {

                const user = this.$store.getters.getUser.cdUsuario;

                if (soli.alteracaoUsuarioDestino && user === soli.cdUsuarioDestino)
                    return true;
                else if (soli.alteracaoUsuarioSolicitante && user === soli.cdUsuarioSolicitante)
                    return true;
                
                return false;
            },
            deleteSolicitacao(id) {

                let indice = this.solicitacoes.findIndex(e => e.idSolicitacao == id);

                this.solicitacoes.splice(indice, 1);
                this.dialog = false;
            },
            corIcone(status) {

                if (tinycolor(status).isLight()) 
                    return 'black';
                else
                    return 'white';
            },
            refreshGuias() {

                this.dialog = false;
                this.$emit('refreshGuias');
            }
        }
    }
</script>