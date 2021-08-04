 <template>
    <v-dialog
        v-model="dialog"
        width="1250"
        persistent
    >
        <div style="background-color: #ddd">
            <v-row class='mx-8'>
                <v-col
                    id='colGuia'
                    cols='2'
                    class="mt-4"
                >
                    <span class='ml-4'>
                        NOME: 
                    </span>
                </v-col>
                <v-col
                    id='col'
                    cols='3'
                    class="mt-4"
                >
                    <input class="campoCriar" type="text" v-model="nome">
                </v-col>
                <v-col
                    id='colGuia'
                    cols='2'
                    class="mt-4"
                >
                    <span class='ml-4'>
                        E-MAIL: 
                    </span>
                </v-col>
                <v-col
                    id='col'
                    cols='5'
                    class="mt-4"
                >
                    <input class="campoCriar" type="text" v-model="email">
                </v-col>
            </v-row>
            <v-row class='mx-8'>
                <v-col
                    id='colGuia'
                    cols='2'
                    class="mt-4"
                >
                    <span class='ml-4'>
                        DESCRIÇÃO: 
                    </span>
                </v-col>
                <v-col
                    id='col'
                    cols='10'
                    class="mt-4"
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
                    @click="criaSolicitacao"
                >
                    NOVA SOLICITAÇÃO
                </v-btn>
                <v-btn
                    color="#a41d1d"
                    dark
                    x-large
                    class="mb-4 ml-2"
                    @click="cancelar"
                >
                    CANCELAR
                </v-btn>
            </div>
        </div>
    </v-dialog>
 </template>
 
 <script>

    import axios from '../../axios' ;
    
    export default {
        name: 'Temporario',
        data: () => ({
            dialog: true,
            nome: '',
            email: '',
            descricao: ''
        }),
        created() {
            
            this.$store.dispatch('setMenuGuias', false);
            this.$store.dispatch('setSideMenu', false);
            this.$store.dispatch('setPagina', 'Login temporário');
        },
        methods: {

            validarCampos() {

                if (this.descricao.trim() == '')
                    return false;
                else if (this.nome.trim() == '')
                    return false;

                return true;
            },
            async criaSolicitacao() {

                if (!this.validarCampos()) {

                    alert('Todos os campos devem estar preenchidos.')
                    return;
                } else if (this.email.indexOf('@') == -1 || this.email.indexOf('.') == -1) {

                    alert('Formato de e-mail incorreto.')
                    return;
                }

                const aux = {
                    descricao: this.descricao, 
                    nomeSolicitanteSemLogin: this.nome,
                    emailSolicitanteSemLogin: this.email
                }

                await axios.post('/api/salvaSolicitacaoSemLogin', aux, { headers: { 'Authorization': '2c56df8ghj4D95GHJK2YF3AS6se65dG5JP' } })
                .then(res => {

                    alert('Solicitação #' + res.data.numeroSolicitacao + ' criada com sucesso!')
                    
                    this.$router.push('/').catch(()=>{});
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else
                        alert('Ocorreu um erro, por favor, contate o suporte.');
                })
            },
            cancelar() {

                this.$router.push('/').catch(()=>{})
            }
        }
    }   
 </script>