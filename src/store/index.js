import Vue from 'vue'
import Vuex from 'vuex'
import Api from '../utils/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	allPersons: null,
    relatives: null,
    selectedPersonId: null,
  },

  getters: {
  	persons: (state) => {
    	return state.allPersons? state.allPersons.map( i => Object.assign({}, i)): null
    },
    personDataById: (state) => (id) => {
      const personData = state.allPersons.filter(i => i.id === id)[0] || {}

      return Object.assign({}, personData)
    },
    relativesById: (state) => (id) => {
      const persons = []

      if (state.relatives[id]) {
        state.relatives[id].forEach( k => {
          persons.push( Object.assign({}, state.allPersons.filter(i => i.id === k)[0]))
        })        
      }

      return persons
    },
    nonRelativesById: (state) => (id) => {
      if (state.relatives[id]) {
        return state.allPersons
          .filter( i => (state.relatives[id].indexOf(i.id) === -1 && i.id !== id))
          .map( i => Object.assign({}, i)) 
      } else {
        return state.allPersons.map( i => Object.assign({}, i))        
      }
    },
    allId: (state) => state.allPersons? state.allPersons.map( i => i.id): null,
    selectedPersonId: (state) => state.selectedPersonId,
  },
  
  mutations: {
    SET_SELECTED_PERSON_ID (state, id) {
      state.selectedPersonId = id      
    },
    SET_DATA_LOCALLY (state, obj) {
      state.allPersons = obj.allPersons
      state.relatives = obj.relatives
    },
    ADD_NEW_PERSON(state, obj) {
      state.allPersons.push(obj)
      let newPers = { [obj.id]: []}

      state.relatives = Object.assign({}, state.relatives, newPers)
    },
    UPDATE_PERSON_DATA(state, obj) {
      let num

      state.allPersons.forEach( (item, ind) => {
        if(obj.id === item.id) num = ind
      })
      state.allPersons.splice(num, 1, obj)
    },
    DELETE_SELECTED_PERSON(state, id) {
      let num

      state.allPersons.forEach( (item, ind) => {
        if(id === item.id) num = ind
      })
      state.allPersons.splice(num, 1)
      if ( state.selectedPersonId === id ) state.selectedPersonId = null
      
      // Clen up all relations of deleted person
      delete state.relatives[id]
      Object.keys(state.relatives).forEach(key => {
        let num = -1

        state.relatives[key].forEach( (item, ind) => {
          if(item === id) num = ind  
        })
        if(num === -1) return
        state.relatives[key].splice(num, 1)    
      })
    },
    ADD_NEW_RELATIVE(state, obj) {
      state.relatives[obj.mainId].push(obj.newRelativeId)
      state.relatives[obj.newRelativeId].push(obj.mainId)
    },
    DELETE_RELATIVE(state, obj) {
      let num = -1

      state.relatives[obj.mainId].forEach( (item, ind) => {
        if(obj.relativeId === item) num = ind
      })
      state.relatives[obj.mainId].splice(num, 1)

      // Delete relationships from deleted relative too
      num = -1
      state.relatives[obj.relativeId].forEach( (item, ind) => {
        if(obj.mainId === item) num = ind
      })
      if(num !== -1) state.relatives[obj.relativeId].splice(num, 1)
    },
  },

  actions: {
    setSelectedPersonId({commit}, id) {
      commit('SET_SELECTED_PERSON_ID', id)
    },
    updatePersonsData({commit, state}, obj) {
      if( obj.id === 'new' ) {
        commit('ADD_NEW_PERSON', obj.data)
      } else {
        commit('UPDATE_PERSON_DATA', obj.data)
      }
      window.localStorage.setItem('projectData', JSON.stringify({
        allPersons: state.allPersons,
        relatives: state.relatives
      }))
    },

    // All actions below should be async while using real backend
    deleteSelectedPerson({commit, state}, id) {
      commit('DELETE_SELECTED_PERSON', id)
      window.localStorage.setItem('projectData', JSON.stringify({
        allPersons: state.allPersons,
        relatives: state.relatives
      }))
    },
    setNewRelative({commit, state}, obj) {
      commit('ADD_NEW_RELATIVE', obj)
      window.localStorage.setItem('projectData', JSON.stringify({
        allPersons: state.allPersons,
        relatives: state.relatives
      }))
    },
    deleteRelative({commit, state}, obj) {
      commit('DELETE_RELATIVE', obj)
      window.localStorage.setItem('projectData', JSON.stringify({
        allPersons: state.allPersons,
        relatives: state.relatives
      }))
    },

    // This action is not really async and done in this way only to show the idea
    async setAllData({commit}) {
      try {
        let projectData = window.localStorage.getItem('projectData')

        if (projectData) {
          projectData = JSON.parse(projectData)
        } else {
          projectData = await Api.getData('list')
          window.localStorage.setItem('projectData', JSON.stringify(projectData))    
        }
        commit('SET_DATA_LOCALLY', projectData)
      } catch(err) {
        console.error(err)
      }
    },

  }
})
