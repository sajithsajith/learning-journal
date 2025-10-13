import { ref, readonly } from 'vue';
import jsmediatags from 'jsmediatags';
import placeholder from '../assets/placeholder.png';

// Credentials and constants
const CLIENT_ID = '224463912373-pehgb64rhf7tsnporngnjjntr5f97i4t.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDwl-IlYOLP-bM03BaUlQEmRa1OKwU-GgI';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const APP_FOLDER_NAME = 'Vue Music Player Files'; // The folder we will create

export function useGoogleDrive() {
  const driveSongs = ref([]);
  const isSignedIn = ref(false);
  const isLoading = ref(false);
  const selectedFolderId = ref(localStorage.getItem('gdrive_folder_id') || null);

  let gapiClient;

  // Uses the library's built-in remote reader with custom auth headers. This is the correct way.
  const getAlbumArt = (fileId) => {
    return new Promise((resolve) => {
      const accessToken = gapi.client.getToken().access_token;
      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      jsmediatags.read(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        onSuccess: (tag) => {
          if (tag.tags.picture) {
            const { data, format } = tag.tags.picture;
            const base64String = data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            resolve(`data:${format};base64,${window.btoa(base64String)}`);
          } else {
            resolve(placeholder);
          }
        },
        onError: (error) => {
          console.warn(`jsmediatags error for fileId ${fileId}:`, error.type, error.info);
          resolve(placeholder);
        }
      });
    });
  };

  const listFiles = async () => {
    if (!selectedFolderId.value || !gapiClient) return;
    isLoading.value = true;
    try {
      const response = await gapiClient.drive.files.list({
        q: `'${selectedFolderId.value}' in parents and mimeType contains 'audio/' and trashed=false`,
        fields: 'files(id, name)',
      });

      const files = response.result.files;
      driveSongs.value = files.map(file => ({
        ...file,
        source: 'gdrive',
        albumCover: placeholder,
      }));

      const artPromises = driveSongs.value.map(song => getAlbumArt(song.id));
      const albumArts = await Promise.all(artPromises);

      driveSongs.value.forEach((song, index) => {
        song.albumCover = albumArts[index];
      });

    } catch (error) {
      console.error("Fatal Error listing files:", error);
      if (error.status === 401) signOut();
    } finally {
      isLoading.value = false;
    }
  };
  
  // --- The rest of the file is standard and correct ---
  const findOrCreateAppFolder = async () => { isLoading.value = true; try { const response = await gapiClient.drive.files.list({ q: `name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`, fields: 'files(id, name)', }); if (response.result.files.length > 0) { selectedFolderId.value = response.result.files[0].id; } else { const fileMetadata = { name: APP_FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }; const createResponse = await gapiClient.drive.files.create({ resource: fileMetadata, fields: 'id' }); selectedFolderId.value = createResponse.result.id; } localStorage.setItem('gdrive_folder_id', selectedFolderId.value); await listFiles(); } catch (error) { console.error("Error finding or creating folder:", error); } finally { isLoading.value = false; } };
  const handleAuthResponse = async (response) => { gapi.client.setToken(response); isSignedIn.value = true; localStorage.setItem('gdrive_token', JSON.stringify(response)); await findOrCreateAppFolder(); };
  const signIn = () => { const googleGisClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: handleAuthResponse, }); googleGisClient.requestAccessToken(); };
  const signOut = () => { const token = gapi.client.getToken(); if (token) { google.accounts.oauth2.revoke(token.access_token, () => { gapi.client.setToken(''); isSignedIn.value = false; driveSongs.value = []; localStorage.removeItem('gdrive_token'); localStorage.removeItem('gdrive_folder_id'); }); } };
  const initializeGapiClient = async () => { await new Promise((resolve) => gapi.load('client', resolve)); await gapi.client.init({ apiKey: API_KEY, discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'] }); gapiClient = gapi.client; const storedToken = localStorage.getItem('gdrive_token'); if (storedToken) { gapi.client.setToken(JSON.parse(storedToken)); isSignedIn.value = true; if (selectedFolderId.value) listFiles(); } };
  initializeGapiClient();
  const getFileBlobUrl = async (fileId) => { const response = await gapiClient.drive.files.get({ fileId: fileId, alt: 'media' }); const blob = new Blob([response.body], { type: response.headers['content-type'] }); return URL.createObjectURL(blob); };
  const uploadFile = async (fileBlob, fileName) => { if (!selectedFolderId.value) { alert("Please connect to Google Drive first."); return; } const metadata = { name: fileName, parents: [selectedFolderId.value] }; const form = new FormData(); form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' })); form.append('file', fileBlob); const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: new Headers({ 'Authorization': `Bearer ${gapi.client.getToken().access_token}` }), body: form, }); if (response.ok) listFiles(); return response.json(); };

  return { driveSongs, isSignedIn, isLoading, signIn, signOut, getFileBlobUrl, uploadFile };
}