<template>
    <div class="text-center mb-6 mx-16">
        <div class="mx-10">
            <div 
                class="d-inline ml-8"
                v-for="l in legendas"
                :key="l.cor"
            >
                <v-avatar
                    :color="l.cor"
                    size="30"
                >
                </v-avatar>
                <span class="ml-3">{{ l.texto }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Legendas',
        data: () => ({
            legendas: [
                {
                    cor: '#1da471',
                    texto: 'Analisar nota fiscal'
                },
                {
                    cor: '#e97490',
                    texto: 'Resposta do fornecedor'
                },
                {
                    cor: '#fff745',
                    texto: 'Em andamento'
                },
                {
                    cor: '#ffffff',
                    texto: 'Aguardando prestador'
                },
                {
                    cor: '#3a89b6',
                    texto: 'Aguardando retorno'
                },
            ]
        })
    }
</script>

<style>

</style>