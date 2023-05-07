<template>
  <div>
    <div id="map" />
  </div>
</template>

<script lang="ts">
/* eslint no-undef: 0 */
import Vue from 'vue'
import mpMapGooglePickupPoint from '@/components/map/infos/info-pickup-point.vue'

export default Vue.extend({
  name: 'mp-map-google',
  props: {
    items: {
      type: Array,
      required: true,
    },
    init: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    this.initMap()
  },
  methods: {
    initMap(): void {
      if (!this.map) {
        this.$emit(
          'update:map',
          //   @ts-ignore
          new google.maps.Map(document.getElementById('map') as HTMLElement, {
            center: { lat: this.init.latitude, lng: this.init.longitude },
            zoom: 13,
          }),
        )
      } else {
        this.map.setCenter({ lat: this.init.latitude, lng: this.init.longitude })
      }

      this.$nextTick(() => {
        for (const item of this.items) {
          const { latitude: lat, longitude: lng } = (item as any).coordinates

          const InfoWindow = Vue.extend(mpMapGooglePickupPoint)
          const instance = new InfoWindow({
            propsData: {
              item,
              getTranslation: this.getTranslation,
            },
          })

          instance.$mount()

          //   @ts-ignore
          const infowindow = new google.maps.InfoWindow({
            content: instance.$el,
            maxWidth: '182',
          })

          //   @ts-ignore
          const pin = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            icon: require('@/assets/icons/map-pin-black.svg'),
          })

          pin.addListener('click', () => {
            this.$emit('selectedItem', item)
            infowindow.open({
              anchor: pin,
              map: this.map,
              shouldFocus: false,
            })
          })
        }
      })
    },
    getTranslation(text: string): string {
      return this.$t(text)
    },
  },
  watch: {
    init: {
      deep: true,
      handler() {
        this.initMap()
      },
    },
  },
})
</script>

<style lang="scss" scoped>
/* Set the size of the div element that contains the map */
#map {
  height: 400px;
  /* The height is 400 pixels */
  width: 100%;
  /* The width is the width of the web page */
}
</style>
