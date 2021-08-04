<template>
    <div id="chat" :style='"background-color: " + ((this.interno) ? "#ddd" : "#fff") + "; position: relative;"'>
        <div class='d-inline float-right'>
            <v-btn 
                text
                @click="close"
            >
                <i class="fas fa-times"></i>
            </v-btn>
        </div>
        <br>
        <div v-if="interno" class="d-flex justify-center mt-4">
            <div class="chatInterno rounded-pill text-center">
                CHAT INTERNO
            </div>
        </div>
        <div v-if="!interno" class="d-flex justify-center mt-4">
            <div :style="'background-color: ' + solicitacao.corStatus + '; color: ' + corFonte" class="chatHistorico rounded-pill text-center">
                HISTÓRICO
            </div>
        </div>
        <div :style="'background-color: ' + ((this.interno) ? '#ddd' : '#fff') + '; width: 92%;'" class='rounded-lg mt-6 mx-auto text-center'>
            <div v-if="!historico || historico.length == 0" class="d-flex align-center justify-center" style="height: 140px;">
                <h3>Inicie uma conversa...</h3>
            </div>
            <v-responsive
                id="scroll"
                v-if="historico && historico.length > 0"
                class="overflow-y-auto"
                min-height="140"
                :max-height="maxHeight"
            >
                <div 
                    v-for='(mensagem, i) in historico'
                    :key='i'
                    :id="'msg' + i"
                >
                    <v-sheet
                        v-if='verificarUsuario(mensagem.cdUsuario) && !verificarAnexo(mensagem.nomeAnexo)'
                        style='background-color: #a8d3c2;'
                        class='rounded-xl mt-4 float-right mr-4'
                        width="530"
                        min-height='82'
                    >
                        <div style='font-size: 80%;' class='float-right d-block mt-1 mr-4 '>
                            <span class="font-weight-black">{{ mensagem.dtInclusao }} - {{ mensagem.nomeUsuario }} </span>
                        </div>
                        <br><br>
                        <span style='font-size: 110%' class='d-block text-center mb-4 ml-2 mr-2'>
                            {{ mensagem.mensagem }}
                        </span>
                    </v-sheet>
                    <v-sheet
                        v-if='!verificarUsuario(mensagem.cdUsuario) && !verificarAnexo(mensagem.nomeAnexo)'
                        style='background-color: #ddd;'
                        class='rounded-xl mt-4 float-left ml-4'
                        width="530"
                        min-height='82'
                    >
                        <div style='font-size: 80%;' class='float-left d-block mt-1 ml-4'>
                            <b>{{ mensagem.dtInclusao }} - {{ mensagem.nomeUsuario }}</b>
                        </div>
                        <br><br>
                        <span style='font-size: 110%' class='d-block text-center mb-4 ml-2 mr-2'>
                            {{ mensagem.mensagem }}
                        </span>
                    </v-sheet>
                    <v-sheet
                        v-if='!verificarUsuario(mensagem.cdUsuario) && verificarAnexo(mensagem.nomeAnexo)'
                        style='background-color: #212121; color: white;'
                        class='rounded-xl mt-4 float-left ml-4'
                        width="530"
                        min-height='82'
                    >
                        <div style='font-size: 80%;' class='float-left d-block mt-1 ml-4'>
                            <span class="font-weight-black">{{ mensagem.dtInclusao }} - {{ mensagem.nomeUsuario }} </span>
                        </div>
                        <br><br>
                        <a id="linkArquivo" style="color: white;" class="mb-4" @click="abrirArquivo(mensagem.nomeAnexo)">ABRIR ARQUIVO</a> <br>
                    </v-sheet>
                    <v-sheet
                        v-if='verificarUsuario(mensagem.cdUsuario) && verificarAnexo(mensagem.nomeAnexo)'
                        style='background-color: #585858; color: white;'
                        class='rounded-xl mt-4 float-right mr-4'
                        width="530"
                        min-height='82'
                    >
                        <div style='font-size: 80%;' class='float-right d-block mt-1 mr-4 '>
                            <span class="font-weight-black">{{ mensagem.dtInclusao }} - {{ mensagem.nomeUsuario }} </span>
                        </div>
                        <br><br>
                        <a id="linkArquivo" style="color: white;" class="mb-4" @click="abrirArquivo(mensagem.nomeAnexo)">ABRIR ARQUIVO</a>
                    </v-sheet>
                </div>
            </v-responsive>
            <div v-if="!finalizado">
                <div class='mx-auto mt-6' style="width: 600px;">
                    <v-textarea
                        rows="4"
                        background-color='#a5e5e2'
                        color='#aaaaaa'
                        outlined
                        class='rounded-xl'
                        v-model="mensagem"
                        label="Escrever comentário..."
                    ></v-textarea>
                </div>
                <v-btn 
                    id="enviarAnexo"
                    dark
                    style='border: 1px solid #aaaaaa' 
                    color='#212121' 
                    width='200' 
                    height='60' 
                    class='rounded-xl font-weight-medium subtitle-1 mb-2 mr-4' 
                    @click="enviarArquivo"
                >
                    Enviar anexo
                    <input hidden id='input-file' type='file' @change="uploadFile"/>
                </v-btn>
                <v-btn 
                    style='border: 1px solid #aaaaaa' 
                    color='#1da471' 
                    dark  
                    width='200' 
                    height='60' 
                    class='rounded-xl font-weight-medium subtitle-1 mb-2'
                    @click="enviarMensagem"
                >
                    Enviar
                </v-btn>
            </div>
        </div>
        <br>
    </div>
</template>

<script>

    import axios from '../../axios'
    import { getToken, getOnlyToken, urls } from '../../config'

    import axiosAux from 'axios';

    import tinycolor from 'tinycolor2'

    export default {
        name: 'Chat',
        props: {
            solicitacao: { type: Object, required: true },
            interno: { type: Boolean, required: true }
        },
        data: () => ({
            dialog: false,
            mensagem: '',
            historico: []
        }),
        async created() {

            await this.getMensagens();
        },
        watch: {

            solicitacao: {
                deep: true,
                handler: 'getMensagens'
            },
            interno: {
                deep: true,
                handler: 'getMensagens'
            },
        },
        computed: {

            finalizado(){
                
                if (this.solicitacao.corStatus == '#4c4c4c' || this.solicitacao.corStatus == '#969696') 
                    return true;

                return false;
            },
            maxHeight() {

                if (this.finalizado)
                    return '580';
                else
                    return '340';
            },
            corFonte() {
                
                if (tinycolor(this.solicitacao.corStatus).isLight())
                    return 'black';
                else
                    return 'white';
            },
        },
        methods: {

            async verificarStatus() {

                if (this.solicitacao.numeroGuia && this.solicitacao.corStatus == '#ffffff' && !this.$store.getters.getUser.interno){

                    let aux = {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        idSolicitacao: this.solicitacao.idSolicitacao
                    }

                    await axios.post('/api/alteraStatus', aux, getToken())
                    .then(() => {

                        this.solicitacao.corStatus = '#fff745'
                        this.$emit('statusAlterado');
                    })
                    .catch(err => {

                        if(err.response.status === 403){
                            alert('Sua sessão expirou, por favor faça o login.')
                            this.$router.push('/redirect-me');
                        } else {
                            alert('Ocorreu um erro, por favor, contate o suporte.')
                        }
                    })
                }
            },
            verificarUsuario(codigo) {

                return this.$store.getters.getUser.cdUsuario == codigo;
            },
            verificarAnexo(anexo) {

                if (anexo)
                    return true;
                
                return false;
            },
            async abrirArquivo(arquivo) {

                const id = arquivo.split('|')[0]

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idAnexo: id.trim()
                }
                

                await axiosAux({
                    method: 'POST',
                    url: urls.baseURL + '/api/retornaAnexoPdf',
                    data: aux,
                    headers: {
                        'Authorization': getOnlyToken()
                    },
                    responseType: 'arraybuffer'
                }).then((data) => {
                    
                    if (data.headers["content-disposition"].indexOf(".pdf") > 0) {

                        let file = new Blob([data.data], {type: 'application/pdf'});
                        let fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank', "fullscreen=no");
                    } else {

                        let file = new Blob([data.data], {type: 'application/image'});
                        let fileURL = URL.createObjectURL(file);
                        let a = document.createElement('a');
                        a.href = fileURL;
                        let fileName = data.headers["content-disposition"].substr(data.headers["content-disposition"].indexOf('=') + 1, data.headers["content-disposition"].length);
                        fileName = fileName.replaceAll('"', '');
                        a.setAttribute("download", fileName);
                        a.click();
                    }
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
            verificarNotificacao() {

                const user = this.$store.getters.getUser.cdUsuario;

                if (this.solicitacao.alteracaoUsuarioDestino && user === this.solicitacao.cdUsuarioDestino)
                    this.solicitacao.alteracaoUsuarioDestino = false;
                else if (this.solicitacao.alteracaoUsuarioSolicitante && user === this.solicitacao.cdUsuarioSolicitante)
                    this.solicitacao.alteracaoUsuarioSolicitante = false;
            },
            async getMensagens() {

                let aux = {
                    cdUsuario: await this.$store.getters.getUser.cdUsuario,
                    idSolicitacao: this.solicitacao.idSolicitacao,
                    interno: this.interno
                }

                await axios.post('/api/retornaMensagensChat', aux, getToken())
                .then(res => {

                    this.historico = res.data;

                    this.verificarStatus();
                    this.verificarNotificacao();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            async enviarMensagem() {

                if (this.mensagem == '')
                    return;

                let aux = {
                    idSolicitacao: this.solicitacao.idSolicitacao,
                    itemChat: {
                        cdUsuario: await this.$store.getters.getUser.cdUsuario,
                        mensagem: this.mensagem
                    },
                    interno: this.interno
                }

                await axios.post('/api/incluiMensagemChat', aux, getToken())
                .then(async res => {

                    this.mensagem = '';

                    if (this.solicitacao.corStatus != res.data.status){

                        this.solicitacao.corStatus = res.data.status;
                        //this.$emit('statusAlterado');
                    }

                    await this.getMensagens();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            enviarArquivo() {

                document.getElementById('input-file').click()
            },
            async uploadFile(e){
                
                let file = e.target.files[0]
                const formData = new FormData()

                let cdUsuario = this.$store.getters.getUser.cdUsuario

                formData.append('file', file)
                formData.append('cdUsuario', cdUsuario)
                formData.append('idSolicitacao', this.solicitacao.idSolicitacao)
                formData.append('tipochat', (this.interno) ? 'interno' : 'externo')

                await axios.post('/api/salvaAnexo', formData, getToken())
                .then(res => {
                    
                    if (this.solicitacao.corStatus != res.data.status){

                        this.solicitacao.corStatus = res.data.status;
                        this.$emit('statusAlterado');
                    }

                    this.getMensagens();
                }).catch(err => {

                    if(err.response.status === 403){
                        alert('Sua sessão expirou, por favor faça o login.')
                        this.$router.push('/redirect-me');
                    } else {
                        alert('Ocorreu um erro, por favor, contate o suporte.')
                    }
                })
            },
            close() {

                this.$emit('close');
            }
        }
    }
</script>

<style>
    .chatHistorico {
        width: 80%;
        height: 33px;
        border: 1px solid #4e4e4e;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .chatInterno {
        background-color: #fff;
        width: 80%;
        height: 33px;
        border: 1px solid #4e4e4e;
        color: rgb(146, 146, 146);
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>