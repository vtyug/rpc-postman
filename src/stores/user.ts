import { defineStore } from 'pinia'
import { PersistenceOptions } from 'pinia-plugin-persistedstate'
import { ref } from 'vue'
import { post } from '../api/fetch'
import { $t } from '../i18n'
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/user'
import { displayNotification } from '../utils/message'
import router from '../router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const registerForm = ref<RegisterRequest>({
    username: "",
    password: ""
  })
  const loginForm = ref<LoginRequest>({
    username: "",
    password: ""
  })


  const handleRegister = async () => {
    try {
      const resp = await post<RegisterResponse>('/api/user/register', { username: registerForm.value.username, password: registerForm.value.password })
      if (resp.success) {
        displayNotification($t('auth.register.success'), 'success')
      }
    } catch (error) {
      displayNotification($t('auth.register.failure'), 'error')
      console.log(error)
    }
  }

  const handleLogin = async () => {
    try {
      const resp = await post<LoginResponse>('/api/user/login', { username: loginForm.value.username, password: loginForm.value.password })
      if (resp.success) {
        token.value = resp.data.token
        router.push({ name: 'Request' })
        displayNotification($t('auth.login.success'), 'success')
      }
    } catch (error) {
      displayNotification($t('auth.login.failure'), 'error')
    }
  }

  return {
    token,
    registerForm,
    loginForm,
    handleRegister,
    handleLogin
  }
},
  {
    persist: {
      key: 'token',
      storage: localStorage,
      paths: ['token']
    } as PersistenceOptions,
  }
);