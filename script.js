// --- DATA GENERATION ---
const baseDate = new Date('2025-09-26T16:42:00+05:30');
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Rohan", "Priya", "Ananya", "Riya", "Saanvi", "Aadhya", "Kiara", "Diya", "Pari", "Anika", "Shanaya", "Alia", "Sameer", "Rahul", "Vikram", "Neha", "Pooja", "Deepika"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Khan", "Malhotra", "Kapoor", "Jain", "Reddy", "Yadav", "Mehta"];
function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function generateUsers(count) {
    const users = [];
    for (let i = 0; i < count; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        const id = 12200000 + Math.floor(Math.random() * 9999);
        users.push({
            id: id, name: `${firstName} ${lastName}`, regNo: id,
            avatar: `https://placehold.co/100x100/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${firstName.charAt(0)}${lastName.charAt(0)}`,
            lastMessage: { type: 'text', content: '...', timestamp: new Date(baseDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 5) },
            unread: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
            online: Math.random() > 0.5, isGroup: false
        });
    }
    return users;
}
const chatsData = generateUsers(50);
const groupsData = [
    { id: 'g1', name: 'SPA109 (Spanish)', avatar: 'https://placehold.co/100x100/FEE2E2/7F1D1D?text=ES', lastMessage: { author: 'Ankita Kaushik', type: 'text', content: 'Hola! New assignment is up.', timestamp: new Date(baseDate.getTime() - 1000 * 60 * 2) }, unread: 1, isGroup: true, members: ['Ankita Kaushik', 'You', 'Riya Sharma', 'Arjun Kumar'] },
    { id: 'g2', name: 'INT328 (Web Dev)', avatar: 'https://placehold.co/100x100/DBEAFE/1E3A8A?text=WD', lastMessage: { author: 'Dr. Pushpendra R Verma', type: 'text', content: 'Check the new module.', timestamp: new Date(baseDate.getTime() - 1000 * 60 * 15) }, unread: 0, isGroup: true, members: ['Dr. Pushpendra R Verma', 'You', 'Sameer Gupta', 'Priya Patel'] },
    { id: 'g3', name: 'CSE325 (DAA)', avatar: 'https://placehold.co/100x100/D1FAE5/065F46?text=DAA', lastMessage: { author: 'Anika Verma', type: 'text', content: 'Does anyone have the notes for Dijkstra\'s algorithm?', timestamp: new Date(baseDate.getTime() - 1000 * 60 * 45) }, unread: 3, isGroup: true, members: ['Anika Verma', 'You', 'Rahul Singh', 'Aditya Jain'] },
    { id: 'g4', name: 'Placement Prep', avatar: 'https://placehold.co/100x100/E0E7FF/3730A3?text=PP', lastMessage: { author: 'Training & Placement Cell', type: 'text', content: 'Accenture is visiting campus next week. Register on UMS.', timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 3) }, unread: 0, isGroup: true, members: ['Training & Placement Cell', 'You', 'Vihaan Shah'] },
];
const assignmentGroupData = [
    { id: 'ag1', name: 'Capstone Project', avatar: 'https://placehold.co/100x100/EDE9FE/5B21B6?text=CP', lastMessage: {author: 'You', type: 'text', content: 'Let\'s finalize the report by tonight.' , timestamp: new Date(baseDate.getTime() - 1000 * 60 * 8)}, unread: 1, isGroup: true, members: ['You', 'Aarav Sharma', 'Saanvi Gupta', 'Vivaan Patel'] },
    { id: 'ag2', name: 'CSE325 Project Group 4', avatar: 'https://placehold.co/100x100/FEF3C7/92400E?text=G4', lastMessage: {author: 'Rohan Kumar', type: 'text', content: 'I have pushed the latest code to GitHub.' , timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 1)}, unread: 0, isGroup: true, members: ['Rohan Kumar', 'You', 'Kiara Singh'] },
];
const allConversations = [...chatsData, ...groupsData, ...assignmentGroupData].sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
const chatHistories = new Map();

// --- DOM ELEMENTS & APP STATE ---
const bodyEl = document.body;
const sidebarEl = document.getElementById('sidebar');
const chatListEl = document.getElementById('chat-list');
const chatAreaEl = document.getElementById('chat-area');
const searchContainer = document.getElementById("search-container");
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const preloader = document.getElementById('preloader');
let activeChatId = null, activeTab = 'chats', currentSearchTerm = '';
 
const formatTimestamp = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function updateLayout() {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
        sidebarEl.classList.remove('hidden');
        chatAreaEl.classList.remove('hidden');
    } else {
        if (activeChatId) {
            sidebarEl.classList.add('hidden');
            chatAreaEl.classList.remove('hidden');
        } else {
            sidebarEl.classList.remove('hidden');
            chatAreaEl.classList.add('hidden');
        }
    }
}

function renderChatList() {
    chatListEl.innerHTML = '';
    let dataToShow = [];
    if (activeTab === 'chats') dataToShow = allConversations;
    if (activeTab === 'groups') dataToShow = groupsData;
    if (activeTab === 'assignments') dataToShow = assignmentGroupData;
    if (currentSearchTerm) {
        const lowerCaseSearch = currentSearchTerm.toLowerCase();
        dataToShow = dataToShow.filter(chat => chat.name.toLowerCase().includes(lowerCaseSearch) || (chat.regNo && chat.regNo.toString().includes(lowerCaseSearch)));
    }
    dataToShow.forEach(chat => {
        const unreadBadge = chat.unread > 0 ? `<span class="bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${chat.unread}</span>` : '';
        const lastMessageText = chat.isGroup ? `${chat.lastMessage.author || 'User'}: ${chat.lastMessage.content}` : chat.lastMessage.content;
        const time = formatTimestamp(chat.lastMessage.timestamp);
        const isActiveClass = chat.id === activeChatId ? 'chat-item-active' : 'chat-item';
        const chatItem = document.createElement('div');
        chatItem.className = `flex items-center p-2 rounded-xl cursor-pointer transition-colors duration-200 ${isActiveClass}`;
        chatItem.innerHTML = `<div class="relative flex-shrink-0"><img src="${chat.avatar}" alt="avatar" class="w-12 h-12 rounded-full">${chat.online ? `<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>` : ''}</div><div class="flex-1 ml-4 overflow-hidden"><div class="flex justify-between items-center"><h3 class="font-semibold truncate">${chat.name} ${chat.regNo ? `(${chat.regNo})` : ''}</h3><p class="text-xs flex-shrink-0 ${chat.unread > 0 ? 'text-orange-500' : 'text-gray-400'}">${time}</p></div><div class="flex justify-between items-center mt-1"><p class="text-sm text-gray-400 truncate flex-1 pr-4">${lastMessageText}</p>${unreadBadge}</div></div>`;
        chatItem.addEventListener('click', () => {
            activeChatId = chat.id;
            renderAll();
            updateLayout();
        });
        chatListEl.appendChild(chatItem);
    });
}
 
function generateChatHistory(chat) {
    if (chatHistories.has(chat.id)) { return chatHistories.get(chat.id); }
    const history = [];
    const messagePool = ["Hey, did you get the notes for INT328?", "Yeah, I'll send them over.", "The deadline for the capstone project is next Friday!", "Let's meet at the library tomorrow at 10 AM to work on it.", "Can someone explain the last topic from the lecture?", "Check UMS, the new assignment is uploaded.", "The slides are in the resources section.", "Has the faculty graded our mid-terms yet?", "No, not yet. Should be out by the end of the week.", "Anyone going to the event on Saturday?", "I am!", "What's the syllabus for the final exam?", "It's the last 3 units.", "Thanks!", "See you in class.", "I'm running a bit late.", "Don't forget to submit the feedback form.", "The link is on the UMS dashboard."];
    const members = chat.isGroup ? chat.members : ['You', chat.name];
    let lastTimestamp = baseDate.getTime();
    for (let i = 0; i < 60; i++) {
        lastTimestamp -= Math.random() * 1000 * 60 * 30;
        history.unshift({ author: getRandomElement(members), type:'text', content: getRandomElement(messagePool), timestamp: new Date(lastTimestamp) });
    }
    chatHistories.set(chat.id, history);
    return history;
}

function renderChatArea() {
    chatAreaEl.innerHTML = '';
    const chat = allConversations.find(c => c.id === activeChatId);
    if (chat) {
        const history = generateChatHistory(chat);
        let messagesHTML = '';
        history.forEach(msg => {
            const isYou = msg.author === 'You';
            let messageContent = '';
            if (msg.type === 'audio') {
                messageContent = `<div class="audio-message"><audio controls src="${msg.content}"></audio></div>`;
            } else {
                messageContent = msg.content;
            }
            messagesHTML += `<div class="flex ${isYou ? 'justify-end' : 'justify-start'}"><div class="chat-bubble ${isYou ? 'message-you rounded-br-none' : 'message-other rounded-bl-none'} max-w-lg">${chat.isGroup && !isYou ? `<div class="font-bold text-xs text-orange-400">${msg.author}</div>` : ''}${messageContent}<div class="text-xs text-right opacity-70 mt-1">${formatTimestamp(msg.timestamp)}</div></div></div>`;
        });

        chatAreaEl.innerHTML = `
            <header class="h-[68px] flex-shrink-0 flex justify-between items-center px-4 border-b" style="border-color: var(--header-border);">
                <div class="flex items-center overflow-hidden">
                    <button id="back-btn" class="p-2 -ml-2 mr-2 rounded-full hover:bg-black/10 md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <img src="${chat.avatar}" alt="avatar" class="w-10 h-10 rounded-full flex-shrink-0" />
                    <div class="ml-4 overflow-hidden">
                        <h3 class="font-medium truncate">${chat.name}</h3>
                        ${chat.online !== undefined ? `<p class="text-xs ${chat.online ? 'text-green-500' : 'text-gray-400'}">${chat.online ? 'Online' : 'Offline'}</p>` : ''}
                    </div>
                </div>
            </header>
            <div id="message-list" class="flex-1 overflow-y-auto p-6 min-h-0"><div class="flex flex-col space-y-3">${messagesHTML}</div></div>
            <footer class="flex-shrink-0 flex items-center p-2 relative">
                <button id="emoji-btn" class="p-2 text-gray-400 hover:text-white"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg></button>
                <div class="flex-1 mx-2"><input id="message-input" type="text" placeholder="Message" class="w-full rounded-full py-2 px-5 focus:outline-none"></div>
                <button id="attachment-btn" class="p-2 text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
                <button id="mic-btn" class="p-2 ml-2 rounded-full bg-orange-500 text-white"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z"></path><path d="M5.5 8.5a.5.5 0 01.5.5v1.5a4 4 0 004 4h0a4 4 0 004-4V9a.5.5 0 011 0v1.5a5 5 0 01-4.75 4.975V17h3a.5.5 0 010 1H7a.5.5 0 010-1h3v-1.525A5 5 0 013.5 10.5V9a.5.5 0 01.5-.5z"></path></svg></button>
                <button id="send-btn" class="p-2 ml-2 rounded-full bg-orange-500 text-white hidden"><svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white"/></svg></button>
            </footer>`;
        const messageList = document.getElementById('message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    } else {
        chatAreaEl.innerHTML = `<div class="flex-1 flex items-center justify-center text-center"><div class="flex flex-col items-center"><svg class="w-24 h-24 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg><h1 class="text-3xl font-bold mt-4">Welcome to LPU LIVE</h1><p class="text-lg font-semibold mt-2 max-w-sm opacity-80">Select a conversation from the sidebar to start your journey.</p><div id="welcome-guidelines" class="mt-8 p-4 rounded-xl max-w-md text-left bg-black/10"><h2 class="font-bold mb-2">Platform Guidelines</h2><p class="text-sm text-gray-400">This is an official university platform. Please maintain professional conduct and use appropriate language in all communications.</p></div></div></div>`;
    }
}

// --- EVENT LISTENERS & SETUP ---
function setupEventListeners() {
    
    // Central Delegated Click Handler for the entire document
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        
        // --- Popover Toggles (Emoji and Attachments) ---
        const emojiBtn = target.closest('#emoji-btn');
        const attachmentBtn = target.closest('#attachment-btn');
        const emojiPopover = document.getElementById('emoji-popover');
        const attachmentPopover = document.getElementById('attachment-popover');

        if (emojiBtn) {
            e.stopPropagation(); // Prevent this click from being caught by the document listener
            attachmentPopover.classList.remove('active');
            emojiPopover.classList.toggle('active');
            return;
        }

        if (attachmentBtn) {
            e.stopPropagation(); // Prevent this click from being caught by the document listener
            emojiPopover.classList.remove('active');
            attachmentPopover.classList.toggle('active');
            return;
        }

        // Close popovers if clicking outside of them or their trigger buttons
        if (!target.closest('#emoji-popover') && !target.closest('#emoji-btn')) {
            emojiPopover.classList.remove('active');
        }
        if (!target.closest('#attachment-popover') && !target.closest('#attachment-btn')) {
            attachmentPopover.classList.remove('active');
        }

        // --- Header Button Modals (FIXED) ---
        if (target.closest('#profile-btn')) document.getElementById('profile-modal')?.classList.add('active');
        if (target.closest('#notifications-btn')) document.getElementById('notifications-modal')?.classList.add('active');
        if (target.closest('#bug-report-btn')) document.getElementById('bug-report-modal')?.classList.add('active');
        if (target.closest('#create-group-btn')) document.getElementById('new-message-modal')?.classList.add('active');
        if (target.closest('#privacy-protect-btn')) document.getElementById('privacy-protect-modal')?.classList.add('active');
        
        // --- Modal Closing Logic ---
        if (target.classList.contains('modal-backdrop') || target.closest('.modal-close-btn')) {
            target.closest('.modal-backdrop')?.classList.remove('active');
        }
        
        // --- Mobile Back Button ---
        if (target.closest('#back-btn')) {
            activeChatId = null;
            renderAll();
            updateLayout();
        }

        // --- Theme Toggles ---
        const isDarkMode = bodyEl.classList.contains('dark-mode');
        if (target.closest('#theme-btn')) handleThemeChange(!isDarkMode);
        if (target.closest('#settings-light-btn')) handleThemeChange(false);
        if (target.closest('#settings-dark-btn')) handleThemeChange(true);

        // --- Tabs ---
        const tab = target.closest('.tab');
        if(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            activeTab = tab.dataset.tab;
            activeChatId = null;
            renderAll();
        }
    });

    // --- Listeners for elements that don't bubble or need specific events ---
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => { currentSearchTerm = e.target.value; renderChatList(); });
    searchInput.addEventListener('focus', () => { searchContainer.classList.add("focused"); document.addEventListener("mousemove", throttledMouseMove); });
    searchInput.addEventListener('blur', () => { searchContainer.classList.remove("focused"); document.removeEventListener("mousemove", throttledMouseMove); searchContainer.style.setProperty('--intensity', '0'); });
    
    document.body.addEventListener('input', (e) => {
        if (e.target.id === 'message-input') {
            const micBtn = document.getElementById('mic-btn');
            const sendBtn = document.getElementById('send-btn');
            if (e.target.value.trim() !== '') {
                micBtn?.classList.add('hidden');
                sendBtn?.classList.remove('hidden');
            } else {
                micBtn?.classList.remove('hidden');
                sendBtn?.classList.add('hidden');
            }
        }
    });
    
    const resizer = document.getElementById('resizer');
    resizer.addEventListener('mousedown', (e) => {
        if (window.innerWidth < 768) return;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        const mouseMoveHandler = (e) => { sidebarEl.style.width = `${e.clientX - sidebarEl.getBoundingClientRect().left}px`; };
        const mouseUpHandler = () => {
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    const wallpaperInput = document.getElementById('wallpaper-input');
    const avatarInput = document.getElementById('avatar-input');
    
    if (wallpaperInput) {
        wallpaperInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => { document.body.style.backgroundImage = `url('${event.target.result}')`; };
                reader.readAsDataURL(file);
            }
        });
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const avatarImg = document.getElementById('profile-modal-avatar');
                    if (avatarImg) avatarImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function handleThemeChange(isDarkMode) {
    if (isDarkMode) {
        bodyEl.classList.add('dark-mode');
    } else {
        bodyEl.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcons(isDarkMode);
    updateProfileThemeButtons(isDarkMode);
};

function renderAll() { renderChatList(); renderChatArea(); }

let mousePos = vec2.fromValues(innerWidth * 0.5, innerHeight * 0.5);
const handleMouseMove = (event) => {
    vec2.set(mousePos, event.clientX, event.clientY);
    const angle = mousePos[0] * mousePos[1] * 0.00005;
    const rect = searchContainer.getBoundingClientRect();
    const containerCenter = vec2.fromValues(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
    const distValue = vec2.dist(containerCenter, mousePos);
    const maxDist = 400, maxOffset = 15;
    const dist = Math.max(0, Math.min(distValue, maxDist));
    const offset = (maxDist - dist) / maxDist * maxOffset;
    const intensity = Math.pow((maxDist - dist) / maxDist, 2);
    searchContainer.style.setProperty('--intensity', intensity);
    searchContainer.style.setProperty('--blur', (dist / maxDist * 40) + 8);
    const rotationalScale = 1;
    searchContainer.style.setProperty('--redTop', Math.sin((angle + 0) * rotationalScale) * offset);
    searchContainer.style.setProperty('--redLeft', Math.cos((angle + 0) * rotationalScale) * offset);
    searchContainer.style.setProperty('--greenTop', Math.sin((angle + 2) * rotationalScale) * offset);
    searchContainer.style.setProperty('--greenLeft', Math.cos((angle + 2) * rotationalScale) * offset);
    searchContainer.style.setProperty('--blueTop', Math.sin((angle + 4) * rotationalScale) * offset);
    searchContainer.style.setProperty('--blueLeft', Math.cos((angle + 4) * rotationalScale) * offset);
};
function throttled(fn) { let didRequest = false; return param => { if (!didRequest) { window.requestAnimationFrame(() => { fn(param); didRequest = false; }); didRequest = true; } }; }
const throttledMouseMove = throttled(handleMouseMove);
function updateThemeIcons(isDarkMode) { if(isDarkMode) { sunIcon.classList.add('hidden'); moonIcon.classList.remove('hidden'); } else { sunIcon.classList.remove('hidden'); moonIcon.classList.add('hidden'); } }

function updateProfileThemeButtons(isDarkMode) {
    const lightBtn = document.getElementById('settings-light-btn');
    const darkBtn = document.getElementById('settings-dark-btn');
    if (!lightBtn || !darkBtn) return;
    const activeLight = ['bg-white', 'text-gray-900'];
    const inactiveLight = ['bg-transparent', 'text-gray-400'];
    const activeDark = ['bg-gray-900', 'text-white'];
    const inactiveDark = ['bg-transparent', 'text-gray-400'];
    const allStyleClasses = [...new Set([...activeLight, ...inactiveLight, ...activeDark, ...inactiveDark])];
    lightBtn.classList.remove(...allStyleClasses);
    darkBtn.classList.remove(...allStyleClasses);
    if (isDarkMode) {
        darkBtn.classList.add(...activeDark);
        lightBtn.classList.add(...inactiveDark);
    } else {
        lightBtn.classList.add(...activeLight);
        darkBtn.classList.add(...inactiveLight);
    }
}

function populateEmojis() {
    const emojiPicker = document.querySelector('#emoji-popover #emoji-grid');
    if(!emojiPicker) return;
    const emojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾','👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','__','🦶','👣','👂','🦻','👃','🧠','🦷','🦴','👀','👁️','👅','👄','💋','🩸'];
    emojiPicker.innerHTML = '';
    emojis.forEach(emoji => { 
        const e = document.createElement('button'); e.textContent = emoji; e.className = 'p-1 rounded-lg hover:bg-black/10 transition-transform transform hover:scale-125';
        e.onclick = () => { const messageInput = document.getElementById('message-input'); if(messageInput) messageInput.value += emoji; };
        emojiPicker.appendChild(e);
    });
}
 
function populateAttachments() {
    const attachmentMenu = document.querySelector('#attachment-popover .grid');
    if(!attachmentMenu) return;
    const attachments = [
        { name: 'Photos & videos', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l2 2m-2-2l-2-2m2 2l2-2m-2 2l-2 2m-6-6l2-2 4 4-2 2m0 0l-2 2m2-2l2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 012.828 0L19 12" /></svg>', action: 'file', inputId: 'image-video-input' },
        { name: 'Camera', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>', action: 'file', inputId: 'camera-input' },
        { name: 'Document', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>', action: 'file', inputId: 'document-input' },
        { name: 'Contact', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>', action: 'modal', modalId: 'contact-modal' },
        { name: 'Poll', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>', action: 'modal', modalId: 'poll-modal' },
        { name: 'Event', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>', action: 'modal', modalId: 'event-modal' },
        { name: 'Drawing', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>', action: 'modal', modalId: 'drawing-modal' },
        { name: 'Code Snippet', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>', action: 'modal', modalId: 'code-snippet-modal' },
        { name: 'GIF', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>', action: 'modal', modalId: 'gif-modal' },
        { name: 'Location', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>', action: 'modal', modalId: 'location-modal' },
    ];
    attachmentMenu.innerHTML = '';
    attachments.forEach(att => {
        const a = document.createElement('button');
        a.className = 'flex items-center text-left w-full p-2 rounded-lg hover:bg-black/10';
        a.innerHTML = `${att.icon}<span>${att.name}</span>`;
        a.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('attachment-popover').classList.remove('active');
            if (att.action === 'modal' && att.modalId) { document.getElementById(att.modalId).classList.add('active'); }
            else if (att.action === 'file' && att.inputId) { document.getElementById(att.inputId).click(); }
        });
        attachmentMenu.appendChild(a);
    });
}
 
function setupNewMessageModal() {
    const modal = document.getElementById('new-message-modal');
    if (!modal) return;
    const selectUsersView = document.getElementById('select-users-view');
    const createGroupView = document.getElementById('create-group-view');
    const searchInput = document.getElementById('new-message-search-input');
    const selectedUsersTray = document.getElementById('selected-users-tray');
    const userList = document.getElementById('new-message-user-list');
    const nextBtn = document.getElementById('new-message-next-btn');
    const backBtn = document.getElementById('back-to-select-btn');
    const groupNameInput = document.getElementById('group-name-input');
    const finalMembersList = document.getElementById('final-group-members-list');
    const createBtn = document.getElementById('create-group-confirm-btn');
    let selectedUsers = [];

    function renderUserList(filter = '') {
        userList.innerHTML = '';
        const lowerFilter = filter.toLowerCase();
        const usersToShow = chatsData.filter(c => !c.isGroup && (c.name.toLowerCase().includes(lowerFilter) || c.regNo.toString().includes(lowerFilter)));
        usersToShow.forEach(user => {
            const isSelected = selectedUsers.some(su => su.id === user.id);
            const userItem = document.createElement('div');
            userItem.className = 'flex items-center p-2 rounded-lg cursor-pointer hover:bg-black/10';
            userItem.innerHTML = `<img src="${user.avatar}" class="w-10 h-10 rounded-full mr-3"><div class="flex-1"><div>${user.name}</div><div class="text-sm text-gray-400">${user.regNo}</div></div><input type="checkbox" data-user-id="${user.id}" class="h-5 w-5 rounded text-orange-500 focus:ring-orange-500" ${isSelected ? 'checked' : ''}>`;
            userList.appendChild(userItem);
        });
    }
    function updateSelectedUsersUI() {
        selectedUsersTray.innerHTML = selectedUsers.map(user => `<div class="bg-gray-700 rounded-full pl-2 pr-1 py-1 flex items-center text-sm"><span>${user.name}</span><button data-user-id="${user.id}" class="remove-selected-user-btn ml-2 text-gray-400 hover:text-white">&times;</button></div>`).join('');
        nextBtn.disabled = selectedUsers.length === 0;
    }
    function resetModal() { selectedUsers = []; updateSelectedUsersUI(); searchInput.value = ''; renderUserList(); selectUsersView.classList.remove('hidden'); createGroupView.classList.add('hidden'); groupNameInput.value = ''; }
    userList.addEventListener('click', e => {
        const target = e.target;
        if (target.type === 'checkbox') {
            const userId = parseInt(target.dataset.userId);
            const user = chatsData.find(u => u.id === userId);
            if (target.checked) { if (!selectedUsers.some(su => su.id === userId)) { selectedUsers.push(user); } }
            else { selectedUsers = selectedUsers.filter(su => su.id !== userId); }
            updateSelectedUsersUI();
        }
    });
    selectedUsersTray.addEventListener('click', e => { if (e.target.classList.contains('remove-selected-user-btn')) { const userId = parseInt(e.target.dataset.userId); selectedUsers = selectedUsers.filter(su => su.id !== userId); updateSelectedUsersUI(); renderUserList(searchInput.value); } });
    searchInput.addEventListener('input', () => renderUserList(searchInput.value));
    nextBtn.addEventListener('click', () => {
        if (selectedUsers.length === 1) { activeChatId = selectedUsers[0].id; modal.classList.remove('active'); resetModal(); renderAll(); }
        else if (selectedUsers.length > 1) { selectUsersView.classList.add('hidden'); createGroupView.classList.remove('hidden'); finalMembersList.innerHTML = selectedUsers.map(u => `<span class="bg-gray-700 rounded-full px-2 py-1 text-sm">${u.name}</span>`).join(''); groupNameInput.addEventListener('input', () => { createBtn.disabled = groupNameInput.value.trim() === ''; }); createBtn.disabled = true; }
    });
    backBtn.addEventListener('click', () => { selectUsersView.classList.remove('hidden'); createGroupView.classList.add('hidden'); });
    createBtn.addEventListener('click', () => {
        const groupName = groupNameInput.value.trim();
        if (groupName && selectedUsers.length > 1) {
            const newGroup = { id: 'g' + (groupsData.length + 1), name: groupName, avatar: `https://placehold.co/100x100/A78BFA/FFFFFF?text=${groupName.substring(0,2).toUpperCase()}`, lastMessage: { author: 'You', type: 'text', content: 'Group created.', timestamp: new Date() }, unread: 0, isGroup: true, members: ['You', ...selectedUsers.map(u => u.name)] };
            groupsData.unshift(newGroup); allConversations.unshift(newGroup); activeChatId = newGroup.id; modal.classList.remove('active'); resetModal(); renderAll();
        }
    });
    modal.addEventListener('click', e => { if (e.target.closest('.modal-close-btn')) { resetModal(); } });
    renderUserList();
}

function updateClock() { const now = new Date(); document.getElementById('date').textContent = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); }
 
// --- INITIALIZATION ---
function init() {
    const setAppHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    window.addEventListener('resize', setAppHeight); 
    setAppHeight();
    
    setTimeout(() => preloader.classList.add('hidden'), 1500);
    
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    handleThemeChange(isDarkMode);

    updateClock();
    setInterval(updateClock, 1000);
    
    renderAll();
    setupEventListeners();
    
    populateEmojis();
    populateAttachments();
    setupNewMessageModal();
    // You can add back other setup functions here if they exist, e.g., setupAudioRecorder()
    
    updateLayout();
}

// Run the app
init();
