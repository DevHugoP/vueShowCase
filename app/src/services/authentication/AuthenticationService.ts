import { redirectToLogin } from '@/router'
import Repository from '@/services/Repository'
import store from '@/store'

class AuthenticationService {
  async initializeProvider(provider: string): Promise<{ url: string }> {
    const { data } = await Repository.get(`auth/provider/${provider}`)
    return data
  }

  sendResetPasswordCallbackUrl(params: Record<string, string>): Promise<void> {
    return Repository.get(`auth/reset`, { params })
  }

  sendPasswordLessAuthentication(params: Record<string, string>): Promise<void> {
    const { email, code } = params
    return Repository.get(`auth/passwordless?email=${email}&code=${code}`)
  }

  resetUserPassword(body: Record<string, string>): Promise<void> {
    return Repository.post(`auth/reset`, { ...body })
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string } | undefined> {
    try {
      const {
        data: { access_token, refresh_token },
      } = await Repository.get(`auth/refresh`, { params: { refreshToken } })

      return { access_token, refresh_token }
    } catch (err) {
      await store.dispatch('auth/logout')
      redirectToLogin()
    }
  }
}

export default new AuthenticationService()
