import feathersClient from "../../feathers-client";

const state = {
    login: false,
    self: '',
}

const mutations = {
    login(state, id) {
        state.self = id;
        state.login = true;
    },
    logout(state) {
        state.login = false;
    }

}

const actions = {
    login({commit}, accessToken){
        return feathersClient.reAuthenticate()
            .catch(()=>feathersClient.authenticate({
                'strategy': 'jwt',
                'accessToken': accessToken
            })).then((res) => {
                commit('login',res.id)
            });
    }
    
};

const plugin = (store)=>{
    feathersClient.reAuthenticate()
        .then((res)=>{
            store.commit('login/login',res.id);
        }).catch(()=> {
            store.commit('login/logout');
        })
}

export default {namespaced: true ,state, mutations, actions, plugin};