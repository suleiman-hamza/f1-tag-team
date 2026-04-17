// define the shape of your data so TypeScript knows exactly what properties a league and its members should have.
export interface LeagueMemberPreview {
  userId: string;
  name: string;
  image: string | null;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  season: number;
  createdAt: string;
  role: string;
  joinedAt: string;
  memberCount: number;
  members: LeagueMemberPreview[];
}

export function useLeagues() {
  const { loggedIn } = useUserSession();

  const result = useFetch<League[]>("/api/leagues", {
    key: "leagues",
    immediate: loggedIn.value,
    watch: false,
  });

  // sets up a client-side watcher
  if (import.meta.client) {
    const stop = watch(
      loggedIn,
      (isLoggedIn) => {
        if (isLoggedIn && !result.data.value) {
          result.refresh();
          // immediately kills the watcher, so it doesn't unnecessarily re-trigger later
          stop();
        }
      },
      { immediate: true },
    );
  }

  return result;
}
// It uses useLocalStorage (likely from VueUse) to remember the last league the user looked
// Because local storage only exists in the browser, it safely falls back to a standard Vue ref during Server-Side Rendering (SSR) to prevent hydration mismatches.
const lastLeagueSlug = import.meta.client
  ? useLocalStorage("f1-last-league", "")
  : ref("");

export function useActiveLeagueSlug() {
  return lastLeagueSlug;
}

export function useCurrentLeague() {
  const route = useRoute();
  const routeSlug = computed(() => route.params.slug as string | undefined);

  const { data: leagues, refresh } = useLeagues();

  if (routeSlug.value) {
    lastLeagueSlug.value = routeSlug.value;
  }

  watch(routeSlug, (slug) => {
    if (slug) lastLeagueSlug.value = slug;
  });

  const league = computed(() => {
    if (!routeSlug.value || !leagues.value) return null;
    return leagues.value.find((l) => l.slug === routeSlug.value) ?? null;
  });

  const leagueId = computed(() => league.value?.id ?? null);
  const isLeagueAdmin = computed(() => league.value?.role === "admin");

  return {
    league,
    leagueId,
    slug: routeSlug,
    isLeagueAdmin,
    refreshLeagues: refresh,
  };
}

export function useLastLeague() {
  const { data: leagues } = useLeagues();

  const league = computed(() => {
    if (!leagues.value?.length) return null;
    if (lastLeagueSlug.value) {
      const found = leagues.value.find((l) => l.slug === lastLeagueSlug.value);
      if (found) return found;
    }
    return leagues.value[0] ?? null;
  });

  return league;
}
