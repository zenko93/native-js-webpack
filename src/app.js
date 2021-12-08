import { createModal, isValid } from "./utils";
import { authWithEmailWithPassword, getAuthForm } from "./auth";
import { Question } from "./question";
import './styles.css'

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', () => {
    Question.renderList();
})
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

async function submitFormHandler(event) {
    event.preventDefault();

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON(),
        }

        submitBtn.disabled = true;
        await Question.create(question)

        input.value = '';
        input.className = '';
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm());
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, { once: true });
}

async function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;
    const token = await authWithEmailWithPassword(email, password);
    const content = await Question.fetch(token);
    renderModalAfterAuth(content);
    btn.disabled = false;

}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка!', content);
    } else {
        createModal('Список вопросов', Question.listToHtml(content));
    }
}
