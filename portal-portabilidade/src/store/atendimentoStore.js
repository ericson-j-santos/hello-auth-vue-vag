import { defineStore } from "pinia"
import axios from "axios"

export const atendimentoStore = defineStore( "atendimento",{
    state: () => ({
        teste: 'teste store atendimento',
        atedimentos: [],
        telefones: [],
        arquivos: [],
    }),

    getters: {},

    actions: {
        async fetchAtendimentos(nsu) {
            try{
                const response = await axios.get(`api/url:caixa:/portabilidade/consignado/atendimentos/${nsu}`)
                this.atendimentos = response.data
            } catch(erro) {
                console.error('Erro função fetchAtendimentos. Status: ', erro.response.status)
            }
        },
        async fetchTelefones (cpf) {
            try {
                const response = await axios.get (
                    `https://api.url:caixa:442/cadastro_v2/clientes/portal/${cpf}?formato=json&prazo=5&telefone=true`,
                )
                const contatosCliente = []
        
                let telefones = ''

                response.data.forEach(contato => {
                    if (contato.numero.lenght == 9){
                        telefone = `(${contato.ddd}) ${contato.numero.substring(0,5)} - ${contato.numero.substring(5,9)}`
                    } else if (contato.numero.lenght == 8) {
                        telefone = `(${contato.ddd}) ${contato.numero.substring(0,4)} - ${contato.numero.substring(4,8)}`
                    } else {
                        telefone = `(${contato.ddd}) ${contato.numero}`
                    }
                    contatosCliente.push(telefone)
                })
                this.telefones = contatosCliente
            } catch {
                console.error('Erro função fetchTelefones. Status: ', erro.response.status)
            }
        },

        asyng fetchPostAtendimentos(nsu ,dadosAtendimento){
            try{
                await axios.post(`api.url:caixa:/portabilidade/consignado/atendimentos/${nsu}`, dadosAtendimento)
            } catch (erro) {
                console.error('Erro função fetchPostAtendimentos. Status: ', erro.response.status)
            }
        },

        async fetchArquivos(nsu){
            try{
                const response = await axios.get(`api.url:caixa:/portabilidade/consignado/anexos/${nsu}`)
                this.arquivos = response.data
            } catch (erro) {
                console.error('Erro função fetchArquivos. Status: ', erro.response.status)
            }
        },
        async fetchUpload(nsu, dadosArquivo){
            try{
                await axios.post(`api.url:caixa:/portabilidade/consignado/anexar/${nsu}`, dadosArquivo)
            } catch (erro) {
                console.error('Erro função fetchUpload. Status: ', erro.response.status)
            }
        },
        async fetchDeleteArquivo(nsu, dadosArquivo){
            try{
                await axios.delete(`api.url:caixa:/portabilidade/consignado/anexar/${nsu}`, { 
                    data: dadosArquivo,
            })
            } catch (erro) {
                console.error('Erro função fetchDeleteArquivo. Status: ', erro.response.status)
            }
        },
    },
})