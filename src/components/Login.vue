<template>
    <div id='div' class="d-flex">
        <div style="width: 460px;" class="d-flex align-center">
            <div style="width: 100%;" class="d-flex flex-column">
                <v-img
                    width="250"
                    src="../assets/imgs/unimed_digital_logo_branco.png"
                    aspect-ratio="2"
                    class="mx-auto"
                ></v-img>
                <span class="text-center text-h6 mt-n6">
                    Gestão de Prestadores
                </span>
                <v-text-field
                    label="Login"
                    :rules="loginRules"
                    hide-details="auto"
                    color="white"
                    class="mx-12 mt-10"
                    dark
                    v-model="user.usuario"
                    @keyup.enter='login'
                ></v-text-field>
                <v-text-field
                    label="Senha"
                    :append-icon="show ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
                    :rules="senhaRules"
                    :type="show ? 'text' : 'password'"
                    hide-details="auto"
                    color="white"
                    class="mx-12 mt-6"
                    dark
                    v-model="user.senha"
                    @click:append="show = !show"
                    @keyup.enter='login'
                ></v-text-field>
                <div class="d-flex justify-end">
                    <v-btn color="white" class="mx-10 mt-4" small text @click='loginTemporario'>Login temporário</v-btn>
                </div>
                <div class="d-flex justify-center">
                    <v-btn color="white" class="mt-10 mb-16" x-large @click='login'>Acessar</v-btn>
                </div>
            </div>
        </div>
        <v-img
            src="../assets/imgs/pessoas.png"
            gradient="to top right, rgba(233,228,240,.23), rgba(211,204,227,.23)"
            aspect-ratio="2"
        ></v-img>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            {{ text }}
        </v-snackbar>
    </div>
</template>

<script>

    import axios from '../axios';

    export default {
        name: 'Login',
        data: () => ({
            show: false,
            user: {
                usuario: '',
                senha: ''
            },
            loginRules: [
                value => !!value || 'Requerido.'
            ],
            senhaRules: [
                value => !!value || 'Requerido.',
                v => v.length >= 3 || 'Min 3 caracteres'
            ],
            snackbar: false,
            text: '',
            timeout: 2500,
        }),
        created() {

            this.$store.dispatch('setUser', '')
            this.$store.dispatch('setSideMenu', false)
        },
        methods: {

            loginTemporario() {
                
                this.$router.push('/temporario').catch(() => {})
            },
            async login() {

                if (this.user.usuario === '' && this.user.senha === ''){

                    this.text = 'Por favor informe suas credenciais.'
                    this.snackbar = true
                    return
                } else if (this.user.usuario === '') {

                    this.text = 'Por favor informe seu login.'
                    this.snackbar = true
                    return
                } else if (this.user.senha === '') {

                    this.text = 'Por favor informe sua senha.'
                    this.snackbar = true
                    return
                }

                return await axios.post('/api/verificaAcesso', this.user)
                .then(res => {
                    
                    let aux = {
                        id: res.data.idUsuario,
                        nome: res.data.nome,
                        tipoUsuario: res.data.tipoUsuario,
                        cdUsuario: this.user.usuario,
                        interno: res.data.interno,
                        idTipoUsuario: res.data.idTipoUsuario,
                        opme: res.data.opme
                    }

                    this.$store.dispatch('setUser', aux)
                    this.$emit('login')

                    var expire = new Date();
                    expire.setHours(expire.getHours() + 5);
                    document.cookie = "token=" + res.data.token + "; expires=" + expire;

                    if (res.data.idTermo != null) {

                        let termo = {
                            id: res.data.idTermo,
                            descricao: res.data.termo
                        }

                        this.$store.dispatch('setTermo', termo);
                    }

                    this.$router.push('/recebidas').catch(() => {})
                }).catch(() => {

                    this.text = 'Login inválido'
                    this.snackbar = true
                    this.user.senha = ''
                })
            }
        }
    };
</script>

<style>
    #div {
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        margin: auto;
        height: 100%;
        background-color: #212120;
        color: white;
    }

    .img {
        max-width: 100%;
        max-height: 100%;
    }    
</style>