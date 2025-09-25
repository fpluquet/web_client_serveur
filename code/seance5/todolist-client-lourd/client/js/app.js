// client/js/app.js
class TodoApp {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api';
    this.todos = [];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadTodos();
  }

  bindEvents() {
    // Formulaire d'ajout de todo
    document.getElementById('add-todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTodo();
    });
  }

  // Appels API
  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      this.showNotification('Erreur de communication avec le serveur', 'error');
      throw error;
    }
  }

  async loadTodos() {
    try {
      this.todos = await this.fetchAPI('/todos');
      this.renderTodos();
      this.updateCounts();
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
      document.getElementById('todos-container').innerHTML = 
        '<p class="error">Erreur lors du chargement des tâches</p>';
    }
  }

  async addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    
    if (!text) return;

    try {
      const newTodo = await this.fetchAPI('/todos', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      
      this.todos.push(newTodo);
      this.renderTodos();
      this.updateCounts();
      input.value = '';
      this.showNotification('Tâche ajoutée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  }

  async toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await this.fetchAPI(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !todo.completed })
      });
      
      // Mettre à jour localement
      const index = this.todos.findIndex(t => t.id === id);
      this.todos[index] = updatedTodo;
      
      this.renderTodos();
      this.updateCounts();
      this.showNotification('Tâche mise à jour', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  }

  async deleteTodo(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      await this.fetchAPI(`/todos/${id}`, { method: 'DELETE' });
      
      // Supprimer localement
      this.todos = this.todos.filter(t => t.id !== id);
      
      this.renderTodos();
      this.updateCounts();
      this.showNotification('Tâche supprimée', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  renderTodos() {
    const container = document.getElementById('todos-container');
    
    if (this.todos.length === 0) {
      container.innerHTML = '<p class="no-todos">Aucune tâche pour le moment</p>';
      return;
    }

    const todosHTML = this.todos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          ${todo.completed ? 'checked' : ''} 
          onchange="app.toggleTodo(${todo.id})"
          class="todo-checkbox"
        >
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <button 
          onclick="app.deleteTodo(${todo.id})" 
          class="delete-btn"
          title="Supprimer"
        >
          ✕
        </button>
      </div>
    `).join('');

    container.innerHTML = todosHTML;
  }

  updateCounts() {
    const total = this.todos.length;
    const pending = this.todos.filter(t => !t.completed).length;
    
    document.getElementById('total-count').textContent = total;
    document.getElementById('pending-count').textContent = pending;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notifications');
    container.appendChild(notification);
    
    // Faire disparaître la notification après 3 secondes
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialiser l'application
const app = new TodoApp();