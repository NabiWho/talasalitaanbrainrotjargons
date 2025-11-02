// Get all word elements
const words = document.querySelectorAll('.word');

// Add click event listener to each word
words.forEach(word => {
    word.addEventListener('click', () => {
        const definitionDiv = word.querySelector('.definition');
        const definition = word.getAttribute('data-definition');
        if (definitionDiv && definition) {
            // Close all other definitions
            document.querySelectorAll('.definition.expanded').forEach(def => {
                if (def !== definitionDiv) {
                    def.classList.remove('expanded');
                }
            });
            // Toggle the current definition
            definitionDiv.textContent = definition;
            definitionDiv.classList.toggle('expanded');
        }
    });
});

// Add search functionality
const searchInput = document.getElementById('searchInput');
const searchBar = document.getElementById('searchBar');
const wordList = document.getElementById('wordList');
const letterSections = document.querySelectorAll('.letter-section');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const suggestionsDiv = document.getElementById('suggestions');

// Get all word texts for suggestions
const allWords = Array.from(document.querySelectorAll('.word')).map(word => word.textContent.trim());

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    if (query.length > 0) {
        backToMenuBtn.style.display = 'block';
        // Show suggestions
        const matchingWords = allWords.filter(word => word.toLowerCase().startsWith(query)).slice(0, 5);
        suggestionsDiv.innerHTML = '';
        if (matchingWords.length > 0) {
            matchingWords.forEach(word => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = word;
                item.addEventListener('click', () => {
                    searchInput.value = word;
                    suggestionsDiv.style.display = 'none';
                    // Trigger search
                    searchInput.dispatchEvent(new Event('input'));
                });
                suggestionsDiv.appendChild(item);
            });
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    } else {
        backToMenuBtn.style.display = 'none';
        suggestionsDiv.style.display = 'none';
    }
    letterSections.forEach(section => {
        const words = section.querySelectorAll('.word');
        let hasVisibleWords = false;
        words.forEach(word => {
            const text = word.textContent.toLowerCase();
            if (text.includes(query)) {
                word.style.display = 'block';
                hasVisibleWords = true;
            } else {
                word.style.display = 'none';
            }
        });
        section.style.display = hasVisibleWords ? 'block' : 'none';
    });
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
    }
});

// Clear search and show all sections
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    letterSections.forEach(section => {
        section.style.display = 'block';
        const words = section.querySelectorAll('.word');
        words.forEach(word => {
            word.style.display = 'block';
        });
    });
});

// Back to menu button in header - hide initially
const backToMenuBtn = document.getElementById('backToMenuBtn');
backToMenuBtn.style.display = 'none';
backToMenuBtn.addEventListener('click', () => {
    searchInput.value = '';
    letterSections.forEach(section => {
        section.style.display = 'block';
        const words = section.querySelectorAll('.word');
        words.forEach(word => {
            word.style.display = 'block';
        });
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Hide button after clearing
    backToMenuBtn.style.display = 'none';
});

// Show search bar on scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) {
        // Past header, show search bar
        searchBar.classList.add('visible');
    } else {
        // At header, hide search bar
        searchBar.classList.remove('visible');
    }
});

// Add pronunciation and listen button to all words
document.querySelectorAll('.word').forEach(word => {
    const wordText = word.textContent.trim();
    const pronunciation = word.getAttribute('data-pronunciation');
    if (pronunciation) {
        const span = document.createElement('span');
        span.className = 'pronunciation';
        span.textContent = pronunciation;
        const button = document.createElement('button');
        button.className = 'listen-btn';
        button.textContent = '🔊';
        button.addEventListener('click', () => {
            const utterance = new SpeechSynthesisUtterance(wordText);
            window.speechSynthesis.speak(utterance);
        });
        word.appendChild(span);
        word.appendChild(button);
    }
});
