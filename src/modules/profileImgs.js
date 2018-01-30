/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import fetchImgStream, { createBase64 } from '../utils/fetchProfileImg';


export default {
  state: {
    profileMap: {},
  },
  mutations: {
    addProfilePic(state, payload) {
      state.profileMap = {
        ...state.profileMap,
        [payload.id]: {
          url: payload.url,
          base64: payload.base64,
        },
      };
    },
  },
  actions: {
    RETRIEVE_PROFILE_PIC({ commit }, gaiaId) {
      let url;
      return fetchImgStream(gaiaId).toPromise()
        .then((response) => {
          if (response !== 'Not Found') {
            url = response.image.url;
            return createBase64(response.image.url);
          }
          return false;
        })
        .then((result) => {
          if (result) {
            commit('addProfilePic', {
              id: gaiaId,
              url,
              base64: result,
            });
          }
        });
    },
  },
};
