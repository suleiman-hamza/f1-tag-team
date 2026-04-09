<script setup lang="ts">
useSeoMeta({
    title: 'F1 League — Predict. Compete. Win.',
    description: 'Predict the F1 Top 10 for every Grand Prix. Compete with friends across the season.',
})

const { loggedIn, user } = useUserSession()
</script>
<template>
    <main v-if="!loggedIn">
        <div class="overflow-hidden relative">
            <div class="absolute inset-0 bg-linear-to-br from-brand-500/15 via-zinc-950 to-zinc-950"></div>
            <div class="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-brand-500/5 to-transparent" />
            <div
                class="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-brand-500/40 to-transparent" />

            <UContainer class="relative py-28 lg:py-32">
                <div class="max-w-2xl">
                    <p class="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8">
                        Prediction League — 2026 Season
                    </p>
                    <h1 class="text-5xl/none lg:text-7xl/none font-black uppercase tracking-tight">
                        Predict.
                        <br>
                        <span class="text-brand-500">Compete.</span>
                        <br>
                        Win.
                    </h1>
                    <p class="mt-6 text-lg/8 text-zinc-400 max-w-lg">
                        Predict the Top 10 finishing order for every Grand Prix. Create or join leagues, earn points for
                        accuracy, and compete with friends across the entire season.
                    </p>
                    <div class="flex items-center gap-4 mt-10">
                        <UButton to="/register" label="Get Started" size="xl"
                            class="font-bold bg-brand-500 hover:bg-brand-600 border-0" />
                        <UButton to="/login" label="Sign in" variant="outline" size="xl" class="font-semibold" />
                    </div>
                </div>
            </UContainer>
        </div>
    </main>
    <main v-else>
        <UContainer class="py-8">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <p class="text-sm text-zinc-500 uppercase tracking-[0.15em] font-semibold">
                        Dashboard
                    </p>
                    <h1 class="text-2xl font-black mt-1">
                        Hey {{ user?.name }}
                    </h1>
                </div>
            </div>
        </UContainer>
    </main>
</template>
