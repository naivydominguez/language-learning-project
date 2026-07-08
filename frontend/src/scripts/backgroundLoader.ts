export default function initiateBackgroundLoading() {
    loadKnownWords();
}

const loadKnownWords = async () => {
    // Get list of known words from server
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/conversations/`)


    // Put the known words into a minisearch index
}