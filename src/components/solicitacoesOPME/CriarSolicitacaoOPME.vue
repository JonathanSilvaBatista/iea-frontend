<template>
    <div style="background-color: #ddd">
        <v-row class='mx-4'>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-4'>
                    NÚMERO GUIA:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-4"
            >
                <input class="campoCriar text-center" type="number" v-model="guia.numeroGuia">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-4'>
                    DATA SOLICITAÇÃO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-4"
            >
                <input class="campoCriar text-center" type="tel" v-mask="'##/##/####'" readonly v-model="data_solicitacao">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-4"
            >
                <span class='ml-4'>
                    DATA DA CIRURGIA:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-4"
            >
                <input class="campoCriar text-center" type="tel" v-mask="'##/##/####'" v-model="guia.data_internacao">
            </v-col>
        </v-row>
        <v-row class="mx-4">
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    PRAZO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="campoCriar text-center" type="tel" v-mask="'##/##/####'" v-model="prazo">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    VENCIMENTO:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="campoCriar text-center" type="tel" v-mask="'##/##/####'" v-model="vencimento">
            </v-col>
            <v-col 
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    TIPO DE CONTA:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="campo text-center" type="text" v-model="guia.tipoConta">
            </v-col>
        </v-row>
        <v-row class='mx-4'>
            <v-col
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    FORNECEDOR:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='6'
                class="mt-2"
            >
                <input class="campoCriar" type="text" v-model="guia.fornecedor">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
                class="mt-2"
            >
                <span class='ml-4'>
                    CÓDIGO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
                class="mt-2"
            >
                <input class="text-center campoCriar" type="number" v-model="guia.cdFornecedor">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    BENEFICIÁRIO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='6'
            >
                <input class="campoCriar" type="text" v-model="guia.nomeBeneficiario">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    CÓDIGO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campoCriar" type="text" v-model="guia.cdBeneficiario">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    MÉDICO: 
                </span>
            </v-col>
            <v-col
                id='col'
                cols='6'
            >
                <input class="campoCriar" type="text" v-model="guia.nomeMedico">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-2'>
                    CÓDIGO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campoCriar" type="number" v-model="guia.cdMedico">
            </v-col>
        </v-row>
        <v-row class='mx-4 mt-2'>
            <v-col 
                id='colGuia'
                cols='2'
            >
                <span class='ml-4'>
                    HOSPITAL:
                </span>
            </v-col>
            <v-col 
                id='col'
                cols='6'
            >
                <input class="campoCriar" type="text" v-model="guia.hospital">
            </v-col>
            <v-col
                id='colGuia'
                cols='2'
            >
                <span class='ml-2'>
                    CÓDIGO:
                </span>
            </v-col>
            <v-col
                id='col'
                cols='2'
            >
                <input class="text-center campoCriar" type="number" v-model="guia.cdHospital">
            </v-col>
        </v-row>
        
        <Materiais ref="materiais" :guia='guia.numeroGuia' :fornecedor='guia.cdFornecedor' />
        <div class="text-center mt-4">
            <v-btn
                color="#1da471"
                dark
                x-large
                class="mb-4"
                @click="salvarSolicitacao"
            >
                NOVA SOLICITAÇÃO
            </v-btn>
        </div>
    </div>
</template>

<script>

    import Materiais from '../notasBiomeek/MateriaisBiomeek'

    import { addDays, endOfMonth } from 'date-fns'

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'CriarSolicitacaoOPME',
        components: {
            Materiais
        },
        props: {
            guia: { type: Object, default: () => {
                return { cdFornecedor: '', fornecedor: '', cdBeneficiario: '', nomeBeneficiario: '', cdHospital: '', hospital: '', cdMedico: '', nomeMedico: '', numeroGuia: '', data_internacao: '', data_liberacao: '', tipoConta: '' }
            } }
        },
        data: () => ({
            data_solicitacao: new Date().toISOString(),
            prazo: '',
            vencimento: '',
        }),
        created() {

            this.data_solicitacao = new Date(this.data_solicitacao).toLocaleDateString().substr(0, 10)
            this.prazo = addDays( new Date(), 10 );
            this.vencimento = endOfMonth(this.prazo);
            this.prazo = this.prazo.toISOString();
            this.prazo = new Date(this.prazo).toLocaleDateString().substr(0, 10)
            this.vencimento = this.vencimento.toISOString();
            this.vencimento = new Date(this.vencimento).toLocaleDateString().substr(0, 10)

            this.validarCampos()
        },
        methods: {

            verificaCampo(valor) {

                if (valor == '' || valor == null || !valor)
                    return true;
                
                return false;
            },
            validarCampos() {

                let flag = 0;

                if (this.verificaCampo(this.guia.numeroGuia))
                    flag++;

                if (this.verificaCampo(this.data_solicitacao))
                    flag++;
                
                if (this.verificaCampo(this.guia.data_internacao))
                    flag++;

                if (this.verificaCampo(this.prazo))
                    flag++;

                if (this.verificaCampo(this.vencimento))
                    flag++;

                if (this.verificaCampo(this.guia.fornecedor))
                    flag++;

                if (this.verificaCampo(this.guia.cdFornecedor))
                    flag++;

                if (this.verificaCampo(this.guia.nomeBeneficiario))
                    flag++;

                if (this.verificaCampo(this.guia.cdBeneficiario))
                    flag++;

                if (this.verificaCampo(this.guia.nomeMedico))
                    flag++;

                if (this.verificaCampo(this.guia.cdMedico))
                    flag++;

                if (this.verificaCampo(this.guia.hospital))
                    flag++;

                if (this.verificaCampo(this.guia.cdHospital))
                    flag++;

                if (this.verificaCampo(this.guia.tipoConta))
                    flag++;

                if (flag != 0)
                    return false;
                else    
                    return true;
            },
            async salvarSolicitacao() {

                if (!this.validarCampos()){

                    alert('Todos os campos devem ser preenchidos')
                    return;
                }

                const materiais = this.$refs.materiais.getMateriais()

                if (materiais[0] == undefined){

                    alert('Ao menos um material deve ser registrado')
                    return;
                }
    
                const aux = {
                    cdUsuarioSolicitante: await this.$store.getters.getUser.cdUsuario,
                    cdUsuarioDestino: this.guia.cdFornecedor,
                    cdBeneficiario: this.guia.cdBeneficiario,
                    nomeBeneficiario: this.guia.nomeBeneficiario,
                    numeroGuia: this.guia.numeroGuia,
                    cdMedico: this.guia.cdMedico,
                    nomeMedico: this.guia.nomeMedico,
                    cdHospital: this.guia.cdHospital,
                    hospital: this.guia.hospital,
                    data_solicitacao: this.data_solicitacao,
                    data_prazo: this.prazo,
                    data_cirurgia: this.guia.data_internacao,
                    data_vencimento: this.vencimento,
                    data_liberacaoBiomeek: this.guia.data_liberacao,
                    tipoConta: this.guia.tipoConta,
                    itemLista: materiais
                }

                await axios.post('/api/salvaSolicitacaoNF', aux, getToken())
                .then(res => {

                    alert('Solicitação #' + res.data.numeroSolicitacao + ' criada com sucesso!')
                    this.$emit('close')
                    this.$emit('refreshGuias')
                    this.$router.push('/andamento').catch(() => {})
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else if (err.response.status === 401) {
                        alert('Fornecedor não cadastrado na base de dados.')
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            }
        }
    }
</script>

<style>

    .campoCriar {
        width: 100%; 
        padding: 3px 0px 3px 5px;
    }
</style>