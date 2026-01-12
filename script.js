document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    // Render Cards
    promptData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;

        const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${item.image}" alt="${item.title}" class="card-image" onerror="this.src='https://via.placeholder.com/400x225?text=No+Image'">
            </div>
            <div class="card-content">
                <div class="card-tags">${tagsHtml}</div>
                <h2>${item.id}. ${item.title}</h2>
                <button class="copy-btn mini-btn" data-prompt="${item.id}">
                    📋 プロンプトをコピー
                </button>
            </div>
        `;

        // Click event to open modal
        card.addEventListener('click', (e) => {
            // If the copy button was clicked, don't open modal
            if (e.target.closest('.copy-btn')) return;
            openPromptModal(item);
        });

        gallery.appendChild(card);
    });

    // Delegated Copy Functionality for main gallery
    gallery.addEventListener('click', (e) => {
        const btn = e.target.closest('.copy-btn');
        if (btn) {
            const promptId = btn.getAttribute('data-prompt');
            const item = promptData.find(p => p.id == promptId);
            handleCopy(item.prompt, btn);
        }
    });

    // Close modal events
    closeModal.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    function openPromptModal(item) {
        const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        modalBody.innerHTML = `
            <div class="modal-image-container">
                <img src="${item.image}" alt="${item.title}" class="modal-image">
            </div>
            <div class="modal-info">
                <div class="card-tags">${tagsHtml}</div>
                <h1>${item.id}. ${item.title}</h1>
                <div class="modal-prompt" id="modal-prompt-text">${escapeHtml(item.prompt)}</div>
                <button class="copy-btn large-btn" id="modal-copy-btn">
                     プロンプトをコピーする
                </button>
            </div>
        `;

        // Setup modal copy button
        const modalCopyBtn = document.getElementById('modal-copy-btn');
        modalCopyBtn.addEventListener('click', () => {
            handleCopy(item.prompt, modalCopyBtn);
        });

        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    async function handleCopy(text, btn) {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ コピーしました！';
            btn.classList.add('copied');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            btn.innerHTML = '✅ コピーしました！';
            setTimeout(() => { btn.innerHTML = '📋 コピー'; }, 2000);
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
