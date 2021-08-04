<template>
    <div>
        <v-dialog
            v-model="dialog"
            width="500"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    block 
                    class="mt-n6 rounded-0" 
                    dark 
                    color="#737373"
                    v-bind="attrs"
                    v-on="on"
                >Adicionar item não cadastrado</v-btn>
            </template>

            <v-card style="background-color: #f2f2f2;">
                <div class="text-center mb-2 pt-4">
                    <span style="font-size: 150%; font-weight: bold;">Cadastro de material</span>
                </div>
                <v-divider></v-divider>
                <div class="d-flex mx-10 mt-4 align-center">
                    Código: <input class="text-center campo bordaCampo ml-4" placeholder="Código" v-model="item.codigo" type="number">
                </div>
                <div class="d-flex mx-10 mt-4 align-center">
                    Descrição: <input class="text-center campo bordaCampo ml-4" placeholder="Descrição" v-model="item.descricao" type="text">
                </div>
                <div class="d-flex mx-10 my-4 align-center">
                    Valor: <input class="text-center campo bordaCampo ml-4" placeholder="Valor" v-model="item.valorUnitario" type="number">
                </div>

                <v-divider></v-divider>

                <v-card-actions>
                <v-btn
                    block 
                    class="rounded-0" 
                    dark 
                    color="#1da471"
                    @click="add"
                >Adicionar item</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: 'CadastroMaterial',
        data: () => ({
            item: {
                codigo: null,
                descricao: null,
                valorUnitario: null
            },
            dialog: false,
        }),
        methods: {
            
            add() {

                if (this.item.codigo == null || this.item.descricao == null || this.item.valorUnitario == null){

                    alert('Todos os campos devem estar preenchidos.'); 
                    return;
                }
                    
                this.$emit('addMaterial', this.item);
                this.item = {
                    codigo: null,
                    descricao: null,
                    valorUnitario: null
                }
            }
        }
    }
</script>

<style>
    .bordaCampo {
        border-style: dashed;
    }
</style>