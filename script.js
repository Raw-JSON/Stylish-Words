// 0FluffStyle Logic

// --- CORE FUNCTIONS ---

function convertText(text, map) {
    return text.split('').map(char => map[char] || char).join('');
}

const styleMapsForMixed = [
    charMaps.bold, charMaps.serifItalic, charMaps.script, charMaps.fraktur,
    charMaps.doubleStruck, charMaps.monospace, charMaps.serifBold, charMaps.circled
];

function convertMixed(text) {
    return text.split('').map((char, i) => {
        const map = styleMapsForMixed[i % styleMapsForMixed.length];
        return map[char] || char;
    }).join('');
}

const fonts = [
    { name: 'Mixed', converter: convertMixed },
    { name: 'Normal', converter: (text) => text },
    { name: 'Bold', converter: (text) => convertText(text, charMaps.bold) },
    { name: 'Bold (Serif)', converter: (text) => convertText(text, charMaps.serifBold) },
    { name: 'Italic', converter: (text) => convertText(text, charMaps.serifItalic) },
    { name: 'Bold Italic', converter: (text) => convertText(text, charMaps.serifBoldItalic) },
    { name: 'Script', converter: (text) => convertText(text, charMaps.script) },
    { name: 'Fraktur', converter: (text) => convertText(text, charMaps.fraktur) },
    { name: 'Monospace', converter: (text) => convertText(text, charMaps.monospace) },
    { name: 'Double-Struck', converter: (text) => convertText(text, charMaps.doubleStruck) },
    { name: 'Circled', converter: (text) => convertText(text, charMaps.circled) },
    { name: 'Squared', converter: (text) => convertText(text, charMaps.squared) },
    { name: 'Fullwidth', converter: (text) => convertText(text, charMaps.fullwidth) }
];

// --- UI LOGIC ---

// GitHub SVG for the new button
const githubSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 3c0 0-1.03-.39-3.41 1.05A16.3 16.3 0 0 0 12 2.88 16.3 16.3 0 0 0 7.4 4.04c-2.38-1.44-3.41-1.05-3.41-1.05A5.07 5.07 0 0 0 3.91 4.77 5.44 5.44 0 0 0 4 9.47c0 5.42 3.3 6.61 6.44 7.37-.4.34-.78 1-1.15 2.06v4.31"></path>
    </svg>
`;
// Share SVG
const shareSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.479-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632L15.316 8.684m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 5.368a3 3 0 100 5.368 3 3 0 000-5.368z" />
    </svg>
`;

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const fontGrid = document.getElementById('fontGrid');
    
    // Set stylized title
    const titleEl = document.getElementById('appTitle');
    // --- START CHANGE ---
    titleEl.innerText = convertText("0FluffStyle.", charMaps.serifBold); // Using Bold (Serif) for consistent style
    // --- END CHANGE ---
    
    // Set GitHub Button
    const githubBtn = document.getElementById('githubButton');
    if (githubBtn) {
        githubBtn.innerHTML = `${githubSVG} View on GitHub`;
        githubBtn.onclick = () => window.open('https://github.com/jayancobk/Stylish-Words', '_blank');
    }
    
    // Initial Render
    updateFontDisplay();
    
    // Listeners
    textInput.addEventListener('input', updateFontDisplay);
});

function updateFontDisplay() {
    const textInput = document.getElementById('textInput');
    const fontGrid = document.getElementById('fontGrid');
    const text = textInput.value === '' ? 'Sample Text' : textInput.value;
    
    fontGrid.innerHTML = '';

    fonts.forEach(font => {
        const convertedText = font.converter(text);

        const card = document.createElement('div');
        card.className = 'relative bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 transition-transform duration-300 hover:scale-105';
        
        const textPreview = document.createElement('p');
        textPreview.className = 'font-preview-text';
        textPreview.innerText = convertedText;
        
        const fontName = document.createElement('span');
        fontName.className = 'block text-sm text-gray-400 mt-4';
        fontName.innerText = font.name;
        
        // COPY BUTTON (Remains as a small circle for one-click copy)
        const copyButton = document.createElement('button');
        copyButton.className = 'absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400';
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        `;
        copyButton.onclick = (e) => {
            e.stopPropagation(); // Prevent card tap
            copyToClipboard(convertedText);
        };
        
        // SHARE BUTTON (Fix: Changed from bottom-4 left-4 to top-16 right-4)
        const shareButton = document.createElement('button');
        shareButton.className = 'absolute top-16 right-4 bg-gray-700 text-gray-300 p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500';
        shareButton.innerHTML = shareSVG;
        shareButton.title = 'Share Text';
        shareButton.onclick = (e) => {
            e.stopPropagation();
            shareText(convertedText);
        };
        
        // Card click now defaults to copy to be user-friendly, since share button is present
        card.onclick = () => copyToClipboard(convertedText);

        card.appendChild(textPreview);
        card.appendChild(fontName);
        card.appendChild(copyButton);
        card.appendChild(shareButton);
        fontGrid.appendChild(card);
    });
}
// --- CLIPBOARD & SHARE ---
let toastTimer;
function showToast() {
    const toast = document.getElementById('toast');
    if (toastTimer) clearTimeout(toastTimer);
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(1rem)';
    }, 3000);
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(showToast);
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) { console.error('Copy failed', err); }
        document.body.removeChild(textarea);
    }
}

function shareText(text) {
    if (navigator.share) {
        navigator.share({
            title: 'Stylish Words',
            text: text
        }).catch((error) => console.error('Error sharing', error));
    } else {
        copyToClipboard(text);
        alert("Share API not available. Text copied to clipboard instead!");
    }
}

// Expose the global functions needed in the HTML
window.copyToClipboard = copyToClipboard;
window.shareText = shareText;
window.updateFontDisplay = updateFontDisplay;
