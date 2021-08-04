<template>
    <div class="justify-center">
        <v-dialog
            v-model="dialog"
            width="1250"
        >
            <template v-slot:activator="{ on, attrs }">
                <dx-data-grid
                    :allow-column-reordering="true"
                    :data-source="guias"
                    :show-borders="true"
                    :two-way-data-bind="false"
                    :show-column-lines='false'
                    :hover-state-enabled='true'
                    :allow-column-resizing='true'
                >
                    <dx-export
                        :enabled="true"
                        file-name="GuiasBiomeek"/>
                    <dx-column
                        data-field="numeroGuia"
                        caption="Guia"
                        alignment="center"
                        width="100"
                    >
                    </dx-column>
                    <dx-column
                        data-field="cdFornecedor"
                        caption="Cód. Fornecedor"
                        alignment="center"
                        width="140"
                    >
                    </dx-column>
                    <dx-column
                        data-field="fornecedor"
                        caption="Fornecedor"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="cdBeneficiario"
                        caption="Cód. Beneficiário"
                        alignment="center"
                        width="140"
                    >
                    </dx-column>
                    <dx-column
                        data-field="nomeBeneficiario"
                        caption="Beneficiário"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="hospital"
                        caption="Hospital"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        caption="Add. Solicitação"
                        alignment="center"
                        cell-template="grid-cell-creation"
                        width="150"
                    >
                    </dx-column>
                    <dx-filter-row
                        :visible="true"
                        :apply-filter="'auto'"
                        css-class="colunaStatus"
                    />
                    <dx-group-panel :visible="false"/>
                    <dx-grouping :auto-expand-all="true"/>
                    <dx-paging :page-size="8"/>
                    <template  #grid-cell-creation="{ data }">
                        <v-btn 
                            block 
                            color="#1da471" 
                            height="40"
                            v-bind="attrs"
                            v-on="on"
                            @click="guia = data.data"
                        >
                            <v-icon color="white" size="30">mdi mdi-plus</v-icon>
                        </v-btn>
                    </template>
                </dx-data-grid>
            </template>
            <CriarSolicitacaoOPME :guia='guia' @close='dialog = false' />
        </v-dialog>
    </div>
</template>

<script>

    import CriarSolicitacaoOPME from '../solicitacoesOPME/CriarSolicitacaoOPME'

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

    export default {
        name: 'GuiasBiomeek',
        props: {
            guias: { type: Array, required: true }
        },
        components: {
            CriarSolicitacaoOPME,
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
            dialog: false,
            guia: {}
        }),
    }
</script>

<style>

</style>