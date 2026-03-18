<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { client } = useUserSession()
const toast = useToast()

definePageMeta({ auth: 'guest' })
useSeoMeta({ title: 'Join the League — F1 League' })

const step = ref<'info' | 'otp'>('info')
const loading = ref(false)

const infoSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, '50 characters max'),
    email: z.email('Enter a valid email address'),
})

type InfoSchema = z.output<typeof infoSchema>

const infoState = reactive<Partial<InfoSchema>>({ name: '', email: '' })

const otpSchema = z.object({
    otp: z.array(z.int()),
})
const otpState = reactive({ otp: undefined })

async function sendCode() {
    loading.value = true
    try {
        await client!.emailOtp.sendVerificationOtp({
            email: infoState.email!,
            type: 'sign-in',
        })
        step.value = 'otp'
        toast.add({ title: 'Code sent', description: 'Check your email for the verification code', color: 'success', icon: 'i-lucide-mail' })
    } catch (error) {
        console.warn('Error Processing..', error)
        // toast.add({ title: 'Error', description: 'Could not send code', color: 'error' })
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
                    Join the League
                </h1>
                <p class="text-zinc-500 text-sm mt-1">Create your account and start predicting</p>
            </div>
            <div class="rounded-2xl bg-zinc-900/50 border-zinc-800 border p-6">
                <UForm v-if="step === 'info'" :schema="infoSchema" :state="infoState" @submit="sendCode"
                    class="flex flex-col gap-4">
                    <UFormField label="Name" name="fullname" required>
                        <UInput v-model="infoState.name" placeholder="Your name" size="lg" class="w-full bg-transparent"
                            autofocus />
                    </UFormField>

                    <UFormField label="Email" name="email" required>
                        <UInput v-model="infoState.email" type="email" placeholder="you@example.com" size="lg"
                            class="w-full" />
                    </UFormField>

                    <UButton type="submit" label="Send verification code" icon="i-lucide-mail" block :loading size="lg"
                        class="mt-2 font-bold bg-brand-500 hover:bg-[#004dc0] border-0" />
                </UForm>
                <!--otp state form visible on condition step==='otp-->
                <UForm v-else :schema="otpSchema" :state="otpState"
                    class="flex flex-col justify-center items-center gap-4">
                    <span class="">
                        <UIcon name="i-lucide-message-square-more" class="size-10" />
                    </span>

                    <p class="text-sm text-zinc-400">
                        We've sent a code to <span class="text-white font-medium">{{ infoState.email }}</span>
                    </p>

                    <UFormField name="otp" class="flex text-center justify-center" required>
                        <UPinInput type="number" otp :length="6" placeholder="_" v-model="otpState.otp" size="lg"
                            class="mx-auto text-center font-mono text-lg tracking-[0.3em]" autofocus />
                    </UFormField>

                    <UButton type="submit" label="Verify" block :loading size="lg"
                        class="mt-2 font-bold bg-brand-500 hover:bg-[#004dc0] border-0" />

                    <UFieldGroup class="flex gap-6">
                        <button type="button" class="text-xs text-zinc-500 hover:text-white transition-colors"
                            @click="step = 'info'">
                            Change email
                        </button>
                        <div class="h-5 w-px bg-zinc-700" />
                        <button type="button" class="text-xs text-zinc-500 hover:text-white transition-colors"
                            @click="step = 'info'">
                            Resend
                        </button>
                    </UFieldGroup>
                </UForm>
            </div>

            <p class="text-center text-sm text-zinc-500 mt-6">
                Already have an account?
                <NuxtLink to="/login" class="text-brand-500 font-semibold hover:underline">
                    Sign in
                </NuxtLink>
            </p>
        </div>
    </div>
</template>