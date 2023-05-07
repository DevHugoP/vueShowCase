import { getDefaultContact, Contact } from '@/types'

export class ContactService {
  public buildContact(contact?: Contact): Contact {
    return { ...getDefaultContact(), ...contact }
  }
}

export default new ContactService()
