<template>
  <v-container id="carrier-detail-perimeter" data-id="carrier-detail-perimeter" v-if="hasLoaded">
    <mp-block
      id="carrier-detail-perimeter-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.perimeter.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :hasEditIcon="hasEditIcon && !!activeCountries.length"
      @clickOnIcon="showModal = true"
    >
      <div v-if="activeCountries.length">
        <v-row no-gutters class="chip-outer-wrapper">
          <mp-chips-wrapper
            dataId="carrier-detail-perimeter-chips"
            :chips="activeCountriesChips"
            v-model="currentChip"
            @input="changeDisplayedCountry($event.value)"
          />
        </v-row>

        <v-row no-gutters class="mt-2" align="center">
          <v-col
            :cols="countryHasDepartment ? ($vuetify.breakpoint.smAndUp ? '7' : '12') : '12'"
            class="map-switch"
          >
            <div
              :class="`map${selectedDisplay === DISPLAY.map ? ' selected' : ''}`"
              data-id="carrier-detail-perimeter-changeDisplay"
              @click="changeDisplay(DISPLAY.map)"
            >
              <div v-if="selectedCountry === COUNTRY.FRANCE">
                <v-icon size="1.8rem">mdi-map-outline</v-icon>
                <span class="medium14">{{ $t('page.carrier.perimeter.map') }}</span>
              </div>
            </div>
            <v-divider v-if="$vuetify.breakpoint.xsOnly" vertical />
            <div
              :class="`list${selectedDisplay === DISPLAY.list ? ' selected' : ''}`"
              @click="changeDisplay(DISPLAY.list)"
              data-id="carrier-detail-perimeter-changeDisplay"
            >
              <div v-if="departmentEligibility.includes(selectedCountry)">
                <v-icon size="1.8rem">mdi-format-list-bulleted</v-icon>
                <span class="medium14">{{ $t('page.carrier.perimeter.list') }}</span>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            v-if="countryHasDepartment && $vuetify.breakpoint.xsOnly"
            class="no-covert-wrapper"
          >
          </v-col>
        </v-row>

        <!-- FR map -->
        <v-row no-gutters v-if="COUNTRY && selectedDisplay === DISPLAY.map && showMap">
          <v-col cols="12" class="map-wrapper" v-if="selectedCountry === COUNTRY.FRANCE">
            <map-france :class="COUNTRY.FRANCE" data-id="carrier-detail-perimeter-mapFrance" />
          </v-col>
          <div v-else>
            <div v-for="countries in activeCountries" :key="countries.text">
              <v-row no-gutters>
                <v-col cols="12" class="switch-wrapper">
                  <div :class="['flag-selector', countries.value.toLowerCase()]" />
                  <span class="main-color regular14 ml-2">{{ countries.text }}</span>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-row>

        <!-- FR list -->
        <v-row
          no-gutters
          v-if="selectedDisplay === DISPLAY.list && typeof oeDepts[selectedCountry] === 'object'"
          class="list-outer-wrapper"
        >
          <v-col cols="12">
            <v-row
              no-gutters
              v-for="(department, index) in oeDepts[selectedCountry]"
              :key="`carrier-detail-perimeter-department-${index}`"
              class="department-outer-wrapper"
            >
              <v-col cols="12" class="department-wrapper">
                <span
                  class="regular14"
                  :data-id="`carrier-detail-perimeter-departments-${department}`"
                >
                  {{ department }} - {{ DEPARTMENTS[selectedCountry][department] }}
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div v-else-if="!departmentEligibility.includes(selectedCountry) && selectedDisplay === DISPLAY.list">
          <div v-for="countries in activeCountries" :key="countries.text">
            <v-row no-gutters>
              <v-col cols="12" class="switch-wrapper">
                <div :class="['flag-selector', countries.value.toLowerCase()]" />
                <span class="main-color regular14 ml-2">{{ countries.text }}</span>
              </v-col>
            </v-row>
          </div>
        </div>
        <v-row
          v-else-if="
            selectedDisplay === DISPLAY.list && typeof oeDepts[selectedCountry] === 'boolean'
          "
          class="min-size"
        >
          <v-col cols="12" v-if="oeDepts[selectedCountry]">
            <span class="medium14" data-id="carrier-detail-perimeter-cover">
              {{ $t('page.carrier.perimeter.cover') }}
            </span>
          </v-col>
        </v-row>
      </div>

      <v-row no-gutters v-else>
        <v-col cols="12" class="no-data-wrapper">
          <no-data
            dataId="carrrier-detail-perimeter-block-noData"
            :content="$t('common.noData.perimetre')"
          />

          <mp-button
            v-if="hasEditIcon && $vuetify.breakpoint.smAndUp"
            format="primary"
            :text="$t('action.add.base')"
            icon="plus"
            class="mp-button"
            @click="showModal = true"
            dataId="carrrier-detail-perimeter-block-add"
          />
        </v-col>
      </v-row>
    </mp-block>

    <mp-dialog-confirmation
      v-if="showModal"
      dataId="carrier-delivery-perimeter-modal"
      :classWrapper="
        `carrier-delivery-perimeter-modal${!showDepartmentForm ? ' country-scroll' : ''}`
      "
      color="primary"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.perimeter'),
        textPolice: 'medium16',
      }"
      :btnValidation="{
        text: $t('action.save'),
        format: 'success',
        icon: 'content-save-outline',
        disabled: !Object.keys(editSelectedCountries).length,
        loading,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      @close="handleCancel()"
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters v-if="!showDepartmentForm">
          <v-col
            cols="10"
            offset="1"
            v-for="(country, index) in parentCountries"
            :key="`countries-${index}`"
            class="row-wrapper"
          >
            <mp-checkbox-new
              :label="$t(`common.country.${country}`)"
              v-model="editSelectedCountries"
              :value="country"
              :hide-details="true"
              :data-id="`carrier-delivery-logistic-checkbox-${index}`"
            />

            <div v-if="departmentEligibility.includes(country)" class="detail-wrapper">
              <span class="medium14 main-lighten-28" @click="openDetail(country)">
                {{ $t('common.detail_plural') }}
              </span>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters v-else>
          <v-col cols="12" class="search-wrapper" v-if="departmentEligibility.includes(selectedCountry)">
            <v-row no-gutters>
              <v-col
                v-if="displayZoningFileInput"
                cols="10"
                offset="1"
                class="d-flex align-center justify-end"
              >
                <v-file-input
                  prepend-icon=""
                  append-icon="mdi-paperclip"
                  :label="$t('page.carrier.perimeter.file')"
                  color="success-color"
                  accept=".json, .csv"
                  @change="changeFile($event)"
                  data-id="zoningEligilibity-fileinput"
                />
              </v-col>
              <v-col v-else cols="10" offset="1" class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon size="2.0rem" class="ml-4 main-color">mdi-file</v-icon>
                  <span class="medium16 ml-2">{{ zoningFileName }}</span>
                </div>
                <div>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        size="2.0rem"
                        class="ml-4 main-color"
                        v-bind="attrs"
                        v-on="on"
                        @click="downloadFile()"
                        data-id="zoningEligilibity-download-file"
                      >
                        mdi-file-download
                      </v-icon>
                    </template>
                    <span>{{ $t('action.download') }}</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        size="2.0rem"
                        class="ml-4 main-color"
                        v-bind="attrs"
                        v-on="on"
                        @click="modifyZoning()"
                        data-id="zoningEligilibity-modify-file"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>{{ $t('action.modify.base') }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        size="2.0rem"
                        class="ml-4 main-color"
                        @click="deleteZoning()"
                        v-bind="attrs"
                        v-on="on"
                        data-id="zoningEligilibity-delete-file"
                      >
                        mdi-close-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('action.delete.base') }}</span>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" class="scroll">
            <v-row no-gutters>
              <v-col cols="12" @click="showDepartmentForm = false" class="back-wrapper">
                <v-icon size="1.8rem" class="ml-4 mr-4">mdi-chevron-left</v-icon>
                <span class="medium16"> {{ $t('page.carrier.perimeter.back') }} </span>
              </v-col>

              <v-col
                cols="10"
                offset="1"
                class="row-wrapper"
                v-if="!searchedDepartement || !searchedDepartement.length"
              >
                <mp-checkbox-new
                  :label="$t('common.all.base')"
                  @change="enableOrDisableAllDepartments($event)"
                  v-model="allCheckbox[selectedCountry]"
                  :hide-details="true"
                  data-id="carrier-delivery-logistic-checkbox-all"
                />
              </v-col>

              <v-col
                cols="10"
                offset="1"
                v-for="(department, index) in editDepartmentListFiltered"
                :key="`departments-${index}`"
                class="row-wrapper"
              >
                <mp-checkbox-new
                  :label="`${department} - ${DEPARTMENTS[selectedCountry][department]}`"
                  v-model="editSelectedDepartments[selectedCountry]"
                  :value="department"
                  :hide-details="true"
                  :data-id="`carrier-delivery-logistic-checkbox-${index}`"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </v-container>
</template>

<script lang="ts">
/* eslint vue/no-side-effects-in-computed-properties: 0 */
import { COUNTRY, DEPARTMENTS } from '@/constants/shared'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { CarrierEligibilityEntity, Zoning, CsvParsedZoning } from '@/types'
import noData from '@/components/noData/noData.vue'
import Papa from 'papaparse'
import Vue from 'vue'

import { CountriesCodeEnum } from '@/constants'

import mpBlock from '@/components/block/block.vue'
import { SnackBarType } from '@/store/types'
import { wait } from '@/helpers/helper'
import { dateHelper } from '@/helpers/dateHelper'

const DISPLAY = {
  map: 'MAP',
  list: 'LIST',
}

const HEADERS = ['country', 'type', 'mode', 'value']

const departmentEligibility: string[] = Object.values(CountriesCodeEnum)

const emptyEditedDepartment = departmentEligibility.reduce(
  (acc, dpt) => ({ ...acc, [dpt]: [] }),
  {},
)

const allCheckboxInit = departmentEligibility.reduce((acc, dpt) => ({ ...acc, [dpt]: false }), {})

export default Vue.extend({
  name: 'mp-carrier-detail-perimeter',
  components: {
    mapFrance: () => import('@/views/Carrier/Map/france.vue'),
    mpBlock,
    noData,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    parentDepartments: {
      type: Object as () => Record<string, any>,
      default: () => { return {} },
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    hasLoaded: false,
    oeDepts: {} as Record<string, any>,
    parentCountries: {} as Record<string, any>,
    selectedCountry: COUNTRY.FRANCE as CountriesCodeEnum,
    COUNTRY,
    selectedDisplay: DISPLAY.map as string,
    DISPLAY,
    DEPARTMENTS,
    departmentEligibility,
    currentChip: null,
    showModal: false,
    editSelectedCountries: [] as string[],
    editSelectedDepartments: emptyEditedDepartment as Record<string, any>,
    editDepartmentList: {} as Record<string, any>,
    showDepartmentForm: false,
    searchedDepartement: '',
    showMap: true,
    allCheckbox: allCheckboxInit as Record<string, any>,
    zoning: null as Zoning | null,
    zoningEligibility: null as Zoning | null,
    displayFileInput: false,
    zoningFileName: null as string | null,
  }),
  computed: {
    editDepartmentListFiltered(): string[] {
      return this.editDepartmentList[this.selectedCountry].filter((dp: CountriesCodeEnum) => {
        return `${dp} - ${DEPARTMENTS[this.selectedCountry][dp].toLowerCase()}`.includes(
          this.searchedDepartement.toLowerCase(),
        )
      })
    },
    countryHasDepartment(): boolean {
      if (typeof this.oeDepts[this.selectedCountry] === 'object') {
        const localDepartments = this.oeDepts[this.selectedCountry] as string[]
        return !localDepartments.length
      }

      return !this.oeDepts[this.selectedCountry]
    },
    noEmptyDepartments(): Record<string, any> {
      const allowedCountries: string[] = Object.values(COUNTRY)
      const countries = allowedCountries.reduce((acc: Record<string, any>, country: string) => {
        if (
          this.oeDepts[country] === true ||
          (Array.isArray(this.oeDepts[country]) && this.oeDepts[country].length)
        ) {
          acc[country] = this.oeDepts[country]
        }
        return acc
      }, {})

      return Object.keys(countries).map(key => {
        return {
          text: this.$t(`common.country.${key}`),
          value: key,
        }
      })
    },
    activeCountriesLength(): number {
      return this.noEmptyDepartments.filter(({ value }: { value: string }) => !departmentEligibility.includes(value)).length
    },
    activeCountries(): Record<string, any> {
      if (this.activeCountriesLength) {
        return this.noEmptyDepartments.filter(
          ({ value }: { value: string }) => !departmentEligibility.includes(value) && value !== 'WR',
        )
      }

      return this.noEmptyDepartments.filter(({ value }: { value: string }) => departmentEligibility.includes(value))
    },
    activeCountriesChips(): Record<string, any> {
      let groupedCountry = this.noEmptyDepartments

      if (this.activeCountriesLength) {
        groupedCountry.push({
          text: this.$t('page.carrier.perimeter.otherCountry', {
            count: this.activeCountriesLength,
          }),
          value: 'WR',
        })
        return groupedCountry.filter(
          ({ value }: { value: string }) => departmentEligibility.includes(value) || value === 'WR',
        )
      }
      return groupedCountry.filter(({ value }: { value: string }) => departmentEligibility.includes(value))
    },
    displayZoningFileInput(): boolean {
      return !this.zoningEligibility || (this.zoningEligibility && this.displayFileInput)
    },
  },
  async mounted() {
    const { departments } = this.orderEligibility
    if (departments) {
      for (const department in departments) {
        if (Array.isArray(departments[department])) {
          departments[department] = departments[department].sort((a: string, b: string) => {
          const aNumber = ['2A', '2B'].includes(a) ? 20 : Number(a)
          const bNumber = ['2A', '2B'].includes(b) ? 20 : Number(b)
          return aNumber < bNumber ? -1 : 1
        })
        }
      }
    }
    this.setAllowedCountries()
    this.oeDepts = departments || {}
    this.fillSelectedDepartments(this.selectedCountry)

    await this.loadZoningData()

    this.hasLoaded = true
  },
  methods: {
    setAllowedCountries() {
      const allowedCountries: string[][] = Object.entries(COUNTRY)

      this.parentCountries = allowedCountries.reduce(
        (acc: Record<string, any>, country: string[]) => {
          const name = country[0]
          const key = country[1]

          if (!this.params.retailerId) {
            acc[name] = key
            if (departmentEligibility.includes(key)) {
              this.editDepartmentList[key] = Object.keys(DEPARTMENTS[key]).filter(dp => {
                return `${dp} - ${DEPARTMENTS[key][dp].toLowerCase()}`.includes(
                  this.searchedDepartement.toLowerCase(),
                )
              })
            }

            return acc
          }

          if (this.parentDepartments[key] && !Array.isArray(this.parentDepartments[key])) {
            acc[name] = key
          } else if (this.parentDepartments?.[key]?.length) {
            // FRANCE
            acc[name] = key
            this.editDepartmentList[key] = this.parentDepartments?.[key]
          }

          return acc
        },
        {},
      )

      if (departmentEligibility.includes(this.selectedCountry) && this.editDepartmentList[this.selectedCountry]) {
        this.editDepartmentList[this.selectedCountry] = this.editDepartmentList[
          this.selectedCountry
        ].sort((a: string, b: string) => {
          const aNumber = ['2A', '2B'].includes(a) ? 20 : Number(a)
          const bNumber = ['2A', '2B'].includes(b) ? 20 : Number(b)
          return aNumber < bNumber ? -1 : 1
        })
      }
    },
    deleteZoning(): void {
      this.zoning = {
        type: 'include',
        postalCodes: [],
        country: 'FR',
      }
      this.zoningEligibility = null
    },
    countryIsActive(country: CountriesCodeEnum) {
      if (Array.isArray(country)) {
        return !!country.length
      }
      return country
    },
    changeDisplayedCountry(value: CountriesCodeEnum ) {
      this.selectedCountry = value
      this.fillSelectedDepartments(value)
      if (departmentEligibility.includes(value) && value !== COUNTRY.FRANCE) {
        this.changeDisplay(DISPLAY.list)
      }
    },
    fillSelectedDepartments(key: CountriesCodeEnum) {
      setTimeout(() => {
        // get the department from SVG
        const querySelector = `.${key} path`
        const paths = Array.from(document.querySelectorAll(querySelector))

        // if not france all department / if france light up selected department
        if (key !== COUNTRY.FRANCE && this.oeDepts[key]) {
          paths.forEach(element => {
            element.classList.add('selected')
          })
        } else if (key === COUNTRY.FRANCE) {
          for (const department of this.oeDepts[key] as any) {
            const path = paths.find(tmpPath => tmpPath.id === department)

            if (path) {
              path.classList.add('selected')
            }
          }
        }
      }, 200)
    },
    modifyZoning() {
      this.displayFileInput = true
    },
    changeDisplay(display: string) {
      this.selectedDisplay = display
      if (this.selectedDisplay === DISPLAY.map) {
        this.fillSelectedDepartments(this.selectedCountry)
      }
    },
    async loadZoningData(): Promise<void> {
      this.zoningEligibility = await OrderEligibilityService.getZoning({
        countryCode: 'FR',
        carrierId: this.params.carrierId,
        ...(this.params.retailerId && { retailerId: this.params.retailerId }),
        ...(this.params.storeId && { storeId: this.params.storeId }),
        ...(this.params.exchangePlaceId && { exchangePlaceId: this.params.exchangePlaceId }),
      })
      this.zoningFileName = this.zoningEligibility
        ? `zoning_${dateHelper.format(this.zoningEligibility.updatedAt!, 'yyyy-MM-dd')}.json`
        : null
      this.displayFileInput = false
    },
    async handleSubmit(): Promise<void> {
      try {
        this.showMap = false
        const dpts: Record<string, any> = {
          FR: [],
          ES: [],
          BE: [],
        }

        for (const selectedCountry of this.editSelectedCountries) {
          if (departmentEligibility.includes(selectedCountry)) {
            if (this.editSelectedDepartments[selectedCountry]?.length) {
              dpts[selectedCountry] = this.editSelectedDepartments[selectedCountry]
            } else {
              dpts[selectedCountry] = this.editDepartmentList[selectedCountry]
            }
          } else {
            dpts[selectedCountry] = true
          }
        }

        this.loading = true
        await OrderEligibilityService.update(this.params, {
          departments: Object.values(this.parentCountries).reduce((acc, country) => {
            return {
              ...acc,
              [country]: dpts[country] || false,
            }
          }, {}),
          ...(this.zoning && { zonings: [this.zoning] }),
        })
        this.orderEligibility.departments = JSON.parse(JSON.stringify(dpts))
        this.oeDepts = dpts
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        if (this.activeCountriesChips.find(({ value }: { value: string }) => value === this.selectedCountry)) {
          this.currentChip = this.activeCountriesChips.find(({ value }: { value: string }) => value === this.selectedCountry)
          this.changeDisplayedCountry(this.selectedCountry)
        } else {
          this.currentChip = this.activeCountriesChips[0]
          this.changeDisplayedCountry(this.activeCountriesChips[0].value)
        }
        this.loading = false
        this.showModal = false
        this.showMap = true
        if (this.zoning) {
          await wait(200)
          await this.loadZoningData()
        }
      }
    },
    enableOrDisableAllDepartments(event: boolean): void {
      if (!event) {
        this.editSelectedDepartments[this.selectedCountry] = []
        return
      }

      this.editSelectedDepartments[this.selectedCountry] = [
        ...this.editDepartmentList[this.selectedCountry],
      ]
    },
    downloadFile(): void {
      const element = document.createElement('a')

      element.setAttribute(
        'href',
        `data:application/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(this.zoningEligibility, null, '\t'),
        )}`,
      )
      element.setAttribute('download', this.zoningFileName!)
      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()
      document.body.removeChild(element)
    },
    async changeFile(file: File): Promise<void> {
      this.zoning = null
      if (!file) {
        return
      }

      try {
        const zoningFile =
          file.type === 'application/json'
            ? await this.parseFile(file)
            : await this.transformCsvFile(file)
        const parsedZoning = zoningFile && {
          ...(zoningFile.country && { country: zoningFile.country }),
          ...(zoningFile.type && { type: zoningFile.type }),
          ...(zoningFile.postalCodes && { postalCodes: zoningFile.postalCodes }),
          ...(zoningFile.cityCodes && { cityCodes: zoningFile.cityCodes }),
        }

        if (
          ['include', 'exclude'].includes(parsedZoning.type) &&
          typeof parsedZoning.country === 'string' &&
          ((!parsedZoning.postalCodes && parsedZoning.cityCodes?.length) ||
            (!parsedZoning.cityCodes && parsedZoning.postalCodes?.length))
        ) {
          this.zoning = parsedZoning
          this.processZoningFile(parsedZoning)
        } else {
          throw new Error(this.$t('page.carrier.perimeter.incorrectFileFormat'))
        }
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('page.carrier.perimeter.incorrectFileFormat'),
        })
      }
    },
    async transformCsvFile(file: File): Promise<void> {
      const selectedCountry = this.selectedCountry
      const rejectReason = this.$t('page.carrier.perimeter.incorrectFileFormat')
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header, index: number) => {
            return HEADERS[index] || header
          },
          complete: function(results: Papa.ParseResult<CsvParsedZoning>) {
            let isError = false
            let zoningFile = new Map()
            for (const zone of results.data) {
              const value = zoningFile?.get(zone.country) || {
                country: zone.country,
                type: zone.type,
                [zone.mode]: [],
              }

              if (value.type === zone.type) {
                value[zone.mode].push(zone.value)
                zoningFile.set(zone.country, value)
              } else {
                isError = true
                break
              }
            }

            zoningFile?.get(selectedCountry) && !isError
              ? resolve(zoningFile.get(selectedCountry))
              : reject(rejectReason)
          },
        })
      })
    },
    async parseFile(file: File): Promise<Record<string, any>> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
          const result = JSON.parse(reader.result as string)
          if (result.country === this.selectedCountry) {
            resolve(result)
          } else {
            reject(this.$t('page.carrier.perimeter.incorrectFileFormat'))
          }
        }
        reader.onerror = error => reject(error)
      })
    },
    processZoningFile(zoning: Zoning): void {
      if (!zoning) {
        return
      }

      this.editSelectedDepartments[this.selectedCountry] = []

      const codes = zoning.postalCodes ? zoning.postalCodes : zoning.cityCodes
      let departments: string[] = []

      if (this.selectedCountry === COUNTRY.FRANCE) {
        departments = codes!.reduce((acc, code) => {
          const department = code.substring(0, code.indexOf('97') === 0 ? 3 : 2)

          if (department === '20') {
            if (acc.includes('2A')) {
              return acc
            }
            return [...acc, '2A', '2B']
          }

          if (acc.includes(department)) {
            return acc
          }
          return [...acc, department]
        }, [] as string[])
      } else if (this.selectedCountry === COUNTRY.BELGIUM) {
        departments = codes!.reduce((acc, code) => {
          const department = code.substring(0, 2)

          for (const listedDepartment of this.editDepartmentListFiltered) {
            const codesdpt = listedDepartment.split('-')
            if (department <= codesdpt[1] && department >= codesdpt[0] && !acc.includes(listedDepartment)) {
              return [...acc, listedDepartment]
            }
          }
          return acc
        }, [] as string[])
      } else {
        departments = codes!.reduce((acc, code) => {
          const department = code.substring(0, 2)

          return [...acc, department]
        }, [] as string[])
      }

      this.editSelectedDepartments[this.selectedCountry] = departments.filter(dept =>
        this.editDepartmentList[this.selectedCountry].includes(dept),
      )
    },
    async handleCancel(): Promise<void> {
      this.displayFileInput = false
      this.showModal = !this.showModal
      await this.loadZoningData()
    },
    openDetail(country: CountriesCodeEnum) {
      this.showDepartmentForm = true
      this.selectedCountry = country
      if (!this.editSelectedDepartments[country] || !this.editSelectedCountries.includes(this.selectedCountry)) {
        this.editSelectedDepartments[country] = []
      }
    },
  },
  watch: {
    editSelectedDepartments: {
      deep: true,
      handler(next) {
        if (next[this.selectedCountry]?.length && this.showDepartmentForm && !this.editSelectedCountries.includes(this.selectedCountry)) {
          this.editSelectedCountries.push(this.selectedCountry)
        } else if (!next[this.selectedCountry]?.length && this.showDepartmentForm && this.editSelectedCountries.includes(this.selectedCountry)) {
          this.editSelectedCountries.splice(
            this.editSelectedCountries.findIndex(country => country === this.selectedCountry),
            1,
          )
        }

        this.allCheckbox[this.selectedCountry] =
          next[this.selectedCountry] &&
          next[this.selectedCountry].length === this.editDepartmentList[this.selectedCountry].length
      },
    },
    showModal(next: boolean) {
      if (!next) {
        this.editSelectedCountries = []
        this.editSelectedDepartments = emptyEditedDepartment
        this.showDepartmentForm = false
        this.searchedDepartement = ''
        this.currentChip = this.activeCountriesChips[0]
        this.changeDisplayedCountry(this.activeCountriesChips[0].value)
        return
      }

      for (const [country, value] of Object.entries(this.oeDepts)) {
        if (this.oeDepts[country] && departmentEligibility.includes(country) && value.length) {
          this.editSelectedCountries.push(country)
          this.editSelectedDepartments[country] = this.oeDepts[country]
          this.allCheckbox[country] = value.length === this.editDepartmentList[country].length
        } else if (this.oeDepts[country] && !departmentEligibility.includes(country)) {
          this.editSelectedCountries.push(country)
        }
      }
    },
    selectedCountry() {
      this.setAllowedCountries()
    },
    editSelectedCountries(next, old) {
      if (next.length > old.length) {
        let nextCountrySelected = next.filter(( value: string ) => !old.includes(value))
        if (!this.editSelectedDepartments[nextCountrySelected].length) {
          this.selectedCountry = nextCountrySelected
          this.enableOrDisableAllDepartments(true)
        }
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';
@import '../../../../styles/flags.scss';

.carrier-delivery-perimeter-modal {
  &.country-scroll {
    .main-dialog-content {
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        @import '../../../../styles/mixins/macScrollbar';
        @include setMacScrollbar('&');
        max-height: calc(100vh - 44rem);
        overflow-y: scroll;
      }

      .row-wrapper {
        display: flex;
        flex-direction: row;
        padding-bottom: 2rem !important;

        &:last-of-type {
          border-bottom: none;
        }
      }
    }
  }
  .main-dialog-content {
    .row-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-top: 2rem !important;
      padding-bottom: 2rem !important;

      &:first-of-type {
        padding-top: 4.1rem;
      }

      &:last-of-type {
        border-bottom: none;
      }

      .detail-wrapper {
        margin-top: 0.2rem;
        margin-left: 3.2rem;

        span {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }

    .search-wrapper {
      min-height: 8.4rem;
      background-color: $main-lighten-80-color;
      margin-bottom: 1.6rem;

      .v-input--is-focused {
        .mdi-magnify {
          color: $success-color !important;
        }
      }

      .v-text-field__details {
        display: none;
      }

      > div {
        height: 100%;
      }
    }

    .scroll {
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        @import '../../../../styles/mixins/macScrollbar';
        @include setMacScrollbar('&');
        max-height: calc(100vh - 44rem);
        overflow-y: scroll;
      }

      .back-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 2.8rem;
        cursor: pointer;
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}

#carrier-detail-perimeter {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .mp-button {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem;
    }
  }

  .chip-outer-wrapper {
    width: fit-content;
    padding-right: 2.3rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 1.5rem;
      margin-bottom: 2rem;
      width: 100%;
    }

    .chip-wrapper {
      max-width: fit-content;
      margin: 0 1.2rem 0.5rem 0;

      &:last-child {
        margin-right: 0;
      }

      .chip {
        cursor: pointer;

        &.chip-dsk {
          .v-chip__content {
            @include regular-14;
          }
        }

        &.chip-mobile {
          .v-chip__content {
            @include regular-16;
          }
        }

        &.chip-selected {
          background-color: $white;
          border: solid 0.2rem $main-color;
          border-radius: 5rem;
          cursor: default;
        }

        &.chip-no-selected {
          background-color: $white;
          border: solid 0.1rem $main-lighten-74-color;
        }
      }
    }
  }

  .no-covert-wrapper {
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    color: $error-color;

    i {
      margin-right: 1.2rem;
      color: $error-color;
    }
  }

  .switch-wrapper {
    min-height: 5rem;
  }

  .map-switch {
    display: flex;
    justify-content: flex-end;
    padding-right: 2.3rem;
    align-items: flex-start;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      justify-content: space-around;
      border: solid 0.1rem $main-lighten-74-color;
      border-radius: 0.4rem;
      min-height: 3rem;
      align-items: center;
      padding-right: 0;
    }

    .map {
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        margin-right: 2.5rem;
      }
      display: flex;
      align-items: center;
      cursor: pointer;

      &.selected {
        color: $success-color;

        i {
          color: $success-color;
        }
      }

      i {
        margin-right: 1rem;
        color: $main-color;
      }
    }

    .list {
      display: flex;
      align-items: center;
      cursor: pointer;

      &.selected {
        color: $success-color;

        i {
          color: $success-color;
        }
      }

      i {
        margin-right: 1rem;
        color: $main-color;
      }
    }
  }

  .list-outer-wrapper {
    min-height: 39.4rem;
    max-height: 39.4rem;
    overflow-y: scroll;
    @include setMacScrollbar('&');
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 1rem;
    }

    .department-outer-wrapper {
      min-height: 5.4rem;
      border-bottom: solid 0.1rem $main-lighten-65-color;

      &:last-child {
        border-bottom: none;
      }

      .department-wrapper {
        display: flex;
        align-items: center;
      }
    }
  }

  .min-size {
    min-height: 39.4rem;
    max-height: 39.4rem;
  }

  .map-wrapper {
    display: flex;
    justify-content: center;
    min-height: 39.4rem;

    svg {
      width: 37.9rem;
      height: 39.4rem;

      path {
        fill: $white;
        stroke: $main-lighten-65-color;
        stroke-width: 0.2rem;

        &.selected {
          fill: $success-color;
        }
      }
    }
  }
}
</style>
