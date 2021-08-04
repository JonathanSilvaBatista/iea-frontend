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
                        file-name="SolicitacoesOPME"/>
                    <dx-column
                        data-field="idSolicitacao"
                        caption="Protocolo"
                        width="120"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="numeroGuia"
                        caption="Nº Guia"
                        width="100"
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
                        data-field="data_prazo"
                        caption="Prazo"
                        width="160"
                        data-type="date"
                        format="d/M/yyyy"
                        cell-template="grid-cell-dataPrazo"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="cdUsuarioDestino"
                        caption="Cód. Prestador"
                        width="130"
                        alignment="center"
                    >
                    </dx-column>
                    <dx-column
                        data-field="nomeUsuarioDestino"
                        caption="Prestador"
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
                    <template #grid-cell-dataPrazo="{ data }">
                        <div>
                            <span>{{ data.data.dataPrazo }}</span>
                        </div>
                    </template>
                    <template #grid-cell-prestador="{ data }">
                        <div>
                            <span> <b> {{ data.data.hospital }} </b> </span> <br>
                        </div>
                    </template>
                    <template  #grid-cell-status="{ data }">
                        <v-btn 
                            block 
                            :color="data.data.corStatus" 
                            height="60"
                            v-bind="attrs"   
                            v-on="on" 
                            style="word-wrap: break-word;"
                            @click="guia = data.data;"
                        >
                            <!-- <span style="font-size: 70%; ">{{ data.data.status }}</span> -->
                            <v-icon :color="corIcone(data.data.corStatus)" size="35">mdi mdi-open-in-new</v-icon>
                        </v-btn>
                    </template>
                </dx-data-grid>
            </template>
            <InfoGuiaOPME :guia='guia' @solicitacaoDeletada='deleteSolicitacao' @recarregarGuias='recarregarGuias' />
        </v-dialog>
    </div>
</template>

<script>

    import InfoGuiaOPME from './InfoGuiaOPME'
    import {
        DxDataGrid,
        //DxHeaderFilter,
        DxFilterRow,
        DxGrouping,
        DxGroupPanel,
        DxColumn,
        DxExport,
        DxScrolling
        //DxButton
    } from 'devextreme-vue/data-grid';

    import tinycolor from 'tinycolor2';

    export default {
        name: 'GuiasOPME',
        props: {
            guias: { type: Array, required: true }
        },
        components: {
            InfoGuiaOPME,
            DxDataGrid,
            DxFilterRow,
            DxGrouping,
            DxGroupPanel,
            DxColumn,
            DxExport,
            DxScrolling
            //DxButton,
        },
        data: () => ({
            dialog: false,
            guia: {}
        }),
        methods: {
            
            deleteSolicitacao(id) {

                let indice = this.guias.findIndex(e => e.idSolicitacao == id);

                this.guias.splice(indice, 1);
                this.dialog = false;
            },
            corIcone(status) {

                if (tinycolor(status).isLight()) 
                    return 'black';
                else
                    return 'white';
            },
            recarregarGuias() {

                this.dialog = false;
                this.$emit('refreshGuias');
            }
        }
    };
</script>

<style>
    #col {
        border: 1px solid #aaaaaa;
        background-color: white;
        /* background-color: #f7f7f7; */
    }

    #colGuia {
        border: 1px solid #aaaaaa;
        background-color: #f2f2f2;
    }

    #guia {
        position: relative;
        top: 25%;
    }

    .dx-toolbar .dx-toolbar-items-container {

        background-color: #ddd;
    }

    .dx-datagrid.dx-datagrid-borders > .dx-datagrid-header-panel {

        background-color: #ddd;
    }

    .dx-toolbar-after {

        left: 0;
    }

    .dx-button-has-icon .dx-button-content {

        padding: 12px;
    }
</style>