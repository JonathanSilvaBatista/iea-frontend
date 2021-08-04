<template>
    <div class="text-center">
        <v-dialog
            v-model="dialog"
            persistent
            width="500"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-icon 
                v-if="icon"
                color="black" 
                class="mr-4"
                v-bind="attrs"
                v-on="on"
                size="34"
            >mdi mdi-lock-reset</v-icon>
            <v-btn
                v-if="!icon"
                color="#3a89b6"
                dark
                v-bind="attrs"
                v-on="on"
                x-large
                width="250"
            >
                Alterar Senha
            </v-btn>
        </template>

        <v-card style="background-color: #ddd">
            <v-card-title class="justify-center">
                <b>Redefinir Senha</b>
            </v-card-title>
            <v-divider></v-divider>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <div style="width: 100%;" class="d-flex justify-center flex-container">
                    <h3 class="align-self-center mx-4">Nova senha:</h3>
                    <v-text-field
                        filled
                        color='success'
                        background-color="white"
                        :append-icon="show ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"
                        v-model="senha"
                        class="input-group--focused mx-4 mt-6"
                        @click:append="show = !show"
                        @keyup.enter='alterarSenha'
                    ></v-text-field>
                </div>
                <div style="width: 100%;" class="d-flex flex-container mt-n8">
                    <h3 class="align-self-center mx-4">Confirmar senha:</h3>
                    <v-text-field
                        filled
                        color='success'
                        background-color="white"
                        :append-icon="show ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"
                        v-model="senhaConfirmada"
                        class="input-group--focused mx-4 mt-6"
                        @click:append="show = !show"
                        @keyup.enter='alterarSenha'
                    ></v-text-field>
                </div>
            </v-form>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="#a41d1d"
                    text
                    @click="dialog = false"
                >
                    Cancelar
                </v-btn>
                <v-btn
                    color="#1da471"
                    text
                    @click="alterarSenha"
                >
                    Alterar
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
        name: 'AlterarSenha',
        props: {
            usuario: { type: String, default: () => '' },
            icon: { type: Boolean, default: () => false }
        },
        data: () => ({
            dialog: false,
            show: false,
            senha: '',
            senhaConfirmada: '',
            rules: {
                required: value => !!value || 'Requerido.',
                min: v => v.length >= 3 || 'Min 3 caracteres',
            },
            valid: true,
        }),
        methods: {

            async alterarSenha() {

                if (!this.$refs.form.validate()) 
                    return;

                if (this.senha != this.senhaConfirmada) {

                    alert('Senhas não coincidem!')
                    return;
                }

                let aux;

                if (this.icon) {

                    aux = {
                        cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                        usuarioObj: {
                            usuario: await this.$store.getters.getUser.cdUsuario,
                            senha: this.senhaConfirmada
                        }
                    }
                } else {

                    aux = {
                        cdUsuarioLogado: await this.$store.getters.getUser.cdUsuario,
                        usuarioObj: {
                            usuario: this.usuario,
                            senha: this.senhaConfirmada
                        }
                    }
                }

                await axios.post('/api/alteraSenhaUsuario', aux, getToken())
                .then(() => {

                    alert('Senha alterada com sucesso!')
                    this.senha = '';
                    this.senhaConfirmada = '';
                    this.dialog = false;
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