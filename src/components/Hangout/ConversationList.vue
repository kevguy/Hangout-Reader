<template lang="html">
  <div class="">
    <ProgressBar
      v-bind:show="showProgressBar"
      v-bind:message="message"
      v-bind:element-id="'hangout-profile-img-progress'"
      v-bind:progress="progress"
    />

    <h2 class="mdc-typography--subtitle1">Personal:</h2>
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
    <h2 class="mdc-typography--subtitle1">Group:</h2>
    <ul class="mdc-image-list mdc-image-list--masonry masonry-image-list">
      <li class="mdc-image-list__item"
        v-for="(conversation, idx) in conversationList"
        v-if="conversation.type === 'group'">
        <div class="">
          <img
            v-for="participant in conversation.participants"
            v-if="participant.gaiaId !== conversation.user"
            v-bind:src="imageMap[participant.gaiaId] || PLACEHOLDER_URL+'00'"
            class="mdc-image-list__image"
            alt="Text label">
        </div>
        <div class="mdc-image-list__supporting">
          <span class="mdc-image-list__label">{{conversation.groupName}}</span>
        </div>
        <!-- <div class="mdc-image-list__supporting">
          <span class="mdc-image-list__label">{{conversation.list}}</span>
        </div> -->
      </li>
    </ul>
  </div>
</template>

<script>
import { fetchProfileImgLinksStream, fetchProfileImgLink } from '../../util/Hangout';
import { mapState } from 'vuex';
import ProgressBar from '../UI/ProgressBar.vue';
import { Observable } from 'rxjs/Rx';
import { MDCLinearProgress } from '@material/linear-progress/dist/mdc.linearProgress'

const PLACEHOLDER_URL = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50';

export default {
  components: { ProgressBar },
  data() {
    return {
      showProgressBar: true,
      participantList: [],
      numOfParticipants: 0,
      progress: 0,
      message: '',
      PLACEHOLDER_URL
    };
  },
  computed: {
    ...mapState({
      imageMap: state => state.Hangout.profileImgMap,
      conversationList: state => state.Hangout.conversationList,
    })
  },
  watch: {
    conversationList() {
      this.initParticipantList()
      // retrieve profile pics
      let count = 0;
      fetchProfileImgLinksStream(this.participantList, 'large')
        .subscribe({
          next: (result) => {
            console.log(result)
            this.imageMap[result.gaiaId] = result.result
            this.$store.commit('Hangout/setProfileImgUrl', result)
            count++;
            this.progress = count / this.numOfParticipants
            this.message = `Processed ${result.name} (${count} / ${this.numOfParticipants})`
          },
          complete: () => {
            this.showProgressBar = false
          }
        })
    }
  },
  created() {},
  mounted() {

  },
  methods: {
    initParticipantList() {
      this.conversationList.forEach((conversation) => {
        conversation.participants.forEach((participant) => {
          if (this.participantList.filter(item => item.gaiaId === participant.gaiaId).length === 0) {
            this.participantList.push(participant);
            this.numOfParticipants++;
          }
        })
      });
      console.log(this.participantList)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@material/image-list/dist/mdc.image-list.css";

.mdc-image-list__image-aspect-container:hover, .mdc-image-list__item:hover {
  opacity: 0.7;
}

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
  max-width: 900px;
}

.masonry-image-list .mdc-image-list__item {
  margin-bottom: 16px;

  img.mdc-image-list__image {
    width: 32%;
    margin-left: 1px;
  }

  .mdc-image-list__label {
    white-space: unset;
    font-size: 0.9rem;
  }

}

.mdc-image-list--masonry .mdc-image-list__image {
  display: inline-grid;
}

@media (max-width: 599px) {
  .standard-image-list .mdc-image-list__item {
    width: calc(100% / 3 - 4.33333px);
    margin: 2px;
  }

  .masonry-image-list {
    -webkit-column-count: 3;
            column-count: 3;
    -webkit-column-gap: 16px;
            column-gap: 16px;
  }
  .masonry-image-list .mdc-image-list__item {
    margin-bottom: 16px;
  }
}
</style>
