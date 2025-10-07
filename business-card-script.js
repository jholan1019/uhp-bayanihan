// Business Card Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Generate QR Code for UHP Bayanihan Facebook Page
    generateQRCode();
    
    // Add click event for card flipping
    const businessCard = document.querySelector('.business-card');
    businessCard.addEventListener('click', flipCard);
    
    // Add floating animation to contact items
    addFloatingAnimations();
    
    // Add glow effects on hover
    addGlowEffects();
});

// Generate QR Code for Facebook Page
function generateQRCode() {
    const qrContainer = document.getElementById('qrcode');
    
    // UHP Bayanihan Facebook Page URL
    const facebookPageUrl = 'https://www.facebook.com/UHPBayanihan';
    
    // Use QR Server API to generate QR code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(facebookPageUrl)}&bgcolor=ffffff&color=1e3c72`;
    
    // Create QR code image
    const qrImage = document.createElement('img');
    qrImage.src = qrCodeUrl;
    qrImage.alt = 'UHP Bayanihan Facebook Page QR Code';
    qrImage.style.width = '60px';
    qrImage.style.height = '60px';
    qrImage.style.borderRadius = '6px';
    qrImage.style.border = '2px solid white';
    
    // Add click event to QR code
    qrImage.addEventListener('click', function(e) {
        e.stopPropagation();
        window.open(facebookPageUrl, '_blank');
    });
    
    qrImage.style.cursor = 'pointer';
    qrImage.title = 'Click to visit UHP Bayanihan Facebook Page';
    
    // Clear container and add QR code
    qrContainer.innerHTML = '';
    qrContainer.appendChild(qrImage);
    
    console.log('QR Code generated successfully!');
}

// Card Flip Function
function flipCard() {
    const businessCard = document.querySelector('.business-card');
    businessCard.classList.toggle('flipped');
}

// Add floating animations to contact items
function addFloatingAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    const featureItems = document.querySelectorAll('.feature-item');
    
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('float-animation');
    });
    
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('float-animation');
    });
}

// Add glow effects on hover
function addGlowEffects() {
    const glowElements = [
        '.wifi-icon',
        '.income-box',
        '.qr-container',
        '.benefit-item',
        '.social-links i'
    ];
    
    glowElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.6)';
                this.style.transform = 'scale(1.05)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
                this.style.transform = '';
            });
        });
    });
}

// Print function with options
function printBusinessCard() {
    // Ask user which side to print
    const printFront = confirm('Print front side? (Cancel for back side)');
    
    const businessCard = document.querySelector('.business-card');
    
    if (!printFront) {
        businessCard.classList.add('flipped');
    } else {
        businessCard.classList.remove('flipped');
    }
    
    // Small delay to ensure flip animation completes
    setTimeout(() => {
        window.print();
    }, 100);
}

// Update contact information dynamically
function updateContactInfo(name, phone, email) {
    const nameElement = document.querySelector('.contact-text strong');
    const phoneElement = document.querySelectorAll('.contact-text')[1];
    const emailElement = document.querySelectorAll('.contact-text')[2];
    
    if (nameElement) nameElement.textContent = name;
    if (phoneElement) phoneElement.textContent = phone;
    if (emailElement) emailElement.textContent = email;
}

// Social media click handlers
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links i');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card flip
            
            const className = this.className;
            let url = '';
            
            if (className.includes('facebook')) {
                url = 'https://www.facebook.com/UHPBayanihan';
            } else if (className.includes('whatsapp')) {
                url = 'https://wa.me/63XXXXXXXXX'; // Replace with actual WhatsApp number
            } else if (className.includes('phone')) {
                url = 'tel:+63XXXXXXXXX'; // Replace with actual phone number
            } else if (className.includes('envelope')) {
                url = 'mailto:uhpbayanihan@gmail.com'; // Replace with actual email
            }
            
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

// Initialize social links
document.addEventListener('DOMContentLoaded', function() {
    setupSocialLinks();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'F' to flip card
    if (e.key.toLowerCase() === 'f') {
        flipCard();
    }
    
    // Press 'P' to print
    if (e.key.toLowerCase() === 'p' && e.ctrlKey) {
        e.preventDefault();
        printBusinessCard();
    }
});

// Auto-flip card every 10 seconds for demo
function startAutoFlip() {
    setInterval(() => {
        flipCard();
    }, 10000);
}

// Uncomment the line below to enable auto-flip
// startAutoFlip();

// Income calculator integration
function openIncomeCalculator() {
    // Open the income calculator in a new tab
    window.open('index.html', '_blank');
}

// Add click event to income highlight
document.addEventListener('DOMContentLoaded', function() {
    const incomeBox = document.querySelector('.income-box');
    if (incomeBox) {
        incomeBox.addEventListener('click', function(e) {
            e.stopPropagation();
            openIncomeCalculator();
        });
        
        // Add cursor pointer to indicate it's clickable
        incomeBox.style.cursor = 'pointer';
    }
});

// Responsive text sizing
function adjustTextSize() {
    const card = document.querySelector('.business-card');
    const cardWidth = card.offsetWidth;
    
    // Adjust font sizes based on card width
    if (cardWidth < 300) {
        document.documentElement.style.setProperty('--base-font-size', '0.8em');
    } else if (cardWidth < 400) {
        document.documentElement.style.setProperty('--base-font-size', '1em');
    } else {
        document.documentElement.style.setProperty('--base-font-size', '1.2em');
    }
}

// Call on window resize
window.addEventListener('resize', adjustTextSize);
document.addEventListener('DOMContentLoaded', adjustTextSize);

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .float-animation {
        animation: floatUp 0.6s ease-out forwards;
    }
    
    @keyframes floatUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .glow-effect {
        transition: all 0.3s ease;
    }
    
    .glow-effect:hover {
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);

console.log('🎯 UHP Bayanihan Business Card loaded successfully!');
console.log('📱 Features: QR Code, Flip Animation, Print Support, Mobile Responsive');
console.log('🔗 Facebook Page: https://www.facebook.com/UHPBayanihan');