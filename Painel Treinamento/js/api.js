/**
 * Módulo de integração com a API do Google Sheets
 */
class GoogleSheetsAPI {
    constructor() {
        this.cache = {
            video: {
                data: null,
                timestamp: 0
            },
            audio: {
                data: null,
                timestamp: 0
            }
        };
        this.isLoading = {
            video: false,
            audio: false
        };
        this.lastError = null;
    }

    /**
     * Busca dados da planilha de vídeo
     * @returns {Promise<Array>} Dados formatados da planilha
     */
    async fetchVideoData() {
        // Verificar se deve usar dados de exemplo
        if (CONFIG.DEV.USE_MOCK_DATA) {
            if (CONFIG.DEV.DEBUG) console.log('Usando dados de exemplo para Vídeo');
            return MOCK_DATA.VIDEO;
        }

        // Verificar cache
        if (this.isCacheValid('video')) {
            if (CONFIG.DEV.DEBUG) console.log('Usando dados em cache para Vídeo');
            return this.cache.video.data;
        }

        try {
            this.isLoading.video = true;
            this.showLoading('video');

            // Construir URL da API
            const url = this.buildApiUrl(
                CONFIG.SHEETS.VIDEO.ID,
                CONFIG.SHEETS.VIDEO.RANGE
            );

            if (CONFIG.DEV.DEBUG) console.log(`Buscando dados de Vídeo: ${url}`);

            // Fazer requisição
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            // Processar dados
            const processedData = this.processSheetData(data, 'video');
            
            // Salvar no cache
            this.updateCache('video', processedData);
            
            return processedData;

        } catch (error) {
            this.handleError('Erro ao buscar dados de Vídeo', error);
            
            // Retornar cache mesmo que expirado, se disponível
            if (this.cache.video.data) {
                return this.cache.video.data;
            }
            
            // Retornar array vazio em caso de erro sem cache
            return [];
        } finally {
            this.isLoading.video = false;
            this.hideLoading('video');
        }
    }

    /**
     * Busca dados da planilha de áudio
     * @returns {Promise<Array>} Dados formatados da planilha
     */
    async fetchAudioData() {
        // Verificar se deve usar dados de exemplo
        if (CONFIG.DEV.USE_MOCK_DATA) {
            if (CONFIG.DEV.DEBUG) console.log('Usando dados de exemplo para Áudio');
            return MOCK_DATA.AUDIO;
        }

        // Verificar cache
        if (this.isCacheValid('audio')) {
            if (CONFIG.DEV.DEBUG) console.log('Usando dados em cache para Áudio');
            return this.cache.audio.data;
        }

        try {
            this.isLoading.audio = true;
            this.showLoading('audio');

            // Construir URL da API
            const url = this.buildApiUrl(
                CONFIG.SHEETS.AUDIO.ID,
                CONFIG.SHEETS.AUDIO.RANGE
            );

            if (CONFIG.DEV.DEBUG) console.log(`Buscando dados de Áudio: ${url}`);

            // Fazer requisição
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            // Processar dados
            const processedData = this.processSheetData(data, 'audio');
            
            // Salvar no cache
            this.updateCache('audio', processedData);
            
            return processedData;

        } catch (error) {
            this.handleError('Erro ao buscar dados de Áudio', error);
            
            // Retornar cache mesmo que expirado, se disponível
            if (this.cache.audio.data) {
                return this.cache.audio.data;
            }
            
            // Retornar array vazio em caso de erro sem cache
            return [];
        } finally {
            this.isLoading.audio = false;
            this.hideLoading('audio');
        }
    }

    /**
     * Constrói a URL da API do Google Sheets
     * @param {string} sheetId - ID da planilha
     * @param {string} range - Intervalo de células
     * @returns {string} URL completa da API
     */
    buildApiUrl(sheetId, range) {
        return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${CONFIG.API_KEY}`;
    }

    /**
     * Processa os dados brutos da planilha
     * @param {Object} response - Resposta da API
     * @param {string} type - Tipo de dados ('video' ou 'audio')
     * @returns {Array} Dados processados
     */
    processSheetData(response, type) {
        if (!response.values || response.values.length < 2) {
            return [];
        }

        const headers = response.values[0];
        const rows = response.values.slice(1);
        
        // Mapear linhas para objetos
        return rows.map(row => {
            const item = {};
            
            // Mapear cada coluna para a propriedade correspondente
            headers.forEach((header, index) => {
                if (index < row.length) {
                    item[header] = row[index];
                } else {
                    item[header] = '';
                }
            });
            
            return item;
        });
    }

    /**
     * Verifica se o cache está válido
     * @param {string} type - Tipo de dados ('video' ou 'audio')
     * @returns {boolean} True se o cache for válido
     */
    isCacheValid(type) {
        if (!CONFIG.CACHE.ENABLED || !this.cache[type].data) {
            return false;
        }
        
        const now = Date.now();
        const cacheAge = now - this.cache[type].timestamp;
        
        return cacheAge < CONFIG.CACHE.DURATION;
    }

    /**
     * Atualiza o cache com novos dados
     * @param {string} type - Tipo de dados ('video' ou 'audio')
     * @param {Array} data - Dados a serem armazenados
     */
    updateCache(type, data) {
        this.cache[type] = {
            data: data,
            timestamp: Date.now()
        };
    }

    /**
     * Limpa o cache
     * @param {string} type - Tipo de dados ('video' ou 'audio'), se omitido limpa todo o cache
     */
    clearCache(type) {
        if (type) {
            this.cache[type] = {
                data: null,
                timestamp: 0
            };
        } else {
            this.cache.video = { data: null, timestamp: 0 };
            this.cache.audio = { data: null, timestamp: 0 };
        }
        
        if (CONFIG.DEV.DEBUG) console.log(`Cache ${type || 'completo'} limpo`);
    }

    /**
     * Trata erros de requisição
     * @param {string} message - Mensagem de erro
     * @param {Error} error - Objeto de erro
     */
    handleError(message, error) {
        this.lastError = {
            message: message,
            error: error,
            timestamp: Date.now()
        };
        
        console.error(`${message}:`, error);
        this.showErrorMessage();
        
        // Tentar novamente após um tempo
        setTimeout(() => {
            this.clearCache();
        }, 10000); // 10 segundos
    }

    /**
     * Mostra indicador de carregamento
     * @param {string} type - Tipo de dados ('video' ou 'audio')
     */
    showLoading(type) {
        const tableBody = document.getElementById(`${type}-table-body`);
        if (!tableBody) return;
        
        // Verificar se já existe uma linha de loading
        const existingLoadingRow = tableBody.querySelector('.loading-row');
        if (existingLoadingRow) return;
        
        // Limpar tabela e adicionar linha de loading
        tableBody.innerHTML = `
            <tr class="loading-row">
                <td colspan="8">
                    <div class="loading-spinner"></div>
                    <p>Carregando dados...</p>
                </td>
            </tr>
        `;
    }

    /**
     * Esconde indicador de carregamento
     * @param {string} type - Tipo de dados ('video' ou 'audio')
     */
    hideLoading(type) {
        const tableBody = document.getElementById(`${type}-table-body`);
        if (!tableBody) return;
        
        // Remover apenas a linha de loading
        const loadingRow = tableBody.querySelector('.loading-row');
        if (loadingRow) {
            loadingRow.remove();
        }
    }

    /**
     * Mostra mensagem de erro
     */
    showErrorMessage() {
        const errorElement = document.getElementById('error-message');
        if (!errorElement) return;
        
        errorElement.classList.add('visible');
        
        // Esconder após 5 segundos
        setTimeout(() => {
            errorElement.classList.remove('visible');
        }, 5000);
    }
}

// Instância global da API
const sheetsAPI = new GoogleSheetsAPI();

