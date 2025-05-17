// Helper to toggle between sections
function showSection(sectionId) {
    const mainSections = ['home', 'learn', 'calculator', 'quiz'];
    mainSections.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Parse input set string into a Set of Numbers
function parseSet(input) {
    return new Set(
        input.split(',').map(item => item.trim()).filter(item => item !== '').map(Number).filter(item => !isNaN(item))
    );
}

// Generic parse for non-numeric sets (for relation)
function parseInput(input) {
    return input.split(',').map(x => x.trim()).filter(x => x !== '');
}

// Power set generation
function powerSet(set) {
    const array = Array.from(set);
    return array.reduce(
        (subsets, value) => subsets.concat(subsets.map(set => [...set, value])),
        [[]]
    );
}

// Perform set operations
function performOperation(operation) {
    const setA = parseSet(document.getElementById('setA').value);
    const setB = parseSet(document.getElementById('setB').value);
    const resultBox = document.getElementById('result');
    let result = '';

    switch (operation) {
        case 'union':
            result = new Set([...setA, ...setB]);
            result = `{ ${Array.from(result).sort((a, b) => a - b).join(', ')} }`;
            break;

        case 'intersection':
            result = new Set([...setA].filter(x => setB.has(x)));
            result = `{ ${Array.from(result).sort((a, b) => a - b).join(', ')} }`;
            break;

        case 'difference':
            result = new Set([...setA].filter(x => !setB.has(x)));
            result = `{ ${Array.from(result).sort((a, b) => a - b).join(', ')} }`;
            break;
        case 'differenceBA':
            result = new Set([...setB].filter(x => !setA.has(x)));
            result = `{ ${Array.from(result).sort((a, b) => a - b).join(', ')} }`;
            break;


        case 'complement':
            const universalInput = document.getElementById('universalSet').value;
            if (!universalInput) {
                result = '⚠️ Please enter a Universal Set for complement operation.';
                break;
            }
            const universal = parseSet(universalInput);
            const allInUniversal = [...setA].every(x => universal.has(x));
            result = allInUniversal
                ? `{ ${Array.from(new Set([...universal].filter(x => !setA.has(x)))).join(', ')} }`
                : '⚠️ Complement only works if all elements of A are within the Universal Set.';
                break;

        case 'complementB':
            const universalInputB = document.getElementById('universalSet').value;
          if (!universalInputB) {
          result = '⚠️ Please enter a Universal Set for complement operation.';
          break;
          }
          const universalB = parseSet(universalInputB);
          const allInUniversalB = [...setB].every(x => universalB.has(x));
          result = allInUniversalB
          ? `{ ${Array.from(new Set([...universalB].filter(x => !setB.has(x)))).join(', ')} }`
          : '⚠️ Complement only works if all elements of B are within the Universal Set.';
          break;

        case 'powerset':
            const pSet = powerSet(setA);
            result = `P(A) = { ${pSet.map(sub => `{${sub.sort((a, b) => a - b).join(', ')}}`).join(', ')} }`;
            break;

        case 'relation':
            const setARel = new Set(parseInput(document.getElementById("setA").value));
            const setBRel = new Set(parseInput(document.getElementById("setB").value));

            const isSubset = [...setARel].every(x => setBRel.has(x));
            const isProperSubset = isSubset && setARel.size < setBRel.size;
            const isEqual = setARel.size === setBRel.size && [...setARel].every(x => setBRel.has(x));
            const isDisjoint = [...setARel].every(x => !setBRel.has(x));
            const isEquivalent = setARel.size === setBRel.size;

            result = `
                <h3>🔎 Set Relation Checker</h3>
                <ul>
                    <li><strong>Equal Sets:</strong> ${isEqual ? '✅ Yes, A = B (Same elements)' : '❌ No, sets are not equal'}</li>
                    <li><strong>Equivalent Sets:</strong> ${isEquivalent ? '✅ Yes, A ≃ B (Same size)' : '❌ No, different number of elements'}</li>
                    <li><strong>Subset:</strong> ${isSubset ? '✅ A ⊆ B' : '❌ A is not a subset of B'}</li>
                    <li><strong>Proper Subset:</strong> ${isProperSubset ? '✅ A ⊂ B' : '❌ Not a proper subset'}</li>
                    <li><strong>Disjoint Sets:</strong> ${isDisjoint ? '✅ A ∩ B = ∅ (No elements in common)' : '❌ Sets share elements'}</li>
                </ul>
            `;
            break;

        default:
            result = 'Invalid Operation';
    }

    resultBox.innerHTML = `<strong>Result:</strong> ${result}`;
}


// Quiz Questions
const quizQuestions = [
  { question: "What is the correct roster method for the set of vowels in the alphabet? (a) A = {x | x is a vowel} (b) A = {a, e, i, o, u} (c) A = {1, 2, 3}", answer: "b" },
  { question: "Which is true for the set E = {1, 3, 5, ...}? (a) 4 ∈ E (b) 5 ∈ E (c) 0 ∈ E", answer: "b" },
  { question: "True or False: {2, 4, 6} = {6, 4, 2}", answer: "True" },
  { question: "Which is a proper subset of {1, 2, 3}? (a) {1, 2} (b) {1, 2, 3} (c) ∅", answer: "a" },
  { question: "True or False: {1, 3, 5} and {2, 4, 6} are disjoint sets.", answer: "True" },
  { question: "If U = {1, 2, 3, 4, 5} and A = {1, 3}, what is A'? (a) {2, 4, 5} (b) {1, 2, 3} (c) {4, 5}", answer: "a" },
  { question: "What is {1, 2} ∪ {2, 3}? (a) {1, 2, 3} (b) {2} (c) {1, 3}", answer: "a" },
  { question: "What is {a, b, c} ∩ {c, d, e}? (a) {c} (b) {a, b, c, d, e} (c) ∅", answer: "a" },
  { question: "How many subsets does {a, b} have? (a) 3 (b) 4 (c) 2", answer: "b" },
  { question: "What is {5, 6, 7} - {6, 7, 8}? (a) {5} (b) {6, 7} (c) {8}", answer: "a" }
];

let currentQuestion = 0;
let score = 0;

function displayQuestion() {
    const questionContainer = document.getElementById('question');
    const quizResult = document.getElementById('quiz-result');
    const restartBtn = document.getElementById('restart-btn');

    if (currentQuestion < quizQuestions.length) {
        const qData = quizQuestions[currentQuestion];
        const lines = qData.question.split(/(\(a\)|\(b\)|\(c\))/g).filter(Boolean);

        let formatted = `<strong>Q${currentQuestion + 1}?</strong> ${lines[0]}<br><br>`;
        for (let i = 1; i < lines.length; i += 2) {
            formatted += `${lines[i]} ${lines[i + 1]}<br>`;
        }

        questionContainer.innerHTML = formatted;
        quizResult.innerHTML = '';
        restartBtn.style.display = 'none';
    } else {
        quizResult.innerHTML = `Quiz Complete! Score: ${score}/${quizQuestions.length}`;
        document.getElementById('question').innerHTML = '';
        restartBtn.style.display = 'inline-block';
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('quiz-input').value.trim();
    const correctAnswer = quizQuestions[currentQuestion].answer;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        score++;
        alert('Correct! 🎉');
    } else {
        alert(`Incorrect. Correct answer: ${correctAnswer}`);
    }

    currentQuestion++;
    document.getElementById('quiz-input').value = '';
    displayQuestion();
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-input').value = '';
    displayQuestion();
}

window.onload = displayQuestion;
// chatbot.js

// Toggle chatbot window
function toggleChatbot() {
  const chatbot = document.getElementById('chatbot');
  if (!chatbot) return;

  if (chatbot.style.display === 'flex') {
    chatbot.style.display = 'none';
  } else {
    chatbot.style.display = 'flex';
    document.getElementById('chat-input').focus();
  }
}

// Add message to chat log
function addChatMessage(sender, message, className = 'bot-message') {
  const log = document.getElementById('chat-log');
  const msg = document.createElement('div');
  msg.classList.add(className);
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

// Respond to user input
function respondToChat(msg) {
  msg = msg.toLowerCase().trim();
  let response = "❓ I didn't understand that. Try asking things like: 'What is a set?', 'What is union?', 'Explain power set', etc.";

  if (msg.includes('equal')) {
    response = "🟰 <strong>Equal Sets:</strong> Sets with the <em>same elements</em>, even if in different order. <br>Example: {1, 2, 3} = {3, 2, 1}";
  } else if (msg.includes('hi') || msg.includes('hello')) {
    response = 'Hello! 👋 How can I assist you today? Would you like help with Set Theory, or something else?';
  } else if (msg.includes('equivalent')) {
    response = "🔢 <strong>Equivalent Sets:</strong> Sets with the <em>same number of elements</em>. <br>Example: {1,2,3} ≃ {a,b,c}";
  } else if (msg.includes('proper subset')) {
    response = "🧩 <strong>Proper Subset:</strong> A ⊂ B means all elements in A are in B, but A ≠ B.";
  } else if (msg.includes('subset')) {
    response = "📥 <strong>Subset:</strong> A ⊆ B means every element in A is also in B.";
  } else if (msg.includes('disjoint')) {
    response = "🚫 <strong>Disjoint Sets:</strong> Sets with <em>no elements in common</em>. <br>Example: A ∩ B = ∅";
  } else if (msg.includes('union')) {
    response = "🔗 <strong>Union:</strong> Combines all elements from both sets. <br>Symbol: A ∪ B";
  } else if (msg.includes('intersection')) {
    response = "🔄 <strong>Intersection:</strong> Elements that are <em>common to both</em> sets. <br>Symbol: A ∩ B";
  } else if (msg.includes('difference')) {
    response = "➖ <strong>Difference:</strong> A − B means elements in A but <em>not in B</em>.";
  } else if (msg.includes('complement')) {
    response = "🌓 <strong>Complement:</strong> A′ includes everything in the universal set <em>not in A</em>.";
  } else if (msg.includes('power set')) {
    response = "💡 <strong>Power Set:</strong> Set of <em>all subsets</em> of a set, including ∅ and the set itself.";
  } else if (msg.includes('universal')) {
    response = "🌐 <strong>Universal Set (U):</strong> Contains <em>all elements</em> being discussed.";
  } else if (msg.includes('null') || msg.includes('empty')) {
    response = "🕳️ <strong>Null (Empty) Set:</strong> A set with <em>no elements</em>. Symbol: ∅";
  } else if (msg.includes('set')) {
    response = `
📚 <strong>What is a Set?</strong><br>
A set is a group of well-defined objects or ideas called elements.

🔤 <strong>Examples:</strong>
<ul>
  <li>{a, e, i, o, u}</li>
  <li>{x | x is a letter of the alphabet}</li>
  <li>{1, 2, 3}</li>
</ul>

✍️ <strong>How to write sets:</strong>
<ul>
  <li><strong>Roster:</strong> A = {1, 2, 3}</li>
  <li><strong>Descriptive:</strong> A = {x | x is a vowel}</li>
</ul>

📂 <strong>Types of Sets:</strong>
<ul>
  <li>🔢 Finite</li>
  <li>♾️ Infinite</li>
  <li>🕳️ Null (Empty)</li>
  <li>🌐 Universal</li>
  <li>💡 Power Set</li>
</ul>
`;
  }

  addChatMessage("Set AI", response, 'bot-message');

}


// Send message (called on Enter key or button click)
function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (message === '') return;

  addChatMessage("👤", message, 'user-message');
  respondToChat(message.toLowerCase());
  input.value = '';
  input.focus();
}

// Handle Enter key press in input field
function handleChatKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();  // Prevent form submit if any
    sendMessage();
  }
}

// Setup event listeners on page load
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('chat-toggle-btn').addEventListener('click', toggleChatbot);
  document.getElementById('chat-close-btn').addEventListener('click', toggleChatbot);
  document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
  document.getElementById('chat-input').addEventListener('keypress', handleChatKey);
});

