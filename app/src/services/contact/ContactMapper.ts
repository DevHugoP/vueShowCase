import { Contact } from '@/types'

export default class ContactMapper {
  static toDto(contact: Contact): Contact {
    const {
      phone,
      email,
      firstName,
      lastName,
      main,
      title,
      timezone,
      language,
      isProfessional,
    } = contact
    return {
      phone,
      email: email.toLowerCase(),
      firstName,
      lastName,
      main,
      title,
      timezone,
      language,
      isProfessional,
    }
  }
}
