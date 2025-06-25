/**
 * Aplicação principal com paginação e atualização sem recarregar
 */
class TabelasApp {
    constructor() {
        this.activeTab = 'video';
        this.currentPage = {
            video: 1,
            audio: 1
        };
        this.updateInterval = null;
        this.videoData = [];
        this.audioData = [];
        this.lastUpdateTime = null;
        this.alternatingIntervals = {}; // Para armazenar os intervalos de alternância
        
        // Configurações de paginação
        this.paginationConfig = {
            video: {
                1: { start: 'A', end: 'Z', label: 'A-Z' }
                
            },
            audio: {
                1: { start: 'A', end: 'Z', label: 'A-Z' },
                
            }
        };
        
        // Inicializar a aplicação
        this.init();
    }
    
    /**
     * Inicializa a aplicação
     */
    init() {
        // Configurar navegação por abas
        this.setupTabs();
        
              
        // Carregar dados iniciais
        this.loadInitialData();
        
        // Iniciar atualização automática
        this.startAutoUpdate();
        
        if (CONFIG.DEV.DEBUG) {
            console.log('Aplicação inicializada');
        }
    }
    
    /**
     * Configura a navegação por abas
     */
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    

    /**
     * Alterna entre as abas
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     */
    switchTab(tabId) {
        // Atualizar aba ativa
        this.activeTab = tabId;
        
        // Atualizar classes das abas
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-tab') === tabId);
        });
        
        // Atualizar conteúdo visível
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
        
        // Renderizar dados da aba ativa com a página atual
        this.renderCurrentPage(tabId);
    }
    
    /**
     * Alterna entre as páginas
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     * @param {number} page - Número da página (1 ou 2)
     */
    switchPage(tabId, page) {
        // Atualizar página atual
        this.currentPage[tabId] = page;
        
        // Atualizar classes dos botões de paginação
        document.querySelectorAll(`#${tabId}-page-1, #${tabId}-page-2`).forEach(button => {
            button.classList.toggle('active', parseInt(button.getAttribute('data-page')) === page);
        });
        
        // Atualizar informação da paginação
        const config = this.paginationConfig[tabId][page];
        const infoElement = document.getElementById(`${tabId}-pagination-info`);
        if (infoElement) {
            infoElement.textContent = `Página ${page} - Colaboradores ${config.label}`;
        }
        
        // Renderizar dados da página atual
       this.renderCurrentPage(tabId);
    }
    
    /**
     * Carrega os dados iniciais
     */
    async loadInitialData() {
        try {
            // Carregar dados de ambas as abas
            await Promise.all([
                this.loadTabData('video'),
                this.loadTabData('audio')
            ]);
            
            // Renderizar página atual
            this.renderCurrentPage(this.activeTab);
            
            // Atualizar hora da última atualização
            this.updateLastUpdateTime();
            
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
        }
    }
    
    /**
     * Carrega os dados de uma aba específica
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     */
    async loadTabData(tabId) {
        try {
            let data;
            
            if (tabId === 'video') {
                data = await sheetsAPI.fetchVideoData();
                this.videoData = data;
            } else {
                data = await sheetsAPI.fetchAudioData();
                this.audioData = data;
            }
            
            // Atualizar hora da última atualização
            this.updateLastUpdateTime();
            
        } catch (error) {
            console.error(`Erro ao carregar dados da aba ${tabId}:`, error);
        }
    }
    
    /**
     * Renderiza a página atual
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     */
    renderCurrentPage(tabId) {
        const data = tabId === 'video' ? this.videoData : this.audioData;
        
        if (!data || data.length === 0) {
            this.showEmptyState(tabId);
            return;
        }
        
        // Ordenar dados por colaborador (ordem alfabética)
        const sortedData = this.sortDataByCollaborator(tabId, data);
        
        // Agrupar dados por colaborador
        const groupedData = this.groupDataByCollaborator(tabId, sortedData);
        
        // Renderizar tabela sem recarregar
        this.updateTableContent(tabId, groupedData);
    }
    
    /**
     * Filtra dados por página
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     * @param {Array} data - Dados a serem filtrados
     * @param {number} page - Número da página
     * @returns {Array} Dados filtrados
     */
    filterDataByPage(tabId, data, page) {
        const config = this.paginationConfig[tabId][page];
        const collaboratorField = tabId === 'video' 
            ? CONFIG.VIDEO_COLUMNS.COLABORADOR 
            : CONFIG.AUDIO_COLUMNS.COLABORADOR;
        
        return data.filter(item => {
            const collaborator = (item[collaboratorField] || '').toLowerCase();
            if (!collaborator) return false;
            
            const firstLetter = collaborator.charAt(0);
            return firstLetter >= config.start.toLowerCase() && firstLetter <= config.end.toLowerCase();
        });
    }
    
    /**
     * Ordena os dados por colaborador
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     * @param {Array} data - Dados a serem ordenados
     * @returns {Array} Dados ordenados
     */
    sortDataByCollaborator(tabId, data) {
        const collaboratorField = tabId === 'video' 
            ? CONFIG.VIDEO_COLUMNS.COLABORADOR 
            : CONFIG.AUDIO_COLUMNS.COLABORADOR;
        
        return [...data].sort((a, b) => {
            const nameA = (a[collaboratorField] || '').toLowerCase();
            const nameB = (b[collaboratorField] || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }
    
    /**
     * Agrupa os dados por colaborador
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     * @param {Array} sortedData - Dados ordenados
     * @returns {Object} Dados agrupados por colaborador
     */
    groupDataByCollaborator(tabId, sortedData) {
        const collaboratorField = tabId === 'video' 
            ? CONFIG.VIDEO_COLUMNS.COLABORADOR 
            : CONFIG.AUDIO_COLUMNS.COLABORADOR;
        
        const groups = {};
        
        sortedData.forEach(item => {
            const collaborator = item[collaboratorField] || 'Sem Colaborador';
            
            if (!groups[collaborator]) {
                groups[collaborator] = [];
            }
            
            groups[collaborator].push(item);
        });
        
        return groups;
    }
    
    /**
     * Atualiza o conteúdo da tabela sem recarregar
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     * @param {Object} groupedData - Dados agrupados por colaborador
     */
    updateTableContent(tabId, groupedData) {
        const tableBody = document.getElementById(`${tabId}-table-body`);
        if (!tableBody) return;
        
        // Limpar intervalos de alternância existentes
        this.clearAlternatingIntervals(tabId);
        
        // Criar novo conteúdo
        const newContent = document.createDocumentFragment();
        
        // Obter mapeamento de colunas
        const columns = tabId === 'video' ? CONFIG.VIDEO_COLUMNS : CONFIG.AUDIO_COLUMNS;
        
        // Renderizar cada grupo com mesclagem de células (rowspan)
        let groupCounter = 0;
        Object.entries(groupedData).forEach(([collaborator, items]) => {
            groupCounter++;
            const isEvenGroup = groupCounter % 2 === 0;

            items.forEach((item, index) => {
                const row = document.createElement('tr');
                if (isEvenGroup) {
                    row.classList.add('group-even');
                }
                
                // Adicionar célula do colaborador apenas na primeira linha com rowspan
                if (index === 0) {
                    const collaboratorCell = document.createElement('td');
                    collaboratorCell.textContent = item[columns.COLABORADOR] || collaborator;
                    collaboratorCell.rowSpan = items.length; // Mesclar células verticalmente
                    row.appendChild(collaboratorCell);
                }
                
                // Adicionar demais células (sem a do colaborador nas linhas subsequentes)
                this.addTableCell(row, item[columns.STATUS] || '', this.getStatusClass(item[columns.STATUS]));
                this.addTableCell(row, item[columns.LOCAL] || '');
                this.addTableCell(row, item[columns.HORA_PREVISTA] || '');
                                
                // Serviço específico para cada tabela
                if (tabId === 'video') {
                    this.addTableCell(row, item[columns.SERVICO_VIDEO] || '');
                    this.addTableCell(row, item[columns.TIPO_EVENTO] || '');
                    // Adicionar célula alternante para Nome do Evento/Observação
                    this.addAlternatingCell(row, item[columns.NOME_EVENTO] || '', item[columns.OBSERVACAO] || '', tabId, groupCounter, index);
                } else {
                    this.addTableCell(row, item[columns.SERVICO_AUDIO] || '');
                    this.addTableCell(row, item[columns.TIPO_EVENTO] || '');
                    // Adicionar célula alternante para Nome do Evento/Observação
                    this.addAlternatingCell(row, item[columns.NOME_EVENTO] || '', item[columns.OBSERVACAO] || '', tabId, groupCounter, index);
                }
                
                newContent.appendChild(row);
            });
        });
        
        // Substituir conteúdo da tabela de uma vez (sem piscar)
        const currentRows = tableBody.querySelectorAll('tr:not(.loading-row)');
        
        // Se não há dados atuais, apenas adicionar o novo conteúdo
        if (currentRows.length === 0) {
            tableBody.innerHTML = '';
            tableBody.appendChild(newContent);
        } else {
            // Atualizar gradualmente para evitar piscar
            tableBody.style.opacity = '0.8';
            setTimeout(() => {
                tableBody.innerHTML = '';
                tableBody.appendChild(newContent);
                tableBody.style.opacity = '1';
            }, 100);
        }
        
        // Iniciar alternância para células que têm observação
        this.startAlternatingCells(tabId);
    }
    
    /**
     * Adiciona uma célula alternante entre Nome do Evento e Observação
     * @param {HTMLElement} row - Elemento TR da linha
     * @param {string} nomeEvento - Nome do evento
     * @param {string} observacao - Observação
     * @param {string} tabId - ID da aba
     * @param {number} groupCounter - Contador do grupo
     * @param {number} index - Índice do item no grupo
     */
    addAlternatingCell(row, nomeEvento, observacao, tabId, groupCounter, index) {
        const cell = document.createElement('td');
        cell.classList.add('alternating-cell');
        
        // Criar ID único para a célula
        const cellId = `${tabId}-alternating-${groupCounter}-${index}`;
        cell.id = cellId;
        
        // Se não há observação, mostrar apenas o nome do evento
        if (!observacao || observacao.trim() === '') {
            cell.textContent = nomeEvento;
        } else {
            // Se há observação, iniciar com nome do evento e marcar para alternância
            cell.textContent = nomeEvento;
            cell.setAttribute('data-nome-evento', nomeEvento);
            cell.setAttribute('data-observacao', observacao);
            cell.setAttribute('data-should-alternate', 'true');
        }
        
        row.appendChild(cell);
    }
    
    /**
     * Inicia a alternância de células que devem alternar
     * @param {string} tabId - ID da aba
     */
    startAlternatingCells(tabId) {
        const alternatingCells = document.querySelectorAll(`#${tabId}-table-body .alternating-cell[data-should-alternate="true"]`);
        
        if (!this.alternatingIntervals[tabId]) {
            this.alternatingIntervals[tabId] = [];
        }
        
        alternatingCells.forEach(cell => {
            const nomeEvento = cell.getAttribute('data-nome-evento');
            const observacao = cell.getAttribute('data-observacao');
            let showingNome = true;
            
            // Criar intervalo para alternar a cada 3 segundos
            const interval = setInterval(() => {
                if (showingNome) {
                    cell.textContent = observacao;
                    showingNome = false;
                } else {
                    cell.textContent = nomeEvento;
                    showingNome = true;
                }
            }, 3000);
            
            // Armazenar o intervalo para poder limpar depois
            this.alternatingIntervals[tabId].push(interval);
        });
    }
    
    /**
     * Limpa os intervalos de alternância
     * @param {string} tabId - ID da aba
     */
    clearAlternatingIntervals(tabId) {
        if (this.alternatingIntervals[tabId]) {
            this.alternatingIntervals[tabId].forEach(interval => {
                clearInterval(interval);
            });
            this.alternatingIntervals[tabId] = [];
        }
    }
    
    /**
     * Adiciona uma célula à linha da tabela
     * @param {HTMLElement} row - Elemento TR da linha
     * @param {string} text - Texto da célula
     * @param {string} className - Classe CSS opcional
     */
    addTableCell(row, text, className = '') {
        const cell = document.createElement('td');
        
        if (className) {
            // Se for uma célula de status, criar um span com a classe
            const statusSpan = document.createElement('span');
            statusSpan.className = `status ${className}`;
            statusSpan.textContent = text;
            cell.appendChild(statusSpan);
        } else {
            // Verificar se o texto é longo e adicionar animação
            if (text && text.length > 20) {
                const scrollingText = document.createElement('div');
                scrollingText.className = 'scrolling-text';
                scrollingText.textContent = text;
                cell.appendChild(scrollingText);
            } else {
                cell.textContent = text;
            }
        }
        
        row.appendChild(cell);
    }
    
    /**
     * Retorna a classe CSS para o status
     * @param {string} status - Status do item
     * @returns {string} Classe CSS
     */
    getStatusClass(status) {
        if (!status) return '';
        
        const statusLower = status.toLowerCase();
        
        if (statusLower.includes('normal')) {
            return 'status-normal';
        } else if (statusLower.includes('atenção') || statusLower.includes('atencao')) {
            return 'status-atencao';
        } else if (statusLower.includes('em andamento')) {
            return 'status-em-andamento';
        } else if (statusLower.includes('aguardando')) {
            return 'status-aguardando';
        }
        
        return '';
    }
    
    /**
     * Mostra estado vazio quando não há dados
     * @param {string} tabId - ID da aba ('video' ou 'audio')
     */
    showEmptyState(tabId) {
        const tableBody = document.getElementById(`${tabId}-table-body`);
        if (!tableBody) return;
        
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: var(--light-text);"></i>
                    <p>Nenhum dado disponível para esta página</p>
                </td>
            </tr>
        `;
    }
    
    /**
     * Inicia a atualização automática
     */
    startAutoUpdate() {
        // Limpar intervalo existente, se houver
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Configurar novo intervalo
        this.updateInterval = setInterval(() => {
            this.updateData();
        }, CONFIG.UPDATE_INTERVAL);
        
        if (CONFIG.DEV.DEBUG) {
            console.log(`Atualização automática iniciada (${CONFIG.UPDATE_INTERVAL / 1000}s)`);
        }
    }
    
    /**
     * Atualiza os dados sem recarregar a tabela
     */
    async updateData() {
        try {
            // Carregar novos dados
            await Promise.all([
                this.loadTabData('video'),
                this.loadTabData('audio')
            ]);
            
            // Renderizar página atual da aba ativa
            this.renderCurrentPage(this.activeTab);
            
            if (CONFIG.DEV.DEBUG) {
                console.log(`Dados atualizados: ${this.activeTab}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
        }
    }
    
     
    /**
     * Formata data e hora
     * @param {Date} date - Data a ser formatada
     * @returns {string} Data formatada
     */
    formatDateTime(date) {
        if (!date) return '--';
        
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    /**
     * Para a atualização automática
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        // Limpar todos os intervalos de alternância
        Object.keys(this.alternatingIntervals).forEach(tabId => {
            this.clearAlternatingIntervals(tabId);
        });
        
        if (CONFIG.DEV.DEBUG) {
            console.log('Atualização automática parada');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.tabelasApp = new TabelasApp();
});

