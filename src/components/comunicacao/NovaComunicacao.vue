<template>
    <div class="d-flex justify-end mb-n3 mt-n6 mx-10">
        <v-dialog
            v-model="dialog"
            width="1000"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    rounded
                    color="#1da471"
                    dark
                    v-bind="attrs" 
                    v-on="on"
                >
                    <v-icon>mdi mdi-plus</v-icon>
                    <span class="ml-2">Novo Comunicado</span>
                </v-btn>
            </template>
            <div style="background-color: #ddd">
                <div class="d-flex justify-center">
                    <div class="select flex-shrink-1 mt-4">
                        <v-select
                            v-model="alvoSelecionado"
                            :items="alvos"
                            item-text="descricao"
                            item-value="idTipoUsuario"
                            solo
                            hint="Escolha o alvo do comunicado"
                            persistent-hint
                        ></v-select>
                    </div>
                </div>
                <v-row class='mx-8'>
                    <v-col
                        id='colGuia'
                        cols='2'
                        class="mt-4"
                    >
                        <span class='ml-4'>
                            TITULO: 
                        </span>
                    </v-col>
                    <v-col
                        id='col'
                        cols='10'
                        class="mt-4"
                    >
                        <input class="campoCriar" type="text" v-model="titulo">
                    </v-col>
                </v-row>
                <v-row class='mx-8'>
                    <v-col
                        id='colGuia'
                        cols='2'
                        class="mt-1"
                    >
                        <span class='ml-4'>
                            DESCRIÇÃO: 
                        </span>
                    </v-col>
                    <v-col
                        id='col'
                        cols='10'
                        class="mt-1"
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
                        @click="salvarComunicacao"
                    >
                        NOVO COMUNICADO
                    </v-btn>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken } from '../../config'

    export default {
        name: 'NovaComunicacao',
        data: () => ({
            dialog: false,
            alvoSelecionado: null,
            descricao: '',
            titulo: ''
        }),
        computed: {

            alvos() {

                let aux = this.$store.getters.getTiposUsuario;
                aux.unshift({ idTipoUsuario: null, descricao: 'TODOS' });
                return aux;
            }
        },
        methods: {

            async salvarComunicacao() {

                if (this.titulo == '' || this.descricao == '') {

                    alert('Todos os campos devem estar preenchidos.');
                    return;
                }
                
                const aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idUsuarioCriacao: await this.$store.getters.getUser.id,
                    idTipoUsuarioDestino: this.alvoSelecionado,
                    titulo: this.titulo,
                    descricao: this.descricao
                }

                await axios.post('/api/enviaComunicacao', aux, getToken())
                .then(() => {

                    alert('Novo comunicado enviado com sucesso.');
                    this.dialog = false;
                    this.$emit('recarregarComunicados');
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else if (err.response.status === 401) {
                        alert('Fornecedor não cadastrado na base de dados.')
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            }
        }
    }
</script>

<style>

</style>