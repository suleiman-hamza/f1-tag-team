<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// definePageMeta({ auth: 'guest' })
useSeoMeta({ title: 'Back on the Grid — F1 League' })

// const { client } = useUserSession()
// const toast = useToast()
const route = useRoute()

const queryEmail = route.query.email as string | undefined
const queryCode = route.query.code as number | undefined
const isMagicLink = !!(queryEmail && queryCode)

const step = ref<'email' | 'otp' | 'verifying'>(isMagicLink ? 'verifying' : 'email')
const loading = ref(isMagicLink)

const emailSchema = z.object({
    email: z.email('Enter a valid email address'),
})
const emailState = reactive({ email: queryEmail || '' })

const otpSchema = z.object({
    otp: z.array(z.int()),
})
const otpState = reactive({ otp: undefined })

// onMounted(() => {
//   if (isMagicLink) verifyCode()
// })

function sendCode() {
    loading.value = true
    try {
        step.value = 'otp'
        // toast.add({ title: 'Code sent', description: 'Check your email for the login code', color: 'success', icon: 'i-lucide-mail' })
    } catch (error) {
        console.warn("Error sending code:", error)
        // toast.add({ title: 'Error', description: 'Could not send code. Make sure your email is registered.', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-[calc(100dvh-60px)] px-4">
        <div class="max-w-sm w-full">
            <div class="text-center mb-8">
                <div class="flex gap-3 justify-center items-center mb-6">
                    <F1Logo class="text-brand-500 w-auto h-5 sm:h-7" />
                    <div class="h-5 w-px bg-zinc-700" />
                    <span class="font-black text-sm uppercase tracking-[0.2em] text-zinc-300">League</span>
                </div>
                <h1 class="text-2xl font-black uppercase tracking-tight">
                    Sign In
                </h1>
                <p class="text-zinc-500 text-sm mt-1">We'll send you a login code by email</p>
            </div>

            <!--form goes here-->
            <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div v-if="step === 'verifying'" class="py-8 text-center">
                    <UIcon name="i-lucide-loader" class="size-6 animate-spin mx-auto mb-3 text-zinc-400" />
                    <p class="text-sm text-zinc-400">
                        Signing you in...
                    </p>
                </div>

                <UForm v-else-if="step === 'email'" :schema="emailSchema" :state="emailState"
                    class="flex flex-col gap-4" @submit="sendCode"
                    @keydown.meta.enter.prevent="($event.target as HTMLElement).closest('form')?.requestSubmit()">
                    <UFormField label="Email">
                        <UInput v-model="emailState.email" size="lg" class="w-full" placeholder="you@example.com"
                            autofocus required />
                    </UFormField>
                    <UButton label="Send login code" icon="i-lucide-mail" type="submit" block :loading size="lg"
                        class="mt-2 font-bold bg-brand-500 hover:bg-[#004dc0] border-0" />
                </UForm>

                <!--otp state form visible on condition step==='otp-->
                <UForm v-else :schema="otpSchema" :state="otpState.otp"
                    class="flex flex-col justify-center items-center gap-4">
                    <span class="">
                        <UIcon name="i-lucide-message-square-more" class="size-10" />
                    </span>

                    <p class="text-sm text-zinc-400">
                        We've sent a code to <span class="text-white font-medium">{{ emailState.email }}</span>
                    </p>

                    <UFormField name="otp" class="flex text-center justify-center" required>
                        <UPinInput type="number" otp :length="6" placeholder="_" v-model="otpState.otp" size="lg"
                            class="mx-auto text-center font-mono text-lg tracking-[0.3em]" autofocus />
                    </UFormField>

                    <UButton type="submit" label="Verify" block :loading size="lg"
                        class="mt-2 font-bold bg-brand-500 hover:bg-[#004dc0] border-0" />

                    <UFieldGroup class="flex gap-6">
                        <button type="button" class="text-xs text-zinc-500 hover:text-white transition-colors"
                            @click="step = 'email'">
                            Change email
                        </button>
                        <div class="h-5 w-px bg-zinc-700" />
                        <button type="button" class="text-xs text-zinc-500 hover:text-white transition-colors"
                            @click="step = 'email'">
                            Resend
                        </button>
                    </UFieldGroup>
                </UForm>
            </div>

            <p class="text-center text-sm text-zinc-500 mt-6">
                Don't have an account?
                <NuxtLink to="/register" class="text-brand-500 font-semibold hover:underline">
                    Register
                </NuxtLink>
            </p>
        </div>
    </div>
</template>