/* ================================
   Interactive Chart Visualizations
   Jack Gewirz Portfolio - Poker Career Data
   ================================ */

// Wait for DOM and Chart.js to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chart when the poker section comes into view
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initProfitChart();
                chartObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartObserver.observe(chartContainer);
    }
});

/* ================================
   Poker Career Progression Chart
   ================================ */

function initProfitChart() {
    const ctx = document.getElementById('profitChart');
    if (!ctx) return;
    
    // Poker career data - games played vs cumulative profit
    const careerData = generateCareerData();
    
    // Create gradient for the line
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
    gradient.addColorStop(0.5, 'rgba(118, 75, 162, 0.6)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.1)');
    
    // Create area gradient
    const areaGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    areaGradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    areaGradient.addColorStop(1, 'rgba(102, 126, 234, 0.0)');
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Cumulative Profit ($)',
                data: careerData,
                borderColor: gradient,
                backgroundColor: areaGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#667eea',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1a1a1d',
                    bodyColor: '#495057',
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            return `Game ${context[0].parsed.x.toLocaleString()}`;
                        },
                        label: function(context) {
                            const profit = context.parsed.y;
                            return `Profit: $${profit.toLocaleString()}`;
                        },
                        afterLabel: function(context) {
                            const milestones = getMilestones();
                            const currentProfit = context.parsed.y;
                            const milestone = milestones.find(m => 
                                Math.abs(m.profit - currentProfit) < 5000
                            );
                            return milestone ? `🎯 ${milestone.description}` : '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Games Played',
                        color: 'var(--text-secondary)',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'var(--text-secondary)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cumulative Profit ($)',
                        color: 'var(--text-secondary)',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'var(--text-secondary)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            },
            onHover: (event, activeElements) => {
                event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        },
        plugins: [{
            id: 'milestoneLines',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                const milestones = getMilestones();
                
                milestones.forEach(milestone => {
                    const yPosition = chart.scales.y.getPixelForValue(milestone.profit);
                    
                    if (yPosition >= chartArea.top && yPosition <= chartArea.bottom) {
                        // Draw milestone line
                        ctx.save();
                        ctx.strokeStyle = 'rgba(102, 126, 234, 0.5)';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([5, 5]);
                        ctx.beginPath();
                        ctx.moveTo(chartArea.left, yPosition);
                        ctx.lineTo(chartArea.right, yPosition);
                        ctx.stroke();
                        
                        // Draw milestone label
                        ctx.fillStyle = 'var(--text-secondary)';
                        ctx.font = '11px Inter';
                        ctx.textAlign = 'right';
                        ctx.fillText(
                            `$${milestone.profit.toLocaleString()}`, 
                            chartArea.right - 10, 
                            yPosition - 5
                        );
                        ctx.restore();
                    }
                });
            }
        }]
    });
    
    // Animate chart on load
    animateChartEntry(chart);
    
    // Make chart responsive to theme changes
    document.addEventListener('themeChanged', () => {
        updateChartTheme(chart);
    });
    
    return chart;
}

/* ================================
   Career Data Generation
   ================================ */

function generateCareerData() {
    // Simulated poker career progression data
    // Based on realistic poker career trajectory
    const data = [];
    
    // Initial learning phase (games 0-500): slight losses and small gains
    for (let game = 0; game <= 500; game += 25) {
        const variance = (Math.random() - 0.5) * 10000;
        const baseProfit = game * -20 + variance; // Initial struggles
        data.push({ x: game, y: Math.max(-15000, baseProfit) });
    }
    
    // Improvement phase (games 500-1500): breaking even and small profits
    for (let game = 525; game <= 1500; game += 25) {
        const variance = (Math.random() - 0.5) * 8000;
        const baseProfit = (game - 500) * 15 - 10000 + variance;
        data.push({ x: game, y: baseProfit });
    }
    
    // Consistent growth phase (games 1500-4000): steady climb
    for (let game = 1525; game <= 4000; game += 25) {
        const variance = (Math.random() - 0.5) * 12000;
        const baseProfit = (game - 1500) * 45 + 5000 + variance;
        data.push({ x: game, y: baseProfit });
    }
    
    // Elite performance phase (games 4000-6000): accelerated growth
    for (let game = 4025; game <= 6000; game += 25) {
        const variance = (Math.random() - 0.5) * 15000;
        const baseProfit = (game - 4000) * 85 + 117500 + variance;
        data.push({ x: game, y: baseProfit });
    }
    
    // Ensure final point reaches approximately $400k
    data[data.length - 1].y = 400000;
    
    // Smooth the data to ensure realistic progression
    return smoothCareerData(data);
}

function smoothCareerData(data) {
    // Apply moving average smoothing
    const smoothed = [...data];
    const windowSize = 3;
    
    for (let i = windowSize; i < data.length - windowSize; i++) {
        let sum = 0;
        for (let j = i - windowSize; j <= i + windowSize; j++) {
            sum += data[j].y;
        }
        smoothed[i].y = sum / (windowSize * 2 + 1);
    }
    
    // Ensure monotonic growth in later stages
    for (let i = 1; i < smoothed.length; i++) {
        if (i > smoothed.length * 0.6) { // After 60% of career
            smoothed[i].y = Math.max(smoothed[i].y, smoothed[i - 1].y);
        }
    }
    
    return smoothed;
}

function getMilestones() {
    return [
        { profit: 50000, description: 'First $50K milestone' },
        { profit: 100000, description: 'Six-figure achievement' },
        { profit: 150000, description: 'Consistent growth phase' },
        { profit: 200000, description: 'Elite tier entry' },
        { profit: 300000, description: 'Top performer status' },
        { profit: 400000, description: 'Career peak achievement' }
    ];
}

/* ================================
   Chart Animations & Effects
   ================================ */

function animateChartEntry(chart) {
    // Progressive data reveal animation
    const originalData = [...chart.data.datasets[0].data];
    chart.data.datasets[0].data = [];
    chart.update('none');
    
    let currentIndex = 0;
    const animationSpeed = 30; // milliseconds between points
    
    function addNextPoint() {
        if (currentIndex < originalData.length) {
            chart.data.datasets[0].data.push(originalData[currentIndex]);
            chart.update('none');
            currentIndex++;
            setTimeout(addNextPoint, animationSpeed);
        } else {
            // Final update with smooth animation
            chart.update('active');
        }
    }
    
    // Start animation after a brief delay
    setTimeout(addNextPoint, 500);
}

function updateChartTheme(chart) {
    // Update chart colors based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    chart.options.scales.x.ticks.color = isDark ? '#b3b3b3' : '#495057';
    chart.options.scales.y.ticks.color = isDark ? '#b3b3b3' : '#495057';
    chart.options.scales.x.title.color = isDark ? '#b3b3b3' : '#495057';
    chart.options.scales.y.title.color = isDark ? '#b3b3b3' : '#495057';
    chart.options.scales.x.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    chart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    chart.update('none');
}

/* ================================
   Additional Chart Interactions
   ================================ */

// Add click interaction to show detailed milestone information
function addChartClickHandler(chart) {
    chart.canvas.addEventListener('click', (e) => {
        const points = Chart.getElementsAtEventForMode(chart, e, 'nearest', { intersect: true }, true);
        
        if (points.length) {
            const firstPoint = points[0];
            const datasetIndex = firstPoint.datasetIndex;
            const index = firstPoint.index;
            const value = chart.data.datasets[datasetIndex].data[index];
            
            showMilestoneModal(value.x, value.y);
        }
    });
}

function showMilestoneModal(games, profit) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="milestone-modal-overlay">
            <div class="milestone-modal glass-effect">
                <button class="milestone-modal-close">&times;</button>
                <h3>Career Milestone</h3>
                <div class="milestone-details">
                    <div class="milestone-stat">
                        <span class="milestone-label">Games Played:</span>
                        <span class="milestone-value">${games.toLocaleString()}</span>
                    </div>
                    <div class="milestone-stat">
                        <span class="milestone-label">Cumulative Profit:</span>
                        <span class="milestone-value">$${profit.toLocaleString()}</span>
                    </div>
                    <div class="milestone-stat">
                        <span class="milestone-label">Average per Game:</span>
                        <span class="milestone-value">$${(profit / games).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const styles = `
        .milestone-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            animation: fadeIn 0.3s ease;
        }
        .milestone-modal {
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            position: relative;
            animation: scaleIn 0.3s ease;
        }
        .milestone-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
        }
        .milestone-modal h3 {
            margin-bottom: 1rem;
            color: var(--primary);
        }
        .milestone-stat {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        .milestone-label {
            color: var(--text-secondary);
        }
        .milestone-value {
            color: var(--text-primary);
            font-weight: 600;
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        styleSheet.remove();
    };
    
    modal.querySelector('.milestone-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.milestone-modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.milestone-modal-overlay')) {
            closeModal();
        }
    });
    
    // Close with ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

/* ================================
   Export for potential future use
   ================================ */

window.PokerChart = {
    init: initProfitChart,
    generateData: generateCareerData,
    getMilestones: getMilestones
}; 