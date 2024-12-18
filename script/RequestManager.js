class RequestManager {
  // Базовий URL для API запитів
  // static apiBase = 'http://localhost:3000/api/v1';
  static apiBase = 'https://task-11-backend.onrender.com/api/v1';

  // Метод для отримання повного маршруту до сервера
  static getServerRoute(path) {
    return `${RequestManager.apiBase}${path}`;
  }

  // Метод для перевірки автентифікації користувача
  static isAuthenticated() {
    return localStorage.getItem('jwt_token');
  }

  // Метод для виходу користувача
  static async onLogout() {
    try {
      // Видаляємо токен з localStorage
      localStorage.removeItem('jwt_token');
      // Оновлюємо сторінку після виходу
      location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Метод для виконання POST запиту
  static async doPostRequest(url, data, redirectRoute, callback, addAuthorization = true) {
    try {
      // Налаштування заголовків запиту
      const headers = {'Content-Type': 'application/json'};
      // Якщо маршрут потребує автентифікації і користувач виконав автентифікацію
      if (addAuthorization && RequestManager.isAuthenticated()) {
        // Додаємо токен до заголовків запиту
        headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
      }
      // Виконання запиту
      const response = await fetch(RequestManager.getServerRoute(url), {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
      console.log(response);

      const resData = await response.json();
      // Обробка успішного запиту
      if (response.ok) {
        if (callback) {
          callback(resData);
        }
        window.location.href = redirectRoute;
      } else {
        const result = await response.json();
        this.showErrors(result.errors);
      }
    } catch (error) {
      console.error('Error:', error);
      this.showErrors([{message: 'Network error. Please try again later.'}]);
    }
  }

  // Метод для відображення помилок
  static showErrors(errors, errorsContainerSelector = '#errors') {
    let errorsContainer = document.querySelector(errorsContainerSelector);
    if (!errorsContainer) {
      // Якщо контейнер для помилок не існує, створюємо його
      errorsContainer = document.createElement('div');
      errorsContainer.id = errorsContainerSelector.replace('#', '');
      document.body.append(errorsContainer);
    }
    errorsContainer.innerHTML = '';
    errors.forEach((error) => {
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = error.message;
      errorsContainer.append(errorMessage);
    });
  }

  // Метод для виконання POST запиту з даними форми
  static async postFormRequest(url, form, addAuthorization = true) {
    const headers = {};
    if (addAuthorization && RequestManager.isAuthenticated()) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    }

    const formData = new FormData(form);
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const result = await response.json();
      this.showErrors(result.errors);
      return null;
    }
  }

  static async sortProdRequest(rout, data, addAuthorization = true) {
    const headers = {'Content-Type': 'application/json'};
    if (addAuthorization && RequestManager.isAuthenticated()) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    }
    
    const response = await fetch(this.getServerRoute(rout), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const result = await response.json();
      this.showErrors(result.errors);
      return null;
    }
  }
  // Загальний метод для виконання POST запиту
  static async postRequest(route, body, addAuthorization = true) {
    // const headers = { 'Content-Type': 'application/json' }
    const headers = {};
    if (addAuthorization && RequestManager.isAuthenticated()) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    }
    const formData = new FormData(body);
    console.log(formData);

    const response = await fetch(this.getServerRoute(route), {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    const data = await response.json();
    return data;
  }

  // Метод для виконання DELETE запиту
  static async deleteRequest(route, id, addAuthorization = true) {
    const headers = {'Content-Type': 'application/json'};
    if (addAuthorization && RequestManager.isAuthenticated()) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    }
    console.log(this.getServerRoute(route));
    console.log(id);
    const response = await fetch(this.getServerRoute(route), {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({id}),
    });
    const data = await response.json();
    window.location.reload(true);
    return data;
  }

  // Метод для обробки вибору файлу
  static handleFileSelect(event, imgSelector) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.querySelector(imgSelector);
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Метод для виконання GET запиту
  static async fetchData(url, addAuthorization = true) {
    let response;
    try {
      const headers = {'Content-Type': 'application/json'};
      if (addAuthorization && RequestManager.isAuthenticated()) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
      }
      response = await fetch(this.getServerRoute(url), {
        method: 'GET',
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const result = await response.json();
        this.showErrors(result.errors);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      this.showErrors([{message: 'Network error. Please try again later.'}]);
      return null;
    }
  }

  // Метод для отримання налаштувань
  static async fetchSettings() {
    return this.fetchData('/settings', false);
  }
}
