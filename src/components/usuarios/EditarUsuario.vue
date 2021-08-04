<template>
    <div>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <div class="d-flex">
                <div class="d-flex flex-column align-center mt-n8">
                    <div class="d-flex">
                        <div class="mt-8">
                            <v-select
                                v-model="tipo"
                                :items="tipos"
                                :readonly='true'
                                item-text="descricao"
                                item-value="idTipoUsuario"
                                hint="Tipo de usuário"
                                persistent-hint
                                solo
                            ></v-select>
                        </div>
                        <div class="ml-16 d-flex flex-column justify-center">
                            <div v-if="interno" class="d-flex align-center mb-n4">
                                <h3>Notificação?</h3>
                                <v-switch
                                    class="ml-4"
                                    v-model="notificacao"
                                    inset
                                    color="#f57200"
                                ></v-switch>
                            </div>
                            <div class="d-flex align-center">
                                <h3 >Ativo?</h3>
                                <v-switch
                                    class="ml-4"
                                    v-model="ativo"
                                    inset
                                    color="success"
                                ></v-switch>
                            </div>
                        </div>
                    </div>
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
                    <div class="d-flex flex-container">
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
                </div>
                <div class="d-flex flex-column align-center flex-grow-1">
                    <SetoresVinculados ref="setores" :user="user" />
                    <div class="flex-grow-1 d-flex flex-column justify-end my-8">
                        <AlterarSenha :usuario='user' />
                        <v-btn
                            class="mt-10"
                            color="#1da471"
                            dark
                            x-large
                            width="250"
                            @click="salvarEdicao"
                        >
                            SALVAR
                        </v-btn>
                    </div>
                </div>
                
            </div>
        </v-form>
    </div>
</template>

<script>

    import AlterarSenha from '../shared/AlterarSenha'
    import SetoresVinculados from '../usuarios/SetoresVinculados'

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'EditarUsuario',
        components: {
            AlterarSenha,
            SetoresVinculados
        },
        props: {
            usuario: { type: String, default: () => '' },
        },
        data: () => ({
            show: false,
            password: '',
            user: '',
            rules: {
                required: value => !!value || 'Requerido.',
                min: v => v.length >= 3 || 'Min 3 caracteres',
                arroba: v => (v && v.indexOf('@')) != -1 || 'Formato de e-mail incorreto.',
                ponto: v => (v && v.indexOf('.')) != -1 || 'Formato de e-mail incorreto.'
            },
            readonly: true,
            tipo: null,
            nome: '',
            nomeFantasia: '',
            cnpj: '',
            email: '',
            ativo: false,
            notificacao: true,
            valid: true
        }),
        created() {

            this.$store.dispatch('setPagina', 'Editar usuário')

            this.getUsuario();
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

            async salvarEdicao() {

                if (!this.$refs.form.validate()) 
                    return;

                let aux = {
                    cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                    usuarioObj: {
                        usuario: this.usuario,
                        nome: this.nome,
                        cdTipoUsuario: this.tipo,
                        nomeFantasia: this.nomeFantasia,
                        cnpj: this.cnpj,
                        ativo: this.ativo,
                        email: this.email,
                        notificacao: this.notificacao
                    }
                }

                await axios.post('/api/alteraUsuario', aux, getToken())
                .then(() => {

                    alert('Usuário alterado com sucesso!')
                    this.$router.push('/usuarios').catch(() => {})
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async getUsuario() {

                let aux = {
                    cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                    usuarioObj: {
                        usuario: this.usuario
                    }
                }

                await axios.post('/api/buscaUsuario', aux, getToken())
                .then(async res => {
                    
                    this.user = res.data.usuario;
                    this.nome = res.data.nome;
                    this.nomeFantasia = res.data.nomeFantasia;
                    this.cnpj = res.data.cnpj;
                    this.tipo = res.data.cdTipoUsuario;
                    this.ativo = res.data.ativo;
                    this.email = res.data.email;
                    this.notificacao = res.data.notificacao;

                    await this.$refs.setores.getSetoresVinculados(this.user);
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
    .flex-container {
        width: 650px;
    }
</style>