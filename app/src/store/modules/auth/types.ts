import { AuthStatus } from '@/constants'
import { CurrentUserEntity } from '@/types'

export interface AuthState {
  reset: string
  status: AuthStatus
  currentUser: CurrentUserEntity
  specificPartnerLoginCode: string
  error: string
  provider: string
}
