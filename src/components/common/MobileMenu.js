/**
 * Menu Hambúrguer Responsivo
 * @description JavaScript para controlar a navegação mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const closeMenu = document.querySelector('.close-menu');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    // Criar overlay se não existir
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    // Função para abrir menu
    function openMenu() {
        navList.classList.add('active');
        overlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll do body
        
        // Adiciona classe para animação dos ícones do hambúrguer
        setTimeout(() => {
            menuToggle.classList.add('opened');
        }, 100);
    }
    
    // Função para fechar menu
    function closeMenuFunc() {
        navList.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active', 'opened');
        document.body.style.overflow = ''; // Restaura scroll do body
    }
    
    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (navList.classList.contains('active')) {
                closeMenuFunc();
            } else {
                openMenu();
            }
        });
    }
    
    // Fechar menu ao clicar no overlay
    overlay.addEventListener('click', closeMenuFunc);
    
    // Fechar menu ao clicar no botão X
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFunc);
    }
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Adiciona um pequeno delay para permitir a navegação
            setTimeout(closeMenuFunc, 200);
        });
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            closeMenuFunc();
        }
    });
    
    // Fechar menu ao redimensionar a tela (para desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            closeMenuFunc();
        }
    });
    
    // Prevenir propagação de cliques dentro do menu
    if (navList) {
        navList.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Smooth scroll para links internos
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Ajuste para header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Adicionar indicador ativo no menu baseado na seção visível
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id], div[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Atualizar link ativo no scroll (throttled)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveLink, 100);
    });
    
    // Inicializar link ativo
    updateActiveLink();
});

// Função para detectar dispositivos touch
function isTouchDevice() {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
}

// Adicionar classe para dispositivos touch
if (isTouchDevice()) {
    document.documentElement.classList.add('touch-device');
} else {
    document.documentElement.classList.add('no-touch');
}

// Otimização para performance em dispositivos móveis
if (window.innerWidth <= 768) {
    // Desabilitar animações desnecessárias em mobile
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
}