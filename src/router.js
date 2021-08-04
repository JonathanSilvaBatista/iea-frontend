import Vue from 'vue';
import Router from 'vue-router';

// import Home from './components/Home';

// import Andamento from './components/solicitacoesOPME/AndamentoSolicitacoes';
// import PrazoVencido from './components/solicitacoesOPME/PrazoVencidoSolicitacoes';
// import Finalizado from './components/solicitacoesOPME/FinalizadoSolicitacoes';

// import Abertas from './components/solicitacoes/SolicitacoesAbertas';
// import Recebidas from './components/solicitacoes/SolicitacoesRecebidas';
// import AbertasSetor from './components/solicitacoes/SolicitacoesSetor';
// import SolicitacoesFinalizadas from './components/solicitacoes/SolicitacoesFinalizadas';

// //import Login from './components/Login';

// import AdicionarUsuario from './components/usuarios/AdicionarUsuario';
// import NotasBiomeek from './components/notasBiomeek/NotasBiomeek';
// import PrestadoresBiomeek from './components/usuarios/PrestadoresBiomeek';
// import Usuarios from './components/usuarios/Usuarios';
// import EditarUsuario from './components/usuarios/EditarUsuario';

// import TipoSolicitacao from './components/gerenciar/TipoSolicitacao';

// import Comunicacao from './components/comunicacao/Comunicacao';

// import Temporario from './components/temporario/Temporario'
import Conversion from './components/forms/Conversion'

Vue.use(Router);

const routes = [
    { path: '/', name: 'login', component: Conversion },
    { path: '/conversion', name: 'conversion', component: Conversion },
    { path: '/redirect-me', redirect: { name: 'login' } },
    // { path: '/home', name: Home, component: Home, 
    //     children: [
    //         //Solicitações
    //         { path: '/andamento', name: 'andamento', component: Andamento, props: true },
    //         { path: '/prazoVencido', name: 'prazoVencido', component: PrazoVencido, props: true },
    //         { path: '/finalizado', name: 'finalizado', component: Finalizado, props: true },
    //         { path: '/abertas', name: 'abertas', component: Abertas, props: true },
    //         { path: '/recebidas', name: 'recebidas', component: Recebidas, props: true },
    //         { path: '/abertasSetor', name: 'abertasSetor', component: AbertasSetor, props: true },
    //         { path: '/solicitacaoFinalizada', name: 'solicitacaoFinalizada', component: SolicitacoesFinalizadas, props: true },
    //         //Usuários
    //         { path: '/adicionarUsuario', name: 'adicionarUsuario', component: AdicionarUsuario },
    //         { path: '/adicionarUsuario/:codigo/:tipoPrestador', name: 'adicionarUsuario', component: AdicionarUsuario, props: true },
    //         { path: '/notasBiomeek', name: 'notasBiomeek', component: NotasBiomeek },
    //         { path: '/prestadores', name: 'prestadores', component: PrestadoresBiomeek },
    //         { path: '/usuarios', name: 'usuarios', component: Usuarios },
    //         { path: '/editarUsuario/:usuario', name: 'editarUsuario', component: EditarUsuario, props: true },

    //         { path: '/tipoSolicitacao', name: 'tipoSolicitacao', component: TipoSolicitacao },

    //         { path: '/comunicacao', name: 'comunicacao', component: Comunicacao },

    //         { path: '/temporario', name: 'temporario', component: Temporario },
    //     ]
    // }
    
];

export default new Router({
    routes,
});