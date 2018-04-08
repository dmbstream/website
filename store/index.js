import Vuex from 'vuex';

const store = () => {
  return new Vuex.Store({
    state: {
      counter: 0
    },
    mutations: {
      increment (state) {
        state.counter++
      }
    },
    actions: {
      fetchConcerts({
                            sortAsc,
                            sortDesc,
                            page = 1,
                            itemsPerPage = 15,
                          }) {
        return this.$axios.$get('');
      },
    },
  });
};

export default store;
