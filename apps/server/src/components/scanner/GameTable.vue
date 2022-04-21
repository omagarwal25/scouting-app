<template>
  <table class="divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          v-for="i in [
            'Team Number',
            'Type',
            'Match Number',
            'Color',
            'Scout',
            'Scout ID',
          ]"
        >
          {{ i }}
        </th>
        <th scope="col" class="relative px-6 py-3">
          <span class="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      <tr class="m-2 border-b p-2" v-for="game in games.games">
        <td
          class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500"
        >
          {{ game.data.split(',')[22] }}
        </td>
        <td
          class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500"
        >
          {{ game.data.split(',')[19] }}
        </td>
        <td
          class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500"
        >
          {{ game.data.split(',')[18] }}
        </td>
        <td
          class="whitespace-nowrap px-6 py-4 text-sm capitalize"
          :class="
            game.data.split(',')[21] === 'red'
              ? 'text-red-700'
              : 'text-blue-700'
          "
        >
          {{ game.data.split(',')[21] }}
        </td>
        <td
          class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500"
        >
          {{ game.data.split(',')[24] }}
        </td>
        <td
          class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500"
        >
          {{ game.data.split(',')[20] }}
        </td>
        <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
          <button
            @click="onDelete(game.hash)"
            class="text-indigo-600 hover:text-indigo-900"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useGamesStore } from '~/stores/games';

const games = useGamesStore();

const onDelete = (game: string) => {
  games.remove(game);
};
</script>
