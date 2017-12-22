import Vue from 'vue'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
  createdQuizKey: '',
  selectedPlaylist: null,

  questions: [],
  currentQuestionIdx: 0,

  buzzed: false,
  buzzerId: null
}

const getters = {
  hasCreatedQuiz (state) {
    return !!(state.createdQuizKey && state.selectedPlaylist)
  },
  currentQuestion (state) {
    return state.questions[state.currentQuestionIdx]
  },
  buzzedUser (state, getters, rootState) {
    return rootState.common.players.find(p => p.id = state.buzzerId)
  }
}

const mutations = {
  [types.SELECT_PLAYLIST] (state, playlist) {
    state.selectedPlaylist = playlist
  },
  [types.SET_CREATED_QUIZ_KEY] (state, key) {
    state.createdQuizKey = key
  },
  [types.QUIZ_QUESTIONS] (state, questions) {
    state.questions = questions
  },
  [types.QUIZ_NEXT_TRACK] (state) {
    state.currentQuestionIdx += 1
  },
  [types.SOCKET_QUIZ_BUZZ] (state, userId) {
    state.buzzed = true
    state.buzzerId = userId
  }
}

const actions = {
  createQuiz ({ commit, state }) {
    if (!state.createdQuizKey) {
      socketBus.$socket.emit('quiz_create', (key) => {
        commit(types.SET_CREATED_QUIZ_KEY, key)
      })
    }
  },
  selectPlaylist ({ commit }, playlist) {
    commit(types.SELECT_PLAYLIST, playlist)
  },
  generateQuestions ({ commit, state, dispatch, rootState }) {
    return new Promise((resolve, reject) => {
      dispatch('getPlaylistTracks', state.selectedPlaylist)
      .then(() => {
        const questions = rootState.spotify.tracks.map(t => {
          return {
            question: Math.random() < 0.5 ? 'What is the name of the song?' : 'What is the name of the artist?',
            track: t
          }
        })

        commit(types.QUIZ_QUESTIONS, questions)
        resolve()

        // reject()
      })
    })
  },
  startQuiz ({ dispatch }) {
    return dispatch('generateQuestions')
    .then(() => {
      socketBus.$socket.emit('quiz_start')
    })
  },
  nextTrack ({ commit, dispatch }) {
    commit(types.QUIZ_NEXT_TRACK)
    dispatch('pause')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
