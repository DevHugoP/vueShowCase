import { i18n } from '@/plugins/i18n'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import CharacterGridView from '@ckeditor/ckeditor5-special-characters/src/ui/charactergridview'
import CharacterInfoView from '@ckeditor/ckeditor5-special-characters/src/ui/characterinfoview'
import SpecialCharactersNavigationView from '@ckeditor/ckeditor5-special-characters/src/ui/specialcharactersnavigationview'
import '@ckeditor/ckeditor5-special-characters/theme/specialcharacters.css'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import htmlParser from 'prettier/parser-html'
import prettier from 'prettier/standalone'

const pickingInformations = [
  {
    key: 'exchangePlaceName',
    value: '{{exchangePlace.name}}',
    label: 'technical.wysiwyg.picking.exchangePlace.name',
  },
  {
    key: 'storeName',
    value: '{{store.name}}',
    label: 'technical.wysiwyg.picking.store.name',
  },
  {
    key: 'pickingIntervalStart',
    value: '{{picking.interval.0.start}}',
    label: 'technical.wysiwyg.picking.interval.start',
  },
  {
    key: 'pickingIntervalEnd',
    value: '{{picking.interval.0.end}}',
    label: 'technical.wysiwyg.picking.interval.end',
  },
  {
    key: 'pickingAddress',
    value: '{{picking.address.addressLine1}}',
    label: 'technical.wysiwyg.picking.address.address',
  },
  {
    key: 'pickingPostalCode',
    value: '{{picking.address.postalCode}}',
    label: 'technical.wysiwyg.picking.address.postalCode',
  },
  {
    key: 'pickingCity',
    value: '{{picking.address.city}}',
    label: 'technical.wysiwyg.picking.address.city',
  },
  {
    key: 'pickingCountry',
    value: '{{picking.address.country}}',
    label: 'technical.wysiwyg.picking.address.country',
  },
]

const contactPickingInformations = [
  {
    key: 'pickingContactFirstname',
    value: '{{picking.contact.firstName}}',
    label: 'technical.wysiwyg.picking.contact.firstname',
  },
  {
    key: 'pickingContactLastname',
    value: '{{picking.contact.lastName}}',
    label: 'technical.wysiwyg.picking.contact.lastname',
  },
  {
    key: 'pickingContactPhone',
    value: '{{picking.contact.phone}}',
    label: 'technical.wysiwyg.picking.contact.phone',
  },
  {
    key: 'pickingContactEmail',
    value: '{{picking.contact.email}}',
    label: 'technical.wysiwyg.picking.contact.email',
  },
]

const contactDeliveryInformations = [
  {
    key: 'deliveryContactFirstname',
    value: '{{delivery.contact.firstName}}',
    label: 'technical.wysiwyg.delivery.contact.firstname',
  },
  {
    key: 'deliveryContactLastname',
    value: '{{delivery.contact.lastName}}',
    label: 'technical.wysiwyg.delivery.contact.lastname',
  },
  {
    key: 'deliveryContactPhone',
    value: '{{delivery.contact.phone}}',
    label: 'technical.wysiwyg.delivery.contact.phone',
  },
  {
    key: 'deliveryContactEmail',
    value: '{{delivery.contact.email}}',
    label: 'technical.wysiwyg.delivery.contact.email',
  },
]

const deliveryInformations = [
  {
    key: 'deliveryIntervalStart',
    value: '{{delivery.interval.0.start}}',
    label: 'technical.wysiwyg.delivery.interval.start',
  },
  {
    key: 'deliveryIntervalEnd',
    value: '{{delivery.interval.0.end}}',
    label: 'technical.wysiwyg.delivery.interval.end',
  },
  {
    key: 'deliveryAddress',
    value: '{{delivery.address.addressLine1}}',
    label: 'technical.wysiwyg.delivery.address.address',
  },
  {
    key: 'deliveryPostalCode',
    value: '{{delivery.address.postalCode}}',
    label: 'technical.wysiwyg.delivery.address.postalCode',
  },
  {
    key: 'deliveryCity',
    value: '{{delivery.address.city}}',
    label: 'technical.wysiwyg.delivery.address.city',
  },
  {
    key: 'deliveryCountry',
    value: '{{delivery.address.country}}',
    label: 'technical.wysiwyg.delivery.address.country',
  },
  {
    key: 'addCreatedDate',
    label: 'technical.wysiwyg.other.createdDate',
    value: '{{delivery.createdAt}}',
  },
]

const packages = [
  {
    key: 'package',
    label: 'technical.wysiwyg.packages.package',
    value: `{{#packages}}
{{quantity}}
{{length.value}}{{length.unit}}
{{width.value}}{{width.unit}}
{{height.value}}{{height.unit}}
{{weight.value}}{{weight.unit}}

{{#products}}
{{quantity}}
{{label}}
{{ean}}
{{type}}
{{/products}}
{{/packages}}`,
  },
  {
    key: 'packagesLoop',
    label: 'technical.wysiwyg.packages.packagesLoop',
    value: `{{#packages}}{{/packages}}`,
  },
  {
    key: 'quantity',
    label: 'technical.wysiwyg.packages.quantity',
    value: `{{quantity}}`,
  },
  {
    key: 'dimensions',
    label: 'technical.wysiwyg.packages.dimensions',
    value: `{{length.value}}{{length.unit}}
    {{width.value}}{{width.unit}}
    {{height.value}}{{height.unit}}
    {{weight.value}}{{weight.unit}}`,
  },
]

const products = [
  {
    key: 'productsLoop',
    label: 'technical.wysiwyg.products.productsLoop',
    value: `{{#packages}}{{#products}}{{/products}}{{/packages}}`,
  },
  {
    key: 'quantity',
    label: 'technical.wysiwyg.products.quantity',
    value: `{{quantity}}`,
  },
  {
    key: 'ean',
    label: 'technical.wysiwyg.products.ean',
    value: `{{ean}}`,
  },
  {
    key: 'cug',
    label: 'technical.wysiwyg.products.cug',
    value: `{{cug}}`,
  },
  {
    key: 'type',
    label: 'technical.wysiwyg.products.type',
    value: `{{type}}`,
  },
]

const carrierInformations = [
  {
    key: 'addCarrierName',
    label: 'technical.wysiwyg.carrier.name',
    value: '{{carrier.name}}',
  },
]

const collectInformations = [
  {
    key: 'exchangePlaceName',
    value: '{{exchangePlaceName}}',
    label: 'technical.wysiwyg.collect.exchangePlaceName',
  },
  {
    key: 'addCollectId',
    label: 'technical.wysiwyg.collect.collectId',
    value: '{{collectId}}',
  },
  {
    key: 'clientContact',
    label: 'technical.wysiwyg.collect.clientContact',
    value: `{{customer.firstName}}{{customer.lastName}}{{customer.phone}}{{customer.email}}`,
  },
  {
    key: 'pickingDateStart',
    label: 'technical.wysiwyg.collect.pickingDateStart',
    value: `{{pickingDateStart}}`,
  },
  {
    key: 'pickingAddress',
    label: 'technical.wysiwyg.collect.pickingAddress',
    value: `{{externalExchangePlaceId}}`,
  },
  {
    key: 'slotSelectUrl',
    label: 'technical.wysiwyg.collect.slotSelectUrl',
    value: `{{slotSelectUrl}}`,
  },
  {
    key: 'presenceUrl',
    label: 'technical.wysiwyg.collect.presenceUrl',
    value: `{{presenceUrl}}`,
  },
  {
    key: 'trackingUrl',
    label: 'technical.wysiwyg.collect.trackingUrl',
    value: `{{trackingUrl}}`,
  },
  {
    key: 'surveyUrl',
    label: 'technical.wysiwyg.collect.surveyUrl',
    value: `{{collectSurveyUrl}}`,
  },
]

const otherInformations = [
  {
    key: 'addServices',
    label: 'technical.wysiwyg.other.services',
    value: '{{#services}}{{.}}{{/services}}',
  },
  {
    key: 'addOrderId',
    label: 'technical.wysiwyg.other.orderId',
    value: '{{orderId}}',
  },
  {
    key: 'deliverySurveyUrl',
    label: 'technical.wysiwyg.other.deliverySurveyUrl',
    value: '{{deliverySurveyUrl}}',
  },
  {
    key: 'trackingPageUrl',
    label: 'technical.wysiwyg.other.trackingPageUrl',
    value: '{{trackingPageUrl}}',
  },
]

export class CustomInput extends Plugin {
  private editor: any
  private characters = new Map()
  private groups = new Map()

  constructor(editor: any) {
    super(editor)
    this.editor = editor
  }

  init(): unknown {
    const {
      editor,
      editor: { locale, config: { _config: { eventType = '' } = {} } = {}, ui, commands } = {},
    } = this

    if (!editor) {
      return
    }

    const inputCommand = commands.get('input')

    ui.componentFactory.add('prettier', () => {
      const button = new ButtonView()

      button.set({
        label: i18n.t('technical.wysiwyg.prettier'),
        keystroke: 'Ctrl+P',
        tooltip: false,
        withText: true,
      })

      button.on('execute', () => {
        // Replace all encoded html to avoid errors
        const editorData = editor
          .getData()
          .replace(/<p>(.*?)<\/p>/gm, '$1')
          .replace(/&amp;/gm, '&')
          // .replace(/&lt;/gm, '<')
          // .replace(/&gt;/gm, '>')
          .replace(/&nbsp;/gm, ' ')
          .replace(/<br>/gm, '\n')
        const formatedData = prettier.format(editorData, { parser: 'html', plugins: [htmlParser] })
        editor.setData(formatedData)
      })

      return button
    })

    ui.componentFactory.add('specialCharacters', () => {
      const dropdownView = createDropdown(locale)
      let dropdownPanelContent: any

      dropdownView.buttonView.set({
        label: i18n.t('technical.wysiwyg.insert'),
        withText: true,
      })

      dropdownView.bind('isEnabled').to(inputCommand)

      // Insert a special character when a tile was clicked.
      dropdownView.on('execute', (evt: any, data: any) => {
        editor.execute('input', { text: data.name })
        editor.editing.view.focus()
      })

      dropdownView.on('change:isOpen', () => {
        if (!dropdownPanelContent) {
          dropdownPanelContent = this._createDropdownPanelContent(locale, dropdownView)

          dropdownView.panelView.children.add(dropdownPanelContent.navigationView)
          dropdownView.panelView.children.add(dropdownPanelContent.gridView)
          dropdownView.panelView.children.add(dropdownPanelContent.infoView)
        }

        dropdownPanelContent.infoView.set({
          character: null,
          name: null,
        })
      })

      return dropdownView
    })

    if (eventType !== 'CLICK_AND_COLLECT') {
      this.addItems(
        i18n.t('technical.wysiwyg.picking.infos'),
        pickingInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.picking.contact.infos'),
        contactPickingInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.delivery.infos'),
        deliveryInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.delivery.contact.infos'),
        contactDeliveryInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.carrier.infos'),
        carrierInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.packages.infos'),
        packages.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.products.infos'),
        products.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.otherInformations'),
        otherInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
    } else {
      this.addItems(
        i18n.t('technical.wysiwyg.collectInformations'),
        collectInformations.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.packages.infos'),
        packages.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
      this.addItems(
        i18n.t('technical.wysiwyg.products.infos'),
        products.map(({ value, label }) => ({ title: i18n.t(label), value })),
      )
    }
  }

  addItems(groupName: string, items: Array<Record<string, any>>): void {
    const group = this._getGroup(groupName)

    for (const item of items) {
      group.add(item.value)
      this.characters.set(item.value, item.title)
    }
  }

  getGroups(): IterableIterator<any> {
    return this.groups.keys()
  }

  getCharactersForGroup(groupName: string): string {
    return this.groups.get(groupName)
  }

  getCharacter(title: string): string | undefined {
    return this.characters.get(title)
  }

  _getGroup(groupName: string): any {
    if (!this.groups.has(groupName)) {
      this.groups.set(groupName, new Set())
    }

    return this.groups.get(groupName)
  }

  _updateGrid(currentGroupName: string, gridView: any): void {
    gridView.tiles.clear()

    const characterTitles = this.getCharactersForGroup(currentGroupName)

    for (const title of characterTitles) {
      const character = this.getCharacter(title)

      gridView.tiles.add(gridView.createTile(character, title))
    }
  }

  _createDropdownPanelContent(locale: any, dropdownView: any): Record<string, any> {
    const specialCharsGroups = [...this.getGroups()]

    const navigationView = new SpecialCharactersNavigationView(locale, specialCharsGroups)
    const gridView = new CharacterGridView(locale)
    const infoView = new CharacterInfoView(locale)

    gridView.delegate('execute').to(dropdownView)

    gridView.on('tileHover', (evt: any, data: any) => {
      infoView.set(data)
    })

    navigationView.on('execute', () => {
      this._updateGrid(navigationView.currentGroupName, gridView)
    })

    this._updateGrid(navigationView.currentGroupName, gridView)

    return { navigationView, gridView, infoView }
  }
}
