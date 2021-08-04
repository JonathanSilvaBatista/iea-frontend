<template>
    <div>
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
                <div>
                    <v-btn
                        v-if="!usuarioAssumido"
                        color="indigo"
                        dark
                        class="mr-10"
                        @click="assumirSolicitacao"
                    >
                        Assumir
                    </v-btn>
                    <v-btn
                        v-if="usuarioAssumido || responsavelSetor"
                        color="indigo"
                        outlined
                        v-bind="attrs"
                        v-on="on"
                    >
                        Transferência de solicitação
                    </v-btn>
                </div>
            </template>

            <v-card>
                <div class="d-flex justify-center mb-4">
                    <v-btn-toggle
                        v-model="tipoExecutante"
                        rounded
                        mandatory
                        :color="(tipoExecutante == 0) ? 'indigo' : 'teal darken-3'"
                        class="mt-2"
                    >
                        <v-btn
                        >
                            Usuário
                        </v-btn>
                        <v-btn
                        >
                            Setor
                        </v-btn>
                    </v-btn-toggle>
                </div>    
                <v-divider></v-divider>
                <div class="d-flex justify-center">
                    <div style="width: 70%;">
                        <v-text-field
                            v-model='pesquisa'
                            label="Buscar"
                            :color="(tipoExecutante == 0) ? 'indigo' : 'teal darken-3'"
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
                    <v-list v-if="tipoExecutante == 0">
                        <v-list-item
                            v-for="usuario in lista"
                            :key="usuario.usuario"
                            @click="transferirSolicitacao(usuario)"
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
                    <v-list v-else>
                        <v-list-item
                            v-for="setor in lista"
                            :key="setor.idSetor"
                            @click="transferirSolicitacao(setor)"
                        >
                            <v-list-item-avatar style="color: white;" size="50" color="teal darken-3">
                                {{ gerarAvatar(setor.descricao) }}
                            </v-list-item-avatar>

                            <v-list-item-content class="ml-1">
                                <v-list-item-title> {{ setor.descricao }} </v-list-item-title>
                                <!-- <v-list-item-subtitle class="ml-2"> {{ usuario.usuario }} </v-list-item-subtitle> -->
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-responsive>
                <v-divider></v-divider>
            </v-card>
        </v-menu>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'TransferenciaSolicitacao',
        props: {
            solicitacao: { type: Object, required: true }
        },
        data: () => ({
            menu: false,
            tipoExecutante: 1,
            pesquisa: '',
            usuarios: [],
        }),
        created() {

            this.getUsuarios();
        },
        computed: {

            lista() {

                if (this.tipoExecutante == 0) {

                    if (/^-?\d+$/.test(this.pesquisa)) //Se for um número - pesquisar pelo código
                        return this.usuarios.filter(e => e.usuario.includes(this.pesquisa));
                    else
                        return this.usuarios.filter(e => e.nome.toUpperCase().includes(this.pesquisa.toUpperCase()));
                } else {

                    return this.setores.filter(e => e.descricao.toUpperCase().includes(this.pesquisa.toUpperCase()));
                }
            },
            usuarioAssumido() {

                return this.solicitacao.cdUsuarioDestino == this.$store.getters.getUser.cdUsuario;
            },
            setores() {

                return this.$store.getters.getSetores;
            },
            responsavelSetor() {

                return this.$store.getters.getUser.tipoUsuario == 'RESPONSAVEL_SETOR';
            }
        },
        methods: {

            async assumirSolicitacao() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idUsuarioDestino: await this.$store.getters.getUser.id,
                    idSolicitacao: this.solicitacao.idSolicitacao
                }

                await axios.post('/api/transfereSolicitacao', aux, getToken())
                .then(res => {

                    let obj ={
                        usuario: aux.cdUsuario,
                        nome: res.data.nomeUsuarioDestino
                    };

                    if (res.data.nomeSetorDestino) {

                        let indice = this.setores.findIndex(e => e.descricao == res.data.nomeSetorDestino)
                        obj.idSetor = this.setores[indice].idSetor
                        obj.descricao = this.setores[indice].descricao
                    }

                    alert('Solicitação assumida com sucesso!');
                }).catch(err => {

                    if(err.response.status === 403) {
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                })

                aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.solicitacao.idSolicitacao,
                    corStatus: 'VERDE'
                }

                await axios.post('/api/alteraStatus', aux, getToken())
                .then(() => {

                    this.solicitacao.corStatus = '#1da471';
                    this.$emit('transferenciaEfetuada', true);
                })
                .catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async transferirSolicitacao(obj) {

                let aux;

                if (obj.usuario) {

                    aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        idUsuarioDestino: obj.idUsuario,
                        idSolicitacao: this.solicitacao.idSolicitacao
                    }
                } else {

                    aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        idSetorDestino: obj.idSetor,
                        idSolicitacao: this.solicitacao.idSolicitacao
                    }
                }

                await axios.post('/api/transfereSolicitacao', aux, getToken())
                .then(res => {

                    if (obj.usuario){

                        if (res.data.nomeSetorDestino) {
                            let indice = this.setores.findIndex(e => e.descricao == res.data.nomeSetorDestino)
                            obj.idSetor = this.setores[indice].idSetor
                            obj.descricao = this.setores[indice].descricao
                        }
                    } 

                    alert('Solicitação transferida com sucesso!');
                    this.menu = false;
                    this.pesquisa = '';
                    this.tipoExecutante = 1;
                    this.$emit('transferenciaEfetuada', false);
                }).catch(err => {

                    if(err.response.status === 403) {
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                })
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