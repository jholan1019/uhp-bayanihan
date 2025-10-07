// UHP Bayanihan - Community Internet Sharing Platform
class UHPBayanihan {
    constructor() {
        this.members = JSON.parse(localStorage.getItem('uhpMembers')) || [];
        this.connections = JSON.parse(localStorage.getItem('uhpConnections')) || [];
        this.activities = JSON.parse(localStorage.getItem('uhpActivities')) || [];
        this.settings = JSON.parse(localStorage.getItem('uhpSettings')) || this.getDefaultSettings();
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.updateStats();
        this.renderDashboard();
        this.renderMembers();
        this.renderConnections();
        this.setupEventListeners();
        this.startConnectionMonitoring();
    }

    getDefaultSettings() {
        return {
            autoSharingEnabled: true,
            maxConnections: 10,
            dataLimit: 1000, // MB per day
            sharingHours: {
                start: '06:00',
                end: '22:00'
            },
            notifications: true,
            communityName: 'UHP Bayanihan Community',
            adminContact: '',
            connectionSpeed: '10 Mbps',
            securityLevel: 'High'
        };
    }

    loadSampleData() {
        if (this.members.length === 0) {
            const sampleMembers = [
                {
                    id: 'member1',
                    name: 'Juan Dela Cruz',
                    email: 'juan@email.com',
                    phone: '+63 912 345 6789',
                    address: 'Barangay 1, Manila',
                    status: 'active',
                    joinDate: '2024-01-15',
                    dataUsed: 250,
                    connectionType: 'WiFi'
                },
                {
                    id: 'member2',
                    name: 'Maria Santos',
                    email: 'maria@email.com',
                    phone: '+63 917 654 3210',
                    address: 'Barangay 2, Quezon City',
                    status: 'active',
                    joinDate: '2024-01-20',
                    dataUsed: 180,
                    connectionType: 'Mobile Hotspot'
                },
                {
                    id: 'member3',
                    name: 'Pedro Garcia',
                    email: 'pedro@email.com',
                    phone: '+63 905 123 4567',
                    address: 'Barangay 3, Makati',
                    status: 'inactive',
                    joinDate: '2024-01-10',
                    dataUsed: 75,
                    connectionType: 'WiFi'
                }
            ];
            this.members = sampleMembers;
            this.saveMembers();
        }

        if (this.connections.length === 0) {
            const sampleConnections = [
                {
                    id: 'conn1',
                    memberId: 'member1',
                    startTime: new Date(Date.now() - 3600000).toISOString(),
                    endTime: null,
                    dataUsed: 45,
                    status: 'active'
                },
                {
                    id: 'conn2',
                    memberId: 'member2',
                    startTime: new Date(Date.now() - 7200000).toISOString(),
                    endTime: new Date(Date.now() - 1800000).toISOString(),
                    dataUsed: 120,
                    status: 'completed'
                }
            ];
            this.connections = sampleConnections;
            this.saveConnections();
        }
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
        
        // Add active class to selected nav item
        const selectedNav = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        if (selectedNav) {
            selectedNav.classList.add('active');
        }
        
        // Render content based on tab
        switch(tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'members':
                this.renderMembers();
                break;
            case 'sharing':
                this.renderSharing();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    renderDashboard() {
        this.updateStats();
        this.renderRecentActivity();
    }

    updateStats() {
        const activeMembers = this.members.filter(m => m.status === 'active').length;
        const activeConnections = this.connections.filter(c => c.status === 'active').length;
        const totalDataShared = this.connections.reduce((sum, c) => sum + c.dataUsed, 0);

        const totalMembersEl = document.getElementById('totalMembers');
        const activeConnectionsEl = document.getElementById('activeConnections');
        const dataSharedEl = document.getElementById('dataShared');

        if (totalMembersEl) totalMembersEl.textContent = this.members.length;
        if (activeConnectionsEl) activeConnectionsEl.textContent = activeConnections;
        if (dataSharedEl) dataSharedEl.textContent = totalDataShared.toFixed(1) + ' MB';
    }

    renderRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;

        const recentConnections = this.connections
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
            .slice(0, 5);

        const activityHTML = recentConnections.map(conn => {
            const member = this.members.find(m => m.id === conn.memberId);
            const memberName = member ? member.name : 'Unknown Member';
            const timeAgo = this.formatTimeAgo(conn.startTime);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-wifi"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">${memberName} ${conn.status === 'active' ? 'connected' : 'disconnected'}</div>
                        <div class="activity-time">${timeAgo}</div>
                    </div>
                    <div class="activity-data">${conn.dataUsed} MB</div>
                </div>
            `;
        }).join('');

        activityContainer.innerHTML = activityHTML || '<p>No recent activity</p>';
    }

    renderMembers() {
        const membersContainer = document.getElementById('membersContainer');
        if (!membersContainer) return;

        const membersHTML = this.members.map(member => `
            <div class="member-card">
                <div class="member-header">
                    <h3>${member.name}</h3>
                    <span class="status-badge ${member.status}">${member.status}</span>
                </div>
                <div class="member-details">
                    <p><i class="fas fa-envelope"></i> ${member.email}</p>
                    <p><i class="fas fa-phone"></i> ${member.phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
                    <p><i class="fas fa-calendar"></i> Joined: ${member.joinDate}</p>
                    <p><i class="fas fa-chart-bar"></i> Data Used: ${member.dataUsed} MB</p>
                </div>
                <div class="member-actions">
                    <button onclick="uhpApp.editMember('${member.id}')" class="btn-edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="uhpApp.deleteMember('${member.id}')" class="btn-delete">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');

        membersContainer.innerHTML = membersHTML;
    }

    renderConnections() {
        // This method can be called when the sharing tab is active
        this.renderSharing();
    }

    renderSharing() {
        const sharingContainer = document.getElementById('sharingContainer');
        if (!sharingContainer) return;

        const activeConnections = this.connections.filter(c => c.status === 'active');
        
        const sharingHTML = `
            <div class="sharing-controls">
                <button onclick="uhpApp.toggleSharing()" class="btn-primary">
                    <i class="fas fa-wifi"></i> ${this.settings.autoSharingEnabled ? 'Stop' : 'Start'} Sharing
                </button>
                <button onclick="uhpApp.showConnectionModal()" class="btn-secondary">
                    <i class="fas fa-plus"></i> New Connection
                </button>
            </div>
            <div class="connections-list">
                ${activeConnections.map(conn => {
                    const member = this.members.find(m => m.id === conn.memberId);
                    return `
                        <div class="connection-item">
                            <div class="connection-info">
                                <h4>${member ? member.name : 'Unknown Member'}</h4>
                                <p>Connected: ${this.formatTimeAgo(conn.startTime)}</p>
                                <p>Data Used: ${conn.dataUsed} MB</p>
                            </div>
                            <button onclick="uhpApp.disconnectMember('${conn.id}')" class="btn-disconnect">
                                <i class="fas fa-times"></i> Disconnect
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        sharingContainer.innerHTML = sharingHTML;
    }

    renderAnalytics() {
        const analyticsContainer = document.getElementById('analyticsContainer');
        if (!analyticsContainer) return;

        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.status === 'active').length;
        const totalDataShared = this.connections.reduce((sum, c) => sum + c.dataUsed, 0);
        const avgDataPerMember = totalMembers > 0 ? (totalDataShared / totalMembers).toFixed(1) : 0;

        const analyticsHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h3>Community Overview</h3>
                    <div class="stat-item">
                        <span class="stat-label">Total Members:</span>
                        <span class="stat-value">${totalMembers}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Active Members:</span>
                        <span class="stat-value">${activeMembers}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Data Shared:</span>
                        <span class="stat-value">${totalDataShared.toFixed(1)} MB</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Data per Member:</span>
                        <span class="stat-value">${avgDataPerMember} MB</span>
                    </div>
                </div>
                <div class="analytics-card">
                    <h3>Connection Statistics</h3>
                    <div class="stat-item">
                        <span class="stat-label">Active Connections:</span>
                        <span class="stat-value">${this.connections.filter(c => c.status === 'active').length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Connections Today:</span>
                        <span class="stat-value">${this.connections.length}</span>
                    </div>
                </div>
            </div>
        `;

        analyticsContainer.innerHTML = analyticsHTML;
    }

    loadSettings() {
        const settingsForm = document.getElementById('settingsForm');
        if (!settingsForm) return;

        const autoSharingEl = document.getElementById('autoSharingEnabled');
        const maxConnectionsEl = document.getElementById('maxConnections');
        const dataLimitEl = document.getElementById('dataLimit');
        const sharingStartEl = document.getElementById('sharingStartTime');
        const sharingEndEl = document.getElementById('sharingEndTime');
        const notificationsEl = document.getElementById('notifications');
        const communityNameEl = document.getElementById('communityName');
        const adminContactEl = document.getElementById('adminContact');

        if (autoSharingEl) autoSharingEl.checked = this.settings.autoSharingEnabled;
        if (maxConnectionsEl) maxConnectionsEl.value = this.settings.maxConnections;
        if (dataLimitEl) dataLimitEl.value = this.settings.dataLimit;
        if (sharingStartEl) sharingStartEl.value = this.settings.sharingHours.start;
        if (sharingEndEl) sharingEndEl.value = this.settings.sharingHours.end;
        if (notificationsEl) notificationsEl.checked = this.settings.notifications;
        if (communityNameEl) communityNameEl.value = this.settings.communityName;
        if (adminContactEl) adminContactEl.value = this.settings.adminContact;
    }

    saveSettings() {
        const settingsForm = document.getElementById('settingsForm');
        if (!settingsForm) return;

        const formData = new FormData(settingsForm);
        
        this.settings = {
            autoSharingEnabled: formData.get('autoSharingEnabled') === 'on',
            maxConnections: parseInt(formData.get('maxConnections')) || 10,
            dataLimit: parseInt(formData.get('dataLimit')) || 1000,
            sharingHours: {
                start: formData.get('sharingStartTime') || '06:00',
                end: formData.get('sharingEndTime') || '22:00'
            },
            notifications: formData.get('notifications') === 'on',
            communityName: formData.get('communityName') || 'UHP Bayanihan Community',
            adminContact: formData.get('adminContact') || ''
        };

        localStorage.setItem('uhpSettings', JSON.stringify(this.settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    showNewMemberModal() {
        const modal = document.getElementById('newMemberModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    saveMember(formData) {
        const memberData = {
            id: 'member' + Date.now(),
            name: formData.get('memberName'),
            email: formData.get('memberEmail'),
            phone: formData.get('memberPhone'),
            address: formData.get('memberAddress'),
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            dataUsed: 0,
            connectionType: formData.get('connectionType') || 'WiFi'
        };

        this.members.push(memberData);
        this.saveMembers();
        this.renderMembers();
        this.updateStats();
        this.closeModal('newMemberModal');
        this.showNotification('Member added successfully!', 'success');
    }

    deleteMember(memberId) {
        if (confirm('Are you sure you want to remove this member?')) {
            this.members = this.members.filter(m => m.id !== memberId);
            this.saveMembers();
            this.renderMembers();
            this.updateStats();
            this.showNotification('Member removed successfully!', 'success');
        }
    }

    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            // For now, just show an alert. In a full implementation, this would open an edit modal
            alert(`Edit member: ${member.name}\nThis feature will be implemented in the full version.`);
        }
    }

    toggleSharing() {
        this.settings.autoSharingEnabled = !this.settings.autoSharingEnabled;
        localStorage.setItem('uhpSettings', JSON.stringify(this.settings));
        this.renderSharing();
        
        const status = this.settings.autoSharingEnabled ? 'enabled' : 'disabled';
        this.showNotification(`Internet sharing ${status}!`, 'info');
    }

    showConnectionModal() {
        // For now, just show an alert. In a full implementation, this would open a connection modal
        alert('New Connection feature will be implemented in the full version.');
    }

    disconnectMember(connectionId) {
        if (confirm('Are you sure you want to disconnect this member?')) {
            const connection = this.connections.find(c => c.id === connectionId);
            if (connection) {
                connection.status = 'completed';
                connection.endTime = new Date().toISOString();
                this.saveConnections();
                this.renderSharing();
                this.updateStats();
                this.showNotification('Member disconnected successfully!', 'info');
            }
        }
    }

    startConnectionMonitoring() {
        if (this.settings.autoSharingEnabled) {
            setInterval(() => {
                this.updateConnectionStatus();
            }, 30000); // Update every 30 seconds
        }
    }

    updateConnectionStatus() {
        // Simulate connection updates
        this.connections.forEach(conn => {
            if (conn.status === 'active') {
                conn.dataUsed += Math.random() * 5; // Random data usage
            }
        });
        this.saveConnections();
        this.updateStats();
    }

    setupEventListeners() {
        // Settings form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }

        // New member form
        const newMemberForm = document.getElementById('newMemberForm');
        if (newMemberForm) {
            newMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMember(new FormData(e.target));
            });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    exportData() {
        const data = {
            members: this.members,
            connections: this.connections,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        this.downloadFile(dataStr, 'uhp-bayanihan-data.json', 'application/json');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    saveMembers() {
        localStorage.setItem('uhpMembers', JSON.stringify(this.members));
    }

    saveConnections() {
        localStorage.setItem('uhpConnections', JSON.stringify(this.connections));
    }

    formatTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick events
let uhpApp;

function showTab(tabName) {
    uhpApp.showTab(tabName);
}

function showNewMemberModal() {
    uhpApp.showNewMemberModal();
}

function closeModal(modalId) {
    uhpApp.closeModal(modalId);
}

function exportData() {
    uhpApp.exportData();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    uhpApp = new UHPBayanihan();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});