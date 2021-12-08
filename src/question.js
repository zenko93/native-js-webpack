export class Question {
    static async create(question) {
        const response = await fetch('https://podcast-project-native-js-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        question.id = response.id;

        addToLocalStorage(question);
        Question.renderList();

        return data;
    }

    static async fetch(token) {
        if (!token) {
            return Promise.resolve('<p class=error>У вас нет токена</p>')
        }
        const response = await fetch(`https://podcast-project-native-js-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`);
        const res = await response.json();
        if (res && res.error) {
            return `<p class=error>${response.error}</p>`
        }

        return res ? Object.keys(res).map(key => ({
            ...res[key],
            id: key,
        })): [];
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage();

        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`;

        const list = document.getElementById('list');

        list.innerHTML = html;
    }

    static listToHtml(questions) {
        return questions.length
        ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
        : '<p>Вопросов пока нет</p>'
    }
}

function addToLocalStorage(question) {
    const allQuestions = getQuestionsFromLocalStorage();

    allQuestions.push(question)
    localStorage.setItem('questions', JSON.stringify(allQuestions));
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
    return `
        <div class="mui--text-black-54">
            ${new Date(question.date).toLocaleDateString()}
            ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div>${question.text}</div>
        <br>
    `

}
