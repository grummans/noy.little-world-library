<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="route.path.startsWith('/read') ? '' : 'page'"
      mode="out-in"
    >
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
