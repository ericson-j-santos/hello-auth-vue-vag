import { defineStore } from 'pinia'
import axios from 'axios'

export const demandaStore = defineStore('demanda', {
    state () {
        return {
            motivosFechamento: [],
            situacoesSIGEC: [],
            situacoesDemanda: [],
            dadosConsulta: [],
            tipoDemanda: [],
            demandasConsulta: [],
            loadingDataTable: false,
            demandasAbertas: [],
            dadosDemanda: [],
            taxasConvenente: [],
            dadosContrato: [],
            motivosAtendimentoForm: [],
            informacoesTed: [],
        }
    },
    getters: {},

    actions: {
        setTipoDemanda(tipo) {
            this.tipoDemanda = tipo
        },

        setDadosConsulta(dados){
            this.dadosConsulta = dados
        },

        async fechMotivosFechamento(tipo){
            try {
                const response = await axios.get(`api.url:caixa:/portabilidade/consignado/motivosFechamento`)
                const data = response.data

                if (!tipo) {
                    this.motivosFechamento = data
                } else {
                    let result = data.filter(item => item.MotivosBloco == tipo)
                    this.motivosFechamento = result
                }
            } catch (err) {
                console.error('Erro função fechMotivosFechamento. Status: ', err)
            }
        },

        async fechSituacoesSIGEC(){
            try {
                const response = await axios.get(`api.url:caixa:/portabilidade/consignado/motivos/sigec`)
                this.situacoesSIGEC = response.data
            } catch (err) {
                console.error('Erro função fechSituacoesSIGEC. Status: ', err)
            }
        },

        async fechSituacoesDemanda(){
            try {
                const response = await axios.get(`api.url:caixa:/portabilidade/retencao/filtro/situacoes`)
                this.situacoesDemanda = response.data
            } catch (err) {
                console.error('Erro função fechSituacoesDemanda. Status: ', err)
            }
        },

        //metodo abaixo deve ser adaptado para usar componente data table - server side (src\views\Prospeccao.vue)
        async fechConsulta(filtroBusca){
            try {
                this.loadingDataTable = true
                this.demandasConsulta = []
                const dataFiltro = []
                let pagina = 1
                let totalPaginas = null

                Object.keys(filtroBusca).forEach(filtro => {
                    if(!!filtroBusca[filtro]){
                        dataFiltro.push({campo: filtro, valor: filtroBusca[filtro]})
                    }
                })

                const demandasFiltradas = []
                do {
                    const response = await axios.get(`api.url:caixa:/portabilidade/retencao/demandas`, {
                        params: {
                            filtros: JSON.stringify(dataFiltro),
                            pagina,
                        },
                    })

                    const demandas = response.data.demandas
                    demandas.forEach(demanda => demandasFiltradas.push(demanda))

                    totalPaginas = Math.ceil(response.data.quantidade / 10)
                    pagina++
                } while (pagina <= totalPaginas)

                this.demandasConsulta = demandasFiltradas.map(demanda => {
                    const dataVencimentoDemanda = new Date(demanda.DemandaDataPrazo)
                    const dataFechamentoDemanda = demanda.DemandaDataFinal ? new Date(demanda.DemandaDataFinal) : null
                    if (dataFechamentoDemanda) {
                        dataFechamentoDemanda.setHours(0,0,0,0)
                    }

                    const fechadaAntesPrazo = 
                        dataVencimentoDemanda && dataFechamentoDemanda ?  dataFechamentoDemanda <= dataVencimentoDemanda : false

                    const diferencaDataPrazo = this.calcularDiferencaEmDias(dataVencimentoDemanda, dataFechamentoDemanda)

                    let status = ''
                    if (fechadaAntesPrazo) {
                        status = 'secondary'
                    } else if (diferencaDataPrazo > 0 && !dataFechamentoDemanda) {
                        status = 'sucess'
                    } else if (diferencaDataPrazo == 0 && !dataFechamentoDemanda) {
                        status = 'warning'
                    } else if (diferencaDataPrazo < 0 && !dataFechamentoDemanda) {
                        status = 'error'
                    } else if (!fechadaAntesPrazo){
                        status = 'primary'
                    }

                    demanda['DiferencaDataPrazo'] = diferencaDataPrazo
                    demanda['Status'] = status
                    return demanda
                })

                this.loadingDataTable = false
            } catch (erro) {
                console.error('Erro função fechConsulta. Status: ', erro)
            }
        },

        async fetchFinalizarDemandas(demandaFinalizada){
            try {
                await axios.post(`http://localhost:3000/demandasFinalizadas`, demandaFinalizada)
            } catch (erro) {
                console.error('Erro função fetchFinalizarDemandas. Status: ', erro)
            }
        }, 

        async fetchDemandarResponsavel(empregado){
            try {
                //obs: api de listagem está em desenvolvimento. Dessa forma, simulamos uma api com biblioteca JSON-server.
                await axios.post(`http://localhost:3000/demandasVinculadas`, empregado)
            } catch (erro) {
                console.error('Erro função fetchDemandarResponsavel. Status: ', erro)
            }
        },

        async fetchEnviarTED(nsu, matricula, senha){
            // portela pediu pra essa funcionalidade ficar comentada, irá avaliar se será implementada
            // thiago usou essa api, enteder ela `https://api.url:caixa:000/portabilidade/consignado/teds/` + nsu
            try {
                const dadosTed = { nsu, matricula, senha }
                await axios.post(`http://localhost:3000/teds`, dadosTed)
            } catch (erro) {
                console.error('Erro função fetchEnviarTED. Status: ', erro)
            }
        },

        async fetchDemandasAbertas(_data) {
            // retorna objeto com demandas (array) para aquele cliente
        try {
            const response = await axios.get(`https://localhost:3000/portabilidade/retencao/consignado/cliente/${_data.cpf}`,
            { headers: { Authorization: `Bearer ${_data.token}` } },
            )
            this.demandasAbertas = response.data
        } catch (error) {
            let errorData
            switch (error.response.status) {
                case 401:
                    errorData = { demandas: [], total: 0, error: 'Erro de autenticação (Credencial inválida)' }
                    break
                case 422: 
                    errorData = { demandas: [], total: 0, error: 'CPF informado está em formato inválido' }
                    break
                default:
                    errorData = {
                        demandas: [],
                        total: 0,
                        error: 'Erro de conexão com a api de demandas abertas. Tente novamente',
                    } 
        }
        this.demandasAbertas = errorData
        }
    },

    async fetchDadosDemanda(nsu) {
        //retorna dados de uma demanda p/ um nsu
        // nsu = '10937605' // '10937605' // para teste.. outras '10941516' 10937605 (teste p/ motivo adicional) 11008190 10974974
        try {
            const response = await axios.get(
                `https://caixa:000/portabilidade/gecsi/consignado/${nsu}?origem=portal`,
            )
            const data = response.data
            data.idadeAnoMes = this.idadeAnoMes(data.portal.ClienteDataNascimento)
            this.dadosDemanda = data
        } catch (erro) {
            console.error('Erro função fetchDadosDemanda. Status: ', erro.response.status)
        }
    },

    async fetchTaxaConvenente(dados) {
        try {
            const response = await axios.get(
                `https://api.url:caixa:000/portabilidade/retencao/taxas/demanda/${dados.nsu}/${dados.convenente}/${dados.matricula}`,
            )
            this.taxasConvenente = response.data
        } catch (erro) {
            console.error('Erro função fetchTaxasConvenente. Status: ', erro.response.status)
        }
    },

    async fetchContrato (nsu){
        try {
            const response = await axios.get(
                `https://api.url:caixa:000/portabilidade/consignado/contrato/siapx/${nsu}`)
                this.dadosContrato = response.data
        } catch (erro) {
            console.error('Erro função fetchContrato. Status: ', erro.response.status)
        }
    },

    async fetchValoresApurados(nsu){
        try {
            const response = await axios.get(
                `https://api.url:caixa:000/portabilidade/retencao/calcula/apura_valores_outra_if/${nsu}`,
            )
            this.valoresApurados = response.data
        } catch (erro) {
            console.error('Erro função fetchValoresApurados. Status: ', erro.response.status)
        }
    },

    async fetchMotivosAtendimentoForm(){
        try {
            const response = await axios.get(
                `https://api.url:caixa:000/portabilidade/consignado/motivos_atendimento`)
            this.motivosAtendimentoForm = response.data.map(motivo => motivo.valor)
        } catch (erro) {
            console.error('Erro função fetchMotivosAtendimentoForm. Status: ', erro.response.status)
        }
    },

    async fetchDadosTed(nsuFebraban){
        try {
            nsuFebraban = '202402080000298300359' // para teste apenas
            const response = await axios.get(
                `https://api.url:caixa:000/portabilidade/retencao/ted_recebida/${nsuFebraban}`)
            this.informacoesTed = response.data
        } catch  {
            console.error('Erro função fetchDadosTed. Status: ')
        }
    },

    idadeAnoMes(dataNascimento){
        if(!dataNascimento) return null
        const dataNasc = new Date(dataNascimento)
        const hoje = new Date()
        let anos = hoje.getGetFullYear() - dataNasc.getFullYear()
        let meses = hoje.getMonth() - dataNasc.getMonth()
        let dias = hoje.getDate() - dataNasc.getDate()
        if (dias < 0 ) meses--
        if(meses < 0 || (meses === 0 && dias < 0)){
            anos--
            meses = (meses + 12) % 12
        }
        return `${anos} anos${meses > 0 ? ` e ${meses} meses` : ''}`
        },

        calcularDiferencaEmDias(dataVencimento, dataFinalizacao){
            let hoje = new Date()
            hoje.setHours(0,0,0,0)

            let diferencaEmMilissegundos = !!dataFinalizacao ? dataVencimento - dataFinalizacao : hoje - dataVencimento

            let diferencaEmDias = diferencaEmMilissegundos / (1000 * 3600 * 24)
            diferencaEmDias = Math.round(diferencaEmDias)
            return -diferencaEmDias
    },
},
})

