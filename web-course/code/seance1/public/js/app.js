// Script pour le client lourd (SPA)
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const usersList = document.getElementById('users-list');
  const userDetails = document.getElementById('user-details');
  const userForm = document.getElementById('user-form');
  const errorMessage = document.getElementById('error-message');
  
  // État de l'application
  let selectedUser = null;
  let isEditing = false;
  
  // Charger les utilisateurs au démarrage
  fetchUsers();
  
  // Event listener pour le formulaire
  userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const roleInput = document.getElementById('user-role');
    
    const userData = {
      name: nameInput.value,
      email: emailInput.value,
      role: roleInput.value
    };
    
    if (isEditing && selectedUser) {
      // Mettre à jour un utilisateur existant
      updateUser(selectedUser.id, userData);
    } else {
      // Créer un nouvel utilisateur
      createUser(userData);
    }
  });
  
  // Fonction pour récupérer tous les utilisateurs
  function fetchUsers() {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then(users => {
        renderUsersList(users);
      })
      .catch(error => {
        showError('Erreur lors du chargement des utilisateurs: ' + error.message);
      });
  }
  
  // Fonction pour récupérer un utilisateur spécifique
  function fetchUser(id) {
    fetch(`/api/users/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        return response.json();
      })
      .then(user => {
        selectedUser = user;
        renderUserDetails(user);
      })
      .catch(error => {
        showError('Erreur lors du chargement de l\'utilisateur: ' + error.message);
      });
  }
  
  // Fonction pour créer un nouvel utilisateur
  function createUser(userData) {
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la création de l\'utilisateur');
        }
        return response.json();
      })
      .then(newUser => {
        resetForm();
        fetchUsers(); // Recharger la liste
        showError('Utilisateur créé avec succès!', 'success');
      })
      .catch(error => {
        showError('Erreur: ' + error.message);
      });
  }
  
  // Fonction pour mettre à jour un utilisateur
  function updateUser(id, userData) {
    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
        }
        return response.json();
      })
      .then(updatedUser => {
        selectedUser = updatedUser;
        resetForm();
        fetchUsers(); // Recharger la liste
        renderUserDetails(updatedUser);
        showError('Utilisateur mis à jour avec succès!', 'success');
      })
      .catch(error => {
        showError('Erreur: ' + error.message);
      });
  }
  
  // Fonction pour supprimer un utilisateur
  function deleteUser(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      return;
    }
    
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }
        return response.json();
      })
      .then(data => {
        if (selectedUser && selectedUser.id === id) {
          selectedUser = null;
          userDetails.classList.add('hidden');
        }
        fetchUsers(); // Recharger la liste
        showError('Utilisateur supprimé avec succès!', 'success');
      })
      .catch(error => {
        showError('Erreur: ' + error.message);
      });
  }
  
  // Fonction pour afficher la liste des utilisateurs
  function renderUsersList(users) {
    usersList.innerHTML = '';
    
    if (users.length === 0) {
      usersList.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
      return;
    }
    
    const table = document.createElement('table');
    
    // En-tête du tableau
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Email</th>
        <th>Rôle</th>
        <th>Actions</th>
      </tr>
    `;
    table.appendChild(thead);
    
    // Corps du tableau
    const tbody = document.createElement('tbody');
    
    users.forEach(user => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="view" data-id="${user.id}">Voir</button>
          <button class="edit" data-id="${user.id}">Éditer</button>
          <button class="delete" data-id="${user.id}">Supprimer</button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    usersList.appendChild(table);
    
    // Ajouter les event listeners sur les boutons
    document.querySelectorAll('button.view').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        fetchUser(id);
      });
    });
    
    document.querySelectorAll('button.edit').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        fetchUser(id);
        isEditing = true;
        
        // Mettre à jour le formulaire avec les données de l'utilisateur
        setTimeout(() => {
          if (selectedUser) {
            document.getElementById('user-name').value = selectedUser.name;
            document.getElementById('user-email').value = selectedUser.email;
            document.getElementById('user-role').value = selectedUser.role;
            document.getElementById('form-title').textContent = 'Modifier l\'utilisateur';
            document.getElementById('submit-button').textContent = 'Mettre à jour';
          }
        }, 500);
      });
    });
    
    document.querySelectorAll('button.delete').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteUser(id);
      });
    });
  }
  
  // Fonction pour afficher les détails d'un utilisateur
  function renderUserDetails(user) {
    userDetails.innerHTML = '';
    userDetails.classList.remove('hidden');
    
    const details = document.createElement('div');
    details.className = 'user-details';
    
    details.innerHTML = `
      <h2>Détails de l'utilisateur</h2>
      <p><strong>ID:</strong> ${user.id}</p>
      <p><strong>Nom:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Rôle:</strong> ${user.role}</p>
    `;
    
    userDetails.appendChild(details);
  }
  
  // Fonction pour afficher un message d'erreur/succès
  function showError(message, type = 'error') {
    errorMessage.textContent = message;
    errorMessage.className = type === 'error' ? 'error' : 'success';
    errorMessage.classList.remove('hidden');
    
    setTimeout(() => {
      errorMessage.classList.add('hidden');
    }, 3000);
  }
  
  // Fonction pour réinitialiser le formulaire
  function resetForm() {
    userForm.reset();
    isEditing = false;
    document.getElementById('form-title').textContent = 'Ajouter un utilisateur';
    document.getElementById('submit-button').textContent = 'Ajouter';
  }
  
  // Bouton pour réinitialiser le formulaire
  document.getElementById('cancel-button').addEventListener('click', function(e) {
    e.preventDefault();
    resetForm();
  });
});
