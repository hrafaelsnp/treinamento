/**
 * Configurações da aplicação
 */
const CONFIG = {
    // IDs das planilhas do Google Sheets
    SHEETS: {
        VIDEO: {
            ID: '1S20g4jhNfoZ6ayvAJC5HNHi8KJs_JAWL_xxxCChGOog',
            RANGE: 'escalaVideo!A:R'  // Intervalo de células a serem lidas
        },
        AUDIO: {
            ID: '1smzyrRUnPZkfZGY-8EPDGg7Js8_6-nQ2xlpXgl8Orjw',
            RANGE: 'escalaAudio!A:R'  // Intervalo de células a serem lidas
        }
    },
    
    // Chave de API do Google (chave real fornecida)
    API_KEY: 'AIzaSyA8yWyDVkekhaVdxCO7BuP3pjjjKTD-cDE',
    
    // Mapeamento de colunas para a tabela de Vídeo
    VIDEO_COLUMNS: {
        COLABORADOR: 'colaborador',
        STATUS: 'Status',
        HORA_PREVISTA: 'horaPrevista',
        LOCAL: 'local',
        SERVICO_VIDEO: 'servicoVideo',
        OBSERVACAO: 'observaçãoVideo',
        NOME_EVENTO: 'nomeEvento',
        TIPO_EVENTO: 'tipoEvento'
    },
    
    // Mapeamento de colunas para a tabela de Áudio
    AUDIO_COLUMNS: {
        COLABORADOR: 'colaboradorAudio',
        STATUS: 'Status',
        HORA_PREVISTA: 'horaPrevista',
        LOCAL: 'local',
        SERVICO_AUDIO: 'servicoAudio',
        OBSERVACAO: 'observaçãoAudio',
        NOME_EVENTO: 'nomeEvento',
        TIPO_EVENTO: 'tipoEvento'
    },
    
    // Intervalo de atualização em milissegundos (55 segundos)
    UPDATE_INTERVAL: 20000,
    
    // Configurações de formatação
    FORMAT: {
        DATE: 'dd/MM/yyyy',
        TIME: 'HH:mm'
    },
    
    // Configurações de cache
    CACHE: {
        ENABLED: true,
        DURATION: 3000  // 3 segundos (menor que o intervalo de atualização)
    },
    
    // Configurações de desenvolvimento
    DEV: {
        USE_MOCK_DATA: false,  // Usar dados de exemplo em vez de buscar da API
        DEBUG: true            // Mostrar logs de debug no console
    }
};

// Dados de exemplo para desenvolvimento (quando não há conexão com Google Sheets)
const MOCK_DATA = {
    VIDEO: [
        {
            colaborador: 'André Silva',
            Status: 'Normal',
            horaPrevista: '09:00',
            local: 'Plenário 01',
            servicoVideo: 'Transmissão',
            observaçãoVideo: 'teste 01',
            nomeEvento: 'Comissão de Meio Ambiente e Desenvolvimento Sustentável',
            tipoEvento: 'Audiência Pública'
        },
        {
            colaborador: 'André Silva',
            Status: 'Aguardando Ficha',
            horaPrevista: '14:00',
            local: 'Plenário 02',
            servicoVideo: 'VideoConferência',
            observaçãoVideo: '',
            nomeEvento: 'Comissão de Direitos Humanos',
            tipoEvento: 'Audiência Pública'
        },
        {
            colaborador: 'Carlos Mendes',
            Status: 'Normal',
            horaPrevista: '10:00',
            local: 'Plenário 03',
            servicoVideo: 'Videowall',
            observaçãoVideo: '',
            nomeEvento: 'Comissão Especial Plano Nacional de Educação',
            tipoEvento: 'Audiência Pública'
        },
        {
            colaborador: 'Roberto Santos',
            Status: 'Normal',
            horaPrevista: '11:00',
            local: 'Plenário 04',
            servicoVideo: 'Transmissão',
            observaçãoVideo: 'teste 04',
            nomeEvento: 'Entrega de Moção de Louvor',
            tipoEvento: 'Outros Eventos'
        }
    ],
    AUDIO: [
        {
            colaboradorAudio: 'Antônio Pereira',
            Status: 'Normal',
            horaPrevista: '09:00',
            local: 'Plenário 01',
            servicoAudio: 'Som, Gravação, Mic. S/fio',
            observaçãoAudio: 'teste 01',
            nomeEvento: 'Comissão de Meio Ambiente e Desenvolvimento Sustentável',
            tipoEvento: 'Audiência Pública'
        },
        {
            colaboradorAudio: 'Antônio Pereira',
            Status: 'Aguardando Ficha',
            horaPrevista: '14:00',
            local: 'Plenário 02',
            servicoAudio: 'Som, Gravação',
            observaçãoAudio: '',
            nomeEvento: 'Comissão de Direitos Humanos',
            tipoEvento: 'Audiência Pública'
        },
        {
            colaboradorAudio: 'Marcos Oliveira',
            Status: 'Normal',
            horaPrevista: '10:00',
            local: 'Plenário 03',
            servicoAudio: 'Som, Gravação',
            observaçãoAudio: '',
            nomeEvento: 'Comissão Especial Plano Nacional de Educação',
            tipoEvento: 'Audiência Pública'
        },
        {
            colaboradorAudio: 'Paulo Souza',
            Status: 'Normal',
            horaPrevista: '11:00',
            local: 'Plenário 04',
            servicoAudio: 'Som, Mic. S/fio',
            observaçãoAudio: 'teste 04',
            nomeEvento: 'Entrega de Moção de Louvor',
            tipoEvento: 'Outros Eventos'
        }
    ]
};

