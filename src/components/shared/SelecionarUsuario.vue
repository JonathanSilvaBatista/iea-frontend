<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :max-width="600"
        :min-width="600"
        rounded="b-xl"
        :nudge-left='200'
        :nudge-bottom='50'
        transition="slide-y-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="indigo"
                dark
                x-large
                v-bind="attrs"
                v-on="on"
                class="mt-4"
            >
                Selecionar usuário destino
            </v-btn>
        </template>

        <v-card>
            <div class="d-flex justify-center">
                <div style="width: 70%;">
                    <v-text-field
                        v-model='pesquisa'
                        label="Buscar"
                        color='indigo'
                        prepend-icon="mdi mdi-magnify"
                        autocomplete="off"
                    ></v-text-field>
                </div>
            </div>
            <v-divider></v-divider>
            <v-responsive
                class="overflow-y-auto"
                max-height="260"
            >   
                <v-list>
                    <v-list-item
                        v-for="usuario in lista"
                        :key="usuario.usuario"
                        @click="selecionar(usuario)"
                    >
                        <v-list-item-avatar style="color: white;" size="50" color="indigo">
                            {{ gerarAvatar(usuario.nome) }}
                        </v-list-item-avatar>

                        <v-list-item-content class="ml-1">
                            <v-list-item-title> {{ usuario.nome }} </v-list-item-title>
                            <v-list-item-subtitle class="ml-2"> {{ usuario.usuario }} </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-responsive>
            <v-divider></v-divider>
        </v-card>
    </v-menu>
</template>

<script>
    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'SelecionarUsuario',
        data: () => ({
            menu: false,
            pesquisa: '',
            usuarios: [],
        }),
        created() {

            this.getUsuarios();
        },
        computed: {

            lista() {

                if (/^-?\d+$/.test(this.pesquisa)) //Se for um número - pesquisar pelo código
                    return this.usuarios.filter(e => e.usuario.includes(this.pesquisa));
                else
                    return this.usuarios.filter(e => e.nome.toUpperCase().includes(this.pesquisa.toUpperCase()));
            },
        },
        methods: {

            selecionar(usuario) {
                
                this.menu = false;
                this.pesquisa = '';
                this.$emit('usuarioSelecionado', usuario);
            },
            gerarAvatar(str) {

                let matches = str.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),''); 
                matches = [ 
                    matches[0], 
                    matches[1], 
                    matches[2]
                ]
                let acronym = matches.join('');

                return acronym;
            },
            async getUsuarios() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                }

                await axios.post('/api/retornaUsuariosSimplificado', aux, getToken())
                .then(res => {

                    this.usuarios = res.data;
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