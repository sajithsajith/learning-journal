// src/components/FullScreenPlayer.vue

<template>
  <div class="fullscreen-player" @click.self="$emit('close')">
    <img :src="song.albumCover" class="fullscreen-album-cover" alt="Album Cover" />
    <div class="player-controls">
      <h2>{{ song.title }}</h2>
      <p>{{ song.artist }}</p>
      <div>
        <button @click.stop="$emit('prev')">⏮</button>
        <button @click.stop="togglePlay">{{ isPlaying ? '⏸' : '▶️' }}</button>
        <button @click.stop="$emit('next')">⏭</button>
      </div>
      <input
        type="range"
        class="progress-bar"
        :value="currentTime"
        @input="seek"
        :max="duration"
        step="0.1"
      />
    </div>
    <audio ref="audioPlayer" :src="song.src" @timeupdate="updateProgress" @ended="$emit('next')"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  song: Object
});

defineEmits(['close', 'next', 'prev']);

const audioPlayer = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.play().catch(error => {
      console.error("Playback failed on mount:", error);
    });
    isPlaying.value = true;
    audioPlayer.value.onloadedmetadata = () => {
      duration.value = audioPlayer.value.duration;
    };
  }
});

watch(() => props.song, (newSong) => {
  if (audioPlayer.value && newSong && newSong.src) {
    audioPlayer.value.src = newSong.src;
    audioPlayer.value.play().catch(error => {
        console.error("Playback failed on song change:", error);
    });
    isPlaying.value = true;
  }
});

const togglePlay = () => {
  if (!audioPlayer.value) return;
  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play().catch(error => console.error("Toggle play failed:", error));
  }
  isPlaying.value = !isPlaying.value;
};

const updateProgress = () => {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
  }
};

const seek = (event) => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = event.target.value;
  }
};
</script>