<template>
    <div>
        <SideMenu />
        <AppHeader :showMenu='showMenu' :pages='opcoes' :rota='rota' />
        <v-main app>
            <v-container class='mt-16 margin0'>
                <router-view :solicitacoes='solicitacoes' :solicitacoesOPME='solicitacoesOPME' />
            </v-container>
        </v-main>
        <TermoAceite v-if="!temporario" />
    </div>
</template>

<script>
    import SideMenu from './sideMenu/SideMenu'
    import AppHeader from './header/AppHeader'

    import TermoAceite from './shared/TermoAceite'

    import axios from '../axios';
    import { getToken } from '../config';

    export default {
        name: 'Home',
        components: {
            SideMenu,
            AppHeader,
            TermoAceite
        },
        data: () => ({
            showMenu: false,
            opcoes: [],
            rota: '',
            solicitacoes: [],
            solicitacoesOPME: [],
            qtdSolicitacoes: {
                andamento: 0,
                prazoVencido: 0,
                finalizado: 0
            }
        }),
        provide() {
            return {
                getSolicitacoes: this.getSolicitacoes,
                getSolicitacoesNF: this.getSolicitacoesNF
            }
        },
        async created(){

            if(typeof this.$store.getters.getUser === 'undefined'){
                alert('Por favor, faça login para acesso ao sistema.');
                this.$router.push('/redirect-me');
            }

            if (!this.temporario) {

                await this.getSolicitacoes();

                await this.getTiposUsuarios();
                this.getSetores();

                this.verificarRota();
            }
        },
        computed: {

            temporario() {

                return this.$store.getters.getUser == '';
            }
        },
        watch: {

            qtdSolicitacoes() {

                this.opcoes = [
                    { page: '(' + this.qtdSolicitacoes.andamento + ') Andamento', icon: 'mdi mdi-monitor', route: '/andamento' },
                    { page: '(' + this.qtdSolicitacoes.prazoVencido + ') Prazo Vencido', icon: 'mdi mdi-calendar-clock', route: '/prazoVencido' },
                    { page: '(' + this.qtdSolicitacoes.finalizado + ') Finalizado', icon: 'mdi mdi-check-circle-outline', route: '/finalizado' },
                ]
            }
        },
        beforeRouteUpdate(to, from, next) {

            if (to.path == '/recebidas' && from.path != '/abertas' && from.path != '/abertasSetor' && from.path != '/solicitacaoFinalizada')
                this.getSolicitacoes();
            else if (to.path == '/andamento' && from.path != '/prazoVencido' && from.path != '/finalizado')
                this.getSolicitacoesNF();

            this.verificarRota(to.path)

            next();
        },
        methods: {

            async getSetores() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario
                }

                await axios.post('/api/retornaSetores', aux, getToken())
                .then(res => {

                    this.$store.dispatch('setSetores', res.data);
                }).catch(err => {

                    if(err.response.status === 403){

                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                })
            },
            async getTiposUsuarios() {

                let aux = {
                    cdUsuario: this.$store.getters.getUser.cdUsuario
                }

                await axios.post('/api/retornaTiposUsuario', aux, getToken())
                .then(res => {

                    this.$store.dispatch('setTiposUsuario', res.data);
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            verificarRota(to) {

                if (!to)
                    to = this.$router.currentRoute.fullPath;

                if (to == '/andamento' || to == '/prazoVencido' || to == '/finalizado') {
              
                    this.showMenu = true;
                    this.opcoes = [
                        { page: '(' + this.qtdSolicitacoes.andamento + ') Andamento', icon: 'mdi mdi-monitor', route: '/andamento' },
                        { page: '(' + this.qtdSolicitacoes.prazoVencido + ') Prazo Vencido', icon: 'mdi mdi-calendar-clock', route: '/prazoVencido' },
                        { page: '(' + this.qtdSolicitacoes.finalizado + ') Finalizado', icon: 'mdi mdi-check-circle-outline', route: '/finalizado' },
                    ]
                } else if (to == '/abertas' || to == '/recebidas' || to == '/abertasSetor' || to == '/solicitacaoFinalizada') {

                    this.showMenu = true;
                    this.opcoes = [
                        { page: 'Recebidas', icon: 'mdi mdi-import', route: '/recebidas' },
                        { page: 'Minhas Solicitações', icon: 'mdi mdi-monitor', route: '/abertas' },
                        { page: 'Finalizadas', icon: 'mdi mdi-check-circle-outline', route: '/solicitacaoFinalizada' },
                    ]

                    if (this.$store.getters.getUser.interno)
                        this.opcoes.push({ page: 'Abertas Setor', icon: 'mdi mdi-animation', route: '/abertasSetor' });
                } else
                    this.showMenu = false;

                this.rota = to;
            },
            async getSolicitacoes() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                }

                await axios.post('/api/retornaSolicitacoes', aux, getToken())
                .then(res => {
                    
                    this.solicitacoes = res.data.map(solicitacao => {

                        if (typeof(solicitacao.data_solicitacao) == 'string') {

                            let [day, month, year] = solicitacao.data_solicitacao.split('/')

                            solicitacao.dataSolicitacao = solicitacao.data_solicitacao
                            solicitacao.data_solicitacao = new Date(year, (month-1), day)

                        } 
                        
                        return solicitacao;
                    });
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                }) 
            },
            async getSolicitacoesNF() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                }

                await axios.post('/api/retornaSolicitacoesNF', aux, getToken())
                .then(res => {

                    this.qtdSolicitacoes = {
                        andamento: res.data.qntAndamento,
                        prazoVencido: res.data.qntVencidos,
                        finalizado: res.data.qntFinalizados
                    };

                    this.solicitacoesOPME = res.data.solicitacaoNFLista.map(solicitacao => {

                        if (typeof(solicitacao.data_prazo) == 'string'){

                            let [day, month, year] = solicitacao.data_prazo.split('/')

                            let date = solicitacao.data_solicitacao.split('/')
                            solicitacao.dataSolicitacao = solicitacao.data_solicitacao
                            solicitacao.data_solicitacao = new Date(date[2] + '-' + date[1] + '-' + date[0] + ' 00:00:00')

                            solicitacao.dataPrazo = solicitacao.data_prazo
                            solicitacao.data_prazo = new Date(year, (month-1), day)
                        }
                        
                        return solicitacao;
                    });
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