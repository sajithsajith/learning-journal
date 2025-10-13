
<template>
  <div>
    <div class="gdrive-controls">
      <button v-if="!gDrive.isSignedIn.value" @click="gDrive.signIn">
        Connect to Google Drive
      </button>
      <button v-else @click="gDrive.signOut" class="sign-out-btn">
        Disconnect Google Drive
      </button>
      <p v-if="gDrive.isSignedIn.value" class="folder-info">
        Songs are synced with your "Vue Music Player Files" folder.
      </p>
    </div>
    <div
      class="upload-area"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ dragging: isDragging }"
    >
      <p>Drag & Drop local music files here</p>
    </div>

    <div v-if="isSongLoading">Preparing song for playback...</div>
    <div v-if="gDrive.isLoading.value">Syncing with Google Drive...</div>
    
    <div class="music-grid">
      <div v-for="song in localSongs" :key="song.src" class="song-tile" @click="playSong(song)">
        <img :src="song.albumCover" class="album-cover" alt="Album Cover" />
        <div class="song-info">
          <h3 class="song-title">{{ song.title }}</h3>
          <p class="song-artist">{{ song.artist }}</p>
        </div>
        <div class="tile-footer">
          <img src="../assets/local_icon.svg" class="source-icon" alt="Local File" title="Local File"/>
          <button v-if="gDrive.isSignedIn.value" class="upload-btn" @click.stop="uploadToDrive(song)" title="Add to Drive">⬆️</button>
        </div>
      </div>
      <div v-for="song in gDrive.driveSongs.value" :key="song.id" class="song-tile" @click="playSong(song)">
        <img :src="song.albumCover" class="album-cover" alt="Album Cover" />
        <div class="song-info">
          <h3 class="song-title">{{ song.name.replace(/\.[^/.]+$/, "") }}</h3>
        </div>
         <div class="tile-footer">
           <img src="../assets/gdrive_icon.svg" class="source-icon" alt="Google Drive" title="Google Drive"/>
        </div>
      </div>
    </div>

    <FullScreenPlayer
      v-if="currentSong"
      :song="currentSong"
      @close="currentSong = null"
      @next="playNext"
      @prev="playPrev"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import jsmediatags from 'jsmediatags';
import FullScreenPlayer from './FullScreenPlayer.vue';
import placeholder from '../assets/placeholder.png';
import { useGoogleDrive } from '../composables/useGoogleDrive.js';

const localSongs = ref([]);
const currentSong = ref(null);
const currentPlaylist = ref([]);
const currentSongIndex = ref(0);
const isDragging = ref(false);
const isSongLoading = ref(false);

const gDrive = useGoogleDrive();

const combinedSongs = computed(() => {
    const mappedDriveSongs = gDrive.driveSongs.value.map(s => ({
        title: s.name.replace(/\.[^/.]+$/, ""),
        artist: 'Google Drive',
        albumCover: s.albumCover,
        source: 'gdrive',
        id: s.id,
        src: null,
    }));
    return [...localSongs.value, ...mappedDriveSongs];
});

const handleDrop = (event) => { isDragging.value = false; addLocalSongs(event.dataTransfer.files); };
const addLocalSongs = (files) => { for (const file of files) { if (file.type.startsWith('audio/')) { jsmediatags.read(file, { onSuccess: (tag) => { const { tags } = tag; let albumCover = placeholder; if (tags.picture) { const { data, format } = tags.picture; const base64String = data.reduce((acc, byte) => acc + String.fromCharCode(byte), ''); albumCover = `data:${format};base64,${window.btoa(base64String)}`; } localSongs.value.push({ title: tags.title || file.name.replace(/\.[^/.]+$/, ""), artist: tags.artist || 'Unknown Artist', albumCover, src: URL.createObjectURL(file), source: 'local', fileHandle: file, }); }, onError: () => { localSongs.value.push({ title: file.name.replace(/\.[^/.]+$/, ""), artist: 'Unknown Artist', albumCover: placeholder, src: URL.createObjectURL(file), source: 'local', fileHandle: file, }); } }); } } };

const playSong = async (song) => {
  if (isSongLoading.value) return;

  isSongLoading.value = true;
  let playableSong = song;

  try {
    if (song.source === 'gdrive') {
      const blobUrl = await gDrive.getFileBlobUrl(song.id);
      playableSong = { ...song, src: blobUrl };
    }
    
    currentSong.value = playableSong;
    
    currentPlaylist.value = combinedSongs.value;
    currentSongIndex.value = currentPlaylist.value.findIndex(s => (s.id && s.id === song.id) || (s.src && s.src === song.src));
  
  } catch (error) {
    console.error("Error preparing song for playback:", error);
    alert("Could not play the selected song.");
  } finally {
    isSongLoading.value = false;
  }
};

const playNext = () => { if (currentPlaylist.value.length === 0) return; const nextIndex = (currentSongIndex.value + 1) % currentPlaylist.value.length; playSong(currentPlaylist.value[nextIndex]); };
const playPrev = () => { if (currentPlaylist.value.length === 0) return; const prevIndex = (currentSongIndex.value - 1 + currentPlaylist.value.length) % currentPlaylist.value.length; playSong(currentPlaylist.value[prevIndex]); };

const uploadToDrive = async (song) => { if (song.fileHandle) { alert(`Uploading "${song.title}"...`); try { await gDrive.uploadFile(song.fileHandle, `${song.title}.mp3`); alert("Upload successful!"); } catch(e) { alert("Upload failed."); console.error(e); } } };
</script>

<style scoped>
.folder-info { color: #b3b3b3; font-size: 0.8rem; margin-left: 1rem; }
.gdrive-controls { margin-bottom: 1.5rem; padding: 1rem; background-color: #282828; border-radius: 8px; display: flex; gap: 10px; align-items: center; }
.sign-out-btn { background-color: #c93434; }
.tile-footer { display: flex; justify-content: space-between; align-items: center; padding: 0 10px 10px 10px; }
.source-icon { width: 24px; height: 24px; }
.upload-btn { background: none; border: none; cursor: pointer; font-size: 1.5rem; padding: 0; }
</style>