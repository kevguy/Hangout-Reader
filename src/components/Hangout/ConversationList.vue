<template lang="html">
  <div class="">
    <!-- <div class="demo-linear-progress-indicator">
      <h3 class="mdc-typography--subtitle1">Buffered</h3>
      <div id="profile-progress" role="progressbar" class="mdc-linear-progress ">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer" style="transform: scaleX(0.75);"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" style="transform: scaleX(0.5);">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
    </div> -->
    <div class="" v-if="this.showProgressBar">
      <h3 class="mdc-typography--subtitle1">{{message}}</h3>
      <div id="profile-progress" role="progressbar" class="mdc-linear-progress">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
    </div>



    <ul class="mdc-image-list standard-image-list mdc-image-list--with-text-protection">
      <li
        class="mdc-image-list__item"
        v-for="(conversation, idx) in conversationList"
        v-if="conversation.type === 'individual'">
        <div
          class="mdc-image-list__image-aspect-container"
          v-for="participant in conversation.participants"
          v-if="participant.gaiaId !== conversation.user"
          >
          <img
            class="mdc-image-list__image"
            v-bind:src="imageMap[participant.gaiaId] || PLACEHOLDER_URL+'00'" alt="Text label">
        </div>
        <div class="mdc-image-list__supporting">
          <span class="mdc-image-list__label">{{conversation.list}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Observable } from 'rxjs/Rx';
import { MDCLinearProgress } from '@material/linear-progress/dist/mdc.linearProgress'

const BASE_URL = 'https://www.googleapis.com/plus/v1/people/';
const PUBLIC_API_ACCESS_KEY = 'AIzaSyD6SrPQUrQlVpmbC3qGR8lXwNorOW_jqH4';
const PLACEHOLDER_URL = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50';

export default {
  data() {
    return {
      conversationList: [{"type":"individual","id":"UgxxAipDUpzt8MlH8F14AaABAQ","participants":[{"gaiaId":"106539800337908949517","name":"Jacob Lee"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Jacob Lee","user":"116725099929439898086"},{"type":"individual","id":"UgzPRlQPTuCzAElfTfZ4AaABAQ","participants":[{"gaiaId":"110606042492529723331"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"Ugy6RkCTigIqiudMsN54AaABAQ","participants":[{"gaiaId":"117120341677250983418","name":"Adrienne Chum"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"116201925507770432645","name":"john huen"}],"list":"Adrienne Chum, john huen","user":"116725099929439898086"},{"type":"individual","id":"UgwXiq6TYHIIsqx_Sjt4AaABAQ","participants":[{"gaiaId":"117120341677250983418","name":"Adrienne Chum"},{"gaiaId":"116725099929439898086","name":"kevilai13579@gmail.com"}],"list":"Adrienne Chum","user":"116725099929439898086"},{"type":"individual","id":"UgyUQL7LrLhY5s1DBg54AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"kevilai13579@gmail.com"},{"gaiaId":"116201925507770432645","name":"john huen"}],"list":"john huen","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"Ugz86jtyRMcmO50ZieJ4AaABAQ","participants":[{"gaiaId":"117120341677250983418"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"116201925507770432645"}],"list":"undefined, undefined","user":"116725099929439898086"},{"type":"individual","id":"Ugxpp3JjWSwmQ_MTciF4AaABAQ","participants":[{"gaiaId":"117958354579682610269","name":"John Liu"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"John Liu","user":"116725099929439898086"},{"type":"individual","id":"UgzuFmEZVO8eJhTlU4d4AaABAQ","participants":[{"gaiaId":"104978189561719149868","name":"Olivia Tse"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Olivia Tse","user":"116725099929439898086"},{"type":"individual","id":"UgySDy6W_I3uVllmbsJ4AaABAQ","participants":[{"gaiaId":"102623725716719325877"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgxVfVottpWrHHmzs_Z4AaABAQ","participants":[{"gaiaId":"112184696875408886366","name":"Vincent Cheng"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Vincent Cheng","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"Ugy1jKEn94A4zkMjNoh4AaABAQ","participants":[{"gaiaId":"104978189561719149868","name":"Olivia Tse"},{"gaiaId":"112184696875408886366","name":"Vincent Cheng"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Olivia Tse, Vincent Cheng","user":"116725099929439898086"},{"type":"individual","id":"Ugy-nnOMYAl67wOEokt4AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"118105105088789656411","name":"Simon Bach Bjerring"}],"list":"Simon Bach Bjerring","user":"116725099929439898086"},{"type":"individual","id":"Ugxr_yS5wRBXGT6m5H54AaABAQ","participants":[{"gaiaId":"113622301731440878307","name":"Alex Leung"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Alex Leung","user":"116725099929439898086"},{"type":"individual","id":"UgwVGZghGsS9dK_lQWx4AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"116795214186745712134","name":"Dom Lai"}],"list":"Dom Lai","user":"116725099929439898086"},{"type":"individual","id":"UgwZPWpR2wDF1cSSGhx4AaABAQ","participants":[{"gaiaId":"110726642604307097493","name":"Carmen Chung"},{"gaiaId":"116725099929439898086","name":"+85260181854"}],"list":"Carmen Chung","user":"116725099929439898086"},{"type":"individual","id":"UgykCDbY4DYK-uGFYTd4AaABAQ","participants":[{"gaiaId":"102179455323735361768"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgxfiKIfTh8GukIyBqx4AaABAQ","participants":[{"gaiaId":"108624733621885587961","name":"George Ching"},{"gaiaId":"103136271959304327572","name":"William Ka-Ho Sheng"},{"gaiaId":"110228156512460228231","name":"George Ching"},{"gaiaId":"116725099929439898086","name":"細佬 Pooper Hairy"},{"gaiaId":"112937314360475089734","name":"A. Chum"}],"list":"George Ching, William Ka-Ho Sheng, George Ching, A. Chum","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgxeZPcwEkVVGzqItYt4AaABAQ","participants":[{"gaiaId":"116725099929439898086"},{"gaiaId":"100754798773805885166","name":"Hei Lok Tso"}],"list":"Hei Lok Tso","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgwZrDxcyviA6ZdpfQZ4AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"115821829711457452449"}],"list":"undefined","user":"116725099929439898086"},{"type":"individual","id":"Ugw1Eq9Lfk64n_wcvtl4AaABAagB5NOEAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101455235059398068574"}],"list":"undefined","user":"116725099929439898086"},{"type":"individual","id":"UgydvFWht1Ixy0TAJ-N4AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"112937314360475089734","name":"A. Chum"}],"list":"A. Chum","user":"116725099929439898086"},{"type":"individual","id":"UgwmqW6N-Bmd-nEbJtV4AaABAagBpKS1Dw","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"113118167210198977068","name":"Tam Wing Yin"}],"list":"Tam Wing Yin","user":"116725099929439898086"},{"type":"individual","id":"UgyUhvEryQgWXix1bY94AaABAagB19-kBA","participants":[{"gaiaId":"112231489111530426653","name":"oil1155 12345"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"oil1155 12345","user":"116725099929439898086"},{"type":"individual","id":"Ugy-JUDLJ68dI-DfsmV4AaABAagB15jzAw","participants":[{"gaiaId":"115940732859734226644","name":"Antariksh Singh"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Antariksh Singh","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"Ugw6RARXW4K94I3mM1d4AaABAQ","participants":[{"gaiaId":"111405853514832243702","name":"Andy Fung"},{"gaiaId":"113853484885517778350","name":"Sam Wong"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101559769448856496191","name":"Kin Yiu Wong"},{"gaiaId":"100754798773805885166"}],"list":"Andy Fung, Sam Wong, Kin Yiu Wong, undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgzUBtneKlLKxC-bcYp4AaABAQ","participants":[{"gaiaId":"111405853514832243702"},{"gaiaId":"116725099929439898086"},{"gaiaId":"100754798773805885166"}],"list":"undefined, undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgwAj5FDePRk0txsZr94AaABAQ","participants":[{"gaiaId":"111405853514832243702","name":"Andy Fung"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"100754798773805885166"}],"list":"Andy Fung, undefined","user":"116725099929439898086"},{"type":"individual","id":"Ugw89RVSPzT-TIZnaKV4AaABAagByZaBCQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"111620797121640105952","name":"Long Wa Siu"}],"list":"Long Wa Siu","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgyWKsFuuI0H9_QS3GF4AaABAQ","participants":[{"gaiaId":"111405853514832243702","name":"Andy Fung"},{"gaiaId":"113853484885517778350"},{"gaiaId":"116725099929439898086"},{"gaiaId":"101559769448856496191"},{"gaiaId":"100754798773805885166"}],"list":"Andy Fung, undefined, undefined, undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"Ugw1NAGok2WjmVnVy8B4AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101559769448856496191"},{"gaiaId":"100754798773805885166"}],"list":"undefined, undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgxKjgoSYvIhPg8q0CN4AaABAQ","participants":[{"gaiaId":"101451093722335283210"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101559769448856496191"},{"gaiaId":"100754798773805885166"}],"list":"undefined, undefined, undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgwJR3ETNvzCGXO9Dz54AaABAQ","participants":[{"gaiaId":"103136271959304327572","name":"William Sheng"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"116795214186745712134","name":"Dom Lai"},{"gaiaId":"112937314360475089734","name":"A. Chum"}],"list":"William Sheng, Dom Lai, A. Chum","user":"116725099929439898086"},{"type":"individual","id":"UgwYpWwl7kxBcmTNB0V4AaABAQ","participants":[{"gaiaId":"112184696875408886366","name":"Vincent Cheng"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Vincent Cheng","user":"116725099929439898086"},{"type":"individual","id":"UgwvtTXfWorSBPHUWQx4AaABAagByrq6CQ","participants":[{"gaiaId":"112489008061321442356","name":"樂仔"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"樂仔","user":"116725099929439898086"},{"type":"individual","id":"UgxCK4-YG-kkG-f_irp4AaABAagBoai8Cg","participants":[{"gaiaId":"101451093722335283210","name":"Clifford Wu"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Clifford Wu","user":"116725099929439898086"},{"type":"individual","id":"UgzMY9GbrOlAgqzjxhV4AaABAagBsO7zCQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101329230952243951550","name":"Yuko Pang"}],"list":"Yuko Pang","user":"116725099929439898086"},{"type":"individual","id":"UgznCwNT6Fw6dHTkVGF4AaABAagBzMmbAQ","participants":[{"gaiaId":"114362307495947784224"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"undefined","user":"116725099929439898086"},{"type":"individual","id":"UgwelBvf1ephg2MWKPF4AaABAagBu7r-AQ","participants":[{"gaiaId":"105431234685212213863","name":"Waichun Cheung"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Waichun Cheung","user":"116725099929439898086"},{"type":"individual","id":"UgykPJEYozIOTJYkf7l4AaABAagB1t3UCw","participants":[{"gaiaId":"116125081999058945086","name":"陳廷晞"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"陳廷晞","user":"116725099929439898086"},{"type":"individual","id":"Ugw9hq7XGC33O57vavd4AaABAagB_YK_CQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101559769448856496191","name":"Kin Yiu Wong"}],"list":"Kin Yiu Wong","user":"116725099929439898086"},{"type":"individual","id":"UgxpQDNzZ5EvFxvWBTF4AaABAagB_u7oAg","participants":[{"gaiaId":"113853484885517778350","name":"Sam Wong"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Sam Wong","user":"116725099929439898086"},{"type":"individual","id":"Ugz7_e_kZ2HxvJvHmr14AaABAagBt5iuBQ","participants":[{"gaiaId":"114355308431236746221","name":"Foxan Ng"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Foxan Ng","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"UgwtNmsrzoKcqrEfX2J4AaABAQ","participants":[{"gaiaId":"116688983061000263557"},{"gaiaId":"113290746621410916946"},{"gaiaId":"116125081999058945086"},{"gaiaId":"101559769448856496191"},{"gaiaId":"100749764919725560317"},{"gaiaId":"101928543968529128211","name":"Kev Lai"},{"gaiaId":"105441465304023356479"},{"gaiaId":"113853484885517778350"},{"gaiaId":"116725099929439898086"},{"gaiaId":"100754798773805885166"}],"list":"undefined, undefined, undefined, undefined, undefined, Kev Lai, undefined, undefined, undefined","user":"116725099929439898086"},{"type":"group","groupName":"Unknown Group","id":"Ugw2Ejh9ZA9FCzy8TCx4AaABAQ","participants":[{"gaiaId":"116688983061000263557"},{"gaiaId":"101559769448856496191"},{"gaiaId":"113290746621410916946"},{"gaiaId":"101451093722335283210"},{"gaiaId":"100749764919725560317"},{"gaiaId":"101928543968529128211","name":"Kev Lai"},{"gaiaId":"105441465304023356479"},{"gaiaId":"113853484885517778350"},{"gaiaId":"116725099929439898086"},{"gaiaId":"100754798773805885166"}],"list":"undefined, undefined, undefined, undefined, undefined, Kev Lai, undefined, undefined, undefined","user":"116725099929439898086"},{"type":"individual","id":"UgwkSqsnyKKCAv-Pj8l4AaABAagB3NXHCA","participants":[{"gaiaId":"100749764919725560317","name":"Christopher Chiu"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Christopher Chiu","user":"116725099929439898086"},{"type":"individual","id":"UgxqG-5GAb4_i_vtbDV4AaABAQ","participants":[{"gaiaId":"103136271959304327572","name":"William Sheng"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"William Sheng","user":"116725099929439898086"},{"type":"individual","id":"Ugwq59fb4EFxyFSMbzR4AaABAagB75TDDA","participants":[{"gaiaId":"101928543968529128211","name":"Kev Lai"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Kev Lai","user":"116725099929439898086"},{"type":"group","groupName":"Chiang Mai","id":"Ugyo6svTxmP3MQbxurV4AaABAQ","participants":[{"gaiaId":"105524006654987809707","name":"kevatuk@gmail.com"},{"gaiaId":"100749764919725560317","name":"Christopher Chiu"},{"gaiaId":"101928543968529128211","name":"Kev Lai"},{"gaiaId":"114355308431236746221","name":"Foxan Ng"},{"gaiaId":"114362307495947784224","name":"Christine bb"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"kevatuk@gmail.com, Christopher Chiu, Kev Lai, Foxan Ng, Christine bb","user":"116725099929439898086"},{"type":"individual","id":"UgxyZ_AQMV4pwn9UvWV4AaABAQ","participants":[{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"100754798773805885166","name":"Hei Lok Tso"}],"list":"Hei Lok Tso","user":"116725099929439898086"},{"type":"individual","id":"UgytEvoxP17iuUUXoud4AaABAagBpqyJAw","participants":[{"gaiaId":"105441465304023356479","name":"M Wong"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"M Wong","user":"116725099929439898086"},{"type":"group","groupName":"HowBowDah","id":"UgyL6KCL052Tq6oQSu14AaABAQ","participants":[{"gaiaId":"116688983061000263557","name":"atang1029@gmail.com"},{"gaiaId":"113290746621410916946","name":"Anakin Yuen"},{"gaiaId":"105524006654987809707","name":"kevatuk@gmail.com"},{"gaiaId":"101451093722335283210","name":"Clifford Wu"},{"gaiaId":"100749764919725560317","name":"Christopher Chiu"},{"gaiaId":"101928543968529128211","name":"Kev Lai"},{"gaiaId":"114355308431236746221","name":"Foxan Ng"},{"gaiaId":"114362307495947784224","name":"Christine Fok"},{"gaiaId":"113853484885517778350","name":"Sam Wong"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101559769448856496191","name":"Kin Yiu Wong"}],"list":"atang1029@gmail.com, Anakin Yuen, kevatuk@gmail.com, Clifford Wu, Christopher Chiu, Kev Lai, Foxan Ng, Christine Fok, Sam Wong, Kin Yiu Wong","user":"116725099929439898086"},{"type":"group","groupName":"Gonna Get Schwifty","id":"Ugy_PUJ57Mp_33TfjQ94AaABAQ","participants":[{"gaiaId":"113290746621410916946","name":"Anakin Yuen"},{"gaiaId":"105524006654987809707","name":"kevatuk@gmail.com"},{"gaiaId":"100749764919725560317","name":"Christopher Chiu"},{"gaiaId":"101928543968529128211","name":"Kev Lai"},{"gaiaId":"105441465304023356479","name":"M Wong"},{"gaiaId":"113853484885517778350","name":"Sam Wong"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"},{"gaiaId":"101559769448856496191","name":"Kin Yiu Wong"},{"gaiaId":"100754798773805885166","name":"Hei Lok Tso"}],"list":"Anakin Yuen, kevatuk@gmail.com, Christopher Chiu, Kev Lai, M Wong, Sam Wong, Kin Yiu Wong, Hei Lok Tso","user":"116725099929439898086"},{"type":"individual","id":"UgylVwHUsKjYT5sSElJ4AaABAQ","participants":[{"gaiaId":"115681458968227650592","name":"Indy Prentice"},{"gaiaId":"116725099929439898086","name":"Kevin Lai"}],"list":"Indy Prentice","user":"116725099929439898086"}],
      // imageMap: {}
      progressBar: undefined,
      showProgressBar: true,
      participantList: [],
      numOfParticipants: 0,
      message: '',
      PLACEHOLDER_URL
    };
  },
  computed: {
    // imageMap() {
    //   return {}
    // }
      ...mapState({
        // a: state => state.some.nested.module.a,
        // b: state => state.some.nested.module.b
        imageMap: state => state.Hangout.profileImgMap
      })
  },
  created() {
    const imageMap = {};
    this.conversationList.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        // imageMap[participant.gaiaId] = `${PLACEHOLDER_URL}00`;
        // if (participantList.indexOf(participant.gaiaId) < 0) {
        if (this.participantList.filter(item => item.gaiaId === participant.gaiaId).length === 0) {
          this.participantList.push(participant);
          this.numOfParticipants++;
        }
      })
    });
    console.log(this.participantList)
    // this.$store.commit('Hangout/initProfileImgMap', imageMap);
  },
  mounted() {
    this.progressBar = new MDCLinearProgress(document.querySelector('#profile-progress'))
    console.log(this.progressBar)
    // this.conversationList.forEach((conversation) => {
    //   conversation.participants.forEach((participant) => {
    //     this.imageMap[participant.gaiaId] = PLACEHOLDER_URL + '00';
    //   })
    // })
    const arr = [];
    // this.conversationList.forEach((conversation) => {
    //   conversation.participants.forEach((participant) => {
    //     arr.push(Observable.of(1)
    //       .delay(10)
    //       .flatMap((a) => {
    //         console.log('fuck')
    //         return Observable.fromPromise(this.fetchProfilePic(participant.gaiaId))
    //       })
    //       .map((result) => ({ gaiaId: participant.gaiaId, result: result + '00', name: participant.name })) // the 00 part is to increase size from 50 to 5000
    //       .do((result) => { console.log(result) }))
    //     // arr.push(Observable.of({ gaiaId: -1, result: -1 }).delay(3000))
    //   })
    // })
    this.participantList.forEach((participant) => {
      arr.push(Observable.of(1)
        .delay(10)
        .flatMap((a) => {
          console.log('fuck')
          return Observable.fromPromise(this.fetchProfilePic(participant.gaiaId))
        })
        .map((result) => ({ gaiaId: participant.gaiaId, result: result + '00', name: participant.name })) // the 00 part is to increase size from 50 to 5000
        .do((result) => { console.log(result) }))
      // arr.push(Observable.of({ gaiaId: -1, result: -1 }).delay(3000))
    })

    const stream = Observable.concat(...arr);
    let count = 0;
    stream.subscribe({
      next: (result) => {
        console.log(result)
        this.imageMap[result.gaiaId] = result.result
        this.$store.commit('Hangout/setProfileImgUrl', result)
        count++;
        this.progressBar.progress = count / this.numOfParticipants
        this.message = `Processed ${result.name} (${count} / ${this.numOfParticipants})`
      },
      complete: () => {
        this.showProgressBar = false
      }
    })
  },
  methods: {
    async createBase64(url) {
      const response = await fetch(url);
      const result = await response.body.getReader().read();
      let resultStr = btoa(String.fromCharCode.apply(null, result.value));
      resultStr = `data:image/jpg;base64, ${resultStr}`;
      console.log(resultStr)
      return resultStr;
    },
    fetchImgStream(gaiaId) {
      const stream = Observable
        .fromPromise(fetch(`${BASE_URL}${gaiaId}?key=${PUBLIC_API_ACCESS_KEY}`))
        .flatMap(response => Observable.fromPromise(response.json()))
        .flatMap((response) => {
          if (!response.error) {
            return Observable.of(response);
          } else if (response.error.message === 'Not Found') {
            return Observable.of('Not Found');
          }
          return this.fetchImgStream(gaiaId).delay(3000);
        });

      return stream;
    },
    retrieveLink(gaiaId) {
      return this.imageMap[gaiaId];
    },
    async fetchProfilePic(gaiaId) {
      // console.log(gaiaId)
      // console.log(this.fetchImgStream)
      const result = await this.fetchImgStream(gaiaId).toPromise()
        .then((response) => {
          if (response !== 'Not Found') {
            const url = response.image.url;
            console.log(url);
            // return this.createBase64(response.image.url);
            return url
          }
          // return false;
          return PLACEHOLDER_URL + '00';
        });
      return result;
      // return '1'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@material/image-list/dist/mdc.image-list.css";
// @import "~@material/image-list/mdc-image-list.scss";
// @import "~material-components-web/material-components-web.scss"

.hero-image-list {
  width: 300px;
  margin: 0;
}

.hero-image-list .mdc-image-list__item {
  width: calc(100% / 5 - 4.2px);
  margin: 2px;
  // @include mdc-image-list-aspect(1);
}

.hero-image-list .mdc-image-list__image {
  background-color: #000;
}

.standard-image-list {
  max-width: 900px;
}
.standard-image-list .mdc-image-list__image-aspect-container {
  padding-bottom: calc(100% / 1); // 1 is the width-height-ratio
}
.standard-image-list .mdc-image-list__item {
  width: calc(100% / 5 - 4.2px);
  margin: 2px;
}

.masonry-image-list {
  -webkit-column-count: 5;
          column-count: 5;
  -webkit-column-gap: 16px;
          column-gap: 16px;
  max-width: 900px; }
  .masonry-image-list .mdc-image-list__item {
    margin-bottom: 16px; }

@media (max-width: 599px) {
  .standard-image-list .mdc-image-list__item {
    width: calc(100% / 3 - 4.33333px);
    margin: 2px; }
  .masonry-image-list {
    -webkit-column-count: 3;
            column-count: 3;
    -webkit-column-gap: 16px;
            column-gap: 16px; }
    .masonry-image-list .mdc-image-list__item {
      margin-bottom: 16px; } }
</style>
