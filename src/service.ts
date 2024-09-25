import TrackPlayer, { Event } from 'react-native-track-player';

const setupEventListeners = () => {
    TrackPlayer.addEventListener(Event.PlaybackError, (data: { message: string }) => {
        console.log(`Error: ${data.message}`);
    });
};

module.exports = async function () {
    await TrackPlayer.setupPlayer();
    setupEventListeners();
};
