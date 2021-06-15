import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default function ({ $config: { GTAG_ID } }) {
  Vue.use(VueGtag, {
    config: { id: GTAG_ID },
    appName: 'Davin Suen Photo',
  })
}
