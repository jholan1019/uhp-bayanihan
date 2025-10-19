// Antenna Sponsor Calculator Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 UHP Bayanihan Antenna Sponsor Calculator loaded!');
    
    // Initialize calculator
    calculateInvestment();
    
    // Add smooth scrolling for navigation links
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
});

// Antenna package data
const antennaPackages = {
    eap110: {
        name: 'EAP110',
        price: 1800,
        shares: 1,
        type: 'Entry Level'
    },
    eap225: {
        name: 'EAP225',
        price: 3500,
        shares: 2,
        type: 'Professional'
    },
    eap650: {
        name: 'EAP650',
        price: 6000,
        shares: 4,
        type: 'Premium'
    }
};

// Function to get real financial data from UHP ecosystem
function getRealFinancialData() {
    try {
        // Get data from localStorage (same as UHP ecosystem)
        const salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        const ewalletData = JSON.parse(localStorage.getItem('ewalletData')) || [];
        const wifiSharerData = JSON.parse(localStorage.getItem('wifiSharerData')) || [];
        const antennaSponsorData = JSON.parse(localStorage.getItem('antennaSponsorData')) || [];
        
        // Calculate total revenue (same logic as UHP ecosystem)
        let totalSalesAmount = 0;
        salesData.forEach(sale => {
            totalSalesAmount += parseFloat(sale.amount) || 0;
        });
        
        let totalEwalletAmount = 0;
        ewalletData.forEach(ewallet => {
            totalEwalletAmount += parseFloat(ewallet.amount) || 0;
        });
        
        const totalRevenue = totalSalesAmount + totalEwalletAmount;
        
        // Calculate community pool (same logic as UHP ecosystem)
        const voucherPoolAmount = totalSalesAmount * 0.70; // 70% of voucher sales
        const ewalletPoolAmount = totalEwalletAmount * 0.70; // 70% of ewallet income
        const communityPool = voucherPoolAmount + ewalletPoolAmount;
        
        // For investment calculator, use a base share calculation based on financial performance
        // This gives a realistic value per share without being tied to current member counts
        const baseShares = Math.max(1, Math.floor(totalRevenue / 10000)); // 1 share per ₱10,000 revenue
        
        // Calculate value per share based on financial performance only
        const valuePerShare = baseShares > 0 ? communityPool / baseShares : 0;
        
        return {
            totalRevenue,
            communityPool,
            baseShares,
            valuePerShare,
            hasData: totalRevenue > 0
        };
    } catch (error) {
        console.error('Error fetching financial data:', error);
        return {
            totalRevenue: 0,
            communityPool: 0,
            baseShares: 0,
            valuePerShare: 0,
            hasData: false
        };
    }
}

// Dynamic income rates based on real data
function getIncomeRates() {
    const realData = getRealFinancialData();
    
    if (realData.hasData && realData.valuePerShare > 0) {
        // Use real value per share as the base
        const baseRate = realData.valuePerShare;
        return {
            conservative: Math.round(baseRate * 0.8), // 80% of actual value per share
            moderate: Math.round(baseRate), // Actual value per share
            optimistic: Math.round(baseRate * 1.2), // 120% of actual value per share
            isRealData: true,
            realValuePerShare: baseRate
        };
    } else {
        // Fallback to estimated rates when no real data
        return {
            conservative: 500,
            moderate: 1000,
            optimistic: 1500,
            isRealData: false,
            realValuePerShare: 0
        };
    }
}

// Update quantity function
function updateQuantity(packageType, change) {
    const input = document.getElementById(`${packageType}-qty`);
    const currentValue = parseInt(input.value) || 0;
    const newValue = Math.max(0, Math.min(50, currentValue + change));
    input.value = newValue;
    calculateInvestment();
}

// Select package function
function selectPackage(packageType, price, shares) {
    const input = document.getElementById(`${packageType}-qty`);
    const currentValue = parseInt(input.value) || 0;
    input.value = currentValue + 1;
    calculateInvestment();
    
    // Scroll to calculator
    document.getElementById('calculator').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Add visual feedback
    const packageCard = document.querySelector(`[data-package="${packageType}"]`);
    packageCard.style.transform = 'scale(1.05)';
    setTimeout(() => {
        packageCard.style.transform = '';
    }, 300);
}

// Preset investment packages
function setPreset(presetType) {
    const presets = {
        starter: {
            eap110: 2,
            eap225: 1,
            eap650: 0
        },
        balanced: {
            eap110: 3,
            eap225: 2,
            eap650: 1
        },
        premium: {
            eap110: 2,
            eap225: 3,
            eap650: 3
        }
    };
    
    const preset = presets[presetType];
    if (preset) {
        Object.keys(preset).forEach(packageType => {
            document.getElementById(`${packageType}-qty`).value = preset[packageType];
        });
        calculateInvestment();
        
        // Visual feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Applied!';
        button.style.background = '#4CAF50';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }
}

// Main calculation function
function calculateInvestment() {
    const quantities = {
        eap110: parseInt(document.getElementById('eap110-qty').value) || 0,
        eap225: parseInt(document.getElementById('eap225-qty').value) || 0,
        eap650: parseInt(document.getElementById('eap650-qty').value) || 0
    };
    
    let totalInvestment = 0;
    let totalShares = 0;
    let totalAntennas = 0;
    let breakdown = [];
    
    // Calculate totals and breakdown
    Object.keys(quantities).forEach(packageType => {
        const qty = quantities[packageType];
        const pkg = antennaPackages[packageType];
        
        if (qty > 0) {
            const investment = qty * pkg.price;
            const shares = qty * pkg.shares;
            
            totalInvestment += investment;
            totalShares += shares;
            totalAntennas += qty;
            
            breakdown.push({
                name: pkg.name,
                type: pkg.type,
                quantity: qty,
                unitPrice: pkg.price,
                totalPrice: investment,
                shares: shares,
                sharesPerUnit: pkg.shares
            });
        }
    });
    
    // Update display
    updateResultsDisplay(totalInvestment, totalShares, totalAntennas, breakdown);
    updateIncomeProjections(totalShares);
    updateBreakdownDisplay(breakdown);
}

// Update results display
function updateResultsDisplay(totalInvestment, totalShares, totalAntennas, breakdown) {
    document.getElementById('total-investment').textContent = `₱${totalInvestment.toLocaleString()}`;
    document.getElementById('total-shares').textContent = totalShares.toLocaleString();
    document.getElementById('total-antennas').textContent = totalAntennas.toLocaleString();
}

// Update income projections
function updateIncomeProjections(totalShares) {
    const incomeRates = getIncomeRates();
    
    const conservativeIncome = totalShares * incomeRates.conservative;
    const moderateIncome = totalShares * incomeRates.moderate;
    const optimisticIncome = totalShares * incomeRates.optimistic;
    
    document.getElementById('conservative-income').textContent = `₱${conservativeIncome.toLocaleString()}`;
    document.getElementById('moderate-income').textContent = `₱${moderateIncome.toLocaleString()}`;
    document.getElementById('optimistic-income').textContent = `₱${optimisticIncome.toLocaleString()}`;
    
    // Update data source indicator
    updateDataSourceIndicator(incomeRates);
}

// Update data source indicator
function updateDataSourceIndicator(incomeRates) {
    const realData = getRealFinancialData();
    let indicatorHtml = '';
    
    if (incomeRates.isRealData) {
        indicatorHtml = `
            <div style="background: #10B981; color: white; padding: 0.75rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center;">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">📊 Real-Time Data</div>
                <div style="font-size: 0.875rem;">
                    Based on actual UHP ecosystem financial performance<br>
                    Current value per share: ₱${incomeRates.realValuePerShare.toLocaleString()}<br>
                    Total community pool: ₱${realData.communityPool.toLocaleString()}<br>
                    Total revenue: ₱${realData.totalRevenue.toLocaleString()}
                </div>
            </div>
        `;
    } else {
        indicatorHtml = `
            <div style="background: #F59E0B; color: white; padding: 0.75rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center;">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">📈 Estimated Data</div>
                <div style="font-size: 0.875rem;">
                    Based on projected performance<br>
                    Connect to UHP ecosystem for real-time calculations
                </div>
            </div>
        `;
    }
    
    // Find or create indicator container
    let indicatorContainer = document.getElementById('data-source-indicator');
    if (!indicatorContainer) {
        indicatorContainer = document.createElement('div');
        indicatorContainer.id = 'data-source-indicator';
        
        // Insert after the income projections section
        const incomeSection = document.querySelector('.bg-green-50');
        if (incomeSection && incomeSection.parentNode) {
            incomeSection.parentNode.insertBefore(indicatorContainer, incomeSection.nextSibling);
        }
    }
    
    indicatorContainer.innerHTML = indicatorHtml;
}

// Update breakdown display
function updateBreakdownDisplay(breakdown) {
    const breakdownContainer = document.getElementById('investment-breakdown');
    
    if (breakdown.length === 0) {
        breakdownContainer.innerHTML = '<p style="color: #6B7280; text-align: center; font-style: italic;">No antennas selected</p>';
        return;
    }
    
    let html = '';
    breakdown.forEach(item => {
        html += `
            <div class="breakdown-item" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 1rem; 
                background: rgba(59, 130, 246, 0.1); 
                border-radius: 10px; 
                margin-bottom: 1rem;
                border-left: 4px solid #10B981;
                border: 1px solid rgba(59, 130, 246, 0.2);
            ">
                <div>
                    <div style="color: #1F2937; font-weight: 600; font-size: 1.1rem;">
                        ${item.quantity}x ${item.name}
                    </div>
                    <div style="color: #6B7280; font-size: 0.9rem;">
                        ${item.type} • ₱${item.unitPrice.toLocaleString()} each • ${item.sharesPerUnit} share${item.sharesPerUnit > 1 ? 's' : ''} each
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #10B981; font-weight: 700; font-size: 1.1rem;">
                        ₱${item.totalPrice.toLocaleString()}
                    </div>
                    <div style="color: #374151; font-size: 0.9rem;">
                        ${item.shares} total shares
                    </div>
                </div>
            </div>
        `;
    });
    
    breakdownContainer.innerHTML = html;
}

// Example calculation scenarios
function showExampleScenarios() {
    const examples = [
        {
            title: "Small Investor",
            description: "2x EAP110 + 1x EAP225",
            investment: (2 * 1800) + (1 * 3500),
            shares: (2 * 1) + (1 * 2),
            monthlyIncome: {
                conservative: ((2 * 1) + (1 * 2)) * 500,
                moderate: ((2 * 1) + (1 * 2)) * 1000,
                optimistic: ((2 * 1) + (1 * 2)) * 1500
            }
        },
        {
            title: "Medium Investor",
            description: "3x EAP110 + 2x EAP225 + 1x EAP650",
            investment: (3 * 1800) + (2 * 3500) + (1 * 6000),
            shares: (3 * 1) + (2 * 2) + (1 * 4),
            monthlyIncome: {
                conservative: ((3 * 1) + (2 * 2) + (1 * 4)) * 500,
                moderate: ((3 * 1) + (2 * 2) + (1 * 4)) * 1000,
                optimistic: ((3 * 1) + (2 * 2) + (1 * 4)) * 1500
            }
        },
        {
            title: "Large Investor",
            description: "5x EAP110 + 5x EAP225 + 5x EAP650",
            investment: (5 * 1800) + (5 * 3500) + (5 * 6000),
            shares: (5 * 1) + (5 * 2) + (5 * 4),
            monthlyIncome: {
                conservative: ((5 * 1) + (5 * 2) + (5 * 4)) * 500,
                moderate: ((5 * 1) + (5 * 2) + (5 * 4)) * 1000,
                optimistic: ((5 * 1) + (5 * 2) + (5 * 4)) * 1500
            }
        }
    ];
    
    console.log('📊 Investment Examples:');
    examples.forEach(example => {
        console.log(`\n${example.title}:`);
        console.log(`  ${example.description}`);
        console.log(`  Investment: ₱${example.investment.toLocaleString()}`);
        console.log(`  Total Shares: ${example.shares}`);
        console.log(`  Monthly Income:`);
        console.log(`    Conservative: ₱${example.monthlyIncome.conservative.toLocaleString()}`);
        console.log(`    Moderate: ₱${example.monthlyIncome.moderate.toLocaleString()}`);
        console.log(`    Optimistic: ₱${example.monthlyIncome.optimistic.toLocaleString()}`);
        console.log(`  Annual Income (Moderate): ₱${(example.monthlyIncome.moderate * 12).toLocaleString()}`);
    });
}

// ROI Calculator
function calculateROI(investment, monthlyIncome) {
    const annualIncome = monthlyIncome * 12;
    const roi = (annualIncome / investment) * 100;
    return {
        annual: annualIncome,
        roi: roi,
        paybackMonths: investment / monthlyIncome
    };
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + 1, 2, 3 for preset packages
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                setPreset('starter');
                break;
            case '2':
                e.preventDefault();
                setPreset('balanced');
                break;
            case '3':
                e.preventDefault();
                setPreset('premium');
                break;
            case 'r':
                e.preventDefault();
                // Reset all quantities
                document.getElementById('eap110-qty').value = 0;
                document.getElementById('eap225-qty').value = 0;
                document.getElementById('eap650-qty').value = 0;
                calculateInvestment();
                break;
        }
    }
});

// Add animation effects
function addAnimationEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.package-card, .step, .calculator-inputs, .calculator-results').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations when page loads
window.addEventListener('load', addAnimationEffects);

// Show example scenarios in console
showExampleScenarios();

// Export functions for global access
window.updateQuantity = updateQuantity;
window.selectPackage = selectPackage;
window.setPreset = setPreset;
window.calculateInvestment = calculateInvestment;

console.log('💡 Keyboard Shortcuts:');
console.log('  Ctrl + 1: Starter Package');
console.log('  Ctrl + 2: Balanced Portfolio');
console.log('  Ctrl + 3: Premium Investment');
console.log('  Ctrl + R: Reset Calculator');
console.log('🚀 Antenna Sponsor Calculator ready!');
