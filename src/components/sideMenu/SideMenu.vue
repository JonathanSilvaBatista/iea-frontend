<template>
    <sidebar-menu v-if="showMenu"
        :menu="menu"
        :collapsed="collapsed"
        :width="width"
        :showOneChild="showOneChild"
        @item-click="onItemClick"
    />
</template>
<script>
    export default {
        name: 'SideMenu',
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Unimed Digital',
                        hiddenOnCollapse: true
                    },
                    {
                        hidden: null, 
                        title: 'Solicitações',
                        icon: 'mdi mdi-text-box-multiple-outline',
                        href: '/recebidas'
                    },
                    {
                        hidden: null, 
                        title: 'Solicitações OPME',
                        icon: 'mdi mdi-clipboard-plus-outline',
                        href: '/andamento'
                    },
                    {
                        hidden: null, 
                        title: 'Notas Biomeek',
                        icon: 'mdi mdi-clipboard-text-multiple-outline',
                        href: '/notasBiomeek'
                    },
                    {
                        hidden: null,
                        title: 'Prestadores',
                        icon: 'mdi mdi-account-box-multiple',
                        href: '/prestadores'
                    },
                    {
                        hidden: null,
                        title: 'Comunicados',
                        icon: 'mdi mdi-comment-alert-outline',
                        href: '/comunicacao'
                    },
                    {
                        hidden: null,
                        title: 'Gerenciar',
                        icon: 'mdi mdi-shield-account-outline',
                        child: [
                            {
                                hidden: false,
                                href: '/usuarios',
                                title: 'Usuários'
                            },
                            {
                                hidden: false,
                                href: '/tipoSolicitacao',
                                title: 'Tipos de Solicitação'
                            },
                        ]
                    },
                    {
                        hidden: null,
                        title: 'Portal do Prestador',
                        icon: 'mdi mdi-link'
                    },
                ],
                collapsed: true,
                width: '250px',
                showOneChild: true
            }
        },
        created() {

            this.recarregarPaginas();
        },
        computed: {

            tipoUsuario() {

                return this.$store.getters.getUser.tipoUsuario;
            },
            showMenu() {

                return this.$store.getters.getSideMenu;
            }
        },
        methods: {

            onItemClick(event, item, node) {

                event = node;
                node = event;
                if (item.title === 'Portal do Prestador')
                    window.open("https://www.unimed.coop.br/pctr/index.jsp?cd_canal=49098&cd_canal_selecionado=46776&erro=-2");
            },
            recarregarPaginas() {

                for(let i=1; i<this.menu.length; i++){

                    this.menu[i].hidden = this.verificarPermissao(this.menu[i].title);
                }
            },
            verificarPermissao(item){
                
                if (this.tipoUsuario === 'ADMIN')
                    return false;
                else if (this.tipoUsuario === 'RESPONSAVEL_SETOR' && item != 'Solicitações OPME' && item != 'Notas Biomeek')
                    return false;
                else if (item == 'Solicitações OPME' && this.$store.getters.getUser.opme)
                    return false;
                else if (item == 'Notas Biomeek' && this.$store.getters.getUser.opme && this.$store.getters.getUser.interno)
                    return false;
                else if (item === 'Solicitações' || item === 'Comunicados' || item === 'Portal do Prestador')
                    return false;

                return true;
            }
        },
    }
</script>

<style>
    .vsm_collapsed{
        background-color: #2a2a2e;
    }
    .vsm--icon {
        font-size: 24px;
    }
    .vsm--list {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>