// Sistema de Comentários Interativo
class CommentsManager {
    constructor(pageId) {
        this.pageId = pageId;
        this.storageKey = `comments_${pageId}`;
        this.comments = this.loadComments();
        this.initializeComments();
    }

    loadComments() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveComments() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
    }

    addComment(author, email, text) {
        if (!author.trim() || !email.trim() || !text.trim()) {
            alert('Por favor, preencha todos os campos!');
            return false;
        }

        const comment = {
            id: Date.now(),
            author: author.trim(),
            email: email.trim(),
            text: text.trim(),
            date: new Date().toLocaleString('pt-BR'),
            replies: []
        };

        this.comments.push(comment);
        this.saveComments();
        this.renderComments();
        return true;
    }

    deleteComment(commentId) {
        if (confirm('Tem certeza que deseja deletar este comentário?')) {
            this.comments = this.comments.filter(c => c.id !== commentId);
            this.saveComments();
            this.renderComments();
        }
    }

    initializeComments() {
        const form = document.getElementById('comment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const author = document.getElementById('comment-author').value;
                const email = document.getElementById('comment-email').value;
                const text = document.getElementById('comment-text').value;

                if (this.addComment(author, email, text)) {
                    form.reset();
                    // Scroll para a seção de comentários
                    setTimeout(() => {
                        const commentsList = document.getElementById('comments-list');
                        if (commentsList) {
                            commentsList.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
            });
        }

        this.renderComments();
    }

    renderComments() {
        const container = document.getElementById('comments-list');
        if (!container) return;

        if (this.comments.length === 0) {
            container.innerHTML = '<p class="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }

        container.innerHTML = this.comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <strong class="comment-author">${this.escapeHtml(comment.author)}</strong>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-email">
                    <small>📧 ${this.escapeHtml(comment.email)}</small>
                </p>
                <p class="comment-text">${this.escapeHtml(comment.text)}</p>
                <div class="comment-actions">
                    <button class="delete-btn" onclick="window.commentsManager.deleteComment(${comment.id})">
                        🗑️ Deletar
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const bodyPageId = document.body.getAttribute('data-page-id');
    const section = document.querySelector('.comments-section');
    const sectionPageId = section ? section.getAttribute('data-page-id') : null;
    const pageId = bodyPageId || sectionPageId;

    console.log('✅ pageId detectado:', pageId);

    if (pageId) {
        window.commentsManager = new CommentsManager(pageId);
        console.log('✅ CommentsManager inicializado com pageId:', pageId);
    } else {
        console.error('❌ Nenhum data-page-id encontrado. Verifique o HTML.');
    }
});
