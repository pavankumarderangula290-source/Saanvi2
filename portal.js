/**
 * portal.js - Logic for Saanvi International School Staff Portal
 */

const DB_KEYS = {
    ADMIN: 'saanvi_admin',
    STAFF: 'saanvi_staff',
    STUDENT: 'saanvi_students',
    SESSION: 'saanvi_session'
};

const DEFAULT_ADMIN = {
    username: 'pavan',
    password: 'kumar1109'
};

// Initialize Database
function initDB() {
    if (!localStorage.getItem(DB_KEYS.ADMIN)) {
        localStorage.setItem(DB_KEYS.ADMIN, JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem(DB_KEYS.STAFF)) {
        localStorage.setItem(DB_KEYS.STAFF, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.STUDENT)) {
        localStorage.setItem(DB_KEYS.STUDENT, JSON.stringify([]));
    }
}

// Session Management
const sessionManager = {
    createSession(type, id) {
        localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ type, id }));
    },
    getSession() {
        const session = localStorage.getItem(DB_KEYS.SESSION);
        return session ? JSON.parse(session) : null;
    },
    clearSession() {
        localStorage.removeItem(DB_KEYS.SESSION);
        window.location.href = 'login.html';
    },
    requireAuth(type) {
        const session = this.getSession();
        if (!session || (type && session.type !== type)) {
            window.location.href = 'login.html';
        }
        return session;
    }
};

// Admin API
const adminApi = {
    verifyLogin(username, password) {
        const admin = JSON.parse(localStorage.getItem(DB_KEYS.ADMIN));
        return admin.username === username && admin.password === password;
    },
    updateCredentials(newUsername, newPassword) {
        localStorage.setItem(DB_KEYS.ADMIN, JSON.stringify({
            username: newUsername,
            password: newPassword
        }));
    },
    getStaff() {
        return JSON.parse(localStorage.getItem(DB_KEYS.STAFF));
    },
    addStaff(staffObj) {
        const staff = this.getStaff();
        staffObj.id = 'STF' + Date.now().toString().slice(-6);
        staffObj.isFirstLogin = true;
        staffObj.tasks = [];
        staff.push(staffObj);
        localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(staff));
    },
    deleteStaff(id) {
        let staff = this.getStaff();
        staff = staff.filter(s => s.id !== id);
        localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(staff));
    },
    assignTask(staffId, taskDesc, deadline) {
        const staff = this.getStaff();
        const member = staff.find(s => s.id === staffId);
        if (member) {
            member.tasks.push({
                id: 'TSK' + Date.now().toString().slice(-6),
                description: taskDesc,
                assignedDate: new Date().toISOString().split('T')[0],
                deadline: deadline,
                status: 'pending'
            });
            localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(staff));
        }
    }
};

// Staff API
const staffApi = {
    verifyLogin(passcode) {
        const staff = JSON.parse(localStorage.getItem(DB_KEYS.STAFF));
        return staff.find(s => s.passcode === passcode);
    },
    getProfile(id) {
        const staff = JSON.parse(localStorage.getItem(DB_KEYS.STAFF));
        return staff.find(s => s.id === id);
    },
    updatePasscode(id, newPasscode) {
        const staffList = JSON.parse(localStorage.getItem(DB_KEYS.STAFF));
        const member = staffList.find(s => s.id === id);
        if (member) {
            member.passcode = newPasscode;
            member.isFirstLogin = false;
            localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(staffList));
        }
    },
    updateTaskStatus(staffId, taskId, status) {
        const staffList = JSON.parse(localStorage.getItem(DB_KEYS.STAFF));
        const member = staffList.find(s => s.id === staffId);
        if (member) {
            const task = member.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = status;
                localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(staffList));
            }
        }
    },
    // Student Management (for Staff)
    getStudents() {
        return JSON.parse(localStorage.getItem(DB_KEYS.STUDENT));
    },
    addStudent(studentObj) {
        const students = this.getStudents();
        studentObj.id = 'STU' + Date.now().toString().slice(-6);
        studentObj.passcode = studentObj.passcode || '1234';
        studentObj.isFirstLogin = true;
        studentObj.exams = [];
        students.push(studentObj);
        localStorage.setItem(DB_KEYS.STUDENT, JSON.stringify(students));
    },
    addExamMarks(studentId, examData) {
        const students = this.getStudents();
        const student = students.find(s => s.id === studentId);
        if (student) {
            examData.id = 'EXM' + Date.now().toString().slice(-6);
            examData.date = new Date().toISOString().split('T')[0];
            student.exams.push(examData);
            localStorage.setItem(DB_KEYS.STUDENT, JSON.stringify(students));
        }
    }
};

// Student API
const studentApi = {
    verifyLogin(studentId, passcode) {
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENT));
        return students.find(s => s.id === studentId && s.passcode === passcode);
    },
    getProfile(id) {
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENT));
        return students.find(s => s.id === id);
    },
    updatePasscode(id, newPasscode) {
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENT));
        const student = students.find(s => s.id === id);
        if (student) {
            student.passcode = newPasscode;
            student.isFirstLogin = false;
            localStorage.setItem(DB_KEYS.STUDENT, JSON.stringify(students));
        }
    }
};

// UI Utils
function showAlert(id, message, type = 'error') {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = `alert alert-${type}`;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// Call initDB on load
initDB();
