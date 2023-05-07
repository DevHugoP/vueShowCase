import ContactMapper from '@/services/contact/ContactMapper'
import { CreateStore, StoreEntity } from '@/types'

export default class StoreMapper {
  static toDto(store: StoreEntity): CreateStore {
    const { contacts } = store

    return {
      ...store,
      contacts: contacts.map(contact => ContactMapper.toDto(contact)),
    }
  }
}
