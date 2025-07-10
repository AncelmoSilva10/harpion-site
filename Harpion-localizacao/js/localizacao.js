/**
 * Harpion - Arquivo JavaScript para a página de localização
 * Integração com Leaflet e interações modernas
 */

// Coordenadas do Vale do Silício
const mapCenter = [37.4030, -122.3237];
let map;

// Aguardar o carregamento completo do documento
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o mapa
    initMap();
    
    // Inicializar sistema de abas
    initTabs();
    
    // Inicializar indicador de progresso
    initProgressBar();
    
    // Inicializar botão de volta ao topo
    initBackToTop();
    
    // Configurar header transparente no início e colorido ao rolar
    const header = document.querySelector('.header');
    
    // Iniciar com o header transparente
    if (header) {
        header.style.background = 'transparent';
        header.classList.remove('sticky');
    }
    
    // Adicionar classe 'sticky' e background ao header quando rolar a página
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
                header.style.background = 'var(--color-primary)';
            } else {
                header.classList.remove('sticky');
                header.style.background = 'transparent';
            }
        }
    });

    // Verificar a posição inicial da página (para casos onde a página já carrega rolada)
    if (window.scrollY > 50 && header) {
        header.classList.add('sticky');
        header.style.background = 'var(--color-primary)';
    }

    // Configurar comportamento do menu mobile
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.header__navbar');
    
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', function() {
            navbar.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Botões interativos no mapa
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const centerMapBtn = document.getElementById('centerMap');
    
    if (zoomInBtn && map) {
        zoomInBtn.addEventListener('click', function() {
            map.zoomIn();
        });
    }
    
    if (zoomOutBtn && map) {
        zoomOutBtn.addEventListener('click', function() {
            map.zoomOut();
        });
    }
    
    if (centerMapBtn && map) {
        centerMapBtn.addEventListener('click', function() {
            map.setView(mapCenter, 15);
        });
    }
    
    // Adicionar animações de entrada aos elementos
    const animateElements = document.querySelectorAll('.location-map__card, .location-info__card, .location-surroundings__item');
    
    // Configurar observer para animações ao scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar todos os elementos que devem ser animados
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Redimensionar o mapa quando a janela for redimensionada
    window.addEventListener('resize', function() {
        if (map) {
            map.invalidateSize();
        }
    });

    // Menu de navegação
    const menuToggle = document.querySelector('.location-header__menu-toggle');
    const nav = document.querySelector('.location-header__nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.location-header__nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            });
        });
        
        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991 && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    }

    // Inicializar a agenda
    initAgenda();
});

/**
 * Inicializa o mapa Leaflet
 */
function initMap() {
    // Criar o mapa
    map = L.map('map', {
        center: mapCenter,
        zoom: 15,
        zoomControl: false,
        attributionControl: true
    });
    
    // Adicionar camada base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Estilo do mapa mais clean (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Criar ícone personalizado para o marcador principal
    const mainIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    // Adicionar marcador da localização principal
    const mainMarker = L.marker(mapCenter, { icon: mainIcon })
        .addTo(map)
        .bindPopup(`<div class="custom-popup">
            <h3>Sede Harpion</h3>
            <p>Nossa sede principal no Vale do Silício.</p>
            <p>Endereço: 1600 Amphitheatre Parkway, Mountain View, CA</p>
        </div>`)
        .openPopup();
    
    // Pontos de interesse
    const pois = [
        { coords: [37.4030, -122.3237], title: "Harpion HQ (São José dos Campos)" },
        { coords: [37.3894, -122.0819], title: "Mountain View" },
        { coords: [37.4439, -122.1622], title: "Palo Alto" },
        { coords: [37.7749, -122.4194], title: "São Francisco" },
        { coords: [37.3541, -121.9552], title: "San Jose" },
        { coords: [37.4849, -122.2305], title: "Redwood City" }
    ];
    
    // Criar ícone personalizado para POIs
    const poiIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    // Adicionar marcadores e popups para cada ponto de interesse
    pois.forEach(poi => {
        L.marker(poi.coords, { icon: poiIcon })
            .addTo(map)
            .bindPopup(`<div class="custom-popup">
                <h3>${poi.title}</h3>
                <p>Um dos nossos pontos estratégicos no Vale do Silício.</p>
            </div>`);
    });
    
    // Adicionar círculo ao redor da localização principal
    L.circle(mapCenter, {
        color: 'rgba(66, 133, 244, 0.7)',
        fillColor: 'rgba(66, 133, 244, 0.2)',
        fillOpacity: 0.5,
        radius: 1000
    }).addTo(map);
    
    // Desenhar linha entre os pontos de interesse
    const poiPositions = pois.map(poi => poi.coords);
    poiPositions.push(mapCenter); // Adicionar a posição principal ao final
    
    // Criar uma rota estilizada entre os pontos
    L.polyline(poiPositions, {
        color: 'rgba(219, 68, 55, 0.7)',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
        lineCap: 'round'
    }).addTo(map);
    
    // Adicionar escala ao mapa
    L.control.scale({
        imperial: false,
        metric: true,
        position: 'bottomleft'
    }).addTo(map);
    
    // Adicionar efeito de zoom ao clicar nos marcadores
    map.on('popupopen', function(e) {
        if (map.getZoom() < 14) {
            map.setView(e.popup._latlng, 16, {
                animation: true,
                duration: 1
            });
        }
    });
}

/**
 * Funcionalidades da agenda de visitas
 */
function initAgenda() {
    // Elementos do calendário
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthText = document.querySelector('.agenda__current-month');
    const daysContainer = document.querySelector('.agenda__days');
    const selectedDateText = document.getElementById('selectedDate');
    
    // Elementos de seleção de período
    const timeBtns = document.querySelectorAll('.agenda__time-btn');
    
    // Elementos para o motivo da visita
    const visitReasonSelect = document.getElementById('visitReason');
    const visitReasonOther = document.getElementById('visitReasonOther');
    
    // Botão de confirmação
    const confirmBtn = document.getElementById('confirmVisit');
    
    // Data atual e selecionada
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDate = null;
    let selectedTime = null;
    
    // Nomes dos meses em português
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    // Inicializar calendário
    updateCalendar();
    
    // Event listeners para navegação do calendário
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar();
        });
    }
    
    // Event listeners para botões de período
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover seleção anterior
            timeBtns.forEach(b => b.classList.remove('agenda__time-btn--selected'));
            
            // Adicionar seleção ao botão clicado
            this.classList.add('agenda__time-btn--selected');
            
            // Armazenar período selecionado
            selectedTime = this.dataset.time;
            
            // Verificar se podemos habilitar o botão de confirmação
            checkConfirmButton();
        });
    });
    
    // Event listener para o select de motivo
    if (visitReasonSelect) {
        visitReasonSelect.addEventListener('change', function() {
            // Mostrar textarea para "Outro" motivo
            if (this.value === 'outro') {
                visitReasonOther.style.display = 'block';
            } else {
                visitReasonOther.style.display = 'none';
            }
            
            // Verificar se podemos habilitar o botão de confirmação
            checkConfirmButton();
        });
    }
    
    // Event listener para o textarea de outro motivo
    if (visitReasonOther) {
        visitReasonOther.addEventListener('input', function() {
            // Verificar se podemos habilitar o botão de confirmação
            checkConfirmButton();
        });
    }
    
    // Função para atualizar o calendário
    function updateCalendar() {
        // Atualizar texto do mês e ano
        if (currentMonthText) {
            currentMonthText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
        
        // Limpar dias existentes
        if (daysContainer) {
            daysContainer.innerHTML = '';
            
            // Obter o primeiro dia do mês
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            
            // Obter o último dia do mês anterior
            const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
            
            // Adicionar os dias do mês anterior (desabilitados)
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('agenda__day', 'agenda__day--disabled');
                dayElement.textContent = prevMonthLastDay - i;
                daysContainer.appendChild(dayElement);
            }
            
            // Obter o número de dias no mês atual
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Adicionar os dias do mês atual
            for (let i = 1; i <= daysInMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('agenda__day');
                dayElement.textContent = i;
                
                // Verificar se é hoje
                if (currentYear === today.getFullYear() && 
                    currentMonth === today.getMonth() && 
                    i === today.getDate()) {
                    dayElement.classList.add('agenda__day--today');
                }
                
                // Verificar se é a data selecionada
                if (selectedDate && 
                    selectedDate.getFullYear() === currentYear && 
                    selectedDate.getMonth() === currentMonth && 
                    selectedDate.getDate() === i) {
                    dayElement.classList.add('agenda__day--selected');
                }
                
                // Verificar se é um dia passado (desabilitar)
                const dayDate = new Date(currentYear, currentMonth, i);
                if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                    dayElement.classList.add('agenda__day--disabled');
                } else {
                    // Adicionar event listener para seleção de data
                    dayElement.addEventListener('click', function() {
                        // Remover seleção anterior
                        const selectedDays = document.querySelectorAll('.agenda__day--selected');
                        selectedDays.forEach(day => day.classList.remove('agenda__day--selected'));
                        
                        // Adicionar seleção ao dia clicado
                        this.classList.add('agenda__day--selected');
                        
                        // Armazenar data selecionada
                        selectedDate = new Date(currentYear, currentMonth, i);
                        
                        // Atualizar texto da data selecionada
                        if (selectedDateText) {
                            const formattedDate = `${i} de ${monthNames[currentMonth]} de ${currentYear} (${getDayOfWeek(selectedDate)})`;
                            selectedDateText.textContent = formattedDate;
                        }
                        
                        // Verificar se podemos habilitar o botão de confirmação
                        checkConfirmButton();
                    });
                }
                
                daysContainer.appendChild(dayElement);
            }
            
            // Adicionar os dias do próximo mês (desabilitados)
            const totalDaysDisplayed = firstDay + daysInMonth;
            const remainingCells = 7 - (totalDaysDisplayed % 7);
            
            if (remainingCells < 7) {
                for (let i = 1; i <= remainingCells; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.classList.add('agenda__day', 'agenda__day--disabled');
                    dayElement.textContent = i;
                    daysContainer.appendChild(dayElement);
                }
            }
        }
    }
    
    // Função para obter o dia da semana em português
    function getDayOfWeek(date) {
        const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return days[date.getDay()];
    }
    
    // Função para verificar se podemos habilitar o botão de confirmação
    function checkConfirmButton() {
        if (confirmBtn) {
            // Verificar condições: data, período e motivo (se outro, verificar o textarea)
            let canConfirm = selectedDate !== null && selectedTime !== null;
            
            if (visitReasonSelect) {
                canConfirm = canConfirm && visitReasonSelect.value !== "";
                
                if (visitReasonSelect.value === 'outro') {
                    canConfirm = canConfirm && visitReasonOther.value.trim() !== "";
                }
            }
            
            // Habilitar ou desabilitar o botão
            if (canConfirm) {
                confirmBtn.classList.add('active');
                
                // Adicionar parâmetros à URL de redirecionamento
                const baseUrl = "index.html#fale-conosco";
                const date = selectedDate ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}` : '';
                const time = selectedTime === 'morning' ? 'Manhã' : 'Tarde';
                let reason = visitReasonSelect ? visitReasonSelect.options[visitReasonSelect.selectedIndex].text : '';
                
                if (visitReasonSelect && visitReasonSelect.value === 'outro' && visitReasonOther) {
                    reason = visitReasonOther.value;
                }
                
                // Atualizar href do botão de confirmação com parâmetros
                const params = `?data=${date}&periodo=${time}&motivo=${encodeURIComponent(reason)}`;
                confirmBtn.href = baseUrl + params;
            } else {
                confirmBtn.classList.remove('active');
                confirmBtn.href = "index.html#fale-conosco";
            }
        }
    }
}

/**
 * Inicializa o sistema de navegação por abas
 */
function initTabs() {
    const tabs = document.querySelectorAll('.location-tab');
    const sections = document.querySelectorAll('.location-section');
    
    console.log('Tabs encontradas:', tabs.length);
    console.log('Seções encontradas:', sections.length);
    
    // Exibir ID de cada seção
    sections.forEach(section => {
        console.log('Seção ID:', section.id);
    });
    
    // Exibir data-target de cada aba
    tabs.forEach(tab => {
        console.log('Tab target:', tab.dataset.target);
    });
    
    // Verificar se há abas na página
    if (tabs.length === 0) return;
    
    // Função para ativar uma aba específica e sua seção correspondente
    function activateTab(targetId) {
        console.log('Ativando tab e seção para ID:', targetId); // Debug
        
        // Remover classe 'active' de todas as abas
        tabs.forEach(t => t.classList.remove('active'));
        
        // Ocultar todas as seções
        sections.forEach(section => section.classList.remove('active'));
        
        // Encontrar a aba correspondente e ativá-la
        const targetTab = document.querySelector(`.location-tab[data-target="${targetId}"]`);
        console.log('Tab encontrada:', targetTab); // Debug
        
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Mostrar a seção correspondente
        const targetSection = document.getElementById(targetId);
        console.log('Seção encontrada:', targetSection); // Debug
        
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll suave até a seção
            window.scrollTo({
                top: window.innerWidth <= 991 ? 
                    targetSection.offsetTop - 120 : 
                    targetSection.offsetTop - 150,
                behavior: 'smooth'
            });
            
            // Se a seção contiver o mapa, redimensioná-lo
            if (targetId === 'mapa' && map) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 400);
            }
        } else {
            console.error('Seção não encontrada para ID:', targetId); // Debug
        }
    }
    
    // Adicionar event listeners para as abas
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.dataset.target;
            activateTab(targetId);
        });
    });
    
    // Verificar se há um hash na URL para navegação direta
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        activateTab(targetId);
    }
    
    // Processar TODOS os links que apontam para as seções com #
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            
            // Verificar se o targetId corresponde a uma seção existente
            if (document.getElementById(targetId)) {
                e.preventDefault();
                activateTab(targetId);
            }
        });
    });
    
    // Processar especificamente os botões de ação rápida (tab-link)
    document.querySelectorAll('.tab-link').forEach(link => {
        console.log('Tab link encontrado:', link); // Debug
        
        link.addEventListener('click', function(e) {
            console.log('Tab link clicado:', this, 'Target:', this.dataset.target); // Debug
            e.preventDefault();
            const targetId = this.dataset.target;
            console.log('Procurando a seção com ID:', targetId); // Debug
            activateTab(targetId);
        });
    });
}

/**
 * Inicializa o indicador de progresso para mostrar quanto da página foi rolada
 */
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    if (!progressBar) return;
    
    // Atualizar a barra de progresso conforme a rolagem da página
    window.addEventListener('scroll', function() {
        // Calcular a porcentagem de rolagem da página
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        // Atualizar largura da barra de progresso
        progressBar.style.width = scrollPercentage + '%';
        
        // Tornar a barra de progresso mais visível quando a página rola
        if (scrollTop > 100) {
            progressBar.style.height = '4px';
            progressBar.style.opacity = '1';
        } else {
            progressBar.style.height = '3px';
            progressBar.style.opacity = '0.8';
        }
    });
}

/**
 * Inicializa o botão de volta ao topo
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Mostrar ou ocultar o botão baseado na posição da rolagem
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Comportamento de clique do botão
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Rolagem suave até o topo
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 