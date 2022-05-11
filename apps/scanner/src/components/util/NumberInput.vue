<template>
  <VertFlex>
    <label :for="id">{{ label }}</label>
    <input
      class="rounded border p-2"
      :id="id"
      type="number"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </VertFlex>
</template>

<script>
import VertFlex from './FlexVert.vue';
export default {
  props: {
    modelValue: String,
    id: String,
    placeholder: String,
    label: String,
  },
  components: { VertFlex },
};
</script>
