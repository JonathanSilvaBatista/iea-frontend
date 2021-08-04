<template>
    <div>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <div>
                <div class="d-flex justify-center">
                    <div v-if="showTipo" class="d-flex align-center">
                        <v-select
                            v-model="tipo"
                            :items="tipos"
                            item-text="descricao"
                            item-value="idTipoUsuario"
                            hint="Tipo de usuário"
                            persistent-hint
                            solo
                        ></v-select>
                    </div>
                    <div v-if="interno" class="ml-16 d-flex flex-column">
                        <h3>Notificação?</h3>
                        <v-switch
                            class="ml-4 align-self-center"
                            v-model="notificacao"
                            inset
                            color="#f57200"
                        ></v-switch>
                    </div>
                </div>
            </div>
            <div class="d-flex mt-6">
                <div class="d-flex flex-column justify-space-around">
                    <div v-if="!interno" class="d-flex flex-container">
                        <h3 class="text-center mt-4 mr-6">CNPJ:</h3>
                        <v-text-field
                            filled
                            color='success'
                            :readonly='readonly'
                            :rules="[rules.required]"
                            background-color="white"
                            v-model="cnpj"
                            v-mask="'##.###.###/####-##'"
                        ></v-text-field>
                    </div>
                    <div class="d-flex flex-container">
                        <h3 class="text-center mt-4 mr-6">E-mail:</h3>
                        <v-text-field
                            filled
                            color='success'
                            :rules="[rules.required, rules.arroba, rules.ponto]"
                            background-color="white"
                            v-model="email"
                        ></v-text-field>
                    </div>
                    <div class="d-flex flex-container">
                        <h3 class="text-center mt-4 mr-6">Nome:</h3>
                        <v-text-field
                            filled
                            color='success'
                            :readonly='readonly'
                            :rules="[rules.required]"
                            background-color="white"
                            v-model="nome"
                        ></v-text-field>
                    </div>
                    <div class="d-flex flex-container">
                        <h3 class="text-center mt-4 mr-6">Nome Fantasia:</h3>
                        <v-text-field
                            filled
                            color='success'
                            background-color="white"
                            v-model="nomeFantasia"
                        ></v-text-field>
                    </div>
                </div>
                <div class="d-flex flex-column flex-grow-1 ml-10">
                    <div class="d-flex">
                        <h3 class="text-center mt-4 mr-6">Usuário:</h3>
                        <v-text-field
                            filled
                            :readonly='readonly'
                            color='success'
                            :rules="[rules.required]"
                            background-color="white"
                            v-model="user"
                        ></v-text-field>
                    </div>
                    <div class="d-flex">
                        <h3 class="text-center mt-4 mr-6">Senha:</h3>
                        <v-text-field
                            filled
                            color='success'
                            background-color="white"
                            :append-icon="show ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
                            :rules="[rules.required, rules.min]"
                            :type="show ? 'text' : 'password'"
                            v-model="password"
                            class="input-group--focused mt-2"
                            @click:append="show = !show"
                        ></v-text-field>
                    </div>
                    <v-btn
                        color="#1da471"
                        dark
                        x-large
                        width="250"
                        class="align-self-center"
                        @click="addUsuario"
                    >
                        Adicionar
                    </v-btn>
                </div>
            </div>
        </v-form>
        <v-dialog
            v-model="dialog"
            persistent
            width="500"
        >
            <v-card>
                <v-card-title class="grey lighten-2">
                    Deseja vincular algum setor a esse usuário?
                </v-card-title>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    text
                    @click="direcionarPágina('N')"
                >
                    Não
                </v-btn>
                <v-btn
                    color="error"
                    text
                    @click="direcionarPágina('S')"
                >
                    Sim
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'AdicionarUsuario',
        props: {
            codigo: { type: String, default: () => ''},
            tipoPrestador: { type: String, default: () => '' }
        },
        data: () => ({
            show: false,
            password: '',
            user: '',
            rules: {
                required: value => !!value || 'Requerido.',
                min: v => v.length >= 3 || 'Min 3 caracteres.',
                arroba: v => (v && v.indexOf('@')) != -1 || 'Formato de e-mail incorreto.',
                ponto: v => (v && v.indexOf('.')) != -1 || 'Formato de e-mail incorreto.'
            },
            readonly: true,
            showTipo: false,
            tipo: null,
            cnpj: '',
            email: '',
            nome: '',
            nomeFantasia: '',
            notificacao: true,
            valid: true,
            dialog: false
        }),
        created() {

            this.$store.dispatch('setPagina', 'Adicionar usuário')

            if (this.codigo == ''){

                this.readonly = false
                this.showTipo = true
            } else {

                this.getFornecedor()
            }
        },
        computed: {

            interno() {

                let aux = this.tipos.findIndex(tipo => tipo.idTipoUsuario == this.tipo)

                if (aux > -1 && aux < this.tipos.length) {
                    
                    return this.tipos[aux].interno;
                }

                return false;
            },
            tipos() {

                return this.$store.getters.getTiposUsuario;
            }
        },
        methods: {

            direcionarPágina(opcao) {

                if (opcao === 'S') 
                    this.$router.push(`/editarUsuario/${this.user}`).catch(() => {});
                else
                    this.$router.push('/usuarios').catch(() => {});
            },
            async getFornecedor() {

                console.log(this.tipoPrestador);

                let aux = {
                    cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                    codigoPrestador: this.codigo,
                    cdTipoPrestador: this.tipoPrestador
                }

                await axios.post('/api/retornaDetalhesPrestador', aux, getToken())
                .then(res => {

                    this.user = res.data.codigo
                    this.nomeFantasia = res.data.nomeFantasia
                    this.nome = res.data.nome
                    this.cnpj = res.data.cpf_cnpj
                    this.email = res.data.email
                    this.tipo = res.data.idTipoUsuario
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async addUsuario() {

                if (!this.$refs.form.validate()) 
                    return;
                
                let aux;

                if (this.interno) {

                    aux = {
                        cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                        usuarioObj: {
                            usuario: this.user,
                            nome: this.nome,
                            cdTipoUsuario: this.tipo,
                            nomeFantasia: this.nomeFantasia,
                            senha: this.password,
                            email: this.email,
                            notificacao: this.notificacao
                        }
                    }
                } else {

                    aux = {
                        cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                        usuarioObj: {
                            usuario: this.user,
                            nome: this.nome,
                            cdTipoUsuario: this.tipo,
                            nomeFantasia: this.nomeFantasia,
                            senha: this.password,
                            email: this.email,
                            cnpj: this.cnpj
                        }
                    }
                }

                let indice = this.tipos.findIndex(tipo => tipo.idTipoUsuario == this.tipo);

                await axios.post('/api/salvaUsuario', aux, getToken())
                .then(() => {

                    if (this.tipos[indice].descricao == 'RESPONSAVEL_SETOR')
                        this.dialog = true;
                    else {

                        alert('Usuário salvo com sucesso!')
                        this.$router.push('/usuarios').catch(() => {})
                    }
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
    .flex-container {
        width: 650px;
    }
</style>