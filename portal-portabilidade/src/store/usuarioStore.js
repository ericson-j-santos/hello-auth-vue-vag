import { defineStore } from 'pinia'
import axios from 'axios'

export const usuarioStore = defineStore('usuario', {
    state: () => ({
        token: '',
        usuario: [],
        usuariosUnidae: [],
    }),

    getters: {
        accessToken: state => state.token,
        matricula: state => state.usuario.matricula ?? null,
        nome: state => state.usuario?.nome ?? null,
        funcao: state => state.usuario?.funcao ?? null,
        lotacaoNome: state => state.usuario?.unidade?.nome ?? null,
        lotacao: state => state.usuario?.unidade?.lotacao_adm ?? null,
    },

    actions: {
        async fetchGetToken(token) {
            try {
                const response = await axios.get(`
                https://api.url:caixa:442/sessao/token`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
                this.token = response.data.token
                await this.fetchUsuario(response.data.matricula)
            } catch (err) {
                console.error('Erro função fetchGetToken. Status: ', err)
            }
        },

        async fetchPostToken(_data){
            try {
                const credenciaisUsuario = {
                    username: _data.username,
                    password: _data.password,
                }
                const config = {    
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
                const response = await axios.post('https://api.url:caixa:442/sessao/token', credenciaisUsuario, config)
                const data = response.data
                if (data.hasOwnProperty('access_token')) {
                    this.token = data.access_token
                    await this.fetchUsuario(_data.username)
                } else if (data.hasOwnProperty('detail')) {
                    console.log('Erro função fetchPostToken. Status: credenciais erradas', data.error)
                }
            } catch (err) {
                console.error('Erro função fetchPostToken. Status: ', err)
            }
        },
    
        async fetchUsuario(matricula) {
            try {
                const response = await axios.get(`
                https://api.url:caixa:442/cadastro_v2/usuarios/` + matricula)
                this.usuario = response.data
            } catch (err) {
                console.error('Erro função fetchUsuario. Status: ', err)
            }
        },

        async fetchLogoff() {
            try{
                const headers = {
                    Authorization: 'Bearer ' + this.accessToken,
                }; // Add a closing parenthesis here
                await axios.delete('https://api.url:caixa:442/sessao/token',  headers);
                this.usuario = [];
                this.token = '';
            } catch (err) {
                console.error('Erro função fetchLogoff. Status: ', err);
            }
        },

        async fetchUsuariosUnidade(){
            try {
                const response = await axios.get(
                'https://api.url:caixa:442/cadastro_v2/unidades/usuarios/' + this.lotacao + '?lotacao_adm=true',
                )
                this.usuariosUnidade = response.data
            } catch (err) {
                console.error('Erro função fetchUsuariosUnidade. Status: ', err)
            }
        },
    },
})

////