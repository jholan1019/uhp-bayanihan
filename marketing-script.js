// Income Calculator Function
function calculateIncome() {
    const personalSales = parseFloat(document.getElementById('personalSales').value) || 0;
    const totalRevenue = parseFloat(document.getElementById('totalRevenue').value) || 0;
    const eWalletIncome = parseFloat(document.getElementById('eWalletIncome').value) || 0;
    
    // Calculate commissions
    const personalCommission = personalSales * 0.50;
    const revenueShare = totalRevenue * 0.70;
    const eWalletCommission = eWalletIncome * 0.70;
    const totalEarnings = personalCommission + revenueShare + eWalletCommission;
    
    // Format and display results
    document.getElementById('personalCommission').textContent = formatCurrency(personalCommission);
    document.getElementById('revenueShare').textContent = formatCurrency(revenueShare);
    document.getElementById('eWalletCommission').textContent = formatCurrency(eWalletCommission);
    document.getElementById('totalEarnings').textContent = formatCurrency(totalEarnings);
    
    // Add animation to results
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

function formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.benefit-card, .income-example, .story-card, .step');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for income amounts
    animateCounters();
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', parallaxEffect);
    
    // Add hover effects to cards
    addCardEffects();
});

function animateCounters() {
    const counters = document.querySelectorAll('.amount, .monthly-total, .earnings');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[₱,]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (counter.classList.contains('amount') || counter.classList.contains('monthly-total')) {
                counter.textContent = '₱' + Math.floor(current).toLocaleString();
            } else {
                counter.textContent = '₱' + Math.floor(current).toLocaleString() + '/month';
            }
        }, 16);
    });
}

function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
}

function addCardEffects() {
    const cards = document.querySelectorAll('.benefit-card, .story-card, .income-example');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Add floating animation to income cards
function addFloatingAnimation() {
    const incomeCards = document.querySelectorAll('.income-card');
    
    incomeCards.forEach((card, index) => {
        setInterval(() => {
            const offset = Math.sin(Date.now() * 0.001 + index * 2) * 10;
            card.style.transform = `translateY(${offset}px)`;
        }, 50);
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add glowing effect to buttons
function addButtonGlow() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(78, 205, 196, 0.6)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.3)';
        });
    });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', function() {
    addFloatingAnimation();
    addButtonGlow();
    
    // Add stagger animation to benefit cards
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add pulse effect to step numbers
    const stepNumbers = document.querySelectorAll('.step-number');
    stepNumbers.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.5}s`;
    });
});

// Add scroll-triggered animations
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Animate elements as they come into view
    const elements = document.querySelectorAll('.benefit-card, .income-example, .story-card');
    elements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        
        if (scrolled + windowHeight > elementTop + elementHeight / 4) {
            element.classList.add('animate-in');
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .benefit-card, .income-example, .story-card {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s ease-out;
    }
    
    .benefit-card.animate-in, 
    .income-example.animate-in, 
    .story-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
