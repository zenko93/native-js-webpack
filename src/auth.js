import { API_KEY } from "./constants";

export function getAuthForm() {
    return `
        <form class="mui-form" id="auth-form">
            <div class="mui-textfield mui-textfield--float-label">
                <input type="email" id="email" required>
                <label for="email">Email</label>
            </div>
            <div class="mui-textfield mui-textfield--float-label">
                <input type="password" id="password" required>
                <label for="password">Пароль</label>
            </div>
            <button
                type="submit"
                class="mui-btn mui-btn--raised mui-btn--primary"
            >
                Войти
            </button>
        </form>
    `
}

export async function authWithEmailWithPassword(email, password) {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data.idToken;
}
