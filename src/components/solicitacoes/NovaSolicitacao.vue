<template>
    <v-dialog
        v-model="dialog"
        width="1250"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                color="#1da471"
                dark
                v-bind="attrs" 
                v-on="on"
            >
                <v-icon>mdi mdi-plus</v-icon>
                <span class="ml-2">Nova Solicitação</span>
            </v-btn>
        </template>
        <div style="background-color: #ddd">
            <div class="d-flex justify-center">
                <div v-if="!interno" class="select flex-shrink-1 mt-4">
                    <v-select
                        v-model="tipoSelecionado"
                        :items="tipos"
                        item-text="descricao"
                        item-value="idTipoSolicitacao"
                        solo
                        hint="Escolha o tipo de solicitação"
                        persistent-hint
                    ></v-select>
                </div>
                <SelecionarUsuario v-if="interno" @usuarioSelecionado='usuarioSelecionado' />
            </div>
            <v-row v-if="usuario" class='mx-8 mt-6'>
                <v-col 
                    id='colGuia'
                    cols='2'
                >
                    <span class='ml-4'>
                        USUÁRIO: 
                    </span>
                </v-col>
                <v-col 
                    id='col'
                    cols='6'
                >
                    <input class="campo" type="text" readonly v-model="usuario.nome">
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
                    <input class="text-center campo" type="number" readonly v-model="usuario.usuario">
                </v-col>
            </v-row>
            <v-row class='mx-8 mt-3'>
                <v-col
                    id='colGuia'
                    cols='2'
                >
                    <span class='ml-4'>
                        DESCRIÇÃO: 
                    </span>
                </v-col>
                <v-col
                    id='col'
                    cols='10'
                >
                    <!-- <input class="campoCriar" type="text" v-model="descricao"> -->
                    <textarea class="campoCriar" type="text" v-model="descricao" rows="4" wrap="soft"> </textarea>
                </v-col>
            </v-row>
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
    </v-dialog>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    import SelecionarUsuario from '../shared/SelecionarUsuario'

    export default {
        name: 'NovaSolicitacao',
        data: () => ({
            dialog: false,
            tipos: [],
            tipoSelecionado: null,
            descricao: null,
            //codigoDestino: null,
            usuario: null
        }),
        components: {
            SelecionarUsuario
        },
        created() {

            this.getTiposSolicitacao();
        },
        computed: {

            interno() {

                return this.$store.getters.getUser.interno;
            }
        },
        methods: {

            usuarioSelecionado(usuario) {

                this.usuario = usuario;
            },
            validarCampos() {

                if (this.descricao == null || this.descricao.trim() == '')
                    return false;
                else if (this.tipoSelecionado == null && this.usuario == null)
                    return false;

                return true;
            },
            async salvarSolicitacao() {

                if (!this.validarCampos()) {

                    alert('Todos os campos devem estar preenchidos.');
                    return;
                }

                const aux = {
                    cdUsuarioSolicitante: await this.$store.getters.getUser.cdUsuario,
                    cdUsuarioDestino: (this.usuario != null) ? this.usuario.usuario : null,
                    idTipoSolicitacao: (this.tipoSelecionado != null) ? this.tipoSelecionado : 2,
                    descricao: this.descricao
                }

                await axios.post('/api/salvaSolicitacao', aux, getToken())
                .then(res => {

                    alert('Solicitação #' + res.data.numeroSolicitacao + ' criada com sucesso!')
                    this.dialog = false;
                    this.$emit('refreshGuias')
                    this.$router.push('/abertas').catch(() => {})
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
            },
            async getTiposSolicitacao() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario
                }

                await axios.post('/api/retornaTiposSolicitacao', aux, getToken())
                .then(res => {

                    this.tipos = res.data;

                    if (this.tipos.length === 0)
                        this.getTiposSolicitacao();
                    else
                        this.tipos.unshift({ idTipoSolicitacao: null, descricao: '' });
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