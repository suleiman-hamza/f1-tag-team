<script setup lang="ts">
useSeoMeta({ title: '2026 Schedule — F1 League', description: 'Full 2026 F1 race calendar with countdown timers.' })

interface Race {
    id: string
    name: string
    location: string
    startAt: string
    season: number
    round: number
    locked: boolean
    open: boolean
    lockTime: string
    openTime: string
    hasResult: boolean
}

const { data: races, status } = useFetch<Race[]>('/api/races')
// const { data: races, status } = useCachedFetch<Race[]>('/api/races')
const lastLeague = useLastLeague()
</script>
<template>
    <UContainer class="py-8">
        <div class="flex items-center justify-between mb-8">
            <div>
                <p class="text-sm text-zinc-500 uppercase tracking-[0.15em] font-semibold">
                    2026 Season
                </p>
                <h1 class="text-2xl font-black uppercase tracking-tight mt-1">
                    Schedule
                </h1>
            </div>
            <div v-if="races" class="text-sm text-zinc-500 tabular-nums">
                {{races.filter((r: any) => r.hasResult).length}}/{{ races.length }} completed
            </div>
        </div>
    </UContainer>
</template>
